const axios = require('axios');
const { getLangId, filterLang } = require('./language');
const { toJSON } = require('./output');

const getGameVersions = async () => {
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

            const gameVersionNames = names
                .filter(filterLang)
                .map(({ language, name }) => ({
                    gameVersionId: id,
                    name,
                    languageId: getLangId(language),
                }));

            return {
                gameVersion: {
                    id,
                    name
                },
                gameVersionNames
            }
        })
    );

    const [gameVersionTmps, gameVersionNames] = gameVersionObj.reduce((a, c) => {
        const [AccumulatorGameVersions, AccumulatorGameVersionNames] = a;
        const { gameVersion, gameVersionNames } = c;

        AccumulatorGameVersions.push(gameVersion);

        return [
            AccumulatorGameVersions,
            AccumulatorGameVersionNames.concat(gameVersionNames)
        ];
    }, [[], []]);

    console.log('===== Get game versions from pokeAPI =====');
    console.log(gameVersionTmps);
    console.log('=============================');
    console.log('===== Get game names from pokeAPI =====');
    console.log(gameVersionNames);
    console.log('=============================');
    const gameVersions = gameVersionTmps
        .filter(gameVersion => this.gameVersionGroups.some(({ groups }) => groups.includes(gameVersion.name)))
        .map(gameVersion => ({
            ...gameVersion,
            gameVersionGroupId: this.gameVersionGroups.find(({ groups }) => groups.includes(gameVersion.name)).id
        }));

    return {
        gameVersions,
        gameVersionNames
    };
}

exports.gameVersionGroups = Object.freeze([
    {
        id: 1,
        alias: 'rgby',
        isSupported: true,
        groups: ['red', 'blue', 'yellow']
    },
    {
        id: 2,
        alias: 'gsc',
        isSupported: true,
        groups: ['gold', 'silver', 'crystal']
    },
    {
        id: 3,
        alias: 'rse',
        isSupported: true,
        groups: ['ruby', 'sapphire', 'emerald']
    },
    {
        id: 4,
        alias: 'frlg',
        isSupported: true,
        groups: ['firered', 'leafgreen']
    },
    {
        id: 5,
        alias: 'dp',
        isSupported: true,
        groups: ['diamond', 'pearl']
    },
    {
        id: 6,
        alias: 'pt',
        isSupported: true,
        groups: ['platinum']
    },
    {
        id: 7,
        alias: 'hgss',
        isSupported: true,
        groups: ['heartgold', 'soulsilver']
    },
    {
        id: 8,
        alias: 'bw',
        isSupported: true,
        groups: ['black', 'white']
    },
    {
        id: 9,
        alias: 'c',
        isSupported: false,
        groups: ['colosseum']
    },
    {
        id: 10,
        alias: 'x',
        isSupported: false,
        groups: ['xd']
    },
    {
        id: 11,
        alias: 'bw2',
        isSupported: false,
        groups: ['black-2', 'white-2']
    },
    {
        id: 12,
        alias: 'xy',
        isSupported: true,
        groups: ['x', 'y']
    },
    {
        id: 13,
        alias: 'oras',
        isSupported: true,
        groups: ['omega-ruby', 'alpha-sapphire']
    },
    {
        id: 14,
        alias: 'sm',
        isSupported: false,
        groups: ['sun', 'moon']
    },
    {
        id: 15,
        alias: 'usum',
        isSupported: false,
        groups: ['ultra-sun', 'ultra-moon']
    }
]);

exports.games = async () => {
    const { gameVersions, gameVersionNames } = await getGameVersions();

    const gameVersionGroups = this.gameVersionGroups.map(gameVersionGroup => ({
        id: gameVersionGroup.id,
        alias: gameVersionGroup.alias,
        isSupported: gameVersionGroup.isSupported
    }));

    toJSON(gameVersionGroups, 'game-version-groups');
    toJSON(gameVersions, 'game-versions');
    toJSON(gameVersionNames, 'game-version-names');

    return {
        gameVersionGroups,
        gameVersions,
        gameVersionNames
    }
}