require("dotenv").config();

const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const path = require("path");
const mapbox = require("./scripts/mapbox");

express()
  .set("views", "src/views/")
  .engine(
    ".hbs",
    exphbs({
      defaultLayout: "main",
      extname: ".hbs",
      layoutsDir: "src/views/layouts",
      partialsDir: "src/views/partials"
    })
  )
  .set("view engine", ".hbs")
  .use(express.static(path.join(__dirname, "../client")))
  .use(
    bodyParser.urlencoded({
      extended: true
    })
  )
  .use(bodyParser.json())
  .get("/", all)
  .post("/searchlocation", directions)
  .listen(1902);

async function all(req, res, next) {
  res.render("overview");
}

async function directions(req, res, next) {
  if (!req.body.location) {
    throw error;
  }
  const end = [4.909457, 52.359849];
  const location = await mapbox.searchLocation(req.body.location);
  const directions = await mapbox.searchRoute(location.features[0].center, end);
  let data = [];
  directions.routes[0].legs[0].steps.map(step => {
    const steps = {
      duration: (step.duration / 60).toFixed(1),
      name: step.name,
      distance: step.distance.toFixed(0),
      instruction: step.maneuver.instruction,
      type: step.maneuver.type,
      bearing_before: step.maneuver.bearing_before,
      bearing_after: step.maneuver.bearing_after,
      location: step.intersections.map(info => info.location)
    };
    data.push(steps);
  });
  res.render("overview", { directions: data });
}
