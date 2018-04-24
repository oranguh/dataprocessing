var svg = d3.select("div.output svg")

// console.log(svg)
svg.selectAll("rect")
  .data([12, 6, 25])
  .enter().append("rect")
    .attr("x", 0)
    .attr("y", function(d,i) { return i*9+5 })
    .attr("width", function(d,i) { return d; })
    .attr("height", 2)
    .style("fill", "steelblue")
