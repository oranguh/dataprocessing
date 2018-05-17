/*
Marco Heuvelman  10176306
data source https://www.pokeapi.co/

Function which fires after a mouse click event on a pokemon
Calls API for extra pokemon data regarding evolution and creates tree figure
Uses d3.hierarchy() to convert data into correct format for d3.tree()

Inspiration to make tree graph from following links
http://bl.ocks.org/d3noob/8324872
https://www.youtube.com/watch?v=iZ6MSHA4FMU&index=14&list=PL6il2r9i3BqH9PmbOf5wA5E1wOG3FT22p
http://d3indepth.com/layouts/
*/

// global variable root to determine if tree is initialized
var root

function getEvolution(pokeURL){
  var svgTree = d3.select("body").select(".treeDiagram")
  var pokeTree
  // queries the "species page" for the clicked pokemon
  let treeQueue = d3.queue();
  treeQueue.defer(d3.request, pokeURL.species.url)
  treeQueue.await(function(error, pokeSpecies) {
    if (error) throw error;
    pokeSpeci = JSON.parse(pokeSpecies.response)
    // From the "species page" find the "evolution page" and query again
    let treeQueue = d3.queue();
    treeQueue.defer(d3.request, pokeSpeci.evolution_chain.url)
    treeQueue.await(function(error, pokeEvoChain) {
      if (error) throw error;
      // Once inside the "evolution page" recursively explore the json object
      pokeChain = JSON.parse(pokeEvoChain.response)
      // root element for evolution tree
      var pokeTree = {"name": "", "pokeID": "", "sprite": ""}
      // recursive function to populate tree
      evoExplorer(pokeChain.chain, pokeTree)
      // from the datastructure use d3.hierarchy
      root = d3.hierarchy(pokeTree)
      // remove any previously drawn tree
      d3.select(".treeDrawn").remove()
      // draw tree with d3.hierarchy data
      drawTree(root)
    })
  });
}
function drawTree(root){
  // creates g element
  var canvas = d3.select(".treeDiagram")
    .append("g")
      .attr("class", "treeDrawn");
  var treeLayout = d3.tree();
  treeLayout.size([wTree, hTree - 100]);
  treeLayout(root);
  var nodes = root.descendants()
  var links = root.links()
  var diagonal = d3.linkVertical();
  canvas.selectAll(".treeLink")
    .data(links)
    .enter()
    .append("line")
    .attr("class", "treeLink")
    .attr("d", diagonal)
    .attr("fill", "none")
    .attr("stroke", "gray")
    .attr("stroke-width", 2)
    .attr('x1', function(d) {return d.source.x;})
    .attr('y1', function(d) {return d.source.y + 50;})
    .attr('x2', function(d) {return d.target.x;})
    .attr('y2', function(d) {return d.target.y + 50;})
  canvas.selectAll("image")
    .data(nodes)
    .enter()
    .append("image")
    .attr("class", "treeImage")
    .attr('xlink:href', function(d){
          return "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/79.png"
         })
    .attr('x', function(d) {return d.x - 50;})
    .attr('y', function(d) {return d.y ;})
    .attr("width", 100)
    .attr("height", 100)
    .on("mouseover", function(d) {
       let tooltipinfo = d.data.name + "<br/>" + "weight: " + d.data.weight
                                + "<br/>" + "speed: " + d.data.speed
                                + "<br/>" + "height: " + d.data.height
                                + "<br/>" + "type(s): " + d.data.types
       d3.select("body").select(".tooltip").transition()
         .duration(200)
         .style("opacity", .9);
       d3.select("body").select(".tooltip").html(tooltipinfo)
         .style("left", (d3.event.pageX) + "px")
         .style("top", (d3.event.pageY - 28) + "px");
       })
    .on("mouseout", function(d) {
       d3.select("body").select(".tooltip").transition()
         .duration(500)
         .style("opacity", 0);
       })
    .on("click", function(d) { window.open(POKEWIKI + d.data.name);
       });
}
// refresh function
function TreeFresh(){
  if (root){
    canvas = d3.select(".treeDiagram")
    // placing this .attr update here somehow fixes the sprite name bug
    canvas.selectAll("image")
      .attr('xlink:href', function(d){
        if (d.data.sprite){
          return d.data.sprite
        }
        else {
          return "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/79.png"
        }
      });
    treeLayout = d3.tree()
    treeLayout.size([wTree, hTree - 100]);
    treeLayout(root);
    // updates positional information for tree
    canvas.selectAll(".treeLink")
      .transition()
      .duration(700)
      .attr('x1', function(d) {return d.source.x;})
      .attr('y1', function(d) {return d.source.y + 50;})
      .attr('x2', function(d) {return d.target.x;})
      .attr('y2', function(d) {return d.target.y + 50;})
    canvas.selectAll(".treeImage")
      .transition()
      .duration(700)
      .attr('x', function(d) {return d.x - 50;})
      .attr('y', function(d) {return d.y ;})
  }
}
// evoExplorer is a recursive function which creates a tree datastructure
// for pokemon evolutions
function evoExplorer(EvoChain, pokeTree){
  // For each node in the tree fill: name, pokemon-ID
  pokeTree.name = EvoChain.species.name;
  pokeTree.pokeID = EvoChain.species.url.substring(42).replace("/", '');
  // For each pokemon ask query the API for their page to get their details
  let imageQueue = d3.queue();
  imageQueue.defer(d3.request, (POKEDEX + pokeTree.pokeID))
  imageQueue.await(function(error, spritefinder) {
    if (error) throw error;
    // updates pokemon details for tooltip and sprite
    spritefound = JSON.parse(spritefinder.response)
    pokeTree.sprite = spritefound.sprites.front_default
    pokeTree.weight = spritefound.weight
    pokeTree.speed = spritefound.stats[0].base_stat
    pokeTree.height = spritefound.height
    let typesString = ""
    for (let k = 0; k < spritefound.types.length; k++){
       typesString = typesString + (spritefound.types[k].type.name) + " "
    }
    pokeTree.types = typesString
    // Once this event is fulfilled refresh the tree
    TreeFresh()
  })
  let chainArray = EvoChain.evolves_to;
  // Stop condition for recursive function
  if (chainArray.length === 0){
    return false
  }
  else{
    pokeTree.children = []
    for (let i = 0; i < chainArray.length; i++){
      // pre-allocate element in tree
      pokeTree.children.push({"name": "", "pokeID": "", "sprite": ""});
      evoExplorer(chainArray[i], pokeTree.children[i]);
    }
  }
}
