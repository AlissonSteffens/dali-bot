const mongoose = require('../config/mongoConnection');
const autopopulate = require('mongoose-autopopulate');
const Schema = mongoose.Schema;

const CanvasSchema = new Schema({
  name: String,
  image: String,
  
});
CanvasSchema.plugin(autopopulate);

const Canvas = mongoose.model('Canvas', CanvasSchema);

module.exports = Canvas;
