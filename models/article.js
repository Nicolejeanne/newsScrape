var mongoose = require("mongoose");

// Schema contructor
var Schema = mongoose.Schema;

// Create new Schema
var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  // The ref property links the ObjectId to the Note model
  // This allows us to populate the Article with an associated Note
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// Create model from the schema
var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
