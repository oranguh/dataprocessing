// Marco Heuvelman  10176306
//  https://www.pokeapi.co/

// Hover over for pokeman name and other info maybe
// colours for type. Maybe add legend
// size for height or something
// dropdown for more pokemon from API
// legend with filter function

var w = window.innerWidth - 150;
var h = window.innerHeight - 50;
var margins = {"right": 100, "left":60, "bottom": 50, "top": 50};
var uninitialized = true;
var numPokemans = 5;
var myPokemonList = []
var poketypes =
  ["fire", "poison", "bug", "dark", "dragon", "electric", "fairy", "fighting",
  "flying", "ghost", "grass", "ground", "ice", "normal", "psychic", "rock", "steel",
  "water"];


var POKEDEX = 'https://pokeapi.co/api/v2/pokemon/';
//  e.g. https://pokeapi.co/api/v2/pokemon/1/
var POKEWIKI = 'http://pokemon.wikia.com/wiki/';

// amount of pokeman in the pokeman world
var pokemanUpperLimit = 949;

// re-initializez when drowdown menu is clicked
function clickity(num) {
  // number of pokeman to ask from api
numPokemans = num;
w = window.innerWidth - 150;
h = window.innerHeight - 50;
uninitialized = false;
initialize()
}

// loads on window load
window.onload = initialize()

function initialize(){

  // list with pokemon objects, this can also be used to cache in future if I want


  let helloThere = d3.queue();
  for (let i = 1; i <= numPokemans; ++i) {
    // I wanted to get a unique list of integers to not get duplicates (for future)
    let randomi = Math.floor(Math.random() * (pokemanUpperLimit/8)) + 1
    helloThere.defer(d3.request, POKEDEX + randomi)
    // if (i === 5) { break; }
  }
    // created new function jus in case I wanted to change code and did not want to call
    helloThere.awaitAll(pokeFun);

  function pokeFun(error, pokemonStats) {
    if (error) throw error;
    // console.log(pokemonStats);
    // console.log([...Array(40)].map(_=>Math.ceil(Math.random()*40)))
    for (let i = 0; i < pokemonStats.length; i++){
      plokemon = JSON.parse(pokemonStats[i].response)
      // console.log(plokemon);

      myPokemonList.push(plokemon)
      // console.log(myPokemonList[i].weight)
      // console.log(myPokemonList[i].stats[0].base_stat)
      for (let k = 0; k < myPokemonList[i].types.length; k++){
        // console.log(myPokemonList[i].types[k].type.name)

      }
    }

  // Clears the screen of circles with transitions? (does not work?)
  d3.select("body").select("svg").selectAll("image")
    .transition()
    .duration(700)
    .attr("opacity", 0);

  // AXES and transforms!
  var xs = d3.scaleLinear()
      .domain([d3.max(myPokemonList, function(d){
            return d.weight;
        }) * -(1/32), d3.max(myPokemonList, function(d){
            return d.weight;
        }) * (9/8)])
      .range([margins.left, (w - margins.right)]);

  var ys = d3.scaleLinear()
      .domain([d3.max(myPokemonList, function(d){
            return d.stats[0].base_stat;
        }) * (9/8), d3.max(myPokemonList, function(d){
              return d.stats[0].base_stat;
          }) * -(1/32)])  // pre-create

      .range([margins.top, (h - margins.bottom)]);
  // creates svg and tooltip div from scratch if not initialized
  if (uninitialized) {
    var svg = d3.select("body")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
  }
  // else only select it
  else {
    var svg = d3.select("body").select("svg");
    var div = d3.select("body").select(".tooltip");
  }
  // make them axes
  var xAxis = d3.axisBottom(xs);
  var yAxis = d3.axisLeft(ys);
  // remove all previous circles
  d3.select("body").select("svg").selectAll("circle")
  .remove();
  // create new circles with tooltips!

  svg.selectAll("image")
    .data(myPokemonList)
    .enter()
    .append("image")
    .attr('xlink:href', function(d){
         return d.sprites.front_default
         })
    .attr("x", function(d) {
         return Math.floor(xs(d.weight) - 25 - d.height);
         })
    .attr("y", function(d) {
         return Math.floor(ys(d.stats[0].base_stat) - 25 - d.height);
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
     .on("click", function(d) { window.open(POKEWIKI + d.name);
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

// big section for legend
var legendo = svg.append("g")
    .attr("class", "legend_box")
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
    d3.select("body").select("svg").selectAll("image")
      .transition()
      .duration(700)
      .style("opacity", 0.1);
    let typeclass = "." + d
    // console.log(typeclass)
    d3.select("body").select("svg").selectAll("image").filter(typeclass)
      .transition()
      .duration(700)
      .style("opacity", 1);
    })
   ;
  // pokemon type text with url to wiki
    legendo.selectAll("text")
     .data(poketypes)
     .enter()
     .append("text")
     .attr("class", function(d) {
       return d + " legendtext legendurl"
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
        .attr("x", Math.floor((w - margins.right) + margins.right/4))
        .attr("y", Math.floor(margins.top*(7/8)))
        // .style("text-anchor", "middle")
        .text("Size: height");
      legendo.append("text")
        .attr("class", "legendtext legendurl")
        .attr("x", Math.floor((w - margins.right) + margins.right/4))
        .attr("y", Math.floor(margins.top*(5/8)))
        .text("RESET")
        .on("click", function(d) {
         d3.select("body").select("svg").selectAll("image")
           .transition()
           .duration(700)
           .style("opacity", 1);
         });
      legendo.append("text")
        .attr("class", "legendTitle")
        .attr("x", Math.floor((w - margins.right) + margins.right/4))
        .attr("y", Math.floor(margins.top*(2/8)))
        // .style("text-anchor", "middle")
        .text("Legend");

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
  }
  else {
  svg.select("#y-axis")
  	.transition()
    .duration(700)
  	.call(yAxis);
  svg.select("#x-axis")
  	.transition()
    .duration(700)
  	.call(xAxis);
  }
  // y-axis text
  svg.append("text")
      .attr("y", 0)
      .attr("x",0 - Math.floor((h / 2)))
      .attr("transform", "rotate(-90)")
      .attr("dy", "1em")
      .attr("fill", "red")
      .style("text-anchor", "middle")
      .text("Speed");
    // x-axis text
  svg.append("text")
    .attr("fill", "red")
    .attr("transform",
          "translate(" + Math.floor((w/2)) + " ," +
                         (h - 7) + ")")
    .style("text-anchor", "middle")
    .text("Weight");

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
  };
};
