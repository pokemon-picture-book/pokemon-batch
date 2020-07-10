const axios = require('axios');
const { getLangId, filterLang } = require('./language');
const { toJSON } = require('./output');

const GENERATIONS = Object.freeze([
    { generationNo: 1, s: 0, e: 151 },
    { generationNo: 2, s: 151, e: 251 },
    { generationNo: 3, s: 251, e: 386 },
    { generationNo: 4, s: 386, e: 493 },
    { generationNo: 5, s: 493, e: 649 },
    { generationNo: 6, s: 649, e: 721 },
    { generationNo: 7, s: 721, e: 809 }
]);

const species = (
    pokemonId,
    {
        flavor_text_entries,
        genera,
        names
    }
) => {
    const pokemonFlavorTextEntries = flavor_text_entries
        // x バージョンのみのデータを取得する（日本語がある最新のバージョンのため）
        .filter(({ language, version }) => version.name === 'x' && filterLang({ language }))
        .map(({ flavor_text, language }) => ({
            pokemonId,
            flavorText: flavor_text,
            languageId: getLangId(language)
        }));

    const pokemonGeneras = genera
        .filter(filterLang)
        .map(({ language, genus }) => ({
            pokemonId,
            languageId: getLangId(language),
            genus
        }));

    const pokemonLangNames = names
        .filter(filterLang)
        .map(({ language, name }) => ({
            pokemonId,
            languageId: getLangId(language),
            name
        }));

    return {
        pokemonFlavorTextEntries,
        pokemonGeneras,
        pokemonLangNames
    };
}

const pokemonDetails = (
    pokemonId,
    {
        stats,
        types,
        height,
        weight,
        order,
        typeGroups,
        evolutions,
        color
    }
) =>  {
    const pokemonType = types.map(({ slot, type }) => ({
        pokemonId,
        order: slot,
        typeId: typeGroups.find(typeGroup => typeGroup.name === type.name).id
    }));

    const pokemonStatus = stats
        .map(({ stat, base_stat }) => {
            let key = stat.name;
            if (key === 'special-attack') {
                key = 'specialAttack';
            } else if (key === 'special-defense') {
                key = 'specialDefense';
            }
            return {
                [key]: base_stat
            }
        })
        .reduce((a, c) => Object.assign(a, c), { pokemonId });

    const { generationNo } = GENERATIONS.find(
        g => g.s < pokemonId && pokemonId <= g.e
    );

    const pokemonEvolution = evolutions.find(evolution => {
        const { fromId, toId } = evolution;
        return fromId === pokemonId || toId === pokemonId;
    });

    const pokemon = {
        id: pokemonId,
        height,
        weight,
        order,
        imageColor: color.name,
        regionId: generationNo,
        pokemonEvolutionId: pokemonEvolution?.pokemonEvolutionId || null
    }

    return {
        pokemonType,
        pokemonStatus,
        pokemon
    };
}

const getPokemonEvolutions = (pokemons, evolutions) => {
    const grouping = (targets) => {
        return targets
            .filter(target => !!target.pokemonEvolutionId)
            .reduce((accumulator, { pokemonEvolutionId, ...values }) => {
                return Object.assign(accumulator, {
                    [pokemonEvolutionId]: (accumulator[pokemonEvolutionId] || []).concat(values)
                });
            }, {});
    };

    const groupingPokemons = grouping(pokemons);
    const groupingEvolutions = grouping(evolutions);

    const keys = Array.from(
        new Set([...Object.keys(groupingPokemons), ...Object.keys(groupingEvolutions)])
    );

    return keys.flatMap(key => {
        const groupingPokemon = groupingPokemons[key] || [];
        const groupingEvolution = groupingEvolutions[key] || [];
        return groupingPokemon.flatMap(p =>
            groupingEvolution.map(e => ({
                pokemonId: p.id,
                evolutionId: e.id
            }))
        );
    });
}

exports.POKEMON_IDS = Object.freeze(
    [...Array(721)].map((_, i) => i + 1)
);

exports.pokemons = async (typeGroups, evolutions) => {
    let flavorTextEntries = [];
    let generas = [];
    let langNames = [];
    let pokemonTypes = [];
    const status = [];
    const pokemons = [];

    for(const pokemonId of this.POKEMON_IDS) {
        const apiSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`;

        const { data: specieData } = await axios
            .get(apiSpeciesUrl)
            .catch(console.error);

        const {
            pokemonFlavorTextEntries,
            pokemonGeneras,
            pokemonLangNames
        } = species(pokemonId, specieData);

        const apiPokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;

        const { data: pokemonData } = await axios
            .get(apiPokemonUrl)
            .catch(console.error);

        const {
            pokemonType,
            pokemonStatus,
            pokemon
        } = pokemonDetails(pokemonId, {
            ...pokemonData,
            typeGroups,
            evolutions,
            color: specieData.color
        });

        flavorTextEntries = flavorTextEntries.concat(pokemonFlavorTextEntries);
        generas = generas.concat(pokemonGeneras);
        langNames = langNames.concat(pokemonLangNames);
        pokemonTypes = pokemonTypes.concat(pokemonType);
        status.push(pokemonStatus);
        pokemons.push(pokemon);
    }

    const pokemonEvolutions = getPokemonEvolutions(pokemons, evolutions);

    toJSON(flavorTextEntries, 'flavor-text-entries');
    toJSON(generas, 'generas');
    toJSON(langNames, 'pokemon-names');
    toJSON(pokemonTypes, 'pokemon-types');
    toJSON(status, 'status');
    toJSON(pokemons, 'pokemons');
    toJSON(pokemonEvolutions, 'pokemon-evolutions');
}
