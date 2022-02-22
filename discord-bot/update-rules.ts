import { HexColorString, MessageEmbed } from "discord.js";
import { RULE_CHANNEL_ID, RULE_MESSAGE_ID, withActiveClient } from "./config";
import { invariant } from "./invariant";

withActiveClient(async function sendRules(client) {
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
});
