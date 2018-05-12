



function getEvolution(pokeURL){

  console.log("It works")
  console.log(pokeURL.species.url)

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
        // console.log(pokeChain.chain)



        function evoExploter(EvoChain){
          // console.log(EvoChain.evolves_to)
          console.log(EvoChain.species.name)
          let chainArray = EvoChain.evolves_to;

          if (chainArray.length === 0){
            return false
          }
          else{
            for (let i = 0; i < chainArray.length; i++){
              // console.log(chainArray[i].species.name)
              evoExploter(chainArray[i])
            }
          }
        }

        evoExploter(pokeChain.chain)


      })
    }
  );


}
