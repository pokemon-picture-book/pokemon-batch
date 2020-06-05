const { evolutions } = require('./evolution');
const { languages } = require('./language');
const { pokemons } = require('./pokemon');
const { gameVersions } = require('./game');
const { types } = require('./type');
const { regions } = require('./region');
const { images } = require('./image');

(async () => {
    // languages();
    images();
    // await gameVersions();
    // await pokemons();
    // await types();
    // await regions();
    // await evolutions();

    // TASK LIST
    // 1. 画像情報とゲームの紐付け
    // 2. 全てのポケモン情報を取得
    // 3. JSONファイルへの吐き出し
})();