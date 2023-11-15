const express = require("express");
const router = express.Router();
const User = require("../schemas/user");

//getUser middleware
async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "Cannot find User" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.user = user;
  next();
}

// Get All Route
router.get("/", async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (err) {
    res.status(500).json({message: err.message})
  }
});

// Get One Route
router.post("/:username", async (req, res) => {
  const user = await User.findOne({username: req.params.username.toLowerCase()});
  if (user !== null && req.body.password === user.password) {
    res.json({login: true, id: user.id, user: user.username});
  } else {
    res.json({login: false});
  }
});

// Create One Route
router.post("/", async (req, res) => {

  const usercheck = await User.findOne({username: req.params.username.toLowerCase()});
  const user = new User({
    username: req.body.username.toLowerCase(),
    password: req.body.password
  });
  try {
    if (usercheck !== null) {
      res.status(500).json({ message: "user allready exists" });
    } else {
      const newUser = await user.save();
      res.status(201).json({ newUser });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Patch Edit One
router.patch("/:id", getUser, async (req, res) => {
  if (req.body.username != null) {
    res.user.username = req.body.username.toLowerCase();
  }
  if (req.body.password != null) {
    res.user.password = req.body.password;
  }
  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Put Edit One
router.put("/:id", getUser, async (req, res) => {
  try {
    const updatedUser = await res.user.set(req.body);
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Delete One Route
router.delete("/:id", getUser, async (req, res) => {
  try {
    await res.user.deleteOne();
    res.json({ message: "User has been deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
