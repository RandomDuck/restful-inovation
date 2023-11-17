const express = require("express");
const router = express.Router();
const Note = require("../schemas/note");

//getNote middleware
async function getNote(req, res, next) {
  let note;
  try {
    note = await Note.findOne({owner: req.params.username});
    if (note == null) {
      return res.status(404).json({ status:404, message: "Cannot find Note" });
    }
  } catch (err) {
    return res.status(500).json({ status:500, message: err.message });
  }
  res.note = note;
  next();
}

// Get All Route
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find()
    res.json(notes)
  } catch (err) {
    res.status(500).json({status: 500, message: err.message})
  }
});

// Get One Route
router.get("/:username", getNote, async (req, res) => {
  res.json({ owner: res.note.owner, notes:res.note.notes, status: 201})
});

// Create One Route
router.post("/", async (req, res) => {
  const note = new Note({
    owner: req.body.username
  });
  noteExists = await Note.exists({owner: req.body.username});
  if (noteExists !== null) {
    res.status(405).json({status: 405, message: "Error: note allready exists, not allowed to make more."})
    return;
  }
  try {
    const newNote = await note.save();
    res.status(201).json({status: 201, newNote });
  } catch (err) {
    res.status(400).json({status: 400, message: err.message });
  }
});

//Patch Edit One
router.patch("/:username", getNote, async (req, res) => {
  if (req.body.username != null) {
    res.note.owner = req.body.username;
  }
  if (req.body.notes != null) {
    res.note.notes = req.body.notes;
  }
  try {
    const updatedUser = await res.note.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete One Route
router.delete("/:username", getNote, async (req, res) => {
  try {
    await res.note.deleteOne();
    res.json({ message: "Note has been deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/", async (req, res) => {
  try {
    const note = await Note.findById(req.body.id)
    await note.deleteOne();
    res.json({ message: "Note has been deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
