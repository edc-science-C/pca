/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
eval("// set the dimensions and margins of the graph\nvar margin = {top: 10, right: 30, bottom: 30, left: 60},\n    width = 960 - margin.left - margin.right,\n    height = 700 - margin.top - margin.bottom;\n\n// setup fill color\nvar foodTypes = [\"Seafood\",\"Vegetables\",\"Fruits\"];\nvar typeColor = d3.scaleOrdinal()\n\t\t.domain(foodTypes)\n  \t\t.range([\"#66EBFF\",\"#8ED752\", \"#F95643\"])\n\n// setup dropdown options\nvar options = ['Calories', 'Calories from Fat', 'Total Fat (g)', 'Sodium (g)',\n       'Potassium (g)', 'Dietary Fiber (g)', 'Sugars (g)', 'Protein (g)',\n       'Vitamin A (%DV)', 'Vitamin C (%DV)', 'Calcium (%DV)', 'Iron (%DV)',\n       'Cholesterol (mg)'];\n\n// setup axes\nvar x = d3.scaleLinear()\n  .domain([-6, 6])\n  .range([0, width]);\nvar y = d3.scaleLinear()\n  .domain([-6, 6])\n  .range([height, 0]);\n\n//PAGE 1\nvar svg1 = d3.select(\"#scatterplot1\")\n  .append(\"svg\")\n    .attr(\"width\", width + margin.left + margin.right)\n    .attr(\"height\", height + margin.top + margin.bottom)\n  .append(\"g\")\n    .attr(\"transform\",\n          \"translate(\" + margin.left + \",\" + margin.top + \")\");\n\n//add axes\nsvg1.append(\"g\")\n  .attr(\"transform\", \"translate(0,\" + y.range()[0] / 2 + \")\")\n  .call(d3.axisBottom(x));\nsvg1.append(\"g\")\n  .attr(\"transform\", \"translate(\" + x.range()[1] / 2 + \", 0)\")\n  .call(d3.axisLeft(y));\n\n//Add legend\nsvg1.append(\"rect\")\n  .attr(\"width\",130)\n  .attr(\"height\",110)\n  .attr(\"x\",700)\n  .attr(\"y\",520)\n  .style(\"fill\",\"none\")\n  .style(\"stroke\",\"black\");\n\nsvg1.append(\"text\")\n  .attr(\"x\",720)\n  .attr(\"y\",540)\n  .style(\"font-weight\",\"bold\")\n  .text(\"Legend\");\n\n// Add one dot in the legend for each name.\nsvg1.selectAll(\"legend_dots\")\n  .data(foodTypes)\n  .enter()\n  .append(\"circle\")\n    .attr(\"cx\", 725)\n    .attr(\"cy\", function(d,i){ return 560 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots\n    .attr(\"r\", 7)\n    .style(\"fill\", function(d){ return typeColor(d)});\n\n// Add one dot in the legend for each name.\nsvg1.selectAll(\"legend_labels\")\n  .data(foodTypes)\n  .enter()\n  .append(\"text\")\n    .attr(\"x\", 745)\n    .attr(\"y\", function(d,i){ return 560 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots\n    .style(\"fill\", function(d){ return typeColor(d)})\n    .text(function(d){ return d})\n    .attr(\"text-anchor\", \"left\")\n    .style(\"alignment-baseline\", \"middle\");\n\n// add the tooltip area to the webpage\nvar tooltip = d3.select(\"#scatterplot1\").append(\"div\")\n    .attr(\"class\", \"tooltip\")\n    .style(\"opacity\", 0);\n\nvar mouseover = function(d) {\n    tooltip\n    \t.transition()\n        .duration(200)\n      \t.style(\"opacity\", 1);\n  \ttooltip\n\t    .html(d.Food)\n      .style(\"left\", (d3.event.pageX+10) + \"px\")\n      .style(\"top\", d3.event.pageY + \"px\");\n\n    tooltip2\n      .transition()\n        .duration(200)\n        .style(\"opacity\", 1);\n    tooltip2\n      .html(d.Food)\n      .style(\"left\", (d3.event.pageX+10) + \"px\")\n      .style(\"top\", (d3.event.pageY-75) + \"px\");\n}\n\n// A function that change this tooltip when the leaves a point: just need to set opacity to 0 again\nvar mouseout = function(d) {\n\ttooltip\n\t  .transition()\n\t  .duration(200)\n\t  .style(\"opacity\", 0);\n\n  tooltip2\n    .transition()\n    .duration(200)\n    .style(\"opacity\", 0);\n}\n\n// make dropdown button\nfunction initializeDropdown(button,options,initial_val) {\n\td3.select(\"#\" + button)\n      .selectAll('options')\n     \t.data(options)\n      .enter()\n    \t.append('option')\n      .text(function (d) { return d; }) // text showed in the menu\n      .attr(\"value\", function (d) { return d; }) // corresponding value returned by the button\n      .property(\"selected\", function(d){ return d === initial_val; }) //default\n}\n\n//Read the data\nd3.csv(\"../data/foods_clean.csv\", function(data) {\n  var currentX = options[0];\n  var currentY = options[1];\n\n  initializeDropdown('selectXButton',options,currentX);\n  initializeDropdown('selectYButton',options,currentY);\n\n  // Add dots & tooltip\n  var circles = svg1.selectAll(\"circle\")\n    .data(data)\n    .enter()\n    .append(\"circle\")\n      .attr(\"cx\", function (d) {return x(d[currentX]);})\n      .attr(\"cy\", function (d) {return y(d[currentY]);})\n      .attr(\"r\", 4)\n      .style(\"fill\", function (d) {return typeColor(d.Type);})\n      .style(\"opacity\",0.5)\n  \t.on(\"mouseover\", mouseover)\n  \t.on(\"mouseout\", mouseout);\n\n  function updateAxis(selectedGroup,axis) {\n    // Create new data with the selection?\n    if (axis == 'y') {\n  \t  var dataFilter = data.map(function(d){return {xVar: d[currentX], yVar:d[selectedGroup], Food:d.Food} })\n      currentY = selectedGroup;\n    } else {\n  \t  var dataFilter = data.map(function(d){return {xVar: d[selectedGroup], yVar:d[currentY], Food:d.Food} })     \n  \t  currentX = selectedGroup;\n    }\n\n    // Give these new data to update dots\n    circles\n      .data(dataFilter)\n      .on(\"mouseover\", mouseover)\n      .on(\"mouseout\", mouseout)\n      .transition()\n      .duration(500)\n      .attr(\"cx\", function(d) { return x(d.xVar);})\n      .attr(\"cy\", function(d) { return y(d.yVar);});\n  }\n\n  d3.select(\"#selectXButton\").on(\"change\", function(d) {\n    var selectedOption = d3.select(this).property(\"value\")\n    updateAxis(selectedOption, 'x')\n  })\n\n  d3.select(\"#selectYButton\").on(\"change\", function(d) {\n    var selectedOption = d3.select(this).property(\"value\")\n    updateAxis(selectedOption, 'y')\n  })\n})\n\n//PAGE 2\nvar svg2 = d3.select(\"#scatterplot2\")\n  .append(\"svg\")\n    .attr(\"width\", width + margin.left + margin.right)\n    .attr(\"height\", height + margin.top + margin.bottom)\n  .append(\"g\")\n    .attr(\"transform\",\n          \"translate(\" + margin.left + \",\" + margin.top + \")\");\n\n// Add axes\nsvg2.append(\"g\")\n  .attr(\"transform\", \"translate(0,\" + y.range()[0] / 2 + \")\")\n  .call(d3.axisBottom(x));\nsvg2.append(\"g\")\n  .attr(\"transform\", \"translate(\" + x.range()[1] / 2 + \", 0)\")\n  .call(d3.axisLeft(y));\n\n//Add legend\nsvg2.append(\"rect\")\n  .attr(\"width\",130)\n  .attr(\"height\",110)\n  .attr(\"x\",700)\n  .attr(\"y\",520)\n  .style(\"fill\",\"none\")\n  .style(\"stroke\",\"black\");\n\nsvg2.append(\"text\")\n  .attr(\"x\",720)\n  .attr(\"y\",540)\n  .style(\"font-weight\",\"bold\")\n  .text(\"Legend\");\n\n// Add one dot in the legend for each name.\nsvg2.selectAll(\"legend_dots\")\n  .data(foodTypes)\n  .enter()\n  .append(\"circle\")\n    .attr(\"cx\", 725)\n    .attr(\"cy\", function(d,i){ return 560 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots\n    .attr(\"r\", 7)\n    .style(\"fill\", function(d){ return typeColor(d)});\n\n// Add one dot in the legend for each name.\nsvg2.selectAll(\"legend_labels\")\n  .data(foodTypes)\n  .enter()\n  .append(\"text\")\n    .attr(\"x\", 745)\n    .attr(\"y\", function(d,i){ return 560 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots\n    .style(\"fill\", function(d){ return typeColor(d)})\n    .text(function(d){ return d})\n    .attr(\"text-anchor\", \"left\")\n    .style(\"alignment-baseline\", \"middle\");\n\n// add the tooltip area to the webpage\nvar tooltip2 = d3.select(\"#scatterplot2\").append(\"div\")\n    .attr(\"class\", \"tooltip\")\n    .style(\"opacity\", 0);\n\n//Read the data\nd3.csv(\"../data/foods_clean.csv\", function(data) {\n  var x1_var,x2_var,x3_var,y1_var,y2_var,y3_var,x1_val,x2_val,x3_val,y1_val,y2_val,y3_val;\n  x1_var = x2_var = x3_var = options[0];\n  y1_var = y2_var = y3_var = options[1];\n  x1_val = x2_val = x3_val = y1_val = y2_val = y3_val = 1;\n\n  initializeDropdown('button_x1',options,x1_var);\n  initializeDropdown('button_x2',options,x2_var);\n  initializeDropdown('button_x3',options,x3_var);\n  initializeDropdown('button_y1',options,y1_var);\n  initializeDropdown('button_y2',options,y2_var);\n  initializeDropdown('button_y3',options,y3_var);\n\n    // Add dots & tooltip\n  var circles = svg2.selectAll(\"circle\")\n    .data(data)\n    .enter()\n    .append(\"circle\")\n      .attr(\"cx\", function (d) {return x(reweightX(d));})\n      .attr(\"cy\", function (d) {return y(reweightY(d));})\n      .attr(\"r\", 4)\n      .style(\"fill\", function (d) {return typeColor(d.Type);})\n      .style(\"opacity\",0.5)\n  \t.on(\"mouseover\", mouseover)\n  \t.on(\"mouseout\", mouseout);\n\n  function reweightX(data) {\n    var sum = Math.abs(x1_val)+Math.abs(x2_val)+Math.abs(x3_val);\n    if (sum == 0) {return 0;}\n\t  return (x1_val*data[x1_var]+x2_val*data[x2_var]+x3_val*data[x3_var])/sum;\n  }\n\n  function reweightY(data) {\n\t  var sum = Math.abs(y1_val)+Math.abs(y2_val)+Math.abs(y3_val);\n    if (sum == 0) {return 0;}\n\t  return (y1_val*data[y1_var]+y2_val*data[y2_var]+y3_val*data[y3_var])/sum;\n  }\n\n  function update() {\n    circles\n      .on(\"mouseover\", mouseover)\n      .on(\"mouseout\", mouseout)\n      .transition()\n      .duration(500)\n      .attr(\"cx\", function(d) { return x(reweightX(d));})\n      .attr(\"cy\", function(d) { return y(reweightY(d));});\n  }\n\n  //update for buttons\n  d3.select(\"#button_x1\").on(\"change\", function(d) {\n    x1_var = d3.select(this).property(\"value\");\n    update();\n  })\n  d3.select(\"#button_x2\").on(\"change\", function(d) {\n    x2_var = d3.select(this).property(\"value\");\n    update();\n  })\n  d3.select(\"#button_x3\").on(\"change\", function(d) {\n    x3_var = d3.select(this).property(\"value\");\n    update();\n  })\n  d3.select(\"#button_y1\").on(\"change\", function(d) {\n    y1_var = d3.select(this).property(\"value\");\n    update();\n  })\n  d3.select(\"#button_y2\").on(\"change\", function(d) {\n    y2_var = d3.select(this).property(\"value\");\n    update();\n  })\n  d3.select(\"#button_y3\").on(\"change\", function(d) {\n    y3_var = d3.select(this).property(\"value\");\n    update();\n  })\n\n  // update for sliders\n  d3.select(\"#slider_x1\").on(\"input\", function(d){\n    recolor_slider(this,this.value);\n    x1_val = parseFloat(this.value);\n    update();\n  })\n  d3.select(\"#slider_x2\").on(\"input\", function(d){\n    recolor_slider(this,this.value);\n    x2_val = parseFloat(this.value);\n    update();\n  })\n  d3.select(\"#slider_x3\").on(\"input\", function(d){\n    recolor_slider(this,this.value);\n    x3_val = parseFloat(this.value);\n    update();\n  })\n  d3.select(\"#slider_y1\").on(\"input\", function(d){\n    recolor_slider(this,this.value);\n    y1_val = parseFloat(this.value);\n    update();\n  })\n  d3.select(\"#slider_y2\").on(\"input\", function(d){\n    recolor_slider(this,this.value);\n    y2_val = parseFloat(this.value);\n    update();\n  })\n  d3.select(\"#slider_y3\").on(\"input\", function(d){\n    recolor_slider(this,this.value);\n    y3_val = parseFloat(this.value);\n    update();\n  })\n})\n\n//slider color update\nfunction recolor_slider(slider,new_val) {\n  var rgb_new = 225 - Math.abs(new_val)*15;\n  if (new_val < -1) {\n    slider.style.setProperty('--SliderColor', 'rgb(255,'+rgb_new+','+rgb_new+')');\n  } else if (new_val > 1) {\n    slider.style.setProperty('--SliderColor', 'rgb('+rgb_new+',255,'+rgb_new+')');\n  } else {\n    slider.style.setProperty('--SliderColor', 'rgb(200,200,200)');\n  }\n}\n\n//# sourceURL=webpack://pca-interactive-visualization/./src/index.js?");
/******/ })()
;