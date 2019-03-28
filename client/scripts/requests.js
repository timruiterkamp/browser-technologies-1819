var url = (end, config = { prefix: "", options: "" }) => {
  var prefix = config.prefix ? config.prefix : config;
  var options = config.options ? `?${config.options}` : "/";
  var key = config.options
    ? "&access_token=pk.eyJ1Ijoibm9jbHVlNHUiLCJhIjoiY2pvZWY2ZTA5MXdkbjN3bGVicm1hZDNvZCJ9.kIU-GIm7Cl36xhEFLaPU1w"
    : "?access_token=pk.eyJ1Ijoibm9jbHVlNHUiLCJhIjoiY2pvZWY2ZTA5MXdkbjN3bGVicm1hZDNvZCJ9.kIU-GIm7Cl36xhEFLaPU1w";
  return `https://api.mapbox.com/${end}/${prefix}${options}${key}`;
};
var request = url =>
  new Promise((resolve, reject) => {
    fetch(url)
      .then(res => res.json())
      .then(resolve)
      .catch(reject);
  });

export function searchLocation(query) {
  var fetchUrl = url("geocoding/v5/mapbox.places", {
    prefix: `${query}.json`
  });
  return request(fetchUrl);
}

export function searchRoute(start, end) {
  var fetchUrl = url("directions/v5/mapbox/walking", {
    prefix: `${start[0]},${start[1]};${end[0]},${end[1]}`,
    options: "steps=true"
  });
  return request(fetchUrl);
}
