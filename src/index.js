// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 960 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

// setup fill color
var typeColor = d3.scaleOrdinal()
		.domain(["ice","grass","fire","psychic","rock","normal",
			"ground","dragon","fairy","water","bug","fighting",
			"dark","ghost","poison","electric","steel","flying"])
  		.range(["#66EBFF","#8ED752", "#F95643","#FB61B4","#CDBD72","#BBBDAF",
              "#F0CA42","#8B76FF","#F9AEFE","#53AFFE","#C3D221","#A35449",
              "#8E6856","#7673DA","#AD5CA2","#F8E64E","#C3C1D7","#75A4F9"])

// setup dropdown options
var xOptions = ["against_grass","against_water","against_fire","against_electric","against_rock","pc1"];
var yOptions = ["against_grass","against_water","against_fire","against_electric","against_rock","pc2"];

// setup axes
var x = d3.scaleLinear()
  .domain([-5, 5])
  .range([0, width]);
var y = d3.scaleLinear()
  .domain([-5, 5])
  .range([height, 0]);

// add jitter to see points better
var jitterWidth = 40;
function jitter(input) {
	return input + Math.random()*jitterWidth;
}

//PAGE 1

var svg1 = d3.select("#scatterplot1")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

svg1.append("g")
  .attr("transform", "translate(0," + y.range()[0] / 2 + ")")
  .call(d3.axisBottom(x));
svg1.append("g")
  .attr("transform", "translate(" + x.range()[1] / 2 + ", 0)")
  .call(d3.axisLeft(y));

// add the tooltip area to the webpage
var tooltip = d3.select("#scatterplot1").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var mouseover = function(d) {
    tooltip
    	.transition()
        .duration(200)
      	.style("opacity", 1);
  	tooltip
	  .html(d.name)
      .style("left", (d3.event.pageX + 10) + "px")
      .style("top", (d3.event.pageY) + "px");
}

// A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
var mouseout = function(d) {
	tooltip
	  .transition()
	  .duration(200)
	  .style("opacity", 0);
}

// make dropdown button
function initializeDropdown(button,options,initial_val) {
	d3.select("#" + button)
      .selectAll('xOptions')
     	.data(options)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button
      .property("selected", function(d){ return d === initial_val; }) //default
}

//Read the data
d3.csv("../data/pokemon_small.csv", function(data) {
  var currentX = 'against_water';
  var currentY = 'against_grass';

  initializeDropdown('selectXButton',xOptions,currentX);
  initializeDropdown('selectYButton',yOptions,currentY);

  // Add dots & tooltip
  var circles = svg1.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) {return jitter(x(d[currentX]));})
      .attr("cy", function (d) {return jitter(y(d[currentY]));})
      .attr("r", 4)
      .style("fill", function (d) {return typeColor(d.type1);})
      .style("opacity",0.5)
  	.on("mouseover", mouseover)
  	.on("mouseout", mouseout);

  function updateAxis(selectedGroup,axis) {
    // Create new data with the selection?
    if (axis == 'y') {
  	  var dataFilter = data.map(function(d){return {xVar: d[currentX], yVar:d[selectedGroup]} })
      currentY = selectedGroup;
    } else {
  	  var dataFilter = data.map(function(d){return {xVar: d[selectedGroup], yVar:d[currentY]} })     
  	  currentX = selectedGroup;
    }

    // Give these new data to update dots
    circles
      .data(dataFilter)
      .transition()
      .duration(500)
      .attr("cx", function(d) { return jitter(x(d.xVar));})
      .attr("cy", function(d) { return jitter(y(d.yVar));});
  }

  // When the button is changed, run the updateChart function
  d3.select("#selectXButton").on("change", function(d) {
    // recover the option that has been chosen
    var selectedOption = d3.select(this).property("value")
    // run the updateChart function with this selected option
    updateAxis(selectedOption, 'x')
  })

  // When the button is changed, run the updateChart function
  d3.select("#selectYButton").on("change", function(d) {
    // recover the option that has been chosen
    var selectedOption = d3.select(this).property("value")
    // run the updateChart function with this selected option
    updateAxis(selectedOption, 'y')
  })
})

//PAGE 2
var svg2 = d3.select("#scatterplot2")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Add axes
svg2.append("g")
  .attr("transform", "translate(0," + y.range()[0] / 2 + ")")
  .call(d3.axisBottom(x));
svg2.append("g")
  .attr("transform", "translate(" + x.range()[1] / 2 + ", 0)")
  .call(d3.axisLeft(y));

// add the tooltip area to the webpage
var tooltip2= d3.select("#scatterplot2").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

function calculateAxisValue(data,v1,v2,v3) {
	return (parseFloat(data[v1]) + parseFloat(data[v2]) + parseFloat(data[v3]))/3.;
}

//Read the data
d3.csv("../data/pokemon_small.csv", function(data) {
  var x1 = 'against_water';
  var x2 = 'against_grass';
  var x3 = 'against_fire';
  var y1 = 'against_water';
  var y2 = 'against_grass';
  var y3 = 'against_fire';

  initializeDropdown('x_button_1',xOptions,x1);
  initializeDropdown('x_button_2',xOptions,x2);
  initializeDropdown('x_button_3',xOptions,x3);
  initializeDropdown('y_button_1',yOptions,y1);
  initializeDropdown('y_button_2',yOptions,y2);
  initializeDropdown('y_button_3',yOptions,y3);

    // Add dots & tooltip
  var circles = svg2.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) {return jitter(x(calculateAxisValue(d,x1,x2,x3)));})
      .attr("cy", function (d) {return jitter(y(calculateAxisValue(d,y1,y2,y3)));})
      .attr("r", 4)
      .style("fill", function (d) {return typeColor(d.type1);})
      .style("opacity",0.5)
  	.on("mouseover", mouseover)
  	.on("mouseout", mouseout);

  function update() {
    circles
      .transition()
      .duration(500)
      .attr("cx", function(d) { return jitter(x(calculateAxisValue(d,x1,x2,x3)));})
      .attr("cy", function(d) { return jitter(y(calculateAxisValue(d,y1,y2,y3)));});
  }

  d3.select("#x_button_1").on("change", function(d) {
    x1 = d3.select(this).property("value");
    update();
  })
  d3.select("#x_button_2").on("change", function(d) {
    x1 = d3.select(this).property("value");
    update();
  })

  d3.select("#x_button_3").on("change", function(d) {
    x1 = d3.select(this).property("value");
    update();
  })

  d3.select("#y_button_1").on("change", function(d) {
    x1 = d3.select(this).property("value");
    update();
  })
  d3.select("#y_button_2").on("change", function(d) {
    x1 = d3.select(this).property("value");
    update();
  })
  d3.select("#y_button_3").on("change", function(d) {
    x1 = d3.select(this).property("value");
    update();
  })



})