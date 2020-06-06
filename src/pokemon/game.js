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

    const gameVersions = gameVersionTmps.map(gameVersion => ({
        ...gameVersion,
        gameVersionGroupId: this.gameVersionGroups.find(gameVersionGroup =>
            gameVersionGroup.groups.includes(gameVersion.name)).id
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
        groups: ['red', 'blue', 'yellow']
    },
    {
        id: 2,
        alias: 'gsc',
        groups: ['gold', 'silver', 'crystal']
    },
    {
        id: 3,
        alias: 'rse',
        groups: ['ruby', 'sapphire', 'emerald']
    },
    {
        id: 4,
        alias: 'frlg',
        groups: ['firered', 'leafgreen']
    },
    {
        id: 5,
        alias: 'dp',
        groups: ['diamond', 'pearl']
    },
    {
        id: 6,
        alias: 'pt',
        groups: ['platinum']
    },
    {
        id: 7,
        alias: 'hgss',
        groups: ['heartgold', 'soulsilver']
    },
    {
        id: 8,
        alias: 'bw',
        groups: ['black', 'white']
    },
    {
        id: 9,
        alias: 'c',
        groups: ['colosseum']
    },
    {
        id: 10,
        alias: 'x',
        groups: ['xd']
    },
    {
        id: 11,
        alias: 'bw2',
        groups: ['black-2', 'white-2']
    },
    {
        id: 12,
        alias: 'xy',
        groups: ['x', 'y']
    },
    {
        id: 13,
        alias: 'oras',
        groups: ['omega-ruby', 'alpha-sapphire']
    },
    {
        id: 14,
        alias: 'sm',
        groups: ['sun', 'moon']
    },
    {
        id: 15,
        alias: 'usum',
        groups: ['ultra-sun', 'ultra-moon']
    }
]);

exports.games = async () => {
    const { gameVersions, gameVersionNames } = await getGameVersions();

    const gameVersionGroups = this.gameVersionGroups.map(gameVersionGroup => ({
        id: gameVersionGroup.id,
        alias: gameVersionGroup.alias
    }));

    toJSON(gameVersionGroups, 'game-version-groups');
    toJSON(gameVersions, 'game-versions');
    toJSON(gameVersionNames, 'game-version-names');
}