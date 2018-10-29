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

exports.getCanvas = async (id) => {
  const result = await Canvas.find({ discord_id: id });
  if (result.length === 0) return;
  return result[0];
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
