// Marco Heuvelman  10176306
//  https://www.pokeapi.co/

// Hover over for pokeman name and other info maybe
// colours for type. Maybe add legend
// size for height or something
// dropdown for different type filtering

var w = window.innerWidth - 150;
var h = window.innerHeight - 50;
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
      // console.log(pokemans);

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
      console.log(myPokemonList[i].weight)
      console.log(myPokemonList[i].stats[0].base_stat)
      for (let k = 0; k < myPokemonList[i].types.length; k++){
        console.log(myPokemonList[i].types[k].type.name)

      }
    }
  // AXES and transforms!
  var xs = d3.scaleLinear()
      .domain([0, d3.max(myPokemonList, function(d){
            return d.weight;
        })])
      .range([margins.left, (w - margins.right)]);

  var ys = d3.scaleLinear()
      .domain([d3.max(myPokemonList, function(d){
            return d.stats[0].base_stat;
        }), 0])
      .range([margins.top, (h - margins.bottom)]);




  // DO SVG SCATTERPLOT HERE
  var svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
  // make them axes

  // var axisX = svg.select("#x_axis")
  //     .transition().duration(200)//.ease(“sin-in-out”)
  //     .attr("transform", "translate(0," + h + ")")
  //     .call(d3.axisBottom(xs))

  var xAxis = d3.axisBottom(xs);
  var yAxis = d3.axisLeft(ys);


  svg.selectAll("circle")
   .data(myPokemonList)
   .enter()
   .append("circle")
   .attr("cx", function(d) {
         return Math.floor(xs(d.weight));
    })
    .attr("cy", function(d) {
         return Math.floor((h - (h - ys(d.stats[0].base_stat))));
    })
    .attr("r", function(d) {
         return d.height;
    })
    .attr("class", function(d) {
      let pokeclasses = ""
      for (let k = 0; k < d.types.length; k++){
        console.log(d.types[k].type.name)
        pokeclasses = pokeclasses + (d.types[k].type.name) + " "
      }
      return pokeclasses
    });

  svg.append('g')
    .attr("transform", "translate(0," + (h - margins.bottom) + ")")
    .call(xAxis)
  svg.append('g')
    .attr("transform", "translate(" + margins.left + ", 0)")
    .call(yAxis)



  };
};
