const mongoose = require('../config/mongoConnection');

const Schema = mongoose.Schema;

const CanvasSchema = new Schema({
  name: String,
  image: String,
  
});


const Canvas = mongoose.model('Canvas', CanvasSchema);

module.exports = Canvas;
