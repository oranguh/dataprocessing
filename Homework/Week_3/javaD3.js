function reqListener(){

  var jsondata = JSON.parse(this.responseText);
  var json_percentage = [];
  var json_months = [];

  // console.log(typeof this.responseText)
  // console.log(typeof jsondata)

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<strong>Frequency:</strong> <span style='color:red'>" + d.fraud_count + "</span>";
    })

var maxfinder = []
  for (i in jsondata.DATA) {
    jsondata.DATA[i]["month"] = new Date(jsondata.DATA[i]["month"]*1000).toString();
    maxfinder[i] = jsondata.DATA[i].fraud_count
  }
  var w = window.innerWidth - 100;
  var h = window.innerHeight - 100;
  var margins = {"right": 0, "left":40, "bottom": 50, "top": 45};
  var barPadding = 3;


  var xs = d3.scale.ordinal()
      .rangeRoundBands([margins.left, w]);

  var ys = d3.scale.linear()
      .domain([Math.max(...maxfinder), 0])
      .range([margins.top, (h - margins.bottom)]);

      // console.log(Math.max(...maxfinder))
      // console.log(ys(10))
      // console.log((h - margins.bottom))

  var xAxis = d3.svg.axis()
      .scale(xs)
      // .ticks(jsondata.DATA.length)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(ys)
      .orient("left")
      // .tickFormat(d3.format(".0%"));
      .ticks(5);

  var svg = d3.select("body")
              .append("svg")
              .attr("width", w)
              .attr("height", h)

  svg.call(tip);

  svg.selectAll("rect")
    .data(jsondata.DATA)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function(d, i) {
    return Math.floor(i * (w / jsondata.DATA.length) + margins.left)
    })
    .attr("y", function(d) {
    return (h - (h -ys(d.fraud_count)));  //Height minus data value
    })

    .attr("width", Math.floor(w / jsondata.DATA.length - barPadding))
    .attr("height", function(d) {
    return h - ys(d.fraud_count) - margins.bottom;  //Just the data value
    })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);
  // months labels
  svg.selectAll("text")
   .data(jsondata.DATA)
   .enter()
   .append("text")
   .attr("class", "texto")
   .text(function(d) {
     return d.month.substring(3,7)
   })
   .attr("x", function(d, i) {
        return Math.floor(i * (w / jsondata.DATA.length) + margins.left) ;
   })
   .attr("y", function(d) {
        return h - margins.bottom * 0.6;
   });
  //  years labels
   svg.selectAll("text1")
    .data(jsondata.DATA)
    .enter()
    .append("text")
    .attr("class", "texto dato")
    .text(function(d) {
      return d.month.substring(10,15)
    })
    .attr("x", function(d, i) {
         return Math.floor(i * (w / jsondata.DATA.length) + margins.left) ;
    })
    .attr("y", function(d) {
         return h - margins.bottom * 0.4 ;
    });
  // make axis appear
  svg.append('g')
    .attr("transform", "translate(0," + (h - margins.bottom) + ")")
    .call(xAxis)
  svg.append('g')
    .attr("transform", "translate(" + margins.left + ", 0)")
    .call(yAxis)

  // y - axis labels https://bl.ocks.org/d3noob/23e42c8f67210ac6c678db2cd07a747e
  svg.append("text")
      .attr("y", 0 + (margins.left / 8))
      .attr("x",0 - (h / 2) + 37)
      .attr("transform", "rotate(-90)")
      .attr("dy", "1em")
      .attr("fill", "red")
      .style("text-anchor", "middle")
      .text("Count");
    // x-axis
    svg.append("text")
      .attr("fill", "red")
      .attr("transform",
            "translate(" + (w/2) + " ," +
                           (h + margins.top ) + ")")
      .style("text-anchor", "middle")
      .text("Date");

  //  I used this helpful link to make this http://jsfiddle.net/nhHww/1/
  svg.append("text")
    .attr("class", "texturl")
    .attr("x", "50")
    .attr("y", "20")
    .attr("font-family", "sans-serif")
    .attr("font-size", "20px")
    .attr("fill", "blue")
    .text("Enron Email Dataset")
    .on("click", function() { window.open("https://www.cs.cmu.edu/~enron/");
    });
  svg.append("text")
    .attr("x", "50")
    .attr("y", "50")
    .attr("font-family", "sans-serif")
    .attr("font-size", "15px")
    .attr("fill", "green")
    .text("Marco Heuvelman 10176306")

    function type(d) {
      d.frequency = +d.frequency;
      return d;
    }

}

var requester = new XMLHttpRequest();
// var gitthingy = "https://oranguh.github.io/dataprocessing/Homework/Week_3/enron.json";
var gitthingy = "enron.json"
requester.addEventListener("load", reqListener);
requester.open("GET", gitthingy);
requester.send();
