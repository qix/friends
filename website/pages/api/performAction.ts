import { Action, ActionResponseByType } from "../../models/Action";
import {
  sessionAsyncHandler,
  HttpError,
  optionalSessionAsyncHandler,
} from "../../server/asyncHandler";
import { FriendsSession } from "./auth/[...nextauth]";
import { performAction } from "../../server/performAction";

export default optionalSessionAsyncHandler<
  Action,
  ActionResponseByType[keyof ActionResponseByType] & { error?: string }
>(async function apiPerformAction(session, action: Action) {
  return performAction(session ? session.user : null, action);
});
