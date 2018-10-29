const jimp = require('jimp');
const fs = require('fs');
const mongoController = require('./mongoController');
const UserSchema = require('../models/User');

let battles = [];
let bot;

exports.setBot = async (b) => {
  bot = b;
};

exports.draw = async (msg) => {
  let userId = msg.author.id;
  let now = Math.floor(Date.now() / 1000);

  let db = await mongoController.getUser(userId)
  
  if(db == undefined){
    let user = {"name": userId, "last": now}
    await mongoController.createSchema(UserSchema, user)
  }else{
    let antes = db[0].last
    let falta = 10 - (parseInt(now) - parseInt(antes));
    if(falta > 0){
      bot.createMessage(msg.channel.id,'Você deve esperar mais '+falta+' segundos.');
      return;
    }
    await mongoController.doUse(db[0].name, now);
  }

  let x =  parseInt(msg.content.split(' ')[1], 10);
  let y =  parseInt(msg.content.split(' ')[2], 10);
  let r =  parseInt(msg.content.split(' ')[3], 10);
  let g =  parseInt(msg.content.split(' ')[4], 10);
  let b =  parseInt(msg.content.split(' ')[5], 10);
  
  if(x<0 || x>=20 || y<0 || y>=20){
    bot.createMessage(msg.channel.id,'Position must be between 0 and 19');
    return;
  }

  jimp.read('./canvas.png').then(async(image) => {
    
    image.resize(20,20, jimp.RESIZE_NEAREST_NEIGHBOR);
    let index = image.getPixelIndex(x, y);
    
    image.bitmap.data[index + 0] = r;
    image.bitmap.data[index + 1] = g;
    image.bitmap.data[index + 2] = b;
    image.bitmap.data[index + 3] = 255;

    image.resize(200,200, jimp.RESIZE_NEAREST_NEIGHBOR);
    let fileo = 'canvas.' + image.getExtension(); // with no extension   
    
    image.write(fileo, () => {
      bot.createMessage(msg.channel.id,'',{file: fs.readFileSync(fileo), name: fileo});
    });

  })
  .catch(err => {
    console.log(err);
  });
};
