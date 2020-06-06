const fs = require('fs');
const { clientSetup, imageDownload } = require('./download');

const POKEMON_JSON_DIR = `${process.env.PWD}/../pokemon.json`;
const POKEMON_ID = process.argv[2];
const UNOWN_NAME = process.argv[3];

(async () => {
    if (!fs.existsSync(POKEMON_JSON_DIR)) {
        throw new Error('npm script で実行してください。また pokemon.json プロジェクトをクローンしてください。');
    }

    if (!POKEMON_ID) {
        throw new Error('コマンドライン引数を指定してください。');
    }

    if (POKEMON_ID > 721) {
        throw new Error('指定されたポケモンIDはサポートされていません');
    }

    const pokemonNo = POKEMON_ID.padStart(3, '0');
    const targetDir = UNOWN_NAME ?
        `${POKEMON_JSON_DIR}/img/${pokemonNo}/${UNOWN_NAME}` :
        `${POKEMON_JSON_DIR}/img/${pokemonNo}`

    clientSetup(targetDir);
    imageDownload(pokemonNo, UNOWN_NAME);
})();