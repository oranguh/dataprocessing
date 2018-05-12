// Marco Heuvelman  10176306
//  https://www.pokeapi.co/

// Hover over for pokeman name and other info maybe
// colours for type. Maybe add legend
// size for height or something
// dropdown for more pokemon from API
// legend with filter function

// http://bl.ocks.org/curran/f4041cac02f19ee460dfe8b709dc24e7
// http://bl.ocks.org/d3noob/8324872

// width = (window.innerWidth);
// height = (window.innerHeight - 50);

width = (window.innerWidth);
height = (window.innerHeight - 50);
var margins = {"right": 100, "left":60, "bottom": 50, "top": 50};
var marginsTree = {"right": 25, "left":25, "bottom": 50, "top": 50};
var uninitialized = true;
var initialized = false;
var numPokemans = 5;
var myPokemonList = []
// var myPokemonIntegerList = []
var yAxisValue = 0
var yAxisLabel = "Speed"

var xAxisValue = 4
var xAxisLabel = "Attack"

var poketypes =
  ["fire", "poison", "bug", "dark", "dragon", "electric", "fairy", "fighting",
  "flying", "ghost", "grass", "ground", "ice", "normal", "psychic", "rock", "steel",
  "water"];


var POKEDEX = 'https://pokeapi.co/api/v2/pokemon/';
//  e.g. https://pokeapi.co/api/v2/pokemon/1/
var POKEWIKI = 'http://pokemon.wikia.com/wiki/';

// amount of pokeman in the pokeman world
var pokemanUpperLimit = 151;

// re-initializez when drowdown menu is clicked
function clickity(num) {
  // number of pokeman to ask from api
  if (initialized) {
    numPokemans = num;
    width = (window.innerWidth);
    height = (window.innerHeight - 50);
    uninitialized = false;
    redraw()
    }
}

function axickity(num, axis) {
  // number of pokeman to ask from api
  if (initialized) {

    if (axis === "x"){
      xAxisValue = num
      switch(num) {
        case 0:
            xAxisLabel = "Speed"
            break;
        case 1:
            xAxisLabel = "Spec-Def"
            break;
        case 2:
            xAxisLabel = "Spec-Atk"
            break;
        case 3:
            xAxisLabel = "Defence"
            break;
        case 4:
            xAxisLabel = "Attack"
            break;
        case 5:
            xAxisLabel = "HP"
            break;
        }
    }
    else {
      yAxisValue = num
      switch(num) {
        case 0:
            yAxisLabel = "Speed"
            break;
        case 1:
            yAxisLabel = "Spec-Def"
            break;
        case 2:
            yAxisLabel = "Spec-Atk"
            break;
        case 3:
            yAxisLabel = "Defence"
            break;
        case 4:
            yAxisLabel = "Attack"
            break;
        case 5:
            yAxisLabel = "HP"
            break;
        }
    }
    numPokemans = 0;
    width = (window.innerWidth);
    height = (window.innerHeight - 50);
    uninitialized = false;
    redraw()
    }
}

// loads on window load
window.onload = initialize()

