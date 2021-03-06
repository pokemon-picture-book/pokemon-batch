const axios = require('axios');
const { toJSON } = require('./output');
const{ POKEMON_IDS } = require('./pokemon');

const getPokemonId = ({ url }) => {
    const pokemonIdStr = url.split('/').filter(specie => !!specie).pop();
    if (isNaN(pokemonIdStr)) {
        throw new Error('pokemon id is NaN');
    }
    return Number(pokemonIdStr);
};

const getEvolution = (id, from, to) => {
    const fromId = getPokemonId(from);
    const toId = getPokemonId(to.species);

    if (!(POKEMON_IDS.includes(fromId) && POKEMON_IDS.includes(toId))) {
        return [];
    }

    const evolutions = to.evolution_details.map(detail => {
        const { trigger, ...itemObj } = detail;

        const evolution = {
            pokemonEvolutionId: id,
            fromId,
            toId,
            trigger: trigger.name
        };

        let detailIndex = 0;
        Object.keys(itemObj).forEach(key => {
            if (itemObj[key]) {
                detailIndex++;

                delete itemObj[key]['url'];

                Object.assign(evolution, { [`detail${detailIndex}`]: JSON.stringify({ [key]: itemObj[key] }) });
            }
        });
        return evolution;
    });

    if (to.evolves_to.length) {
        return evolutions
            .concat(to.evolves_to.map(ee => getEvolution(id, to.species, ee)))
            .flat();
    }
    return evolutions;
}

// 進化情報に関する情報をまとめる
// from_pokemon_id, to_pokemon_id, trigger, trigger_type
// 1, 2, 16, level-up
// 2, 3, 32, level-up
// 44, 182, sun-stone, use-item
// 44, 45, leaf-stone, use-item
exports.evolutions = async () => {
    // ===== MAX CHAIN ID 419 =====
    // const evolutionId = 214; // ミツハニー
    // const evolutionId = 200; // レックウザ
    // const evolutionId = 67; // イーブイ
    // const evolutionId = 1; // フシギダネ
    // const evolutionId = 18; // クサイ花
    const apiUrl = 'https://pokeapi.co/api/v2/evolution-chain';

    let evolutions = [];

    const evolutionIds = [...Array(419)].map((_, i) => i + 1);
    for (const evolutionId of evolutionIds) {
        const { data } = await axios
            .get(`${apiUrl}/${evolutionId}`)
            .catch(err => {
                const { status } = err.response;
                if (status !== 404) {
                    throw err;
                }
                return { data: null }
            });

        if (!data) {
            continue;
        }

        const { id, chain } = data;
        const { evolves_to, species } = chain;

        const results = evolves_to.reduce((a, c) => {
            return a.concat(getEvolution(id, species, c));
        }, []);

        evolutions = evolutions.concat(results);
    }

    const evolutionData = evolutions.map((evolution, i) => ({
        id: i + 1,
        ...evolution
    }))

    toJSON(evolutionData, 'evolutions');

    return evolutionData;
}