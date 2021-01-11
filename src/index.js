// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// setup fill color
var typeColor = d3.scaleOrdinal()
		.domain(["ice","grass","fire","psychic","rock","normal",
			"ground","dragon","fairy","water","bug","fighting",
			"dark","ghost","poison","electric","steel","flying"])
  		.range(["#66EBFF","#8ED752", "#F95643","#FB61B4","#CDBD72","#BBBDAF",
              "#F0CA42","#8B76FF","#F9AEFE","#53AFFE","#C3D221","#A35449",
              "#8E6856","#7673DA","#AD5CA2","#F8E64E","#C3C1D7","#75A4F9"])

// append the svg object to the body of the page
var svg = d3.select("#scatterplot")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Add axes
var x = d3.scaleLinear()
  .domain([-5, 5])
  .range([0, width]);
var y = d3.scaleLinear()
  .domain([-5, 5])
  .range([height, 0]);
svg.append("g")
  .attr("transform", "translate(0," + y.range()[0] / 2 + ")")
  .call(d3.axisBottom(x));
svg.append("g")
  .attr("transform", "translate(" + x.range()[1] / 2 + ", 0)")
  .call(d3.axisLeft(y));

// add the tooltip area to the webpage
var tooltip = d3.select("#scatterplot").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// add jitter to see points better
var jitterWidth = 40;
function jitter(input) {
	return input + Math.random()*jitterWidth;
}

//Read the data
d3.csv("data/pokemon_small.csv", function(data) {

  // List of groups (here I have one group per column)
  var xOptions = ["against_grass","against_water","against_fire","against_electric","against_rock","pc1"];
  var yOptions = ["against_grass","against_water","against_fire","against_electric","against_rock","pc2"];


  var currentX = 'against_water';
  var currentY = 'against_grass';

  // add the options to the x button
  d3.select("#selectXButton")
      .selectAll('xOptions')
     	.data(xOptions)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button
      .property("selected", function(d){ return d === currentX; }) //default

  // add the options to the y button
  d3.select("#selectYButton")
      .selectAll('yOptions')
     	.data(yOptions)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button
      .property("selected", function(d){ return d === currentY; }) //default

  // Add dots & tooltip
  var dot = svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) {return jitter(x(d.against_water));})
      .attr("cy", function (d) {return jitter(y(d.against_grass));})
      .attr("r", 4)
      .style("fill", function (d) {return typeColor(d.type1);})
      .style("opacity",0.5)
  	.on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d.name)
               .style("left", (d3.event.pageX + 10) + "px")
               .style("top", (d3.event.pageY) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

  // A function that update the chart
    function update(selectedGroup,axis) {

      // Create new data with the selection?
      if (axis == 'y') {
      	var dataFilter = data.map(function(d){return {xVar: d[currentX], yVar:d[selectedGroup]} })
        currentY = selectedGroup;
      } else {
      	var dataFilter = data.map(function(d){return {xVar: d[selectedGroup], yVar:d[currentY]} })     
      	currentX = selectedGroup;
      }

      // Give these new data to update line
      dot
          .data(dataFilter)
          .transition()
          .duration(1000)
          .attr("cx", function(d) { return jitter(x(d.xVar));})
          .attr("cy", function(d) { return jitter(y(d.yVar));})
    }

    // When the button is changed, run the updateChart function
    d3.select("#selectXButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption, 'x')
    })

     // When the button is changed, run the updateChart function
    d3.select("#selectYButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption, 'y')
    })

})