const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const fs = require("fs");

const usersRouter = require("./routes/users");
const notesRouter = require("./routes/notes");

const { databaseUrl, port } = JSON.parse(fs.readFileSync('./config.json'));
const app = express();
app.set('view engine', 'react');

mongoose.connect(databaseUrl);  
const db = mongoose.connection;
db.on("error", error => console.log(error));
db.once("open", () => console.log("connection to db established"));
app.use(express.json());
app.use(cors());

app.use("/users", usersRouter);
app.use("/notes", notesRouter);

app.listen(port, () => console.log(`server has started at port ${port}`));