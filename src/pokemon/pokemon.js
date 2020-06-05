const axios = require('axios');
const { getLangId, filterLang } = require('./language');

const POKEMON_IDS = Object.freeze(
    [...Array(721)].map((_, i) => i + 1)
);

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
    console.log('flavor_text_entries');
    console.log(pokemonFlavorTextEntries);
    console.log('==============================');

    const pokemonGeneras = genera
        .filter(filterLang)
        .map(({ language, genus }) => ({
            pokemonId,
            languageId: getLangId(language),
            genus
        }));
    console.log('generas');
    console.log(pokemonGeneras);
    console.log('==============================');

    const pokemonLangNames = names
        .filter(filterLang)
        .map(({ language, name }) => ({
            pokemonId,
            languageId: getLangId(language),
            name
        }));
    console.log('names');
    console.log(pokemonLangNames);
    console.log('==============================');
}

const pokemonDetails = (
    pokemonId,
    {
        stats,
        types,
        height,
        weight,
        order,
        color
    }
) =>  {
    const pokemonType = types.map(({ slot, type }) => ({
        pokemonId,
        order: slot,
        type: type.name
    }));

    console.log('pokemon_types');
    console.log(pokemonType);
    console.log('==============================');

    const pokemonStatus = stats
        .map(({ stat, base_stat }) => {
            return {
                [stat.name]: base_stat
            }
        })
        .reduce((a, c) => Object.assign(a, c), { pokemonId: 1 });

    console.log('status');
    console.log(pokemonStatus);
    console.log('==============================');

    const { generationNo } = GENERATIONS.find(
        g => g.s < pokemonId && pokemonId <= g.e
    );

    const pokemon = {
        id: pokemonId,
        height,
        weight,
        order,
        imageColor: color.name,
        generationNo
    }

    console.log('pokemons');
    console.log(pokemon);
    console.log('==============================');

    return {
        pokemonType,
        pokemonStatus,
        pokemon
    };
}

exports.pokemons = async () => {
    const pokemonId = 1;
    const apiSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`;

    const { data: specieData } = await axios
        .get(apiSpeciesUrl)
        .catch(console.error);

    species(pokemonId, specieData);

    const apiPokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;

    const { data: pokemonData } = await axios
        .get(apiPokemonUrl)
        .catch(console.error);

    pokemonDetails(pokemonId, {
        ...pokemonData,
        color: specieData.color
    });
}
