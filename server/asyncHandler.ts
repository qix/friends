import type { NextApiRequest, NextApiResponse } from "next";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { FriandsSession } from "../pages/api/auth/[...nextauth]";
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
  callback: (
    session: FriandsSession,
    requestBody: RequestData
  ) => Promise<ResponseData>
) {
  return function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData | { error: string }>
  ) {
    try {
      invariant(typeof req.body === "object", "Could not parse request body");

      return getSession({ req })
        .then((session) => {
          if (!session) {
            throw new HttpError(400, "Not signed in");
          }
          return callback(session as FriandsSession, req.body);
        })
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
