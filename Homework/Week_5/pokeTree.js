// Marco Heuvelman  10176306
//  https://www.pokeapi.co/

// Hover over for pokeman name and other info maybe
// colours for type. Maybe add legend
// size for height or something
// dropdown for more pokemon from API
// legend with filter function

// http://bl.ocks.org/d3noob/8324872
// https://www.youtube.com/watch?v=iZ6MSHA4FMU&index=14&list=PL6il2r9i3BqH9PmbOf5wA5E1wOG3FT22p

// var POKEDEX = 'https://pokeapi.co/api/v2/pokemon/';

function getEvolution(pokeURL){

  // console.log("It works")
  // console.log(pokeURL.species.url)

  var svgTree = d3.select("body").select(".treeDiagram")


  let treeQueue = d3.queue();
  treeQueue.defer(d3.request, pokeURL.species.url)
  treeQueue.await(function(error, pokeSpecies) {
    if (error) throw error;

    // console.log(pokeSpecies.response)
    pokeSpeci = JSON.parse(pokeSpecies.response)
    // console.log(pokeSpeci.evolution_chain.url)

    let treeQueue = d3.queue();
    treeQueue.defer(d3.request, pokeSpeci.evolution_chain.url)
    treeQueue.await(function(error, pokeEvoChain) {
      if (error) throw error;
        pokeChain = JSON.parse(pokeEvoChain.response)
        console.log(pokeChain.chain)


        var pokeTree = {"name": "", "Evolutionz": [], "pokeID": "", "imageURL": ""}

        function evoExploter(EvoChain, pokeTree){
          // console.log(EvoChain.evolves_to)
          console.log(EvoChain.species.name);
          pokeTree.name = EvoChain.species.name;
          pokeTree.pokeID = EvoChain.species.url.substring(42,44);

          let imageQueue = d3.queue();
          imageQueue.defer(d3.request, POKEDEX + pokeTree.pokeID)
          imageQueue.await(function(error, spritefinder) {
            if (error) throw error;
            spritefound = JSON.parse(spritefinder.response)
            pokeTree.imageURL = spritefound.sprites.front_default
          })

          let chainArray = EvoChain.evolves_to;
          if (chainArray.length === 0){
            return false
          }
          else{
            for (let i = 0; i < chainArray.length; i++){
              // console.log(chainArray[i].species.name)
              // console.log(pokeTree)
              pokeTree.Evolutionz.push({"name": "", "Evolutionz": []});
              // pokeTree.Evolutionz[i].name = chainArray[i].species.name;
              evoExploter(chainArray[i], pokeTree.Evolutionz[i]);
            }
          }
        }
        evoExploter(pokeChain.chain, pokeTree)
        console.log(pokeTree)
      })
    }
  );


}
