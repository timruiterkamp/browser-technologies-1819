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

module.exports = {
  searchLocation(query) {
    const fetchUrl = url("geocoding/v5/mapbox.places", {
      prefix: `${query}.json`
    });
    return request(fetchUrl);
  },
  searchRoute(start, end) {
    const fetchUrl = url("directions/v5/mapbox/walking", {
      prefix: `${start[0]},${start[1]};${end[0]},${end[1]}`,
      options: "steps=true"
    });
    return request(fetchUrl);
  }
};

// if (module) {
//   export mapbox;
// } else {
//   export default
// }
