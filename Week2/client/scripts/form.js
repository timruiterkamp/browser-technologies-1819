var form = document.querySelector("#search-form");
var input = document.querySelector("#location");

let geolocation;
if (window.addEventListener) {
  if ("geolocation" in navigator) {
    input.addEventListener("click", e => {
      e.preventDefault();
      navigator.geolocation.getCurrentPosition(position => {
        geolocation = position.coords;
        input.value = "Loading geolocation...";
        input.value = `${geolocation.latitude}, ${geolocation.longitude}`;
      });
    });
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    var value = e.target.location.value;
    var end = [4.909457, 52.359849];

    navigator.geolocation.watchPosition(
      function() {
        navigator.geolocation.getCurrentPosition(function(position) {
          var location = position.coords;
          searchRoute(
            [location.longitude, location.latitude],
            end, e, function(value) {
              loadDirections(value);

            }
          );
        });
      },
      function(error) {
        if (error.code == error.PERMISSION_DENIED)
        function findLocation(value, e, fn) {
          searchLocation(value, e, function(result) {
            fn(result);
          });
        }

        findLocation(value, e, function(location) {
          searchRoute(location.features[0].center, end, e, function(value){
            loadDirections(value)
          })
        });
      }
    );
  });
}
function loadDirections(directions) {
  let data = [];
  var instructions = document.getElementById('instruction');
  var steps = directions.routes[0].legs[0].steps;

  var tripInstructions = [];
  for (var i = 0; i < steps.length; i++) {
    tripInstructions.push('<br><li>' + steps[i].maneuver.instruction + ' after ' + steps[i].distance + ' meters') + '</li>';
    instructions.innerHTML = '<br><span class="duration">Walking duration: ' + Math.floor(directions.routes[0].duration / 60) + ' minutes </span>' + tripInstructions;
  } 
  instructions.style.zIndex = '1'; 
  directions.routes[0].legs[0].steps.map(step => {
    var steps = {
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
    map.flyTo({
      center:  data[0].location[0],
      zoom: 16
    })

    loadMap(directions.routes[0])
    
  });
}

function loadMap(data) {
  var route = data.geometry.coordinates;
    var geojson = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: route
      }
    };
    if (map.getSource("route")) {
      map.getSource("route").setData(geojson);
    } else {
      // otherwise, make a new request
      map.addLayer({
        id: "route",
        type: "line",
        source: {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: geojson
            }
          }
        },
        layout: {
          "line-join": "round",
          "line-cap": "round"
        },
        paint: {
          "line-color": "#3887be",
          "line-width": 15,
          "line-opacity": 1
        }
      });
    }

    map.on("load", function() {
      // Add starting point to the map
      map.addLayer({
        id: "point",
        type: "circle",
        source: {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "Point",
                  coordinates: start
                }
              }
            ]
          }
        },
        paint: {
          "circle-radius": 10,
          "circle-color": "#3887be"
        }
      });

      map.addLayer({
        id: 'end',
        type: 'circle',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: coords
              }
            }]
          }
        },
        paint: {
          'circle-radius': 10,
          'circle-color': '#f30'
        }
      });
    });
}

function request(url, e, cb) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState !== 4) return;
    if (xhr.status >= 200 && xhr.status < 300) {
      e.preventDefault();
      return cb(JSON.parse(xhr.responseText))
    }
  };
  xhr.open("GET", url);
  xhr.send();
}

function url(end, config = { prefix: "", options: "" }) {
  var prefix = config.prefix ? config.prefix : config;
  var options = config.options ? `?${config.options}` : "/";
  var key = config.options
    ? "&access_token=pk.eyJ1Ijoibm9jbHVlNHUiLCJhIjoiY2pvZWY2ZTA5MXdkbjN3bGVicm1hZDNvZCJ9.kIU-GIm7Cl36xhEFLaPU1w"
    : "?access_token=pk.eyJ1Ijoibm9jbHVlNHUiLCJhIjoiY2pvZWY2ZTA5MXdkbjN3bGVicm1hZDNvZCJ9.kIU-GIm7Cl36xhEFLaPU1w";
  return "https://api.mapbox.com/" + end + "/" + prefix + options + key;
}

function searchLocation(query, e, fn) {
  var fetchUrl = url("geocoding/v5/mapbox.places", {
    prefix: `${query}.json`
  });
  var value =  request(fetchUrl, e, fn);
  return value;
}

function searchRoute(start, end, e, fn) {
  var fetchUrl = url("directions/v5/mapbox/walking", {
    prefix: `${start[0]},${start[1]};${end[0]},${end[1]}`,
    options: "steps=true&geometries=geojson"
  });
  var value =  request(fetchUrl, e, fn);
  return value;
}
