import { Client, HexColorString, MessageEmbed } from "discord.js";
import { invariant } from "./invariant";
import { FRIENDS_GUILD_ID, FRIEND_ROLE_ID, withActiveClient } from "./config";
import { got } from "got-cjs";

withActiveClient(async function updateNicknames(client: Client) {
  const guild = await client.guilds.fetch(FRIENDS_GUILD_ID);

  console.log("Fetching members...");
  const members = await guild.members.fetch();

  const db = await got("http://localhost:3000/api/discordMembers", {
    responseType: "json",
  });
  const payload: {
    users: {
      discordID: string;
      name: string;
    }[];
  } = db.body as any;

  const registered = new Map<
    string,
    {
      name: string;
    }
  >();
  for (const { discordID, name } of payload.users) {
    if (discordID) {
      registered.set(discordID, {
        name,
      });
    }
  }
  console.log(db.body);

  for (const member of members.values()) {
    const { id, username, discriminator } = member.user;

    const details = registered.get(member.user.id);
    if (!details) {
      continue;
    }

    console.log(
      `${member.user.id} -- ${username}#${discriminator} : ${member.nickname}`
    );

    if (member.nickname !== details.name) {
      console.log("-- Setting nickname");
      await member.setNickname(details.name);
    }
    if (!member.roles.cache.has(FRIEND_ROLE_ID)) {
      console.log("-- Adding role");
      await member.roles.add([FRIEND_ROLE_ID]);
    }
  }
});
