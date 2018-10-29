const mongoose = require('mongoose');
let keys;

if (!process.env['url_mongo']) {
  keys = require('../keys.json');
}

const url = process.env['url_mongo'] || keys.url_mongo;

mongoose.connect(url, () => {
  console.log('mongodb connected');
});

module.exports = mongoose;

