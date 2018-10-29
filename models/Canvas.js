const mongoose = require('../config/mongoConnection');

const Schema = mongoose.Schema;

const CanvasSchema = new Schema({
  server_name: String,
  delay: Number  
});


const Canvas = mongoose.model('Canvas', CanvasSchema);

module.exports = Canvas;
