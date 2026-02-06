export const UK_GEOJSON = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "id": "scotland_n", "name": "Scotland N" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-5.0, 58.6], [-4.0, 58.6], [-3.0, 58.4], [-2.0, 57.5], 
          [-3.0, 57.0], [-4.0, 57.0], [-5.0, 57.2], [-6.0, 58.0], [-5.0, 58.6]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { "id": "scotland_e", "name": "Scotland E" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-3.0, 57.0], [-2.0, 57.5], [-2.0, 56.5], [-2.5, 56.0],
          [-3.5, 56.0], [-4.0, 56.5], [-3.0, 57.0]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { "id": "scotland_w", "name": "Scotland W" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-5.0, 57.2], [-4.0, 57.0], [-4.0, 56.5], [-3.5, 56.0],
          [-4.5, 55.5], [-5.5, 55.5], [-6.0, 56.0], [-5.0, 57.2]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { "id": "england_n", "name": "England N" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-3.5, 56.0], [-2.5, 56.0], [-1.5, 55.5], [-0.5, 54.5],
          [-1.0, 53.5], [-3.0, 53.5], [-3.5, 54.5], [-3.5, 56.0]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { "id": "england_e_ne", "name": "England E & NE" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-1.0, 53.5], [-0.5, 54.5], [0.5, 53.5], [1.0, 53.0],
          [0.5, 52.5], [0.0, 52.5], [-1.0, 53.5]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { "id": "midlands", "name": "Midlands" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-3.0, 53.5], [-1.0, 53.5], [0.0, 52.5], [-1.0, 52.0],
          [-2.5, 52.0], [-3.0, 52.5], [-3.0, 53.5]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { "id": "user_wales_n", "name": "North Wales (Map)" }, 
      // Mapping closest internal ID, assuming 'wales_n' is N Wales
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-4.5, 53.5], [-3.0, 53.5], [-3.0, 52.5], 
          [-4.0, 52.5], [-5.0, 53.0], [-4.5, 53.5]
        ]]
      }
    },
    {
        "type": "Feature",
        "properties": { "id": "wales_n", "name": "Wales N" }, 
        "geometry": {
          "type": "Polygon",
          "coordinates": [[
            [-4.8, 53.4], [-3.0, 53.4], [-3.0, 52.8], 
            [-4.0, 52.8], [-4.8, 53.4]
          ]]
        }
    },
    {
      "type": "Feature",
      "properties": { "id": "wales", "name": "Wales S" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-5.2, 52.0], [-4.0, 52.8], [-3.0, 52.8], 
          [-2.8, 51.5], [-3.5, 51.4], [-5.2, 51.6], [-5.2, 52.0]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { "id": "east_anglia", "name": "East Anglia" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [0.0, 52.5], [0.5, 52.5], [1.8, 52.8], [1.5, 51.8],
          [0.5, 51.8], [0.0, 52.5]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { "id": "england_central", "name": "England Central" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-2.5, 52.0], [-1.0, 52.0], [0.5, 51.8], 
          [-0.5, 51.2], [-2.0, 51.2], [-2.5, 52.0]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { "id": "england_sw_s_wales", "name": "England SW" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-5.7, 50.0], [-4.0, 51.2], [-3.0, 51.2], 
          [-3.0, 50.0], [-5.7, 50.0]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { "id": "england_s", "name": "England S" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-3.0, 51.2], [-0.5, 51.2], [1.5, 51.5], 
          [1.0, 50.5], [-2.0, 50.5], [-3.0, 51.2]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { "id": "northern_ireland", "name": "Northern Ireland" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-8.2, 55.2], [-6.0, 55.2], [-5.5, 54.0], 
          [-8.0, 54.0], [-8.2, 55.2]
        ]]
      }
    },
    {
        // Placeholder for UK total if needed, usually mapped on top or separate
        "type": "Feature",
        "properties": { "id": "uk", "name": "UK" },
        "geometry": {
             "type": "Polygon",
             "coordinates": [] // Empty to not obscure specific regions
        }
    }
  ]
};
