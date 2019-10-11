
$(createMap)



function createMap(){



  map = L.map('map', {
    zoomControl : true,
    center : [ 40.789142, -73.064961 ],
    zoom : 10,
    minZoom : 10,
    maxZoom : 15
  });
  // Change the cursor depending on the element we are on
  // Fitting to tell the user the action they should take in each position

  var mapBounds =
      L.latLngBounds([ 41.394543, -70.684156 ], [ 40.370698, -75.346929 ]);

  // Changing levels of boundry based on the zoom level
  // Keeps the user centered around long island
  // After zoomLevel == 11 the entire map is bounded within Long Island
  map.setMaxBounds(mapBounds);

      L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
          maxZoom: 18,

          center: [40.789142, -73.064961],

          zoom: 12

      }).addTo(map);

      //
      // var CartoLayerSource = {
      //   user_name : "latinos",
      //   api_key : "6835ac33fdea1831afbabcc40bb7e09468c6945a",
      //   settings.serverUrl
      //   maps_api_template : "//app2.gss.stonybrook.edu/user/{user}",
      //   sql_api_template : "//app2.gss.stonybrook.edu/user/{user}",
      //   sublayers : []
      // };

      // define client
      const client = new carto.Client({
          apiKey: "6835ac33fdea1831afbabcc40bb7e09468c6945a",
          username:  "latinos",
          serverUrl: "http://app2.gss.stonybrook.edu/user/latinos"
      });


      var decades = [ "1960", "1970", "1980", "1990", "2000", "2010", "2017" ];



      var layers = {
        "demographics" : {

        },
        "Points" : {

        }
      };
      decades.forEach(function(year) {
        // [2010].forEach(function(year) {
        layers.demographics[year] = {
          sql :
              `SELECT g.cartodb_id, g.gisjoin, g.the_geom, g.the_geom_webmercator, t.year, t.areaname as areaname,
               t.v00001 as total_pop, t.v00002 as latino, t.v00003 as non_latino, round( t.v00002::numeric / t.v00001::numeric * 100, 1) as pct_latino
      FROM tract_${year} g INNER JOIN li_tract_${year} t ON g.gisjoin = t.gisjoin
      WHERE t.v00001::numeric > 0`
        }
      })


      const style = new carto.style.CartoCSS(`
        #layer { polygon-fill: #810f7c; polygon-opacity: 1; line-width: 0.5; line-color: #b9b1b1; line-opacity: 0.5; } #layer[ pct_latino <= 80] { polygon-fill: #8856a7; } #layer[ pct_latino <= 40] { polygon-fill: #8c96c6; } #layer [ pct_latino <= 20] { polygon-fill: #9ebcda; } #layer [ pct_latino <= 10] { polygon-fill: #bfd3e6; } #layer [ pct_latino<= 5] { polygon-fill: #edf8fb; }
  `)
      var cartoLayers={"left":{"currentYear":"2017"},"right":{"currentYear":"1960"}}


      Object.keys(cartoLayers).forEach(function(cartoLayerKey) {
        console.log("df")
    let source = new carto.source.SQL( layers.demographics[cartoLayers[cartoLayerKey].currentYear].sql );

    let currentLayer= new carto.layer.Layer(source, style);

    cartoLayers[cartoLayerKey].Cartolayer =currentLayer;
        client.addLayer(cartoLayers[cartoLayerKey].Cartolayer).then(function(layer){
          console.log(cartoLayers[cartoLayerKey].Cartolayer)
          client.getLeafletLayer().addTo(map)

 });


      })



  //   client.getLayers().forEach(function(clientLayer) {
  // console.log(clientLayer)
  //
  //   })

        // define source of data using a SQL query
          //client.getLeafletLayer().addTo(map)
      // define CartoCSS code to style data on map

      // create CARTO layer from source and style variables


      // add CARTO layer to the client


      // get tile from client and add them to the map object


      // create formula dataview using pop_max column values
      // SUM formula
      // const formulaDataview = new carto.dataview.Formula(source, 'pop_max', {
      //     operation: carto.operation.SUM
      // });

      // Use D3.js library to format text with comma separator for thousands
      let commaSeparator = d3.format(",");
      // when there is a change on the data, execute function to
      // display result from dataview in DOM element
      // formulaDataview.on('dataChanged', function(data){
      //     let content = `<h4>Total of inhabitants: ${commaSeparator(data.result)}</h4><p>with ${data.operation.toUpperCase()} operation</p>`
      //     document.getElementById('formula').innerHTML = content;
      // });
      //
      // // add category dataview to client
      // client.addDataview(formulaDataview);

      // Set bounding box filter
      const bboxFilter = new carto.filter.BoundingBoxLeaflet(map);






}
