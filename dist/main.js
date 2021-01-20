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
eval("// set the dimensions and margins of the graph\nvar margin = {top: 10, right: 30, bottom: 30, left: 60},\n    width = 960 - margin.left - margin.right,\n    height = 700 - margin.top - margin.bottom;\n\n// setup fill color\nvar typeColor = d3.scaleOrdinal()\n\t\t.domain([\"ice\",\"grass\",\"fire\",\"psychic\",\"rock\",\"normal\",\n\t\t\t\"ground\",\"dragon\",\"fairy\",\"water\",\"bug\",\"fighting\",\n\t\t\t\"dark\",\"ghost\",\"poison\",\"electric\",\"steel\",\"flying\"])\n  \t\t.range([\"#66EBFF\",\"#8ED752\", \"#F95643\",\"#FB61B4\",\"#CDBD72\",\"#BBBDAF\",\n              \"#F0CA42\",\"#8B76FF\",\"#F9AEFE\",\"#53AFFE\",\"#C3D221\",\"#A35449\",\n              \"#8E6856\",\"#7673DA\",\"#AD5CA2\",\"#F8E64E\",\"#C3C1D7\",\"#75A4F9\"])\n\n// setup dropdown options\nvar xOptions = [\"against_grass\",\"against_water\",\"against_fire\",\"against_electric\",\"against_rock\",\"pc1\"];\nvar yOptions = [\"against_grass\",\"against_water\",\"against_fire\",\"against_electric\",\"against_rock\",\"pc2\"];\n\n// setup axes\nvar x = d3.scaleLinear()\n  .domain([-5, 5])\n  .range([0, width]);\nvar y = d3.scaleLinear()\n  .domain([-5, 5])\n  .range([height, 0]);\n\n// add jitter to see points better\nvar jitterWidth = 25;\nfunction jitter(input) {\n\treturn input + Math.random()*jitterWidth;\n}\n\n//PAGE 1\nvar svg1 = d3.select(\"#scatterplot1\")\n  .append(\"svg\")\n    .attr(\"width\", width + margin.left + margin.right)\n    .attr(\"height\", height + margin.top + margin.bottom)\n  .append(\"g\")\n    .attr(\"transform\",\n          \"translate(\" + margin.left + \",\" + margin.top + \")\");\n\nsvg1.append(\"g\")\n  .attr(\"transform\", \"translate(0,\" + y.range()[0] / 2 + \")\")\n  .call(d3.axisBottom(x));\nsvg1.append(\"g\")\n  .attr(\"transform\", \"translate(\" + x.range()[1] / 2 + \", 0)\")\n  .call(d3.axisLeft(y));\n\n// add the tooltip area to the webpage\nvar tooltip = d3.select(\"#scatterplot1\").append(\"div\")\n    .attr(\"class\", \"tooltip\")\n    .style(\"opacity\", 0);\n\nvar mouseover = function(d) {\n    tooltip\n    \t.transition()\n        .duration(200)\n      \t.style(\"opacity\", 1);\n  \ttooltip\n\t  .html(d.name)\n      .style(\"left\", (d3.event.pageX + 10) + \"px\")\n      .style(\"top\", (d3.event.pageY) + \"px\");\n}\n\n// A function that change this tooltip when the leaves a point: just need to set opacity to 0 again\nvar mouseout = function(d) {\n\ttooltip\n\t  .transition()\n\t  .duration(200)\n\t  .style(\"opacity\", 0);\n}\n\n// make dropdown button\nfunction initializeDropdown(button,options,initial_val) {\n\td3.select(\"#\" + button)\n      .selectAll('options')\n     \t.data(options)\n      .enter()\n    \t.append('option')\n      .text(function (d) { return d; }) // text showed in the menu\n      .attr(\"value\", function (d) { return d; }) // corresponding value returned by the button\n      .property(\"selected\", function(d){ return d === initial_val; }) //default\n}\n\n//Read the data\nd3.csv(\"../data/pokemon_small.csv\", function(data) {\n  var currentX = 'against_water';\n  var currentY = 'against_grass';\n\n  initializeDropdown('selectXButton',xOptions,currentX);\n  initializeDropdown('selectYButton',yOptions,currentY);\n\n  // Add dots & tooltip\n  var circles = svg1.selectAll(\"circle\")\n    .data(data)\n    .enter()\n    .append(\"circle\")\n      .attr(\"cx\", function (d) {return jitter(x(d[currentX]));})\n      .attr(\"cy\", function (d) {return jitter(y(d[currentY]));})\n      .attr(\"r\", 4)\n      .style(\"fill\", function (d) {return typeColor(d.type1);})\n      .style(\"opacity\",0.5)\n  \t.on(\"mouseover\", mouseover)\n  \t.on(\"mouseout\", mouseout);\n\n  function updateAxis(selectedGroup,axis) {\n    // Create new data with the selection?\n    if (axis == 'y') {\n  \t  var dataFilter = data.map(function(d){return {xVar: d[currentX], yVar:d[selectedGroup]} })\n      currentY = selectedGroup;\n    } else {\n  \t  var dataFilter = data.map(function(d){return {xVar: d[selectedGroup], yVar:d[currentY]} })     \n  \t  currentX = selectedGroup;\n    }\n\n    // Give these new data to update dots\n    circles\n      .data(dataFilter)\n      .transition()\n      .duration(500)\n      .attr(\"cx\", function(d) { return jitter(x(d.xVar));})\n      .attr(\"cy\", function(d) { return jitter(y(d.yVar));});\n  }\n\n  d3.select(\"#selectXButton\").on(\"change\", function(d) {\n    var selectedOption = d3.select(this).property(\"value\")\n    updateAxis(selectedOption, 'x')\n  })\n\n  d3.select(\"#selectYButton\").on(\"change\", function(d) {\n    var selectedOption = d3.select(this).property(\"value\")\n    updateAxis(selectedOption, 'y')\n  })\n})\n\n//PAGE 2\nvar svg2 = d3.select(\"#scatterplot2\")\n  .append(\"svg\")\n    .attr(\"width\", width + margin.left + margin.right)\n    .attr(\"height\", height + margin.top + margin.bottom)\n  .append(\"g\")\n    .attr(\"transform\",\n          \"translate(\" + margin.left + \",\" + margin.top + \")\");\n\n// Add axes\nsvg2.append(\"g\")\n  .attr(\"transform\", \"translate(0,\" + y.range()[0] / 2 + \")\")\n  .call(d3.axisBottom(x));\nsvg2.append(\"g\")\n  .attr(\"transform\", \"translate(\" + x.range()[1] / 2 + \", 0)\")\n  .call(d3.axisLeft(y));\n\n// add the tooltip area to the webpage\nvar tooltip= d3.select(\"#scatterplot2\").append(\"div\")\n    .attr(\"class\", \"tooltip\")\n    .style(\"opacity\", 0);\n\n//Read the data\nd3.csv(\"../data/pokemon_small.csv\", function(data) {\n  var x1_var,x2_var,x3_var,y1_var,y2_var,y3_var,x1_val,x2_val,x3_val,y1_val,y2_val,y3_val;\n  x1_var = x2_var = x3_var = 'against_water';\n  y1_var = y2_var = y3_var = 'against_grass';\n  x1_val = x2_val = x3_val = y1_val = y2_val = y3_val = 50;\n\n  initializeDropdown('button_x1',xOptions,x1_var);\n  initializeDropdown('button_x2',xOptions,x2_var);\n  initializeDropdown('button_x3',xOptions,x3_var);\n  initializeDropdown('button_y1',yOptions,y1_var);\n  initializeDropdown('button_y2',yOptions,y2_var);\n  initializeDropdown('button_y3',yOptions,y3_var);\n\n    // Add dots & tooltip\n  var circles = svg2.selectAll(\"circle\")\n    .data(data)\n    .enter()\n    .append(\"circle\")\n      .attr(\"cx\", function (d) {return jitter(x(transformX(d)));})\n      .attr(\"cy\", function (d) {return jitter(y(transformY(d)));})\n      .attr(\"r\", 4)\n      .style(\"fill\", function (d) {return typeColor(d.type1);})\n      .style(\"opacity\",0.5)\n  \t.on(\"mouseover\", mouseover)\n  \t.on(\"mouseout\", mouseout);\n\n\n  function transformX(data) {\n  \tvar sum = x1_val+x2_val+x3_val;\n\treturn (x1_val*data[x1_var]+x2_val*data[x2_var]+x3_val*data[x3_var])/sum;\n  }\n\n  function transformY(data) {\n\tvar sum = y1_val+y2_val+y3_val;\n\treturn (y1_val*data[y1_var]+y2_val*data[y2_var]+y3_val*data[y3_var])/sum;\n  }\n\n  function update() {\n    circles\n      .transition()\n      .duration(500)\n      .attr(\"cx\", function(d) { return jitter(x(transformX(d)));})\n      .attr(\"cy\", function(d) { return jitter(y(transformY(d)));});\n  }\n\n  //update for buttons\n  d3.select(\"#button_x1\").on(\"change\", function(d) {\n    x1_var = d3.select(this).property(\"value\");\n    update();\n  })\n  d3.select(\"#button_x2\").on(\"change\", function(d) {\n    x2_var = d3.select(this).property(\"value\");\n    update();\n  })\n  d3.select(\"#button_x3\").on(\"change\", function(d) {\n    x3_var = d3.select(this).property(\"value\");\n    update();\n  })\n  d3.select(\"#button_y1\").on(\"change\", function(d) {\n    y1_var = d3.select(this).property(\"value\");\n    update();\n  })\n  d3.select(\"#button_y2\").on(\"change\", function(d) {\n    y2_var = d3.select(this).property(\"value\");\n    update();\n  })\n  d3.select(\"#button_y3\").on(\"change\", function(d) {\n    y3_var = d3.select(this).property(\"value\");\n    update();\n  })\n\n  // update for sliders\n  d3.select(\"#slider_x1\").on(\"change\", function(d){\n    x1_val = parseFloat(this.value);\n    update();\n  })\n  d3.select(\"#slider_x2\").on(\"change\", function(d){\n    x2_val = parseFloat(this.value);\n    update();\n  })\n  d3.select(\"#slider_x3\").on(\"change\", function(d){\n    x3_val = parseFloat(this.value);\n    update();\n  })\n  d3.select(\"#slider_y1\").on(\"change\", function(d){\n    y1_val = parseFloat(this.value);\n    update();\n  })\n  d3.select(\"#slider_y2\").on(\"change\", function(d){\n    y2_val = parseFloat(this.value);\n    update();\n  })\n  d3.select(\"#slider_y3\").on(\"change\", function(d){\n    y3_val = parseFloat(this.value);\n    update();\n  })\n})\n\n//# sourceURL=webpack://pca-interactive-visualization/./src/index.js?");
/******/ })()
;