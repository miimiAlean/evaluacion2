document.addEventListener("DOMContentLoaded", () => {
    const buttonSearch = document.querySelector(".buttonSearch");
    const inputSearch = document.querySelector("#in1");
    const containerError = document.querySelector(".containerError");
    const containerInfo = document.querySelector(".containerInfo");
    const pokemonNameElement = document.querySelector(".pokemonName");
    const pokemonImgElement = document.querySelector(".pokemonImg");
    const pokemonTypeElement = document.querySelector(".pokemonType");
    const pokemonDescritionElement = document.querySelector(".pokemonDescrition");
    const pokemonAbilitiesElement = document.querySelector(".pokemonAbilities");
    const buttonEvolution = document.querySelector(".buttonEvolution");

    buttonSearch.addEventListener("click", async () => {
        const pokemonName = inputSearch.value.toLowerCase().trim();

        if (pokemonName === "") {
            containerError.style.display = "block";
            containerInfo.style.display = "none";
            return;
        }

        try {
            const pokemonData = await getPokemon(pokemonName);
            const evolutionName = await validateEvolution(pokemonData.id);
            const pokemon = {
                name: pokemonData.name,
                sprite: pokemonData.sprites.front_default,
                type: pokemonData.types[0].type.name,
                description: `${pokemonData.name} es un Pokémon de tipo '${pokemonData.types[0].type.name}'`,
                abilities: pokemonData.abilities.map(ability => ability.ability.name),
                evolution: evolutionName
            };

            displayPokemonInfo(pokemon);
            containerError.style.display = "none";
            containerInfo.style.display = "block";
        } catch (error) {
            containerError.style.display = "block";
            containerInfo.style.display = "none";
        }
    });

    const getPokemon = async (pokemonName) => {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        return response.data;
    };

    const validateEvolution = async (pokemonId, pokemonName) => {
        try {
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
            const evolutionUrl = response.data.evolution_chain.url;
            const evolutionResponse = await axios.get(evolutionUrl);
            const evolutionData = evolutionResponse.data;
            return hasEvolution(evolutionData, pokemonName) ? evolutionData.chain.evolves_to[0].species.name : null;
        } catch (error) {
            console.error(error);
            throw new Error(`Error al consultar la evolución del Pokémon: ${pokemonId}`);
        }
    };

    const hasEvolution = (evolutionChain, pokemonName) => {
        if (evolutionChain.chain.evolves_to.length === 0) {
            return false;
        }
        const evolvesToName = evolutionChain.chain.evolves_to[0].species.name;
        console.log("Nombre del Pokémon:", pokemonName);
        console.log("Nombre de la evolución:", evolvesToName);
        return evolvesToName !== pokemonName;
    };
    

    const displayPokemonInfo = (pokemon) => {
        pokemonNameElement.textContent = `Nombre: ${pokemon.name}`;
        pokemonImgElement.src = pokemon.sprite;
        pokemonTypeElement.textContent = `Tipo: ${pokemon.type}`;
        pokemonDescritionElement.textContent = `Descripción: ${pokemon.description}`;
        pokemonAbilitiesElement.textContent = `Habilidades: ${pokemon.abilities.join(", ")}`;
    
        // Verificar si el Pokémon tiene evolución
        if (pokemon.evolution) {
            buttonEvolution.style.display = "block"; 
            buttonEvolution.textContent = `Evolucionar a: ${pokemon.evolution}`;
        } else {
            buttonEvolution.style.display = "none"; 
        }
    };
});



