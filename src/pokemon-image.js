const fs = require('fs');
var client = require('cheerio-httpcli');

const POKEMON_JSON_DIR = `${process.env.PWD}/../pokemon.json`;
const POKEMON_ID = process.argv[2];

const makeDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    return dir;
}

const clientSetup = () => {
    client.download
        .on('ready', function(stream) {
            const { path } = stream.url;
            const pathParts = path.split('/').filter(p => !!p && p !== 'material');
            const fileName = pathParts.pop();

            if (([...pathParts].shift() === 'icon' || [...pathParts].shift() === 'overworld') && ! /\.gif$/i.test(fileName)) {
                return stream.end();
            }

            const imageDir = makeDir(`${POKEMON_JSON_DIR}/img`);
            const pokemonNo = POKEMON_ID.padStart(3, '0');
            const pokemonImageDir = makeDir(`${imageDir}/${pokemonNo}`);

            const savedDir = pathParts.reduce((a, c) => {
                const subDir = makeDir(`${a}/${c}`);
                return subDir;
            }, pokemonImageDir);

            stream.toBuffer(function (_, buffer) {
                fs.writeFileSync(`${savedDir}/${fileName}`, buffer, 'binary');
            });
        })
        .on('error', function(err) {
            console.error(err.url + 'をダウンロードできませんでした: ' + err.message);
        })
        .on('end', function() {
            console.log('ダウンロードが完了しました');
        });

    client.download.parallel = 4;
}

const imageDownload = () => {
    const pokemonNo = POKEMON_ID.padStart(3, '0');

    const { $, error } = client.fetchSync(`http://hikochans.com/pixelart/pokemon/${pokemonNo}`);
    if (error) {
        throw error;
    }

    $('table.material.material-mini img').download();
    $('table.material.material-gen1 img').download();
    $('table.material.material-gen2 img').download();
    $('table.material.material-gen3 img').download();
    $('table.material.material-gen4 img').download();
    $('table.material.material-gen5 img').download();
    $('table.material.material-gen6 img').download();
    $('img.actiongif').download();
}

(async () => {
    if (!fs.existsSync(POKEMON_JSON_DIR)) {
        throw new Error('npm script で実行してください。また pokemon.json プロジェクトをクローンしてください。');
    }

    if (!POKEMON_ID) {
        throw new Error('コマンドライン引数を指定してください。');
    }

    clientSetup();
    imageDownload();
})();