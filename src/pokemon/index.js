const { evolutions } = require('./evolution');
const { languages } = require('./language');
const { pokemons } = require('./pokemon');
const { gamesRegions } = require('./game-region');
const { games } = require('./game');
const { types } = require('./type');
const { regions } = require('./region');
const { images } = require('./image');

(async () => {
    languages();

    images();

    const { gameVersionGroups } = await games();

    const typeData = await types();

    const evolutionData = await evolutions();

    await pokemons(typeData.types, evolutionData);

    const { regions: regionData } = await regions();

    await gamesRegions(gameVersionGroups, regionData);
})();