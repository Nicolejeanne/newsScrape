var mongoose = require('mongoose');

// Schema contructor
var Schema = mongoose.Schema;

// Create new Schema
var NoteSchema = new Schema({
	title: {
		type: String,
	},
	body: {
		type: String
	}
});

// Create model from the schema
var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;