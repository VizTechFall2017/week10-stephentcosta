var width = document.getElementById('svg1').clientWidth;
var height = document.getElementById('svg1').clientHeight;

var marginLeft = 0;
var marginTop = 0;
//
var svg = d3.select('svg')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

var projection = d3.geoAlbers()
    .scale( 8000 )
    .rotate( [71.057,0] )
    .center( [0, 42.313] )
    .translate( [width/2,height/2] );

    path = d3.geoPath()
          .projection(projection);

var areaLookup = d3.map();
console.log(areaLookup);
var colorScale = d3.scaleLinear().range(['white','#00a6b4']);

var div = d3.select("body")
		    .append("div")
    		.attr("class", "tooltip")
    		.style("opacity", 0);
        // .style('stroke','#003c50')
        // .style('stroke-width',2)

// var group = svg.selectAll("g")
//     .data(data.features)
//     .enter()
//     .append("g")

// var area = group.append("path")
//     .attr("d", path)
//     .attr("class", "area")
//     .attr("stroke", "white")
//     .attr("fill", "#00a6b4")

queue()
    .defer(d3.json, "./bostonNeighborhoods.json")
    .defer(d3.csv, "./affordableUnits.csv")
    .await(function(err, mapData, unitsData){

    unitsData.forEach(function(d){
        areaLookup.set(d.area, d.units);
    });

    console.log(areaLookup.get('Allston'));

    colorScale.domain([0, d3.max(unitsData.map(function(d){return +d.units}))]);


        svg.selectAll("path")               //make empty selection
            .data(mapData.features)          //bind to the features array in the map data
            .enter()
            .append("path")                 //add the paths to the DOM
            .attr("d", path)                //actually draw them
            .attr("class", "feature")
            .attr('fill', function(d){
                return colorScale(areaLookup.get(d.properties.Name));
            })
            .attr('stroke','#003c50')
            .attr('stroke-width',2)
              .on("mouseover", function(d) {
console.log(areaLookup.get(d.properties.Name));
                  	div.transition()
                    	   .duration(200)
                         .style("opacity", .9);
                         div.text(d.properties.Name + areaLookup.get(d.properties.Name))
                         .style("left", (d3.event.pageX) + "px")
                         .style("top", (d3.event.pageY - 28) + "px");
          	})

              // fade out tooltip on mouse out
              .on("mouseout", function(d) {
                  div.transition()
                     .duration(500)
                     .style("opacity", 0);
              });
                });






    // d3.json("./bostonNeighborhoods.json", function (data) {


            // .attr('fill', function(d) { return colorScale(d.units); });


// var areaLookup = d3.map(areaData, function(d){
//   return d.units
// });
// //
// var colorScale = d3.scaleLinear().range(['white',"#00a6b4"]);
// //
// queue()
//     .defer(d3.json, "./bostonNeighborhoods.json")
//     .defer(d3.csv, "./affordableUnits.csv";)
//     .await(function(err, mapData, unitsData){
//
//     unitsData.forEach(function(d){
//         areaLookup.set(d.area, d.units);
//     });
//
// //
//     colorScale.domain([0, d3.max(unitsData.map(function(d){return +d.units}))]);
//

//
// var canvas = d3.select("body").append("svg")
//     .attr("width", 700)
//     .attr("height", 700)

// var usChart = dc.geoChoroplethChart("#map");

// var colorScale = d3.scale.threshold()
//         .domain([0, 2000, 4000, 6000, 8000, 10000, 12000])
//          .range(["#cccccc", "#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f",]);

// var color = d3.scale.threshold()
//       .domain([1000, 3000, 5000, 7000, 9000, 11000, 13000])
//       .range(["#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f", "#eafdff"]);
//
// d3.json("bostonNeighborhoods.json", function(error, boston) {
//             d3.csv("affordableUnits.csv", function(error, units) {
//                 var rateById = {};
//
//                 areaLookup.forEach(function(d) {
//                     rateById[d.id] = +d.id;
//                 });

// d3.csv("./affordableUnits.csv", function(error,data){
//   var facts = crossfilter(data);
// })



        // .attr("stroke", "white")
        // .attr("fill", "#00a6b4")
        // .colors(d3.scale.quantize().range("#00a6b4", "#35d0dd", "#73dae2", "#91dbe0", "#c6fbff"))
        // .colorDomain(0,200)
        // .colorCalculator(function(d){return d ? usChart.color() })
        // .overlayGeoJson(bostonNeighborhoods.json,"area",function(d){
        //   return d.properties.NAME;
        // })


// });
    //
    // svg.selectAll("path")               //make empty selection
    //     .data(mapData.features)          //bind to the features array in the map data
    //     .enter()
    //     .append("path")                 //add the paths to the DOM
    //     .attr("d", path)                //actually draw them
    //     .attr("class", "feature")
    //     .attr('stroke','black')
    //     .attr('stroke-width',.2);
