const { evolutions } = require('./evolution');
const { languages } = require('./language');
const { pokemons } = require('./pokemon');
const { games } = require('./game');
const { types } = require('./type');
const { regions } = require('./region');
const { images } = require('./image');

(async () => {
    languages();

    images();

    await games();

    const typeData = await types();

    const evolutionData = await evolutions();

    await pokemons(typeData.types, evolutionData);

    await regions();
})();