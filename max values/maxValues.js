function getMaxValues(statesData) {
    const propertyNames = [
      { key: "publicSchoolScore", name: "Public School Score" },
      { key: "jobgrowthRate", name: "Job Growth Rate" },
      { key: "Median Contract Rent", name: "Median Contract Rent" },
      { key: "Median Home Value", name: "Median Home Value" },
      { key: "gdpPerCapita", name: "GDP per Capita" },
      { key: "costlivingIndex", name: "Cost of Living Index" },
      { key: "populationDensity", name: "Population Density" },
    ];
  
    const maxValues = {};
  
    // find the maximum value for each property
    for (const feature of statesData.features) {
      for (const { key, name } of propertyNames) {
        const value = feature.properties[key];
        if (!isNaN(value)) {
          if (!maxValues[key] || value > maxValues[key].value) {
            maxValues[key] = { value, state: feature.properties.Name, name };
          }
        }
      }
    }
  
    // return an object containing the maximum value for each property
    return maxValues;
  }
  