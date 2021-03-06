var form = document.querySelector("#search-form");
var input = document.querySelector("#location");

mapboxgl.accessToken =
  "pk.eyJ1Ijoibm9jbHVlNHUiLCJhIjoiY2pvZWY2ZTA5MXdkbjN3bGVicm1hZDNvZCJ9.kIU-GIm7Cl36xhEFLaPU1w";

const map = new mapboxgl.Map({
  container: "map-container",
  style: "mapbox://styles/noclue4u/cjth43b7477qe1foa6s1n76wv",
  center: [4.6727, 52.5453],
  zoom: 12
});

const container = map.getCanvasContainer();

map.on("load", function() {
  document.querySelector(".routes").style.display = "none";

  var viewToggle = document.querySelector("#view-toggle");
  if (viewToggle) {
    viewToggle.style.display = "block";

    viewToggle.addEventListener("click", function(e) {
      e.preventDefault();

      if (e.target.innerHTML.toLowerCase() === "toggle list") {
        document.querySelector("#map-container").style.display = "none";
        document.querySelector(".routes").style.display = "block";
        viewToggle.innerHTML = "Toggle map";
      } else {
        e.preventDefault();
        document.querySelector("#map-container").style.display = "block";
        document.querySelector(".routes").style.display = "none";
      }
    });
  }

  map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    })
  );
});

let geolocation;
if (window.addEventListener) {
  if ("geolocation" in navigator) {
    try {
      input.addEventListener("click", function(e) {
        e.preventDefault();

        navigator.geolocation.getCurrentPosition(function(position) {
          geolocation = position.coords;
          input.value = "Loading route...";
          input.value = geolocation.latitude + "," + geolocation.longitude;
        });
      });
    } catch (err) {
      throw err;
    }
  }

  form.addEventListener("submit", function(e) {
    e.preventDefault();
    var value = e.target.location.value;
    var number = parseInt(value);
    var loading = document.querySelector("#loading");
    loading.innerHTML = "Looking for the fastest route...";
    loading.style.display = "block";
    navigator.geolocation.watchPosition(
      function() {
        navigator.geolocation.getCurrentPosition(function(position) {
          var location = position.coords;
          if (!number) {
            findDirection(value, e);
          } else {
            findDirection([location.longitude, location.latitude], e);
          }
        });
      },
      function(error) {
        if (error.code == error.PERMISSION_DENIED && !number) {
          findDirection(value, e);
        } else {
          loading.innerHTML = "Please enter a city name";
        }
      }
    );
  });
}

function findDirection(value, e) {
  var end = [4.909457, 52.359849];

  if (parseInt(value)) {
    searchRoute(value, end, e, function(value) {
      loadDirections(value);
    });
  } else {
    function findLocation(value, e, fn) {
      searchLocation(value, e, function(result) {
        fn(result);
      });
    }

    findLocation(value, e, function(location) {
      document.querySelector("#loading").style.display = "none";
      var suggestions = document.querySelector("#suggestions");
      var tripsuggestions = [];
      var place = location.features;
      for (var i = 0; i < place.length; i++) {
        tripsuggestions.push(
          "<br><li>" +
            "<a class=" +
            "place" +
            " href=" +
            '"' +
            place[i].place_name +
            '"' +
            "alt=" +
            '"' +
            "plaats:" +
            place[i].place_name +
            '">' +
            place[i].place_name +
            "</a>"
        ) + "</li>";
        suggestions.innerHTML = "<br>Did you mean:" + tripsuggestions;
      }

      var places = document.querySelectorAll(".place");
      for (var i = 0; i < places.length; i++) {
        places[i].addEventListener("click", function(e) {
          e.preventDefault();
          var value = e.target.innerHTML;
          for (var i = 0; i < location.features.length; i++) {
            if (location.features[i].place_name === value.toString()) {
              searchRoute(location.features[i].center, end, e, function(value) {
                loadDirections(value);
              });
            }
          }
        });
      }
      suggestions.style.zIndex = "1";
      suggestions.style.display = "block";
    });
  }
}
function loadDirections(directions) {
  let data = [];

  directions.routes[0].legs[0].steps.map(function(step) {
    var steps = {
      duration: (step.duration / 60).toFixed(1),
      name: step.name,
      distance: step.distance.toFixed(0),
      instruction: step.maneuver.instruction,
      type: step.maneuver.type,
      bearing_before: step.maneuver.bearing_before,
      bearing_after: step.maneuver.bearing_after,
      location: getLocations(step.intersections)
    };
    data.push(steps);

    var routes = document.querySelector(".routes");
    var routesuggestions = [];
    for (var i = 0; i < data.length; i++) {
      routesuggestions.push(
        "<br><article class=" +
          "route-description>" +
          "<h3>" +
          data[i].instruction +
          " after " +
          data[i].distance +
          "meters</h3>" +
          "<p>Estimated time:" +
          data[i].duration +
          " minutes</p>" +
          "<p>Current location:" +
          data[i].name +
          "</p></article>"
      );
      routes.innerHTML = "<br>" + routesuggestions;
    }

    map.flyTo({
      center: data[0].location,
      zoom: 16
    });

    function getLocations(steps) {
      for (var i = 0; i < steps.length; i++) {
        return steps[i].location;
      }
    }
    loadMap(directions.routes[0]);
  });
}

function loadMap(data) {
  document.querySelector("#suggestions").style.display = "none";

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
        "line-color": "#FEFF00",
        "line-width": 15,
        "line-opacity": 1
      }
    });
  }
}

function request(url, e, cb) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState !== 4) return;
    if (xhr.status >= 200 && xhr.status < 300) {
      e.preventDefault();
      return cb(JSON.parse(xhr.responseText));
    }
  };
  xhr.open("GET", url);
  xhr.send();
}

function url(end, prefixes, options) {
  var prefix;
  var option;
  var key;

  if (prefixes) {
    prefix = prefixes;
  } else {
    prefix = "";
  }

  if (options) {
    option = "?" + options;
  } else {
    option = "/";
  }

  if (options) {
    key =
      "&access_token=pk.eyJ1Ijoibm9jbHVlNHUiLCJhIjoiY2pvZWY2ZTA5MXdkbjN3bGVicm1hZDNvZCJ9.kIU-GIm7Cl36xhEFLaPU1w";
  } else {
    key =
      "?access_token=pk.eyJ1Ijoibm9jbHVlNHUiLCJhIjoiY2pvZWY2ZTA5MXdkbjN3bGVicm1hZDNvZCJ9.kIU-GIm7Cl36xhEFLaPU1w";
  }

  return "https://api.mapbox.com/" + end + prefix + option + key;
}

function searchLocation(query, e, fn) {
  var fetchUrl = url("geocoding/v5/mapbox.places" + "/" + query + ".json");

  var value = request(fetchUrl, e, fn);
  document.querySelector("#loading").style.display = "none";
  return value;
}

function searchRoute(start, end, e, fn) {
  var fetchUrl = url(
    "directions/v5/mapbox/walking/",
    start[0] + "," + start[1] + ";" + end[0] + "," + end[1],
    "steps=true&geometries=geojson"
  );
  var value = request(fetchUrl, e, fn);
  document.querySelector("#loading").style.display = "none";
  return value;
}
