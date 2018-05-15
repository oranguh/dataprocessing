// Marco Heuvelman  10176306
//  https://www.pokeapi.co/

// Hover over for pokeman name and other info maybe
// colours for type. Maybe add legend
// size for height or something
// dropdown for more pokemon from API
// legend with filter function

// http://bl.ocks.org/d3noob/8324872
// https://www.youtube.com/watch?v=iZ6MSHA4FMU&index=14&list=PL6il2r9i3BqH9PmbOf5wA5E1wOG3FT22p
// http://d3indepth.com/layouts/

// var POKEDEX = 'https://pokeapi.co/api/v2/pokemon/';
var root

function getEvolution(pokeURL){

  // console.log("It works")
  // console.log(pokeURL.species.url)

  var svgTree = d3.select("body").select(".treeDiagram")

  var pokeTree
  let treeQueue = d3.queue();
  treeQueue.defer(d3.request, pokeURL.species.url)
  treeQueue.await(function(error, pokeSpecies) {
    if (error) throw error;
    pokeSpeci = JSON.parse(pokeSpecies.response)
    // console.log(pokeSpeci.evolution_chain.url)
    let treeQueue = d3.queue();
    treeQueue.defer(d3.request, pokeSpeci.evolution_chain.url)
    treeQueue.await(function(error, pokeEvoChain) {
      if (error) throw error;
        pokeChain = JSON.parse(pokeEvoChain.response)
        // console.log(pokeChain.chain)
        var pokeTree = {"name": "", "pokeID": "", "sprite": ""}
        function evoExploter(EvoChain, pokeTree){
          // console.log(EvoChain.evolves_to)
          // console.log(EvoChain.species.name);
          pokeTree.name = EvoChain.species.name;

          pokeTree.pokeID = EvoChain.species.url.substring(42).replace("/", '');
          // console.log(pokeTree.pokeID)
          let imageQueue = d3.queue();
          imageQueue.defer(d3.request, (POKEDEX + pokeTree.pokeID))
          imageQueue.await(function(error, spritefinder) {
            if (error) throw error;
            spritefound = JSON.parse(spritefinder.response)
            pokeTree.sprite = spritefound.sprites.front_default
            console.log(spritefound)
            pokeTree.weight = spritefound.weight
            pokeTree.speed = spritefound.stats[0].base_stat
            pokeTree.height = spritefound.height
            let typesString = ""
            for (let k = 0; k < spritefound.types.length; k++){
               // console.log(d.types[k].type.name)
               typesString = typesString + (spritefound.types[k].type.name) + " "
              }
            pokeTree.types = typesString
            TreeFresh()
          })

          let chainArray = EvoChain.evolves_to;
          if (chainArray.length === 0){
            return false
          }
          else{
            pokeTree.children = []
            for (let i = 0; i < chainArray.length; i++){
              // console.log(chainArray[i].species.name)
              // console.log(pokeTree)
              pokeTree.children.push({"name": "", "pokeID": "", "sprite": ""});
              // pokeTree.Evolutionz[i].name = chainArray[i].species.name;
              evoExploter(chainArray[i], pokeTree.children[i]);
            }
          }
        }
        evoExploter(pokeChain.chain, pokeTree)

        root = d3.hierarchy(pokeTree)

        d3.select(".treeDrawn").remove()
        drawTree(root)
      })
    });
}

function drawTree(root){

  var canvas = d3.select(".treeDiagram")
    .append("g")
      .attr("class", "treeDrawn");

  var treeLayout = d3.tree();
  treeLayout.size([wTree, hTree - 100]);
  treeLayout(root);

  var nodes = root.descendants()
  var links = root.links()


  // var node = canvas.selectAll(".node")
  //   .data(nodes)
  //   .enter()
  //   .append("g")
  //     .attr("class", "node")
      // .attr("transform", function(d){
      //   return ("translate("d.x + "," + d.y ")")
      // })

  var diagonal = d3.linkVertical();

  canvas.selectAll(".link")
    .data(links)
    .enter()
    .append("line")
    .attr("class", "link")
    // .attr("d", pathString)
    .attr("d", diagonal)
    .attr("fill", "none")
    .attr("stroke", "gray")
    .attr("stroke-width", 2)
    .attr('x1', function(d) {return d.source.x;})
    .attr('y1', function(d) {return d.source.y + 50;})
    .attr('x2', function(d) {return d.target.x;})
    .attr('y2', function(d) {return d.target.y + 50;})
    // .curve(d3.curveLinear);

  canvas.selectAll("image")
    .data(nodes)
    .enter()
    .append("image")
    .attr('xlink:href', function(d){
         return "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/79.png"
         })
    .attr('x', function(d) {return d.x - 50;})
    .attr('y', function(d) {return d.y ;})
    .attr("width", 100)
    .attr("height", 100)

    .on("mouseover", function(d) {
       // d3.select(this).moveToFront();
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
       });

}
function TreeFresh(){
  canvas = d3.select(".treeDiagram")
  canvas.selectAll("image")
    .attr('xlink:href', function(d){
      return d.data.sprite
    });

  treeLayout = d3.tree()
  treeLayout.size([wTree, hTree - 100]);
  treeLayout(root);


  canvas.selectAll(".link")
    .transition()
    .duration(700)
    .attr('x1', function(d) {return d.source.x;})
    .attr('y1', function(d) {return d.source.y + 50;})
    .attr('x2', function(d) {return d.target.x;})
    .attr('y2', function(d) {return d.target.y + 50;})

  canvas.selectAll("image")
    .transition()
    .duration(700)
    .attr('x', function(d) {return d.x - 50;})
    .attr('y', function(d) {return d.y ;})
}
