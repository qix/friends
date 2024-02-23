import { invariant } from "./invariant";

export function stripMargin(str: string) {
  const lines = str.trimEnd().split("\n");

  let ws: string = /^\s*/.exec(lines[0])![0];
  while (ws === lines[0]) {
    lines.shift();
    ws = /^\s*/.exec(lines[0])![0];
  }

  return (
    lines
      .map((line) => {
        if (!line.trim()) {
          return "";
        }
        invariant(
          line.substring(0, ws.length) === ws,
          "Expected whitespace to match: " +
            JSON.stringify(ws) +
            JSON.stringify(line)
        );
        return line.substring(ws.length);
      })
      .join("\n") + "\n"
  );
}
