import { Action } from "../models/Action";

export async function performAction(action: Action) {
  const res = await fetch("/api/performAction", {
    body: JSON.stringify(action),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  return await res.json();
}
