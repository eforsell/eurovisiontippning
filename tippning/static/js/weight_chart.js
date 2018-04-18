var margin = {top: 5, right: 10, bottom: 40, left: 42},
    width = parseInt(d3.select('#points_chart').style('width'), 10),
    width = width - margin.left - margin.right,
    height = width/2 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .domain([0,25])
    .range([7, width]);

var y = d3.scale.linear()
    .domain([0, 1])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .tickValues(d3.range(0, 26, 5))
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .tickValues(d3.range(0, 1.05, 0.2))
    .orient("left");

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Vikt:</strong> " + Math.round(d.weight * 100) / 100;
  })

var line = d3.svg.line()
    .x(function(d) { return x(d.distance); })
    .y(function(d) { return y(d.weight); });


var svg = d3.select("#weight_chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("shape-rendering", "crispEdges")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

var data = []
for (var i = 0; i < 26; i++) {
    var w = 1/(i+1);
    var d = i
    data[i] = {distance: d, weight: w}
}


  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .style("font-size", "11px")
      .call(xAxis);

  svg.append("text")      // text label for the x axis
          .attr("x", width/2 )
          .attr("y",  height + 35 )
          .style("text-anchor", "middle")
          .text("Avstånd");

  svg.append("g")
      .attr("class", "y axis")
      .style("font-size", "11px")
      .call(yAxis);

    svg.append("text")
      .attr("y", "-2.25em")
      .attr("x", -height/2)
      .attr("transform", "rotate(-90)")
      .style("text-anchor", "middle")
      .text("Vikt");

  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);

    svg.selectAll('circle')
        .data(data)
      .enter().append('circle')
        .attr("class", "node")
        .attr('cx', function(d) {
          return x(d.distance);
        })
        .attr('cy', function(d) {
          return y(d.weight);
        })
        .attr('r', 2.5)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);



function type(d) {
  d.distance = +d.distance;
  d.weight = +d.weight;
  return d;
}
