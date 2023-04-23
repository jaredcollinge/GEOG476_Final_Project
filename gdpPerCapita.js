var map = L.map('map1').setView([37.8, -96], 4);

var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// control that shows state info on hover
var info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};

info.update = function (props) {
  var contents = props
    ? `<b>${props.Name}</b><br />GDP Per Capita: $${Math.round(props.gdpPerCapita).toLocaleString()}`
    : 'Hover over a state';
  this._div.innerHTML = `<h4>US GDP Per Capita</h4>${contents}`;
};

info.addTo(map);

// get color depending on cost of living index value
function getColor(d) {
  return d > 90000 ? '#084081' :
         d > 80000 ? '#0868ac' :
         d > 70000 ? '#2b8cbe' :
         d > 60000 ? '#4eb3d3' :
         d > 50000 ? '#7bccc4' :
         d > 45000 ? '#a8ddb5' :
                     '#ccebc5';
}
  
  function style(feature) {
    return {
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7,
      fillColor: getColor(feature.properties.gdpPerCapita)
    };
  }

function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.7,
  });

  layer.bringToFront();

  info.update(layer.feature.properties);
}

/* global statesData */
var geojson = L.geoJson(statesData, {
  style,
  onEachFeature,
}).addTo(map);

function resetHighlight(e) {
  geojson.resetStyle(e.target);
  info.update();
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature,
  });
}

map.attributionControl.addAttribution('GDP Per Capita data &copy; <a href="https://worldpopulationreview.com/state-rankings/gdp-by-state">World Population Review</a>');

var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    var grades = [40000, 50000, 60000, 70000, 80000, 90000, 100000];
    var labels = [];
    let from, to;

    for (let i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + getColor(from + 1) + '"></i> ' +
            from + (to ? '&ndash;' + to : '+')
        );
    }

    div.innerHTML = labels.join('<br>');
    return div;
};


legend.addTo(map);
