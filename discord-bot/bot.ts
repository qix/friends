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
import { FRIEND_ROLE_ID, withActiveClient } from "./config";

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
      await guildMember.roles.add([FRIEND_ROLE_ID]);
    } else {
      await guildMember.roles.remove([FRIEND_ROLE_ID]);
    }
  }
}
withActiveClient(async (client) => {
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

  console.log("Bot running");
  await new Promise((resolve, reject) => {
    // Sleep forever
  });
});