function initialize(){

  redraw()
}
function redraw(){

  // list with pokemon objects, this can also be used to cache in future if I want
  let helloThere = d3.queue();
  for (let i = 1; i <= numPokemans; ++i) {
    // I want to get a unique list of integers to not get duplicates (for future)
    let randomi = Math.floor(Math.random() * pokemanUpperLimit + 1)
    helloThere.defer(d3.request, POKEDEX + randomi)
  }
    // created new function jus in case I wanted to change code and did not want to call
    helloThere.awaitAll(pokeFun);

  function pokeFun(error, pokemonStats) {
    if (error) throw error;
    for (let i = 0; i < pokemonStats.length; i++){
      plokemon = JSON.parse(pokemonStats[i].response)
      myPokemonList.push(plokemon)
    }


  // creates svg and tooltip div from scratch if not initialized
  if (uninitialized) {
    d3.select("body").append("svg")
      .attr("class", "svgContainer")
      .attr("width", width)
      .attr("height", height);
    var container = d3.select(".svgContainer")

    var w = Math.floor(container.node().getBoundingClientRect().width * (3/4))
    var h = Math.floor(container.node().getBoundingClientRect().height)

    var wTree = Math.floor(w/3)
    var hTree = Math.floor(h)
    // console.log(w)
    // console.log(h)
    var svgTree = d3.select("body").select(".svgContainer")
      .append("svg")
      .attr("class", "treeDiagram")
      .attr("width", wTree)
      .attr("height", hTree)
      .attr("x", wTree * 3)
        .append("rect")
        .attr("width", wTree - 20)
        .attr("height", hTree - 0)
        .style("stroke", "green")
        .style("stroke-width", 3)
        .style("fill-opacity", 0)
        // .attr("x", wTree * 3)
        ;

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
      .attr("width", width)
      .attr("height", height);


    var w = Math.floor(container.node().getBoundingClientRect().width * (3/4))
    var h = Math.floor(container.node().getBoundingClientRect().height)

    var wTree = Math.floor(w/3)
    var hTree = Math.floor(h)

    var svgTree = d3.select("body").select(".treeDiagram")
      .attr("width", wTree - 20)
      .attr("height", hTree)
      .attr("x", wTree * 3);
    svgTree.select("rect")
      .transition()
      .duration(700)
      .attr("width", wTree - 50)
      .attr("height", hTree - 20)
      ;


    var svg = d3.select("body").select(".scatterPlot")
      .attr("width", w)
      .attr("height", h);

    var div = d3.select("body").select(".tooltip");

    var legendo = svg.select(".legend_box");

  }
  // AXES and transforms!
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
          }) * -(1/32)])  // pre-create

      .range([margins.top, (h - margins.bottom)]);
  // make them axes
  var xAxis = d3.axisBottom(xs);
  var yAxis = d3.axisLeft(ys);

  // create new circles with tooltips!
  svg.selectAll(".scatter")
    .transition()
    .duration(700)
    .attr("x", function(d) {
         return Math.floor(xs(d.stats[xAxisValue].base_stat) - 25 - d.height);
         })
    .attr("y", function(d) {
         return Math.floor(ys(d.stats[yAxisValue].base_stat) - 25 - d.height);
         });

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
         return 50 + d.height*2;
         })
    .attr("height", function(d) {
         return 50 + d.height*2;
         })
    .attr("class", function(d) {
           let pokeclasses = "scatter "
           for (let k = 0; k < d.types.length; k++){
           // console.log(d.types[k].type.name)
           pokeclasses = pokeclasses + (d.types[k].type.name) + " "
           }
         return pokeclasses
         })
    // url link to wiki page
     .on("click", function(d) {
       getEvolution(d)
     })
    // tooltips for circles
     .on("mouseover", function(d) {
        // d3.select(this).moveToFront();
        let tooltipinfo = d.name + "<br/>" + "weight: " + d.weight
                                 + "<br/>" + "speed: " + d.stats[0].base_stat
                                 + "<br/>" + "height: " + d.height
                                 + "<br/>" + "type(s): "
        for (let k = 0; k < d.types.length; k++){
          // console.log(d.types[k].type.name)
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
    legendo.selectAll("rect")
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
      // console.log(typeclass)
      d3.select("body").select(".scatterPlot").selectAll("image").filter(typeclass)
        .transition()
        .duration(700)
        .style("opacity", 1)
        .style("visibility", "visible");
      })
     ;
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
        })
        // .style("text-anchor", "middle")
        ;
        // table titles
        legendo.append("text")
          .attr("class", "legendtext")
          .attr("id", "legendAxes")
          .attr("x", Math.floor((w - margins.right) + margins.right/4))
          .attr("y", Math.floor(margins.top*(7/8)))
          // .style("text-anchor", "middle")
          .text("Size: height");
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
          // .style("text-anchor", "middle")
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
  };
};
