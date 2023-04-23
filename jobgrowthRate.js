var map = L.map('map3').setView([37.8, -96], 4);

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
    ? `<b>${props.Name}</b><br />Job Growth Rate: ${(props.jobgrowthRate * 100).toFixed(2)}%`
    : 'Hover over a state';
  this._div.innerHTML = `<h4>US Job Growth Rate</h4>${contents}`;
};

info.addTo(map);

// get color depending on public school score value
function getColor(d) {
  return d > 0.015 ? '#1a9641' :
         d > 0.01 ? '#a6d96a' :
         d > 0.005 ? '#ffffbf' :
         d > 0 ? '#fdae61' :
         d > -0.005 ? '#d7191c' :
                     '#67000d';
}

  function style(feature) {
    return {
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7,
      fillColor: getColor(feature.properties.jobgrowthRate)
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

map.attributionControl.addAttribution('Job Growth data &copy; <a href="https://worldpopulationreview.com/state-rankings/job-growth-by-state">World Population Review</a>');

var jobGrowthLegend = L.control({ position: 'bottomright' });

jobGrowthLegend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    var grades = [-0.01, -0.0025, 0, 0.005, 0.01];
    var labels = [];
    let from, to;

    for (let i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + getColor(from + 0.001) + '"></i> ' +
            (from * 100).toFixed(1) + '%' + (to ? '&ndash;' + (to * 100).toFixed(1) + '%' : '+')
        );
    }

    div.innerHTML = labels.join('<br>');
    return div;
};

jobGrowthLegend.addTo(map);