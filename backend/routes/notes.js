const express = require("express");
const router = express.Router();
const Note = require("../models/Note"); //Notes.js ko import kr rhy hn
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

//(Route 1):(1st endpoint) Get all notes Using :GET "/api/notes/fetchallnotes".login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }); //fetchuser use kiya h is liya is { user: req.user } ma user mojod ho ga or us ki (id) ly ly gy
    res.json(notes);
  } catch (error) {
    //Some error found then show this error
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
//(Route 2):(2nd endpoint) Add a new notes Using :POST "/api/notes/addnote".login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "description must be atleast 5 charactors").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      //destructuring
      const { title, description, tag } = req.body;
      //If there are errors,return Bad reqest and error
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      //it return a promises and apply .save function
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      //Some error found then show this error
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//(Route 3):(3rd endpoint) Update an exicting notes Using :PUT "/api/notes/updatenote".login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  try {
    //create a newNote object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }
    //Find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.send(note);
  } catch (error) {
    //Some error found then show this error
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//(Route 4):(4th endpoint) Delete an exicting notes Using :DELETE "/api/notes/deletenote".login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    //Find the note to be deleted and delete it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }

    //Allow deletion only if user owns this Note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    note = await Note.findByIdAndDelete(req.params.id);
    res.send({ Success: "Note has been deleted", note: note });
  } catch (error) {
    //Some error found then show this error
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
