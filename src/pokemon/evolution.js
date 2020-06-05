const axios = require('axios');

const getPokemonId = ({ url }) => {
    const pokemonIdStr = url.split('/').filter(specie => !!specie).pop();
    if (isNaN(pokemonIdStr)) {
        throw new Error('pokemon id is NaN');
    }
    return Number(pokemonIdStr);
};

const getEvolution = (id, from, to) => {
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
    const evolutionId = 67; // イーブイ
    // const evolutionId = 1; // フシギダネ
    // const evolutionId = 18; // クサイ花
    const apiUrl = 'https://pokeapi.co/api/v2/evolution-chain';

    const { data } = await axios.get(`${apiUrl}/${evolutionId}`).catch(console.error);
    const { id, chain } = data;
    const { evolves_to, species } = chain;

    const results = evolves_to.reduce((a, c) => {
        return a.concat(getEvolution(id, species, c));
    }, []);

    console.log(results);
    return results;
}