const Eris = require('eris');
const canvasController = require('./canvasController');
const utils = require('../utils/utils');
let keys;

if (!process.env['bot_token']) {
  keys = require('../keys.json');
}

const botToken = process.env['bot_token'] || keys.bot_token;
const bot = new Eris(botToken);
const commands = [];
let commandSymbol = '+';

exports.connectBot = () => {
  bot.connect();
};

bot.on('ready', () => {
  createCommands();
  canvasController.setBot(bot);
  console.log('Dali is here');
  
  bot.editStatus("away", {name:"Conversa Fora", type:2});
});

bot.on('messageCreate', (msg) => {
  const command = commands.filter(c => c.condition(msg));
  if (command[0]) command[0].action(msg);
});

const createCommands = () => {
  commands.push({
    name: 'Ping',
    condition: (msg) => { return msg.content.startsWith(commandSymbol + 'ping'); },
    action: (msg) => { bot.createMessage(msg.channel.id, 'Pong!'); }
  });
  commands.push({
    name: 'Draw',
    condition: (msg) => { return msg.content.startsWith(commandSymbol + 'draw'); },
    action: (msg) => { canvasController.draw(msg, bot); }
  });
};

const changeSymbol = (msg) => {
  commandSymbol = msg.content.split(' ').slice(1).join(' ');
  bot.createMessage(msg.channel.id, `New symbol is now ${commandSymbol}`);
};

