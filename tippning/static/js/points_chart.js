var margin = {top: 5, right: 10, bottom: 40, left: 42},
    width = parseInt(d3.select('#points_chart').style('width'), 10),
    width = width - margin.left - margin.right,
    height = width/2 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .domain([0,25])
    .range([7, width]);

var y = d3.scale.linear()
    .domain([0, 100])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .tickValues(d3.range(0, 26, 5))
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .tickValues(d3.range(0, 105, 25))
    .orient("left");

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Poäng:</strong> " + Math.round(d.poang * 100) / 100;
  })

var line = d3.svg.line()
    .x(function(d) { return x(d.placering); })
    .y(function(d) { return y(d.poang); });


var svg = d3.select("#points_chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("shape-rendering", "crispEdges")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

d3.csv("points_data.csv", type, function(error, data) {
  if (error) throw error;

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .style("font-size", "11px")
      .call(xAxis);

  svg.append("text")      // text label for the x axis
          .attr("x", width/2 )
          .attr("y",  height + 35 )
          .style("text-anchor", "middle")
          .text("Placering");

  svg.append("g")
      .attr("class", "y axis")
      .style("font-size", "11px")
      .call(yAxis);

    svg.append("text")
      .attr("y", "-2.25em")
      .attr("x", -height/2)
      .attr("transform", "rotate(-90)")
      .style("text-anchor", "middle")
      .text("Poäng");

  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);

    svg.selectAll('circle')
      .data(data)
      .enter().append('circle')
      .attr("class", "node")
      .attr('cx', function(d) {
        return x(d.placering);
      })
      .attr('cy', function(d) {
        return y(d.poang);
      })
      .attr('r', 2.5)
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);



});

function type(d) {
  d.placering = +d.placering;
  d.poang = +d.poang;
  return d;
}
