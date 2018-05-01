// Marco Heuvelman  10176306
//  https://www.pokeapi.co/

// Hover over for pokeman name and other info maybe
// colours for type. Maybe add legend
// size for height or something
// dropdown for different type filtering

var w = window.innerWidth - 150;
var h = window.innerHeight - 100;
var margins = {"right": 20, "left":60, "bottom": 50, "top": 50};
var barPadding = 3;
var numPokemans = 5;

var API_HOST = 'https://pokeapi.co/api/v2/'
var POKEDEX = 'https://pokeapi.co/api/v2/pokemon/'
//  e.g. https://pokeapi.co/api/v2/pokemon/1/
//
//
window.onload = function(){

  var myPokemonList = []
  d3.queue()
    .defer(d3.request, POKEDEX)
    .awaitAll(function(error, pokedex) {
      if (error) throw error;

      pokemans = JSON.parse(pokedex[0]['response']).results
      console.log(pokemans);

      let helloThere = d3.queue()
      for (let i = 0; i < numPokemans; ++i) {
        console.log(pokemans[i])
        helloThere.defer(d3.request, pokemans[i].url)
      }
        helloThere.awaitAll(pokeFun);
    });

  function pokeFun(error, pokemonStats) {
    if (error) throw error;
    // console.log(pokemonStats);

    for (let i = 0; i < pokemonStats.length; i++){
      plokemon = JSON.parse(pokemonStats[i]['response'])
      console.log(plokemon);

      myPokemonList.push(plokemon)
      console.log(myPokemonList[0].weight)
      console.log(myPokemonList[0].stats[0].base_stat)
    }
  // AXES and transforms!

  // DO SVG SCATTERPLOT HERE
  var svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h)

  svg.selectAll("circle")
   .data(myPokemonList)
   .enter()
   .append("circle")
   .attr("cx", function(d) {
         return d.weight;
    })
    .attr("cy", function(d) {
         return d.stats[0].base_stat;
    })
    .attr("r", function(d) {
         return d.height;
    });
  };
};
