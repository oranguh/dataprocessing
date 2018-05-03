// Marco Heuvelman  10176306
//  https://www.pokeapi.co/

// Hover over for pokeman name and other info maybe
// colours for type. Maybe add legend
// size for height or something
// dropdown for different type filtering

var w = window.innerWidth - 150;
var h = window.innerHeight - 50;
var margins = {"right": 100, "left":60, "bottom": 50, "top": 50};

var numPokemans = 5;
var poketypes =
  ["fire", "poison", "bug", "dark", "dragon", "electric", "fairy", "fighting",
  "flying", "ghost", "grass", "ground", "ice", "normal", "psychic", "rock", "steel",
  "water"];


var API_HOST = 'https://pokeapi.co/api/v2/'
var POKEDEX = 'https://pokeapi.co/api/v2/pokemon/'
//  e.g. https://pokeapi.co/api/v2/pokemon/1/
var POKEWIKI = 'http://pokemon.wikia.com/wiki/'


function clickity(num) {
numPokemans = num;

initialize()

}

window.onload = initialize()

function initialize(){

  var myPokemonList = []
  d3.queue()
    .defer(d3.request, POKEDEX)
    .awaitAll(function(error, pokedex) {
      if (error) throw error;

      pokemans = JSON.parse(pokedex[0].response)
      // console.log(pokemans);
      pokemanUpperLimit = pokemans.count;

      let helloThere = d3.queue();
      for (let i = 1; i <= numPokemans; ++i) {
        // console.log(pokemans[i])
        let randomi = Math.floor(Math.random() * (pokemanUpperLimit/4)) + 1
        // console.log(randomi)
        helloThere.defer(d3.request, POKEDEX + randomi)
        // if (i === 5) { break; }
      }
        helloThere.awaitAll(pokeFun);
    });


  function pokeFun(error, pokemonStats) {
    if (error) throw error;
    // console.log(pokemonStats);
    console.log([...Array(40)].map(_=>Math.ceil(Math.random()*40)))
    for (let i = 0; i < pokemonStats.length; i++){
      plokemon = JSON.parse(pokemonStats[i].response)
      console.log(plokemon);

      myPokemonList.push(plokemon)
      // console.log(myPokemonList[i].weight)
      // console.log(myPokemonList[i].stats[0].base_stat)
      for (let k = 0; k < myPokemonList[i].types.length; k++){
        // console.log(myPokemonList[i].types[k].type.name)

      }
    }

  // Clears the screen
  d3.select("body").select(".tooltip").remove();
  d3.select("body").select("svg").remove();
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
          }) * -(1/32)])
      .range([margins.top, (h - margins.bottom)]);

  var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);


  // DO SVG SCATTERPLOT HERE
  var svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
  // make them axes

  var xAxis = d3.axisBottom(xs);
  var yAxis = d3.axisLeft(ys);

// https://stackoverflow.com/questions/15747987/nested-circles-in-d3
  svg.selectAll("circle")
   .data(myPokemonList)
   .enter()
   .append("circle")
   .attr("cx", function(d) {
         return Math.floor(xs(d.weight));
    })
    .attr("cy", function(d) {
         return Math.floor(ys(d.stats[0].base_stat));
    })
    .attr("r", function(d) {
         return d.height*1.5;
    })
    .style("stroke-width", 1)
    .style("stroke", "black")
    .attr("class", function(d) {
      let pokeclasses = "scatter "
      for (let k = 0; k < d.types.length; k++){
        console.log(d.types[k].type.name)
        pokeclasses = pokeclasses + (d.types[k].type.name) + " "
      }
      return pokeclasses
    })
    .on("click", function(d) { window.open(POKEWIKI + d.name);
    })
    .on("mouseover", function(d) {
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
      })

var legendo = svg.append("g")
    .attr("class", "legend_box")

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
   .attr("height", 10);

    legendo.selectAll("text")
     .data(poketypes)
     .enter()
     .append("text")
     .attr("class", function(d) {
       return d + " legendtext legendurl"
      })
     .attr("x", (w - margins.right) + margins.right*(3/8))
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
      legendo.append("text")
        .attr("class", "legendtext")
        .attr("x", (w - margins.right) + margins.right/4)
        .attr("y", margins.top)
        // .style("text-anchor", "middle")
        .text("Size: height");

  svg.append('g')
    .attr("transform", "translate(0," + (h - margins.bottom) + ")")
    .call(xAxis)
  svg.append('g')
    .attr("transform", "translate(" + margins.left + ", 0)")
    .call(yAxis)
  svg.append("text")
      .attr("y", 0)
      .attr("x",0 - (h / 2))
      .attr("transform", "rotate(-90)")
      .attr("dy", "1em")
      .attr("fill", "red")
      .style("text-anchor", "middle")
      .text("Speed");
    // x-axis
  svg.append("text")
    .attr("fill", "red")
    .attr("transform",
          "translate(" + (w/2) + " ," +
                         (h - 7) + ")")
    .style("text-anchor", "middle")
    .text("Weight");

  };
};
