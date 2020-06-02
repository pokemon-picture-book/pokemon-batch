const fs = require('fs');
var client = require('cheerio-httpcli');

const pokemonJsonDir = `${process.env.PWD}/../pokemon.json`;

const makeDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    return dir;
}

/*
サンプル
client.download
    .on('ready', function (stream) {
        // gif画像以外はいらない
        if (! /\.gif$/i.test(stream.url.pathname)) {
            return stream.end();
        }

        // 各種情報表示
        console.log(stream.url.href); // => 'http://hogehoge.com/foobar.png'
        console.log(stream.type);     // => 'image/png'
        console.log(stream.length);   // => 10240

        // Buffer化してファイルに保存
        stream.toBuffer(function (err, buffer) {
            fs.writeFileSync('foobar.png', buffer, 'binary');
        });
    })
    .on('error', function (err) {
        console.error(err.url + ': ' + err.message);
    })
    .on('end', function (err) {
        console.log('queue is empty');
    });
*/

const clientSetup = () => {
    client.download
        .on('ready', (stream) => {
            const { path } = stream.url;
            const splitPaths = path.split('/').filter(p => !!p && p !== 'material');
            const fileName = splitPaths.pop();

            console.log(path);
            console.log('====================');

            // const hrefItems = stream.url.href.split('/');
            // const filename = hrefItems.pop();
            // const mainDirName = filename.slice(0, 3);

            // if (filename.split('.').shift().length >= 3 && /^([0-9]*|0)$/.test(mainDirName)) {
            //     const imgDir = makeDir(`./img`);
            //     // const imgDir = makeDir(`${pokemonJsonDir}/img`);
            //     const mainDir = makeDir(`${imgDir}/${mainDirName}`);
            //     const subDir = makeDir(`${mainDir}/${hrefItems.pop()}`);

            //     stream.pipe(fs.createWriteStream(`${subDir}/${filename}`));
            //     console.log(stream.url.href + 'をダウンロードしました');
            // }
        })
        .on('error', (err) => {
            console.error(err.url + 'をダウンロードできませんでした: ' + err.message);
        })
        .on('end', () => {
            console.log('ダウンロードが完了しました');
        });

    client.download.parallel = 4;
}

const imageDownload = () => {
    [...Array(2)].forEach((_, i) => {
    // [...Array(721)].forEach((_, i) => {
        const pokemonNo = String(i + 1).padStart(3, '0');

        const { $, error } = client.fetchSync(`http://hikochans.com/pixelart/pokemon/${pokemonNo}`);
        if (error) {
            throw error;
        }

        $('table.material.material-mini img').download();
        // $('table.material.material-gen1 img').download();
        // $('table.material.material-gen2 img').download();
        // $('table.material.material-gen3 img').download();
        // $('table.material.material-gen4 img').download();
        // $('table.material.material-gen5 img').download();
        // $('table.material.material-gen6 img').download();
        // $('img.actiongif').download();
    });
}

(async () => {
    if (!fs.existsSync(pokemonJsonDir)) {
        throw new Error('npm script で実行してください。また pokemon.json プロジェクトをクローンしてください。');
    }
    clientSetup();
    imageDownload();
})();