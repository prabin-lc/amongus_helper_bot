const Discord = require("discord.js");
const { prefix, token, role_that_can_mute } = require("./config.json");
const client = new Discord.Client();

const { giveMemeLink } = require("./meme");

let currentlyActiveControlMessage;

function resetReactionsToControlMessage() {
  currentlyActiveControlMessage.reactions.removeAll();
  currentlyActiveControlMessage.react("🔇");
  currentlyActiveControlMessage.react("🔈");
}

async function handleCommand(message) {
  if (message.content == `${prefix}ctrl`) {
    let [code, server] = await findLastSentCodeAndServer(message.channel);
    message.channel
      .send(
        `AMONG US\n**Last sent code:** ${code}\n**Server:** ${server}\nReact to mute/unmute channel`
      )
      .then((message) => {
        currentlyActiveControlMessage = message;
        resetReactionsToControlMessage();
      });
  } else if (message.content == `${prefix}meme`) {
    message.channel.send(giveMemeLink());
  } else {
    message.channel.send(
      `The main command is \`${prefix}ctrl\` for control menu.\nJoin a voice channel to use mute and unmute functions.\n\nEnter code in all caps for the bot to identify it.\nServer name can be case insensitive`
    );
  }
}

async function findLastSentCodeAndServer(channel) {
  let code;
  let server;
  await channel.messages
    .fetch({ limit: 20 })
    .then((messages) => {
      for (const message of messages.array()) {
        code = message.content.match(/(^| )[A-Z]{6}(\n|$| )/);
        if (code) {
          code = code[0];
          break;
        }
      }
      for (const message of messages.array()) {
        server = message.content.match(
          /(^| )(asia|north america|na|europe)(\n|$| )/i
        );
        if (server) {
          server = server[0];
          break;
        }
      }
    })
    .catch(console.error);
  return [code, server];
}

function muteVoiceChannel(user) {
  const member = currentlyActiveControlMessage.guild.member(user);
  const channel = member.voice.channel;
  if (
    role_that_can_mute === null ||
    member.roles.cache.some((r) => r.name === role_that_can_mute)
  ) {
    if (channel) {
      for (const [memberID, member] of channel.members) {
        member.voice.setMute(true);
      }
    } else {
      currentlyActiveControlMessage.channel
        .send(`${user}, you need to join a voice channel first`)
        .then((message) => message.delete({ timeout: 3000 }));
    }
  } else {
    currentlyActiveControlMessage.channel
      .send(
        `${user}, You need the \`${role_that_can_mute}\` role to mute server.`
      )
      .then((message) => message.delete({ timeout: 3000 }));
  }
}

function unmuteVoiceChannel(user) {
  const member = currentlyActiveControlMessage.guild.member(user);
  const channel = member.voice.channel;
  if (
    role_that_can_mute === null ||
    member.roles.cache.some((r) => r.name === role_that_can_mute)
  ) {
    if (channel) {
      for (const [memberID, member] of channel.members) {
        member.voice.setMute(false);
      }
    } else {
      currentlyActiveControlMessage.channel
        .send(`${user}, you need to join a voice channel first`)
        .then((message) => message.delete({ timeout: 3000 }));
    }
  } else {
    currentlyActiveControlMessage.channel
      .send(
        `${user}, You need the \`${role_that_can_mute}\` role to unmute server.`
      )
      .then((message) => message.delete({ timeout: 3000 }));
  }
}

client.on("message", (message) => {
  if (message.content.startsWith(prefix)) handleCommand(message);
});

client.on("messageReactionAdd", (reaction, user) => {
  let message = reaction.message,
    emoji = reaction.emoji;

  if (user.bot || message !== currentlyActiveControlMessage) return;

  if (emoji.identifier == "%F0%9F%94%87") {
    muteVoiceChannel(user);
  } else if (emoji.identifier == "%F0%9F%94%88") {
    unmuteVoiceChannel(user);
  }
  resetReactionsToControlMessage();
});

client.login(token);
