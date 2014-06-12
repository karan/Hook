var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// For any user
var postsSchema = new Schema({
  date: {
    type: Date,
    default: new Date().toJSON().slice(0,10)
  },
  expires: {
    type: Date,
    default: new Date(Date.now() + 60*60*1000)   // 1 hour
  },
  posts: []
});

module.exports = mongoose.model('Posts', postsSchema);
