var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// For any user
var commentsSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  expires: {
    type: Date,
    default: new Date(Date.now() + 2*60*60*1000)   // 2 hours
  },
  permalink: String,
  post: {},
  comments: []
});

module.exports = mongoose.model('Comments', commentsSchema);
