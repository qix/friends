import {
  Client,
  Guild,
  GuildEmoji,
  HexColorString,
  Intents,
  Message,
  MessageEmbed,
  PartialMessage,
  PartialUser,
  ReactionEmoji,
  User,
} from "discord.js";
import { createDiscordClient } from "./config";

const client = createDiscordClient();

function invariant(
  condition: any,
  message?: string | (() => string)
): asserts condition {
  if (condition) {
    return;
  }

  const errorMessage = typeof message === "function" ? message() : message;
  throw new Error(errorMessage);
}

client.once("ready", () => {
  console.log("Ready!");
});

async function handleEmoji(props: {
  user: User | PartialUser;
  guild: Guild;
  message: Message | PartialMessage;
  emoji: GuildEmoji | ReactionEmoji;
  set: boolean;
}) {
  const { user, guild, message, emoji, set } = props;

  const userName = `${user.username}#${user.discriminator}`;
  const symbol = set ? "+" : "-";

  console.log(`${symbol} ${userName} ${emoji.name} on ${message.id}`);

  if (message.id === "945440548154646538" && emoji.name === "🎉") {
    // It's a rule enable/disable
    const guildMember = await guild.members.fetch(user.id);

    // Add/remove the `friand` role
    if (set) {
      await guildMember.roles.add(["944631047767863316"]);
    } else {
      await guildMember.roles.remove(["944631047767863316"]);
    }
  }
}
client.on("messageReactionAdd", async (messageReaction, user) => {
  if (messageReaction.partial) {
    await messageReaction.fetch();
  }
  const { message, emoji } = messageReaction;
  const { guild } = message;
  invariant(guild, "Bot only handles guild messages");
  await handleEmoji({
    user,
    guild,
    message,
    emoji,
    set: true,
  });
});
client.on("messageReactionRemove", async (messageReaction, user) => {
  if (messageReaction.partial) {
    await messageReaction.fetch();
  }
  const { message, emoji } = messageReaction;
  const { guild } = message;
  invariant(guild, "Bot only handles guild messages");
  await handleEmoji({
    user,
    guild,
    message,
    emoji,
    set: false,
  });
});

client.login(token);
