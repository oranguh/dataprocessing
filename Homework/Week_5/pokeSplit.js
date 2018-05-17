// Marco Heuvelman  10176306
//  https://www.pokeapi.co/

// Hover over for pokeman name and other info maybe
// colours for type. Maybe add legend
// size for height or something
// dropdown for more pokemon from API
// legend with filter function

// http://bl.ocks.org/curran/f4041cac02f19ee460dfe8b709dc24e7
// http://bl.ocks.org/d3noob/8324872

// dimensions of container
var width = (window.innerWidth);
var height = (window.innerHeight - 80);
// dimensions of scatterplot
var w
var h
// dimensions of treeplot
var wTree
var hTree
// margins of scatterplot
var margins = {"right": 100, "left":60, "bottom": 50, "top": 50};
// tags for initialization
var uninitialized = true;
var initialized = false;
// number of pokemon to call on window load (Keep this small to not pressure API)
var numPokemans = 1;
// cached pokemon to keep API load low
var myPokemonList = []
// integers of cached pokemon
var myPokemonIntegerList = []
// amount of pokeman in generation 1
var pokemanUpperLimit = 151;
// initialize the axes metadeta
var yAxisValue = 0
var yAxisLabel = "Speed"
var xAxisValue = 4
var xAxisLabel = "Attack"
// list of types for legend
var poketypes =
  ["fire", "poison", "bug", "dark", "dragon", "electric", "fairy", "fighting",
  "flying", "ghost", "grass", "ground", "ice", "normal", "psychic", "rock", "steel",
  "water"];

// API server
var POKEDEX = 'https://pokeapi.co/api/v2/pokemon/';
//  e.g. https://pokeapi.co/api/v2/pokemon/1/
var POKEWIKI = 'http://pokemon.wikia.com/wiki/';

