import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions, FriendsSession } from "../pages/api/auth/[...nextauth]";
import { tryGetFriendsSession } from "./getFriendsSession";
import { invariant } from "./invariant";

function thrownErrorMessage(err: unknown) {
  return err instanceof Error ? err.toString() : "Unexpected thrown error type";
}

export class HttpError extends Error {
  statusCode: number;
  constructor(statusCode: number, message?: string) {
    super(message); // 'Error' breaks prototype chain here
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    this.statusCode = statusCode;
  }
}

export function asyncHandler<
  RequestData,
  ResponseData extends {
    error?: string;
  }
>(
  callback: (req: NextApiRequest, res: NextApiResponse) => Promise<ResponseData>
) {
  return function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData | { error: string }>
  ) {
    try {
      if (req.method === "POST") {
        invariant(typeof req.body === "object", "Could not parse request body");
      } else if (req.method !== "GET") {
        throw new Error("Unhandled request method");
      }

      return callback(req, res)
        .then(
          (responseData) => {
            invariant(
              typeof responseData === "object",
              "Expected object for responseData"
            );
            res.status(200).json(responseData);
          },
          (err) => {
            if (err instanceof HttpError) {
              res.status(err.statusCode).json({
                error: err.message,
              });
              return;
            }
            throw err;
          }
        )
        .catch((err) => {
          console.error(err);
          res.status(500).json({
            error: "Encountered an internal server error",
          });
        });
    } catch (err) {
      return res.status(400).json({
        error: "Could not parse request: " + thrownErrorMessage(err),
      });
    }
  };
}
export function optionalSessionAsyncHandler<
  RequestData,
  ResponseData extends {
    error?: string;
  }
>(
  callback: (
    session: FriendsSession | null,
    requestBody: RequestData
  ) => Promise<ResponseData>
) {
  return asyncHandler((req, res) => {
    return tryGetFriendsSession(req, res).then((session) => {
      return callback(session, req.body as RequestData);
    });
  });
}

export function sessionAsyncHandler<
  RequestData,
  ResponseData extends {
    error?: string;
  }
>(
  callback: (
    session: FriendsSession,
    requestBody: RequestData
  ) => Promise<ResponseData>
) {
  return optionalSessionAsyncHandler<RequestData, ResponseData>(
    (session, requestBody) => {
      if (!session) {
        throw new HttpError(400, "Not signed in");
      }
      return callback(session, requestBody);
    }
  );
}
