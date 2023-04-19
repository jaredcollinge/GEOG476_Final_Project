const map = L.map('map').setView([37.8, -96], 4);

const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// control that shows state info on hover
const info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};

info.update = function (props) {
  const contents = props
    ? `<b>${props.Name}</b><br />Cost of living index: ${props.costlivingIndex}`
    : 'Hover over a state';
  this._div.innerHTML = `<h4>US Cost of Living Index</h4>${contents}`;
};

info.addTo(map);

// get color depending on cost of living index value
function getColor(d) {
    return d > 130 ? '#084081' :
           d > 120 ? '#0868ac' :
           d > 110 ? '#2b8cbe' :
           d > 100 ? '#4eb3d3' :
           d > 90 ? '#7bccc4' :
           d > 80 ? '#a8ddb5' :
                    '#ccebc5';
  }
  


  function style(feature) {
    return {
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7,
      fillColor: getColor(feature.properties.costlivingIndex)
    };
  }

function highlightFeature(e) {
  const layer = e.target;

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
const geojson = L.geoJson(statesData, {
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

map.attributionControl.addAttribution('Cost of living index data &copy; <a href="https://worldpopulationreview.com/state-rankings/cost-of-living-index-by-state">World Population Review</a>');

const legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    const div = L.DomUtil.create('div', 'info legend');
    const grades = [80, 90, 100, 110, 120, 130];
    const labels = [];
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
