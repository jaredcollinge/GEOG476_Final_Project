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
