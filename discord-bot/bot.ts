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

const token = process.env.DISCORD_BOT_TOKEN;
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

const RULE_CHANNEL_ID = "944630927328436314";
const RULE_MESSAGE_ID = "945787612415811604";

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

async function sendRules() {
  const channel = await client.channels.fetch(RULE_CHANNEL_ID);
  invariant(channel, "Expected to find channel");
  invariant(
    channel.type === "GUILD_TEXT",
    "Expected to find guild text channel"
  );

  const colors: HexColorString[] = [
    "#B6E7D6",
    "#AFCAE4",
    "#E4E9BE",
    "#E9BED4",
    "#BEE9BF",
    "#BFBAE8",
  ];
  const rulesMessage =
    "**Welcome to the NYC Friands Club Discord!** :open_hands:\n" +
    "\n" +
    "We're building a community of nice, creative and trustworthy humans " +
    "that I hope you want to share a space with. If you're here it means " +
    "someone vouched for you, so well done and welcome!\n" +
    "\n" +
    "Please respect the rules and we'll all have a good time\n\n";

  const rules = [
    {
      heading: "Be nice",
      description:
        "It's that simple. We won't tolerate any hateful, racist, sexist, " +
        "harrassment or any form of abuse in messages here.",
    },
    {
      heading: "Observe channel etiquette",
      description:
        "We're trying to keep this as organised as possible. See the pinned " +
        "messages at the top of each channel for the rules, and keep " +
        "conversation relevant to the channel you're in.",
    },
    {
      heading: "Have fun",
      description:
        "This is built for you. You'll find a bunch of friendly and helpful" +
        "people within these walls. Contibute back as you can, if you want " +
        "to. If you don't want to, there's no-one forcing you to stay. Just " +
        "be nice and have fun!",
    },
    {
      heading: "---",
      description:
        "You're ready to get started! React to this message with :tada: to " +
        "gain access to the rest of our channels.",
    },
  ];
  const embeds = rules.map(({ heading, description }, idx) => {
    return new MessageEmbed()
      .setColor(colors[idx])
      .setTitle(heading)
      .setDescription(description);
  });

  const messageUpdate = {
    content: rulesMessage,
    embeds,
  };
  if (RULE_MESSAGE_ID === null) {
    channel.send(messageUpdate);
  } else {
    const message = await channel.messages.fetch(RULE_MESSAGE_ID);
    invariant(message, "Could not find rule message");
    message.edit(messageUpdate);
  }
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
