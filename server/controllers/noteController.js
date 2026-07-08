const Note = require("../models/Note");

const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ updatedAt: -1 });
    res.json({ success: true, notes });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

const createNote = async (req, res) => {
  try {
    const { title, content, type, tags } = req.body;
    const note = await Note.create({ user: req.user.id, title, content, type, tags });
    res.json({ success: true, note });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

const updateNote = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, content, tags },
      { new: true }
    );
    res.json({ success: true, note });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

const deleteNote = async (req, res) => {
  try {
    await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

module.exports = { getNotes, createNote, updateNote, deleteNote };
