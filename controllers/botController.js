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
    condition: (msg) => { return msg.content.startsWith(commandSymbol + 'pong'); },
    action: (msg) => { bot.createMessage(msg.channel.id, 'Ping!'); }
  });
  commands.push({
    name: 'Draw',
    condition: (msg) => { return msg.content.startsWith(commandSymbol + 'draw'); },
    action: (msg) => { canvasController.draw(msg, bot); }
  });
  commands.push({
    name: 'Set Color',
    condition: (msg) => { return msg.content.startsWith(commandSymbol + 'setColor'); },
    action: (msg) => { canvasController.setColor(msg, bot); }
  });
  commands.push({
    name: 'Set Delay',
    condition: (msg) => { return msg.content.startsWith(commandSymbol + 'setDelay'); },
    action: (msg) => { canvasController.setDelay(msg, bot); }
  });
  commands.push({
    name: 'Colors',
    condition: (msg) => { return msg.content.startsWith(commandSymbol + 'colors'); },
    action: (msg) => { canvasController.showColors(msg, bot); }
  });
  commands.push({
    name: 'Help',
    condition: (msg) => { return msg.content.startsWith(commandSymbol + 'help'); },
    action: (msg) => { showHelp(msg); }
  });
};

const showHelp = async (msg) => {
  let message = '```Command List:\n';
  
  message += '--------------Canvas---------------\n';
  message += commandSymbol + 'draw x y: Draw on pixel X Y\n';
  message += commandSymbol + 'setColor newColor: Set your new actual color\n';
  message += commandSymbol + 'colors: Show all possible colors as image\n';

  message += '\n--------------Admin Only---------------\n';
  message += commandSymbol + 'setDelay time: set the draw on canvas delay\n';
  message += '```'
  bot.createMessage(msg.channel.id, message);
};

