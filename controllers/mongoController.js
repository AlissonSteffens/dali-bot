const Canvas = require('../models/Canvas');
const User = require('../models/User');

exports.getSchema = async (Schema) => {
  const result = await Schema.find();
  return result;
};

exports.getSchemaById = async (Schema, id) => {
  const result = await Schema.findById(id);
  return result;
};

exports.getSchemaByProperty = async (Schema, propertyName, propertyValue) => {
  const query = {};
  query[propertyName] = propertyValue;
  const result = await Schema.find(query);
  return result;
};

exports.createSchema = async (Schema, info) => {
  const model = new Schema({
    ...info
  });
  const createdModel = await model.save();
  return createdModel;
};

exports.updateSchema = async (Schema, id, modifications) => {
  const updatedModel = await Schema.updateOne({ _id: id }, modifications);
  return updatedModel;
};

exports.updateSchemaByProperty = async (Schema, propertyName, propertyValue, modifications) => {
  const updatedModel = await Schema.updateMany({ propertyName: propertyValue }, modifications);
  return updatedModel;
};

exports.deleteSchema = async (Schema, id) => {
  await Schema.findByIdAndRemove(id);
};

exports.getUser = async (name) => {
  const result = await User.find({ name });
  if (result.length === 0) return;
  return result;
};

exports.getCanvas = async (server_name) => {
  const result = await Canvas.find({server_name});
  if (result.length === 0) return;
  return result[0];
};

exports.setDelay = async (server_name, newDelay) => {
  const canvas = await Canvas.find({ server_name });
  if (canvas.length === 0){
    await this.createSchema(Canvas, {'server_name': server_name, 'delay': newDelay})
  }else{
    canvas[0].delay = newDelay;
    const resultUpdate = await this.updateSchema(Canvas, canvas[0]._id, canvas[0]);
  }
  
};

exports.doUse = async (name, time) => {
  const user = await User.find({ name });
  if (user.length === 0) return;
  user[0].last = time;
  const resultUpdate = await this.updateSchema(User, user[0]._id, user[0]);
};

exports.setColor = async (name, color) => {
  const user = await User.find({ name });
  if (user.length === 0) return;
  user[0].color = color;
  const resultUpdate = await this.updateSchema(User, user[0]._id, user[0]);
};
