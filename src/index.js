// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 960 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

// setup fill color
var foodTypes = ["Seafood","Vegetables","Fruits"];
var typeColor = d3.scaleOrdinal()
		.domain(foodTypes)
  		.range(["#66EBFF","#8ED752", "#F95643"])

// setup dropdown options
var options = ['Calories', 'Calories from Fat', 'Total Fat (g)', 'Sodium (g)',
       'Potassium (g)', 'Total Carbohydrate (g)','Dietary Fiber (g)', 'Sugars (g)', 
       'Protein (g)', 'Vitamin A (%DV)', 'Vitamin C (%DV)', 'Calcium (%DV)', 
       'Iron (%DV)','Cholesterol (mg)','Saturated Fat (g)'];

// setup axes
var x = d3.scaleLinear()
  .domain([-6, 6])
  .range([0, width]);
var y = d3.scaleLinear()
  .domain([-6, 6])
  .range([height, 0]);

//PAGE 1
var svg1 = d3.select("#scatterplot1")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//add axes
svg1.append("g")
  .attr("transform", "translate(0," + y.range()[0] / 2 + ")")
  .call(d3.axisBottom(x));
svg1.append("g")
  .attr("transform", "translate(" + x.range()[1] / 2 + ", 0)")
  .call(d3.axisLeft(y));

//Add legend
svg1.append("rect")
  .attr("width",130)
  .attr("height",110)
  .attr("x",700)
  .attr("y",520)
  .style("fill","none")
  .style("stroke","black");

svg1.append("text")
  .attr("x",715)
  .attr("y",540)
  .style("font-weight","bold")
  .text("Legend");

