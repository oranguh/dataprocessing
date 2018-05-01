// Marco Heuvelman  10176306
// YELP API KEY:
// 8ZtylY3CFd_Rnym2ndkiG7Yx8NTJy9d9Gl6sIRSSZqvC00Ep1muPovd6M6S1xnydJK3LwZwfgKHKRRlGqWbiAYLjuzW0rBcPCFPjedt3WHMUr3nKLERWxUhgjYrnWnYx



var svg = d3.select("body")
            .append("svg")
            .attr("width", 500)
            .attr("height", 200)
console.log(svg)

svg.select("rect")
  .attr("width", 100)
  .attr("height", 100)
  .style("fill", "steelblue")

// svg.selectAll("rect")
//   .enter()
//   .append("rect")
//   .attr("class", "bar") // look at stylers.css for additional attributes
//   .attr("x", 50)
//   .attr("y", 50)
//
//   .attr("width", 6)
//   .attr("height", 7)
