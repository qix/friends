import { HexColorString, MessageEmbed } from "discord.js";
import {
  FRIENDS_GUILD_ID,
  RULE_CHANNEL_ID,
  RULE_MESSAGE_ID,
  withActiveClient,
} from "./config";
import { invariant } from "./invariant";

withActiveClient(async function updateNicknames(client) {
  const guild = await client.guilds.fetch(FRIENDS_GUILD_ID);

  const meyer = await guild.members.fetch("130409128131559424");
  await meyer.setNickname("Mike Meyer");
  console.log("DONE", meyer);
});
