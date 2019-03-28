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
  .post("/searchlocation", directions)
  .get("/", all)
  .listen(process.env.PORT || 1902);

async function all(req, res, next) {
  res.render("overview");
}

async function directions(req, res, next) {
  if (!req.body.location) {
    throw error;
  }
  const end = [4.909457, 52.359849];
  console.log(mapbox);
  const location = await searchLocation(req.body.location);
  const directions = await searchRoute(
    location ? location.features[0].center : "",
    end
  );
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

const fetch = require("node-fetch");

const url = (end, config = { prefix: "", options: "" }) => {
  const prefix = config.prefix ? config.prefix : config;
  const options = config.options ? `?${config.options}` : "/";
  const key = config.options
    ? `&access_token=${process.env.MAPBOX_KEY}`
    : `?access_token=${process.env.MAPBOX_KEY}`;
  return `https://api.mapbox.com/${end}/${prefix}${options}${key}`;
};
const request = url =>
  new Promise((resolve, reject) => {
    fetch(url)
      .then(res => res.json())
      .then(resolve)
      .catch(reject);
  });

function searchLocation(query) {
  const fetchUrl = url("geocoding/v5/mapbox.places", {
    prefix: `${query}.json`
  });
  return request(fetchUrl);
}

function searchRoute(start, end) {
  const fetchUrl = url("directions/v5/mapbox/walking", {
    prefix: `${start[0]},${start[1]};${end[0]},${end[1]}`,
    options: "steps=true"
  });
  return request(fetchUrl);
}
