const jimp = require('jimp');
const fs = require('fs');
const mongoController = require('./mongoController');
const UserSchema = require('../models/User');
const Color = require('color2');
const NamedColors = require('color-name-list');
const NearestColors = require('nearest-color');



const colors = [new Color('#2d3436'), new Color('#dfe6e9'), new Color('#00b894'), new Color('#00cec9'), new Color('#0984e3'), new Color('#6c5ce7'), new Color('#fdcb6e'), new Color('#e17055'), new Color('#d63031'), new Color('#e84393')];
const allColors = NamedColors.reduce((o, { name, hex }) => Object.assign(o, { [name]: hex }), {});
const nearest = NearestColors.from(allColors);

let bot;

let drawDelay = 60;

exports.setBot = async (b) => {
  bot = b;
};

let getColors = async () => {
  let msg = '';
  for(let i = 0; i<colors.length;i++){
    msg += '\n'+i+' - '+nearest(colors[i].hexString()).name;
  }
  return msg;
};

exports.setColor = async (msg) => {

  let newColor =  parseInt(msg.content.split(' ')[1], 10);

  let userId = msg.author.id;
  let db = await mongoController.getUser(userId)
  let user

  if(db == undefined){
    user = {"name": userId, "last": "0", "color": newColor};
    await mongoController.createSchema(UserSchema, user);
  }else{
    db[0].color = newColor;    
    await mongoController.setColor(db[0].name, newColor);
  }

  let colorName = nearest(colors[newColor].hexString()).name;
  bot.createMessage(msg.channel.id,'New color is '+colorName);
};

exports.setDelay = async (msg) => {

  let newDelay =  parseInt(msg.content.split(' ')[1], 10);

  let userAdmin = msg.member.permission.json.administrator;
  if(userAdmin){
    drawDelay = newDelay;
    await mongoController.setDelay(msg.channel.id, newDelay)
    bot.createMessage(msg.channel.id,'New draw delay is '+newDelay);
  }else{
    bot.createMessage(msg.channel.id,'Ohh, what are You doing here? You are not an Admin :unamused: go home');
  }
  
  
};

exports.draw = async (msg) => {
  let userId = msg.author.id;
  let now = Math.floor(Date.now() / 1000);

  let db = await mongoController.getUser(userId)
  let user
  if(db == undefined){
    user = {"name": userId, "last": now, "color": '0'};
    await mongoController.createSchema(UserSchema, user);
  }else{
    let antes = db[0].last;
    user = db[0];
    let canvas = await mongoController.getCanvas(msg.channel.id)
    
    if(canvas == undefined){
      await mongoController.setDelay(msg.channel.id, 60)
      drawDelay = 60;
    }else{
      drawDelay = canvas.delay;
    }
    let falta = drawDelay - (parseInt(now) - parseInt(antes));
    if(falta > 0){
      bot.createMessage(msg.channel.id,'<@'+msg.author.id+'> você deve esperar mais '+falta+' segundos.');
      return;
    }
    await mongoController.doUse(db[0].name, now);
  }

  let color = colors[user.color].rgbArray();
  let x =  parseInt(msg.content.split(' ')[1], 10);
  let y =  parseInt(msg.content.split(' ')[2], 10);


  
  if(x<0 || x>=20 || y<0 || y>=20){
    bot.createMessage(msg.channel.id,'Position must be between 0 and 19');
    return;
  }

  jimp.read('./canvas.png').then(async(image) => {
    
    image.resize(20,20, jimp.RESIZE_NEAREST_NEIGHBOR);
    let index = image.getPixelIndex(x, y);
    
    image.bitmap.data[index + 0] = color[0];
    image.bitmap.data[index + 1] = color[1];
    image.bitmap.data[index + 2] = color[2];
    image.bitmap.data[index + 3] = 255;

    image.resize(300, 300, jimp.RESIZE_NEAREST_NEIGHBOR);
    let fileo = 'canvas.' + image.getExtension(); // with no extension   
    
    image.write(fileo, () => {
      bot.createMessage(msg.channel.id,'',{file: fs.readFileSync(fileo), name: fileo});
    });

  })
  .catch(err => {
    console.log(err);
  });
};

exports.showColors = async (msg) => {

  jimp.read(5, colors.length/5, 0x000000ff).then(async(image) => {
    
    let actualColor = 0
    let color;
    for(let y = 0; y < colors.length/5; y++){
      for(let x = 0; x < 5; x++){      
        let index = image.getPixelIndex(x, y);
        color = colors[actualColor].rgbArray();
        image.bitmap.data[index + 0] = color[0];
        image.bitmap.data[index + 1] = color[1];
        image.bitmap.data[index + 2] = color[2];
        image.bitmap.data[index + 3] = 255;
        actualColor++;
      }
    }
    image.resize(250,jimp.AUTO, jimp.RESIZE_NEAREST_NEIGHBOR);
    let fileo = 'colors.' + image.getExtension(); // with no extension   
    let colorNames = '```\nPossible Colors:\n' + await getColors() + '```';
    image.write(fileo, () => {
      bot.createMessage(msg.channel.id, colorNames ,{file: fs.readFileSync(fileo), name: fileo});
    });

  })
  .catch(err => {
    console.log(err);
  });
};
