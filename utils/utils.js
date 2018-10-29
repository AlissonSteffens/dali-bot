exports.handleAsyncMethod = async (method, args) => {
  try {
    const result = await method(...args);
    return result;
  } catch (err) {
    console.log(err);
    return 'error';
  }
};

exports.generateRandomInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
