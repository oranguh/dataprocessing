function reqListener(){

  var jsondata = this.responseText;
  console.log(jsondata)
  // var json_values = jsondata.map(x => x["fraud_count"]);
  console.log(json_values)
  var svg = d3.select("div.output svg")
    .attr('width', window.innerWidth)
    .attr('height', window.innerHeight)
  // console.log(svg)
  svg.selectAll("rect")
    .data([12, 6, 25])
    .enter().append("rect")
      .attr("x", 0)
      .attr("y", function(d,i) { return i*30+50 })
      .attr("width", function(d,i) { return d; })
      .attr("height", 20)
      .style("fill", "steelblue")

}

var requester = new XMLHttpRequest();
var gitthingy = "https://oranguh.github.io/dataprocessing/Homework/Week_3/enron.json";

requester.addEventListener("load", reqListener);
requester.open("GET", gitthingy);
requester.send();
