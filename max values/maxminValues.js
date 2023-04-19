function getMaxValues() {
  const propertyNames = [
    "publicSchoolScore",
    "jobgrowthRate",
    "Median Contract Rent",
    "Median Home Value",
    "gdpPerCapita",
    "costlivingIndex",
    "populationDensity"
  ];
  const maxValues = {};
  const minValues = {};
  for (const propName of propertyNames) {
    let maxValue = 0;
    let minValue = Number.MAX_VALUE;
    let maxStateName = "";
    let minStateName = "";
    for (const feature of statesData.features) {
      const propValue = feature.properties[propName];
      if (propValue > maxValue) {
        maxValue = propValue;
        maxStateName = feature.properties.Name;
      }
      if (propValue < minValue) {
        minValue = propValue;
        minStateName = feature.properties.Name;
      }
    }
    maxValues[propName] = { value: maxValue, state: maxStateName };
    minValues[propName] = { value: minValue, state: minStateName };
  }
  return { maxValues, minValues };
}

function displayMaxValues() {
  const { maxValues, minValues } = getMaxValues();
  for (const [propName, propInfo] of Object.entries(maxValues)) {
    const maxRow = document.createElement("tr");
    maxRow.innerHTML = `<td>${propName}</td><td>${propInfo.value}</td><td>${propInfo.state}</td>`;
    document.getElementById("max-values").appendChild(maxRow);
  }
  for (const [propName, propInfo] of Object.entries(minValues)) {
    const minRow = document.createElement("tr");
    minRow.innerHTML = `<td>${propName}</td><td>${propInfo.value}</td><td>${propInfo.state}</td>`;
    document.getElementById("min-values").appendChild(minRow);
  }
}

displayMaxValues();
