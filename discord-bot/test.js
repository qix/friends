const { Client, Intents } = require('discord.js');

const token = process.env.DISCORD_BOT_TOKEN;
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });


const mario = '816343807159042058';
const jyud = '311175386887094282';

async function run() {

  const guilds = await client.guilds.fetch();
  const guild = await guilds.get('944628347101642752').fetch();
  console.log('GET MEM');
  // const members = await guild.members.fetch();
  const guildMember = await guild.members.fetch(mario);
  console.log('ADD TO MARIO', guildMember);
  await guildMember.roles.add(['944631047767863316']);
}

client.once('ready', () => {
	console.log('Ready!');

  run() .then(() => {
    console.log("DONE");
  }).catch(err => {
      console.error("ERROR", err);
    });
});

client.login(token);


/*

*/

/* [
  {
    "messageId": "945440548154646538",
    "channelId": "944630927328436314",
    "removeReaction": true,
    "policy": "any",
    "emojiRoleMap": {
      "🎉": [""]
    }
  }
] */
