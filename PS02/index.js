// __      __     _____  _____          ____  _      ______  _____
// \ \    / /\   |  __ \|_   _|   /\   |  _ \| |    |  ____|/ ____|
//  \ \  / /  \  | |__) | | |    /  \  | |_) | |    | |__  | (___
//   \ \/ / /\ \ |  _  /  | |   / /\ \ |  _ <| |    |  __|  \___ \
//    \  / ____ \| | \ \ _| |_ / ____ \| |_) | |____| |____ ____) |
//     \/_/    \_\_|  \_\_____/_/    \_\____/|______|______|_____/




var width = document.getElementById('svg1').clientWidth;
var height = document.getElementById('svg1').clientHeight;

var marginLeft = 0;
var marginTop = 0;
//
var svg = d3.select('#svg1')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

var svg2 = d3.select('#svg2')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

var projection = d3.geoAlbers()
    .scale( 130000 )
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






//  _____ _    _  ____  _____   ____  _____  _      ______ _______ _    _
// / ____| |  | |/ __ \|  __ \ / __ \|  __ \| |    |  ____|__   __| |  | |
// | |   | |__| | |  | | |__) | |  | | |__) | |    | |__     | |  | |__| |
// | |   |  __  | |  | |  _  /| |  | |  ___/| |    |  __|    | |  |  __  |
// | |___| |  | | |__| | | \ \| |__| | |    | |____| |____   | |  | |  | |
// \_____|_|  |_|\____/|_|  \_\\____/|_|    |______|______|  |_|  |_|  |_|

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



 //  _____ _____ ______    _____ _    _          _____ _______
 // |  __ \_   _|  ____|  / ____| |  | |   /\   |  __ \__   __|
 // | |__) || | | |__    | |    | |__| |  /  \  | |__) | | |
 // |  ___/ | | |  __|   | |    |  __  | / /\ \ |  _  /  | |
 // | |    _| |_| |____  | |____| |  | |/ ____ \| | \ \  | |
 // |_|   |_____|______|  \_____|_|  |_/_/    \_\_|  \_\ |_|


                var pieX = width/2 - marginLeft;
                var pieY = height/2 - marginTop;

                var pieGroup = svg.append('g')
                    .attr('transform', 'translate(' + pieX + ',' + pieY + ')');

                //set up scales to position circles using the data
                var scaleColor = d3.scaleOrdinal()
                    .domain(["16-19", "20-24", "25-34", "35-44", "45-54", "55-64","65+"])
                    .range(["#00a6b4","#ec008c","#6a4ea0","#ffcb05","#ee5223","#aaea0c","#cccccc"]);
                //var scaleY = d3.scaleLinear().domain([0,1200]).range([400, 0]);  //remember that 0,0 is at the top of the screen! 300 is the lowest value on the y axis

                var nestedData = [];

                var pieRadius = 100;

                var makeArc = d3.arc()
                    .outerRadius(pieRadius)
                    .innerRadius(75);

                var labelArc = d3.arc()
                    .outerRadius(pieRadius + 30)
                    .innerRadius(pieRadius + 30);

                var makePie = d3.pie()
                    .sort(null)
                    .value(function(d) { return d.total; });

                //import the data from the .csv file
                d3.csv('./ageDist.csv', function(dataIn){

                    nestedData = d3.nest()
                        .key(function(d){return d.year})
                        .entries(dataIn);

                    var loadData = dataIn;

                    svg2.append('text')
                        .text('Age Distribution')
                        .attr('transform','translate(300, 20)')
                        .attr('text-anchor','middle')
                        .attr('fill', 'white');



                    // make a group for each arc, which will contain the path for the arc
                    var g = pieGroup.selectAll('.arc')
                        .data(makePie(loadData))   //makePie makes sure that one arc gets added for each data object in the array
                        .enter()
                        .append('g')
                        .attr('class','arc');

                    g.append('path')              //grab each group in the variable above, and add a path to it (this will be the pie wedge)
                        .attr('d',makeArc)        //call the makeArc generator function to draw the actual wedges
                        .attr('fill', function(d){ return scaleColor(d.data.age)});   //give the wedges a color, based on their d.age values


                    g.append("text")
                        .attr("transform", function(d) {return "translate(" + labelArc.centroid(d) + ")"; })
                        .attr("dy", ".35em")
                        .attr('text-anchor','middle')
                        .attr('fill', 'white')
                        .text(function(d) { return d.data.age; });
                });

                d3.selectAll("text")
                      .attr('fill', 'white');





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
