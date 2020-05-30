const axios = require('axios');

const GENERATIONS = Object.freeze([
    { generationNo: 1, s: 0, e: 151 },
    { generationNo: 2, s: 151, e: 251 },
    { generationNo: 3, s: 251, e: 386 },
    { generationNo: 4, s: 386, e: 493 },
    { generationNo: 5, s: 493, e: 649 },
    { generationNo: 6, s: 649, e: 721 },
    { generationNo: 7, s: 721, e: 809 }
]);

const getLangId = (languages, language) =>
    languages.find(({ name }) => name === language.name).id;

const getGameVersionGroupId = (gameVersionGroups, gameVersionGroup) =>
    gameVersionGroups.find(({ name }) => name === gameVersionGroup.name).id;

const pokemons = async (languages, gameVersionGroups) => {
    const pokemonId = 1;
    const apiSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`;

    const { data: speciesData } = await axios
        .get(apiSpeciesUrl)
        .catch(console.error);

    const {
        flavor_text_entries,
        genera,
        names,
        color
    } = speciesData;

    const pokemonFlavorTextEntries = flavor_text_entries.map(({ flavor_text, language, version }) => ({
        pokemonId,
        flavorText: flavor_text,
        languageId: getLangId(languages, language),
        gameVersionGroupId: getGameVersionGroupId(gameVersionGroups, version)
    }));
    console.log('flavor_text_entries');
    console.log(pokemonFlavorTextEntries);
    console.log('==============================');

    const pokemonGeneras = genera.map(({ language, genus }) => ({
        pokemonId,
        languageId: getLangId(languages, language),
        genus
    }));
    console.log('generas');
    console.log(pokemonGeneras);
    console.log('==============================');

    const pokemonLangNames = names.map(({ language, name }) => ({
        pokemonId,
        languageId: getLangId(languages, language),
        name
    }));
    console.log('names');
    console.log(pokemonLangNames);
    console.log('==============================');


    const apiPokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;

    const { data: pokemonData } = await axios
        .get(apiPokemonUrl)
        .catch(console.error);

    const {
        stats,
        types,
        height,
        weight,
        order,
    } = pokemonData;

    const pokemonType = types.map(({ slot, type }) => ({
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
        pokemonId,
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
        pokemonFlavorTextEntries,
        pokemonGeneras,
        pokemonLangNames,
        pokemonType,
        pokemonStatus,
        pokemon
    };
}

const gameVersions = async (languages) => {
    const apiUrl = 'https://pokeapi.co/api/v2/version';

    const { data } = await axios
        .get(apiUrl)
        .catch(console.error);

    const gameVersionObj = await Promise.all(
        [...Array(data.count)].map(async (_, i) => {
            const { data } = await axios
                .get(`${apiUrl}/${i + 1}`)
                .catch(console.error);

            const { id, name, names } = data;

            const gameVersions = names.map(({ language, name }) => ({
                gameVersionGroupId: id,
                name,
                languageId: getLangId(languages, language),
            }));

            return {
                gameVersionGroup: {
                    id,
                    name
                },
                gameVersions
            }
        })
    );

    const [gameVersionGroups, gameVersions] = gameVersionObj.reduce((a, c) => {
        const [AccumulatorGameVersion, AccumulatorGameVersionLangs] = a;
        const { gameVersionGroup, gameVersions } = c;

        AccumulatorGameVersion.push(gameVersionGroup);

        return [
            AccumulatorGameVersion,
            AccumulatorGameVersionLangs.concat(gameVersions)
        ];
    }, [[], []]);

    console.log('game_version_groups');
    console.log(gameVersionGroups);
    console.log('==============================');

    console.log('game_versions');
    console.log(gameVersions);
    console.log('==============================');

    return {
        gameVersionGroups,
        gameVersions
    };
}

const languages = () => {
    const languages = [
        { id: 1, name: 'zh-Hans' },
        { id: 2, name: 'ja' },
        { id: 3, name: 'en' },
        { id: 4, name: 'it' },
        { id: 5, name: 'es' },
        { id: 6, name: 'de' },
        { id: 7, name: 'fr' },
        { id: 8, name: 'zh-Hant' },
        { id: 9, name: 'ko' },
        { id: 10, name: 'roomaji' },
        { id: 11, name: 'ja-Hrkt' },
    ];

    console.log('language');
    console.log(languages);
    console.log('==============================');

    return languages;
}

const types = async (languages) => {
    const apiUrl = 'https://pokeapi.co/api/v2/type';

    const { data } = await axios
        .get(apiUrl)
        .catch(console.error);

    const results = await Promise.all(
        data.results.map(async result => {
            const { data } = await axios.get(result.url).catch(console.error);
            const { id, name, names } = data;

            const types = names.map(({ language, name }) => ({
                typeGroupId: id,
                name,
                languageId: getLangId(languages, language),
            }));

            return {
                typeGroups: {
                    id,
                    name
                },
                types
            };
        })
    );

    const [typeGroups, types] = results.reduce((a, c) => {
        const [AccumulatorTypeGroups, AccumulatorTypes] = a;
        const { typeGroups, types } = c;

        AccumulatorTypeGroups.push(typeGroups);

        return [
            AccumulatorTypeGroups,
            AccumulatorTypes.concat(types)
        ];
    }, [[], []]);

    console.log('typeGroups');
    console.log(typeGroups);
    console.log('==============================');
    console.log('types');
    console.log(types);
    console.log('==============================');

    return {
        typeGroups,
        types
    }
}

const regions = async (languages) => {
    const apiUrl = 'https://pokeapi.co/api/v2/region';

    const { data } = await axios
        .get(apiUrl)
        .catch(console.error);

    const results = await Promise.all(
        data.results.map(async result => {
            const { data } = await axios.get(result.url).catch(console.error);

            // TODO locations も管理したい
            const { id, name, names } = data;

            const regions = names.map(({ language, name }) => ({
                regionGroupId: id,
                name,
                languageId: getLangId(languages, language),
            }));

            return {
                regionGroups: {
                    id,
                    name
                },
                regions
            };
        })
    );

    const [regionGroups, regions] = results.reduce((a, c) => {
        const [AccumulatorRegionGroups, AccumulatorRegions] = a;
        const { regionGroups, regions } = c;

        AccumulatorRegionGroups.push(regionGroups);

        return [
            AccumulatorRegionGroups,
            AccumulatorRegions.concat(regions)
        ];
    }, [[], []]);

    console.log('regionGroups');
    console.log(regionGroups);
    console.log('==============================');
    console.log('regions');
    console.log(regions);
    console.log('==============================');

    return {
        regionGroups,
        regions
    }
}

// 進化情報に関する情報をまとめる
// from_pokemon_id, to_pokemon_id, trigger, trigger_type
// 1, 2, 16, level-up
// 2, 3, 32, level-up
// 44, 182, sun-stone, use-item
// 44, 45, leaf-stone, use-item
const evolution = async () => {
    // const evolutionId = 214; // ミツハニー
    // const evolutionId = 200; // レックウザ
    const evolutionId = 67; // イーブイ
    // const evolutionId = 1; // フシギダネ
    // const evolutionId = 18; // クサイ花
    const apiUrl = 'https://pokeapi.co/api/v2/evolution-chain';

    const { data } = await axios.get(`${apiUrl}/${evolutionId}`).catch(console.error);
    const { id, chain } = data;
    const { evolves_to, species } = chain;

    const getPokemonId = ({ url }) => {
        const pokemonIdStr = url.split('/').filter(specie => !!specie).pop();
        if (isNaN(pokemonIdStr)) {
            throw new Error('pokemon id is NaN');
        }
        return Number(pokemonIdStr);
    };

    const getEvolution = (from, to) => {
        const evolutions = to.evolution_details.map(detail => {
            const { trigger, ...itemObj } = detail;

            const evolution = {
                pokemon_evolution_id: id,
                fromId: getPokemonId(from),
                toId: getPokemonId(to.species),
                trigger: trigger.name
            };

            let detailIndex = 0;
            Object.keys(itemObj).forEach(key => {
                if (itemObj[key]) {
                    detailIndex++;

                    delete itemObj[key]['url'];

                    Object.assign(evolution, { [`detail_${detailIndex}`]: JSON.stringify({ [key]: itemObj[key] }) });
                }
            });
            return evolution;
        });

        if (to.evolves_to.length) {
            return evolutions
                .concat(to.evolves_to.map(ee => getEvolution(to.species, ee)))
                .flat();
        }
        return evolutions;
    }

    const results = evolves_to.reduce((a, c) => {
        return a.concat(getEvolution(species, c));
    }, []);

    console.log(results);
    return results;
}

(async () => {
    const langObj = languages();
    const gameVersionObj = await gameVersions(langObj);
    await pokemons(langObj, gameVersionObj.gameVersionGroups);
    await types(langObj);
    await regions(langObj);
    await evolution();
})();