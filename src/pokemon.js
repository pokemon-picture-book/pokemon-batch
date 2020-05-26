const axios = require('axios');

const species = async () => {
    const pokemonId = 1;
    const apiUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`;

    const { data } = await axios
        .get(apiUrl)
        .catch(console.error);

    const {
        flavor_text_entries,
        genera,
        names
    } = data;

    console.log('flavor_text_entries');
    const pokemonFlavorTextEntries = flavor_text_entries.map(({ flavor_text, language, version }) => ({
        pokemonId,
        flavorText: flavor_text,
        language: language.name,
        version: version.name
    }));
    console.log(pokemonFlavorTextEntries);
    console.log('==============================');

    console.log('generas');
    const pokemonGeneras = genera.map(({ language, genus }) => ({
        pokemonId,
        language: language.name,
        genus
    }));
    console.log(pokemonGeneras);
    console.log('==============================');

    console.log('names');
    const pokemonLangNames = names.map(({ language, name }) => ({
        pokemonId,
        language: language.name,
        name
    }));
    console.log(pokemonLangNames);
    console.log('==============================');
}

const gameVersions = async () => {
    const apiUrl = 'https://pokeapi.co/api/v2/version';

    const { data } = await axios
        .get(apiUrl)
        .catch(console.error);

    const gameVersions = await Promise.all(
        [...Array(data.count)].map(async (_, i) => {
            const { data } = await axios
                .get(`${apiUrl}/${i + 1}`)
                .catch(console.error);

            const { id, name, names } = data;

            const gameVersionLangs = names.map(({ language, name }) => ({
                gameVersionId: id,
                name,
                language: language.name
            }));

            return {
                gameVersion: {
                    id,
                    name
                },
                gameVersionLangs
            }
        })
    );

    const [gameVersion, gameVersionLangs] = gameVersions.reduce((a, c) => {
        const [AccumulatorGameVersion, AccumulatorGameVersionLangs] = a;
        const { gameVersion, gameVersionLangs } = c;

        AccumulatorGameVersion.push(gameVersion);

        return [
            AccumulatorGameVersion,
            AccumulatorGameVersionLangs.concat(gameVersionLangs)
        ];
    }, [[], []]);

    console.log('game_version_groups');
    console.log(gameVersion);
    console.log('==============================');

    console.log('game_versions');
    console.log(gameVersionLangs);
    console.log('==============================');
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
}

const types = async () => {
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
                language: language.name
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
}

const pokemons = async () => {
    const pokemonId = 1;

    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;

    const { data } = await axios
        .get(apiUrl)
        .catch(console.error);

    const {
        stats,
        types,
        height,
        weight,
        order,
        name,
    } = data;

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

    const pokemon = {
        pokemonId,
        height,
        weight,
        order,
        name
    }

    console.log('pokemons');
    console.log(pokemon);
    console.log('==============================');
}

const region = async () => {
    const apiUrl = 'https://pokeapi.co/api/v2/region';

    const { data } = await axios
        .get(apiUrl)
        .catch(console.error);

    const result = await axios.get(data.results[0].url).catch(console.error);
    console.log(result.data);

    // const results = await Promise.all(
    //     data.results.map(async result => {
    //         const { data } = await axios.get(result.url).catch(console.error);
    //         const { id, name, names } = data;

    //         const types = names.map(({ language, name }) => ({
    //             typeGroupId: id,
    //             name,
    //             language: language.name
    //         }));

    //         return {
    //             typeGroups: {
    //                 id,
    //                 name
    //             },
    //             types
    //         };
    //     })
    // );

    // const [typeGroups, types] = results.reduce((a, c) => {
    //     const [AccumulatorTypeGroups, AccumulatorTypes] = a;
    //     const { typeGroups, types } = c;

    //     AccumulatorTypeGroups.push(typeGroups);

    //     return [
    //         AccumulatorTypeGroups,
    //         AccumulatorTypes.concat(types)
    //     ];
    // }, [[], []]);

    // console.log('typeGroups');
    // console.log(typeGroups);
    // console.log('==============================');
    // console.log('types');
    // console.log(types);
    // console.log('==============================');
}

(async () => {
    // await species();
    // await gameVersions();
    // await languages();
    // await types();
    // await pokemons();
    await region();
})();