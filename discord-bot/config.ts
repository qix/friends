import { Client, Intents } from "discord.js";

export const RULE_CHANNEL_ID = "944630927328436314";
export const RULE_MESSAGE_ID = "945787612415811604";

export function createDiscordClient() {
  const token = process.env.DISCORD_BOT_TOKEN;
  return new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
  });
}

export function withActiveClient(callback: (client: Client) => Promise<void>) {
  const client = createDiscordClient();

  client.once("ready", () => {
    callback(client)
      .then(() => {
        client.destroy();
      })
      .catch((err) => {
        console.error("Callback failed: " + err.toString());
      });
  });
}