// Add one dot in the legend for each name.
svg1.selectAll("legend_dots")
  .data(foodTypes)
  .enter()
  .append("circle")
    .attr("cx", 725)
    .attr("cy", function(d,i){ return 560 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 7)
    .style("fill", function(d){ return typeColor(d)});

// Add one dot in the legend for each name.
svg1.selectAll("legend_labels")
  .data(foodTypes)
  .enter()
  .append("text")
    .attr("x", 745)
    .attr("y", function(d,i){ return 560 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", function(d){ return typeColor(d)})
    .text(function(d){ return d})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle");

// add the tooltip area to the webpage
var tooltip = d3.select("#scatterplot1").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
var mouseout = function(d) {
	tooltip
	  .transition()
	  .duration(200)
	  .style("opacity", 0);

  tooltip2
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
d3.csv("../data/foods_clean_all.csv", function(data) {
  var currentX = options[0];
  var currentY = options[1];
  
  var mouseover = function(d) {
    tooltip
      .transition()
        .duration(200)
        .style("opacity", 1);
    tooltip
      .html('<p><b>' + d.Food + '</b></p> <p>' + currentX + ': ' + d.xOrig + 
        '</p> <p>' + currentY + ': ' + d.yOrig + '</p>')
      .style("left", (d3.event.pageX+10) + "px")
      .style("top", d3.event.pageY + "px");
  }

  // Add dots & tooltip
  var circles = svg1.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) {return x(d[currentX]);})
      .attr("cy", function (d) {return y(d[currentY]);})
      .attr("r", 4)
      .style("fill", function (d) {return typeColor(d.Type);})
      .style("opacity",0.5)
  	.on("mouseover", mouseover)
  	.on("mouseout", mouseout);

  initializeDropdown('selectXButton',options,currentX);
  initializeDropdown('selectYButton',options,currentY);
  updateAxis(currentX,'x');

  function updateAxis(selectedGroup,axis) {
    // Create new data with the selection?
    if (axis == 'y') {
  	  var dataFilter = data.map(function(d){return {xVar: d[currentX], yVar:d[selectedGroup], Food:d.Food,
          xOrig: d[currentX + '_orig'], yOrig: d[selectedGroup + '_orig']}})
      currentY = selectedGroup;
    } else {
  	  var dataFilter = data.map(function(d){return {xVar: d[selectedGroup], yVar:d[currentY], Food:d.Food,
          xOrig: d[selectedGroup + '_orig'], yOrig: d[currentY + '_orig']}})  
  	  currentX = selectedGroup;
    }

    // Give these new data to update dots
    circles
      .data(dataFilter)
      .on("mouseover", mouseover)
      .on("mouseout", mouseout)
      .transition()
      .duration(500)
      .attr("cx", function(d) { return x(d.xVar);})
      .attr("cy", function(d) { return y(d.yVar);});
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

//Add legend
svg2.append("rect")
  .attr("width",130)
  .attr("height",110)
  .attr("x",700)
  .attr("y",520)
  .style("fill","none")
  .style("stroke","black");

svg2.append("text")
  .attr("x",715)
  .attr("y",540)
  .style("font-weight","bold")
  .text("Legend");

// Add one dot in the legend for each name.
svg2.selectAll("legend_dots")
  .data(foodTypes)
  .enter()
  .append("circle")
    .attr("cx", 725)
    .attr("cy", function(d,i){ return 560 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 7)
    .style("fill", function(d){ return typeColor(d)});

// Add one dot in the legend for each name.
svg2.selectAll("legend_labels")
  .data(foodTypes)
  .enter()
  .append("text")
    .attr("x", 745)
    .attr("y", function(d,i){ return 560 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", function(d){ return typeColor(d)})
    .text(function(d){ return d})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle");

// add the tooltip area to the webpage
var tooltip2 = d3.select("#scatterplot2").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

//Read the data
d3.csv("../data/foods_clean.csv", function(data) {
  var x1_var,x2_var,x3_var,y1_var,y2_var,y3_var,x1_val,x2_val,x3_val,y1_val,y2_val,y3_val;
  x1_var = x2_var = x3_var = options[0];
  y1_var = y2_var = y3_var = options[1];
  x1_val = x2_val = x3_val = y1_val = y2_val = y3_val = 1;

  initializeDropdown('button_x1',options,x1_var);
  initializeDropdown('button_x2',options,x2_var);
  initializeDropdown('button_x3',options,x3_var);
  initializeDropdown('button_y1',options,y1_var);
  initializeDropdown('button_y2',options,y2_var);
  initializeDropdown('button_y3',options,y3_var);

  var mouseover = function(d) {
    tooltip2
      .transition()
        .duration(200)
        .style("opacity", 1);
    tooltip2
      .html('<p> ' + d.Food + '</p>' )
      .style("left", (d3.event.pageX+10) + "px")
      .style("top", (d3.event.pageY-75) + "px");
  }

    // Add dots & tooltip
  var circles = svg2.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) {return x(reweightX(d));})
      .attr("cy", function (d) {return y(reweightY(d));})
      .attr("r", 4)
      .style("fill", function (d) {return typeColor(d.Type);})
      .style("opacity",0.5)
  	.on("mouseover", mouseover)
  	.on("mouseout", mouseout);

  function reweightX(data) {
    var sum = Math.abs(x1_val)+Math.abs(x2_val)+Math.abs(x3_val);
    if (sum == 0) {return 0;}
	  return (x1_val*data[x1_var]+x2_val*data[x2_var]+x3_val*data[x3_var])/sum;
  }

  function reweightY(data) {
	  var sum = Math.abs(y1_val)+Math.abs(y2_val)+Math.abs(y3_val);
    if (sum == 0) {return 0;}
	  return (y1_val*data[y1_var]+y2_val*data[y2_var]+y3_val*data[y3_var])/sum;
  }

  function update() {
    circles
      .on("mouseover", mouseover)
      .on("mouseout", mouseout)
      .transition()
      .duration(500)
      .attr("cx", function(d) { return x(reweightX(d));})
      .attr("cy", function(d) { return y(reweightY(d));});
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
  d3.select("#slider_x1").on("input", function(d){
    recolor_slider(this,this.value);
    x1_val = parseFloat(this.value);
    update();
  })
  d3.select("#slider_x2").on("input", function(d){
    recolor_slider(this,this.value);
    x2_val = parseFloat(this.value);
    update();
  })
  d3.select("#slider_x3").on("input", function(d){
    recolor_slider(this,this.value);
    x3_val = parseFloat(this.value);
    update();
  })
  d3.select("#slider_y1").on("input", function(d){
    recolor_slider(this,this.value);
    y1_val = parseFloat(this.value);
    update();
  })
  d3.select("#slider_y2").on("input", function(d){
    recolor_slider(this,this.value);
    y2_val = parseFloat(this.value);
    update();
  })
  d3.select("#slider_y3").on("input", function(d){
    recolor_slider(this,this.value);
    y3_val = parseFloat(this.value);
    update();
  })
})

//slider color update
function recolor_slider(slider,new_val) {
  var rgb_new = 225 - Math.abs(new_val)*15;
  if (new_val < -1) {
    slider.style.setProperty('--SliderColor', 'rgb(255,'+rgb_new+','+rgb_new+')');
  } else if (new_val > 1) {
    slider.style.setProperty('--SliderColor', 'rgb('+rgb_new+',255,'+rgb_new+')');
  } else {
    slider.style.setProperty('--SliderColor', 'rgb(200,200,200)');
  }
}