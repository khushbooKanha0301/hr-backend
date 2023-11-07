const express = require("express");
const cors = require("cors");
const path = require("path");
global.__basedir = __dirname;

const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json()); /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(
  express.urlencoded({ extended: true })
); /* bodyParser.urlencoded() is deprecated */

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to hr application." });
});

require("./app/routes/schedule.routes.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
