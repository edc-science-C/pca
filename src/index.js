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
      .selectAll('options')
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

  d3.select("#selectXButton").on("change", function(d) {
    var selectedOption = d3.select(this).property("value")
    updateAxis(selectedOption, 'x')
  })

  d3.select("#selectYButton").on("change", function(d) {
    var selectedOption = d3.select(this).property("value")
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
var tooltip= d3.select("#scatterplot2").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

//Read the data
d3.csv("../data/pokemon_small.csv", function(data) {
  var x1_var,x2_var,x3_var,y1_var,y2_var,y3_var,x1_val,x2_val,x3_val,y1_val,y2_val,y3_val;
  x1_var = x2_var = x3_var = 'against_water';
  y1_var = y2_var = y3_var = 'against_grass';
  x1_val = x2_val = x3_val = y1_val = y2_val = y3_val = 50;

  initializeDropdown('button_x1',xOptions,x1_var);
  initializeDropdown('button_x2',xOptions,x2_var);
  initializeDropdown('button_x3',xOptions,x3_var);
  initializeDropdown('button_y1',yOptions,y1_var);
  initializeDropdown('button_y2',yOptions,y2_var);
  initializeDropdown('button_y3',yOptions,y3_var);

    // Add dots & tooltip
  var circles = svg2.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) {return jitter(x(transformX(d)));})
      .attr("cy", function (d) {return jitter(y(transformY(d)));})
      .attr("r", 4)
      .style("fill", function (d) {return typeColor(d.type1);})
      .style("opacity",0.5)
  	.on("mouseover", mouseover)
  	.on("mouseout", mouseout);


  function transformX(data) {
  	var sum = x1_val+x2_val+x3_val;
	return (x1_val*data[x1_var]+x2_val*data[x2_var]+x3_val*data[x3_var])/sum;
  }

  function transformY(data) {
	var sum = y1_val+y2_val+y3_val;
	return (y1_val*data[y1_var]+y2_val*data[y2_var]+y3_val*data[y3_var])/sum;
  }

  function update() {
    circles
      .transition()
      .duration(500)
      .attr("cx", function(d) { return jitter(x(transformX(d)));})
      .attr("cy", function(d) { return jitter(y(transformY(d)));});
  }

  //update for buttons
  d3.select("#button_x1").on("change", function(d) {
    x1_var = d3.select(this).property("value");
    update();
  })
  d3.select("#button_x2").on("change", function(d) {
    x2_var = d3.select(this).property("value");
    update();
  })
  d3.select("#button_x3").on("change", function(d) {
    x3_var = d3.select(this).property("value");
    update();
  })
  d3.select("#button_y1").on("change", function(d) {
    y1_var = d3.select(this).property("value");
    update();
  })
  d3.select("#button_y2").on("change", function(d) {
    y2_var = d3.select(this).property("value");
    update();
  })
  d3.select("#button_y3").on("change", function(d) {
    y3_var = d3.select(this).property("value");
    update();
  })

  // update for sliders
  d3.select("#slider_x1").on("change", function(d){
    x1_val = parseFloat(this.value);
    update();
  })
  d3.select("#slider_x2").on("change", function(d){
    x2_val = parseFloat(this.value);
    update();
  })
  d3.select("#slider_x3").on("change", function(d){
    x3_val = parseFloat(this.value);
    update();
  })
  d3.select("#slider_y1").on("change", function(d){
    y1_val = parseFloat(this.value);
    update();
  })
  d3.select("#slider_y2").on("change", function(d){
    y2_val = parseFloat(this.value);
    update();
  })
  d3.select("#slider_y3").on("change", function(d){
    y3_val = parseFloat(this.value);
    update();
  })
})