// draws graph on window load
window.onload = redraw()
function redraw(){
  // list with pokemon objects, which get cached in myPokemonList
  let pokeGetter = d3.queue();
  for (let i = 1; i <= numPokemans; ++i) {
    // I want to get a unique list of integers to not get duplicates
    let randomi = Math.floor(Math.random() * pokemanUpperLimit + 1)
    if (!myPokemonIntegerList.includes(randomi)) {
      myPokemonIntegerList.push(randomi)
      pokeGetter.defer(d3.request, POKEDEX + randomi)
    }
  }
  pokeGetter.awaitAll(function(error, pokemonStats){
    if (error) throw error;
    for (let i = 0; i < pokemonStats.length; i++){
      plokemon = JSON.parse(pokemonStats[i].response)
      myPokemonList.push(plokemon)
    }
    // creates svg and tooltip div from scratch if not initialized
    if (uninitialized) {
      d3.select("body").append("svg")
        .attr("class", "svgContainer")
        .attr("width", width - 50)
        .attr("height", height);
      var container = d3.select(".svgContainer")
      w = (width - 50) * (3/4)
      h = height
      wTree = Math.floor(w/3)
      hTree = Math.floor(h)
      var svgTree = d3.select("body").select(".svgContainer")
          .append("svg")
          .attr("class", "treeDiagram")
          .attr("width", wTree)
          .attr("height", hTree)
          .attr("x", wTree * 3)
            .append("rect")
            .attr("width", wTree)
            .attr("height", hTree)
            .style("stroke", "green")
            .style("stroke-width", 2)
            .style("fill-opacity", 0);
      d3.select("body").select(".svgContainer").select(".treeDiagram")
        .append("text")
        .attr("x", "5")
        .attr("y", "15")
        .attr("font-family", "sans-serif")
        .attr("font-size", "15px")
        .attr("font-weight", "bold")
        .attr("fill", "darkgreen")
        .text("Pokemon Evolution");

      var svg = d3.select("body").select(".svgContainer")
        .append("svg")
        .attr("class", "scatterPlot")
        .attr("width",  w)
        .attr("height", h);
      var div = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);
      var legendo = svg.append("g")
          .attr("class", "legend_box");
    }
    // else only select it
    else {
      container = d3.select(".svgContainer")
        .attr("width", width - 50)
        .attr("height", height);
      // update dimensions
      w = (width - 50) * (3/4)
      h = height
      wTree = Math.floor(w/3)
      hTree = Math.floor(h)
      var svgTree = d3.select("body").select(".treeDiagram")
        .attr("width", wTree)
        .attr("height", hTree)
        .attr("x", wTree * 3);
      svgTree.select("rect")
        .transition()
        .duration(700)
        .attr("width", wTree)
        .attr("height", hTree);
      var svg = d3.select("body").select(".scatterPlot")
        .attr("width", w)
        .attr("height", h);
      var div = d3.select("body").select(".tooltip");
      var legendo = svg.select(".legend_box");
    }
    // Domain and range for axes
    var xs = d3.scaleLinear()
        .domain([d3.max(myPokemonList, function(d){
              return d.stats[xAxisValue].base_stat ;
          }) * -(1/32), d3.max(myPokemonList, function(d){
              return d.stats[xAxisValue].base_stat;
          }) * (9/8)])
        .range([margins.left, (w - margins.right)]);
    var ys = d3.scaleLinear()
        .domain([d3.max(myPokemonList, function(d){
              return d.stats[yAxisValue].base_stat;
          }) * (9/8), d3.max(myPokemonList, function(d){
              return d.stats[yAxisValue].base_stat;
          }) * -(1/32)])
        .range([margins.top, (h - margins.bottom)]);
    var xAxis = d3.axisBottom(xs);
    var yAxis = d3.axisLeft(ys);
    // transition pokemon currently on plot to new axes range
    svg.selectAll(".scatter")
      .transition()
      .duration(700)
      .attr("x", function(d) {
        return Math.floor(xs(d.stats[xAxisValue].base_stat) - 25 - d.height);
       })
      .attr("y", function(d) {
        return Math.floor(ys(d.stats[yAxisValue].base_stat) - 25 - d.height);
       });
    // enter new pokemon elements
    svg.selectAll("image")
      .data(myPokemonList)
      .enter()
      .append("image")
      .attr('xlink:href', function(d){
        return d.sprites.front_default
       })
      .attr("x", function(d) {
        return Math.floor(xs(d.stats[xAxisValue].base_stat) - 25 - d.height);
       })
      .attr("y", function(d) {
        return Math.floor(ys(d.stats[yAxisValue].base_stat) - 25 - d.height);
       })
      .attr("width", function(d) {
        return 50 + d.height * 2;
       })
      .attr("height", function(d) {
        return 50 + d.height * 2;
       })
      .attr("class", function(d) {
        let pokeclasses = "scatter "
        for (let k = 0; k < d.types.length; k++){
        pokeclasses = pokeclasses + (d.types[k].type.name) + " "
        }
        return pokeclasses
       })
      // Clicking activates the evolution tree
       .on("click", function(d) {
         getEvolution(d)
       })
      // tooltips for pokemon
       .on("mouseover", function(d) {
          let tooltipinfo = d.name + "<br/>" + "weight: " + d.weight
                                   + "<br/>" + "speed: " + d.stats[0].base_stat
                                   + "<br/>" + "height: " + d.height
                                   + "<br/>" + "type(s): "
          for (let k = 0; k < d.types.length; k++){
            tooltipinfo = tooltipinfo + (d.types[k].type.name) + " "
          }
          div.transition()
            .duration(200)
            .style("opacity", .9);
          div.html(tooltipinfo)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
          })
       .on("mouseout", function(d) {
          div.transition()
            .duration(500)
            .style("opacity", 0);
          });
    // only create axes if not initialized, otherwise select and transition
    if (uninitialized) {
      svg.append('g')
        .attr("transform", "translate(0," + (h - margins.bottom) + ")")
        .attr("id", "x-axis")
        .call(xAxis)
      svg.append('g')
        .attr("transform", "translate(" + margins.left + ", 0)")
        .attr("id", "y-axis")
        .call(yAxis)
      // y-axis text
      svg.append("text")
        .attr("id", "y-axis-text")
        .attr("y", 0)
        .attr("x",0 - Math.floor((h / 2)))
        .attr("transform", "rotate(-90)")
        .attr("dy", "1em")
        .attr("fill", "blue")
        .style("text-anchor", "middle")
        .text(yAxisLabel);
      // x-axis text
      svg.append("text")
        .attr("id", "x-axis-text")
        .attr("fill", "green")
        .attr("transform",
              "translate(" + Math.floor((w/2)) + " ," +
                             (h - 7) + ")")
        .style("text-anchor", "middle")
        .text(xAxisLabel);
        // blocks with interactive element

      legendo.append("rect")
        .attr("class", "outlineLegend")
        .attr("width", 70)
        .attr("height", h - margins.bottom)
        .attr("x", Math.floor((w - margins.right) + margins.right*(2/8)) - 3)
        .attr("y", 0)
        .style("stroke", "green")
        .style("stroke-width", 1)
        .style("fill-opacity", 0);

      legendo.selectAll("rect .legendblock")
       .data(poketypes)
       .enter()
       .append("rect")
       .attr("class", function(d) {
         return d + " legendblock"
        })
       .attr("x", (w - margins.right) + margins.right/4)
       .attr("y", function(d, i) {
         return Math.floor(
         (i/poketypes.length) * (h - margins.top - margins.bottom) + margins.top);
        })
       .attr("width", 10)
       .attr("height", 10)
       .on("click", function(d) {
        d3.select("body").select(".scatterPlot").selectAll("image")
          .transition()
          .duration(700)
          .style("opacity", 0)
          .transition()
          .delay(700)
          .style("visibility", "hidden");
        let typeclass = "." + d
        d3.select("body").select(".scatterPlot").selectAll("image").filter(typeclass)
          .transition()
          .duration(700)
          .style("opacity", 1)
          .style("visibility", "visible");
        });
      // pokemon type text with url to wiki
      legendo.selectAll("text")
       .data(poketypes)
       .enter()
       .append("text")
       .attr("class", function(d) {
         return d + " legendtext legendurl legendBoxText"
        })
       .attr("x", Math.floor((w - margins.right) + margins.right*(4/8)))
       .attr("y", function(d, i) {
         return Math.floor(
         (i/poketypes.length) * (h - margins.top - margins.bottom) + margins.top) + 9;
        })
        .text(function(d){
          return d
        })
        .on("click", function(d) { window.open(POKEWIKI + d + "_type");
        });
      // table titles
      legendo.append("text")
        .attr("class", "legendtext legendurl")
        .attr("id", "legendReset")
        .attr("x", Math.floor((w - margins.right) + margins.right/4))
        .attr("y", Math.floor(margins.top*(5/8)))
        .text("RESET")
        .on("click", function(d) {
         d3.select("body").select(".scatterPlot").selectAll("image")
           .transition()
           .duration(700)
           .style("opacity", 1)
           .style("visibility", "visible");
         });
      legendo.append("text")
        .attr("id", "legendTitle")
        .attr("x", Math.floor((w - margins.right) + margins.right/4))
        .attr("y", Math.floor(margins.top*(2/8)))
        .text("Legend");
    }
    else {
      svg.select("#y-axis")
      	.transition()
        .duration(700)
        .attr("transform", "translate(" + margins.left + ", 0)")
      	.call(yAxis);
      svg.select("#x-axis")
      	.transition()
        .duration(700)
        .attr("transform", "translate(0," + (h - margins.bottom) + ")")
      	.call(xAxis);
      svg.select("#y-axis-text")
        .transition()
        .duration(700)
        .attr("y", 0)
        .attr("x",0 - Math.floor((h / 2)))
        .attr("transform", "rotate(-90)")
        .attr("dy", "1em")
        .text(yAxisLabel);
      // x-axis text
      svg.select("#x-axis-text")
        .transition()
        .duration(700)
        .attr("transform",
              "translate(" + Math.floor((w/2)) + " ," +
                             (h - 7) + ")")
        .text(xAxisLabel);
      legendo.select(".outlineLegend")
        .transition()
        .duration(700)
        .attr("width", 70)
        .attr("height", h - margins.bottom)
      legendo.selectAll(".legendblock")
        .transition()
        .duration(700)
        .attr("x", (w - margins.right) + margins.right/4)
        .attr("y", function(d, i) {
          return Math.floor(
          (i/poketypes.length) * (h - margins.top - margins.bottom) + margins.top);
        });
      legendo.selectAll(".legendBoxText")
        .transition()
        .duration(700)
        .attr("x", Math.floor((w - margins.right) + margins.right*(4/8)))
        .attr("y", function(d, i) {
          return Math.floor(
          (i/poketypes.length) * (h - margins.top - margins.bottom) + margins.top) + 9;
        });
      legendo.select("#legendAxes")
        .transition()
        .duration(700)
        .attr("x", Math.floor((w - margins.right) + margins.right/4))
        .attr("y", Math.floor(margins.top*(7/8)));
      legendo.select("#legendReset")
        .transition()
        .duration(700)
        .attr("x", Math.floor((w - margins.right) + margins.right/4))
        .attr("y", Math.floor(margins.top*(5/8)));
      legendo.select("#legendTitle")
        .transition()
        .duration(700)
        .attr("x", Math.floor((w - margins.right) + margins.right/4))
        .attr("y", Math.floor(margins.top*(2/8)));
      }
    // titles
    svg.append("text")
      .attr("x", "50")
      .attr("y", "40")
      .attr("font-family", "sans-serif")
      .attr("font-size", "15px")
      .attr("fill", "green")
      .text("Marco Heuvelman 10176306");
    svg.append("text")
      .attr("class", "title")
      .attr("x", "100")
      .attr("y", "20")
      .attr("font-family", "sans-serif")
      .attr("font-size", "15px")
      .attr("font-weight", "bold")
      .attr("fill", "darkgreen")
      .text("Random pokemons from pokemon API")
      .on("click", function() { window.open("https://pokeapi.co/");
      });
    initialized = true;
  });
};
// re-draw when dropdown menu is clicked or when browser is resized
function clickity(num) {
  // only perform if window has fully initialized
  if (initialized) {
    // gets more pokemon according to amount user clicks
    numPokemans = num;
    width = (window.innerWidth);
    height = (window.innerHeight - 80);
    uninitialized = false;
    redraw()
    TreeFresh()
  }
}
function axickity(num, axis) {
  // changes the axes and the labels
  if (initialized) {
    let label = ""
    switch(num) {
      case 0:
          Label = "Speed"
          break;
      case 1:
          Label = "Spec-Def"
          break;
      case 2:
          Label = "Spec-Atk"
          break;
      case 3:
          Label = "Defence"
          break;
      case 4:
          Label = "Attack"
          break;
      case 5:
          Label = "HP"
          break;
    }
    if (axis === "x"){
      xAxisValue = num
      xAxisLabel = Label
    }
    else {
      yAxisValue = num
      yAxisLabel = Label
    }
    // do not call extra pokemon
    numPokemans = 0;
    // refresh dimensions
    width = (window.innerWidth);
    height = (window.innerHeight - 80);
    uninitialized = false;
    redraw()
  }
}
