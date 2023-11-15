const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const noteSchema = new Schema({
owner: {
  type: String,
  required: true
 },
notes: {
  type: [String],
  required: true,
  default: ["Welcome to your personal notepad"]
 }
});
const Note = mongoose.model("Note", noteSchema);
module.exports = Note;