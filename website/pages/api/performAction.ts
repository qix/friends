import { Action, ActionResponseByType } from "../../models/Action";
import { optionalSessionAsyncHandler } from "../../server/asyncHandler";
import { performAction } from "../../server/performAction";

export default optionalSessionAsyncHandler<
  Action,
  ActionResponseByType[keyof ActionResponseByType] & { error?: string }
>(async function apiPerformAction(session, action: Action) {
  return performAction(session ? session.user : null, action);
});
