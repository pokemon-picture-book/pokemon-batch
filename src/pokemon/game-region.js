const { toJSON } = require('./output');

const relatedGameRegions = [
    {
        game: 'rgby',
        regionNames: ['kanto']
    },
    {
        game: 'gsc',
        regionNames: ['kanto', 'johto']
    },
    {
        game: 'rse',
        regionNames: ['kanto', 'johto', 'hoenn']
    },
    {
        game: 'frlg',
        regionNames: ['kanto', 'johto', 'hoenn']
    },
    {
        game: 'dp',
        regionNames: ['kanto', 'johto', 'hoenn', 'sinnoh']
    },
    {
        game: 'pt',
        regionNames: ['kanto', 'johto', 'hoenn', 'sinnoh']
    },
    {
        game: 'hgss',
        regionNames: ['kanto', 'johto', 'hoenn', 'sinnoh']
    },
    {
        game: 'bw',
        regionNames: ['kanto', 'johto', 'hoenn', 'sinnoh', 'unova']
    },
    {
        game: 'xy',
        regionNames: ['kanto', 'johto', 'hoenn', 'sinnoh', 'unova', 'kalos']
    },
    {
        game: 'oras',
        regionNames: ['kanto', 'johto', 'hoenn', 'sinnoh', 'unova', 'kalos']
    }
];

exports.gamesRegions = (gameVersionGroups, regions) => {
    const filteredGameVersionGroups = gameVersionGroups.filter(gameVersionGroup => gameVersionGroup.isSupported);

    const gamesRegions = relatedGameRegions.flatMap(relatedGameRegion => {
        const gameVersionGroup = filteredGameVersionGroups.find(gameVersionGroup => gameVersionGroup.alias === relatedGameRegion.game);
        return relatedGameRegion.regionNames.map(regionName => {
            const region = regions.find(region => region.name === regionName);
            return {
                gameVersionGroupId: gameVersionGroup.id,
                regionId: region.id
            }
        })
    }).map((gameRegion, i) => {
        return {
            id: i + 1,
            ...gameRegion
        }
    });

    toJSON(gamesRegions, 'games-regions');
}