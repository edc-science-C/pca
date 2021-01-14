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
eval("// set the dimensions and margins of the graph\nvar margin = {top: 10, right: 30, bottom: 30, left: 60},\n    width = 960 - margin.left - margin.right,\n    height = 500 - margin.top - margin.bottom;\n\n// setup fill color\nvar typeColor = d3.scaleOrdinal()\n\t\t.domain([\"ice\",\"grass\",\"fire\",\"psychic\",\"rock\",\"normal\",\n\t\t\t\"ground\",\"dragon\",\"fairy\",\"water\",\"bug\",\"fighting\",\n\t\t\t\"dark\",\"ghost\",\"poison\",\"electric\",\"steel\",\"flying\"])\n  \t\t.range([\"#66EBFF\",\"#8ED752\", \"#F95643\",\"#FB61B4\",\"#CDBD72\",\"#BBBDAF\",\n              \"#F0CA42\",\"#8B76FF\",\"#F9AEFE\",\"#53AFFE\",\"#C3D221\",\"#A35449\",\n              \"#8E6856\",\"#7673DA\",\"#AD5CA2\",\"#F8E64E\",\"#C3C1D7\",\"#75A4F9\"])\n\n// append the svg object to the body of the page\nvar svg = d3.select(\"#scatterplot1\")\n  .append(\"svg\")\n    .attr(\"width\", width + margin.left + margin.right)\n    .attr(\"height\", height + margin.top + margin.bottom)\n  .append(\"g\")\n    .attr(\"transform\",\n          \"translate(\" + margin.left + \",\" + margin.top + \")\");\n\n// Add axes\nvar x = d3.scaleLinear()\n  .domain([-5, 5])\n  .range([0, width]);\nvar y = d3.scaleLinear()\n  .domain([-5, 5])\n  .range([height, 0]);\nsvg.append(\"g\")\n  .attr(\"transform\", \"translate(0,\" + y.range()[0] / 2 + \")\")\n  .call(d3.axisBottom(x));\nsvg.append(\"g\")\n  .attr(\"transform\", \"translate(\" + x.range()[1] / 2 + \", 0)\")\n  .call(d3.axisLeft(y));\n\n// add the tooltip area to the webpage\nvar tooltip = d3.select(\"#scatterplot\").append(\"div\")\n    .attr(\"class\", \"tooltip\")\n    .style(\"opacity\", 0);\n\n// add jitter to see points better\nvar jitterWidth = 40;\nfunction jitter(input) {\n\treturn input + Math.random()*jitterWidth;\n}\n\n//Read the data\nd3.csv(\"../data/pokemon_small.csv\", function(data) {\n\n  // List of groups (here I have one group per column)\n  var xOptions = [\"against_grass\",\"against_water\",\"against_fire\",\"against_electric\",\"against_rock\",\"pc1\"];\n  var yOptions = [\"against_grass\",\"against_water\",\"against_fire\",\"against_electric\",\"against_rock\",\"pc2\"];\n\n\n  var currentX = 'against_water';\n  var currentY = 'against_grass';\n\n  // add the options to the x button\n  d3.select(\"#selectXButton\")\n      .selectAll('xOptions')\n     \t.data(xOptions)\n      .enter()\n    \t.append('option')\n      .text(function (d) { return d; }) // text showed in the menu\n      .attr(\"value\", function (d) { return d; }) // corresponding value returned by the button\n      .property(\"selected\", function(d){ return d === currentX; }) //default\n\n  // add the options to the y button\n  d3.select(\"#selectYButton\")\n      .selectAll('yOptions')\n     \t.data(yOptions)\n      .enter()\n    \t.append('option')\n      .text(function (d) { return d; }) // text showed in the menu\n      .attr(\"value\", function (d) { return d; }) // corresponding value returned by the button\n      .property(\"selected\", function(d){ return d === currentY; }) //default\n\n  // Add dots & tooltip\n  var dot = svg.selectAll(\"circle\")\n    .data(data)\n    .enter()\n    .append(\"circle\")\n      .attr(\"cx\", function (d) {return jitter(x(d.against_water));})\n      .attr(\"cy\", function (d) {return jitter(y(d.against_grass));})\n      .attr(\"r\", 4)\n      .style(\"fill\", function (d) {return typeColor(d.type1);})\n      .style(\"opacity\",0.5)\n  \t.on(\"mouseover\", function(d) {\n          tooltip.transition()\n               .duration(200)\n               .style(\"opacity\", .9);\n          tooltip.html(d.name)\n               .style(\"left\", (d3.event.pageX + 10) + \"px\")\n               .style(\"top\", (d3.event.pageY) + \"px\");\n      })\n      .on(\"mouseout\", function(d) {\n          tooltip.transition()\n               .duration(500)\n               .style(\"opacity\", 0);\n      });\n\n  // A function that update the chart\n    function update(selectedGroup,axis) {\n\n      // Create new data with the selection?\n      if (axis == 'y') {\n      \tvar dataFilter = data.map(function(d){return {xVar: d[currentX], yVar:d[selectedGroup]} })\n        currentY = selectedGroup;\n      } else {\n      \tvar dataFilter = data.map(function(d){return {xVar: d[selectedGroup], yVar:d[currentY]} })     \n      \tcurrentX = selectedGroup;\n      }\n\n      // Give these new data to update line\n      dot\n          .data(dataFilter)\n          .transition()\n          .duration(1000)\n          .attr(\"cx\", function(d) { return jitter(x(d.xVar));})\n          .attr(\"cy\", function(d) { return jitter(y(d.yVar));})\n    }\n\n    // When the button is changed, run the updateChart function\n    d3.select(\"#selectXButton\").on(\"change\", function(d) {\n        // recover the option that has been chosen\n        var selectedOption = d3.select(this).property(\"value\")\n        // run the updateChart function with this selected option\n        update(selectedOption, 'x')\n    })\n\n     // When the button is changed, run the updateChart function\n    d3.select(\"#selectYButton\").on(\"change\", function(d) {\n        // recover the option that has been chosen\n        var selectedOption = d3.select(this).property(\"value\")\n        // run the updateChart function with this selected option\n        update(selectedOption, 'y')\n    })\n\n})\n\n//# sourceURL=webpack://pca-interactive-visualization/./src/index.js?");
/******/ })()
;