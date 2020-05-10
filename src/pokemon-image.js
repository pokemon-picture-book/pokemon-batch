const fs = require('fs');
var client = require('cheerio-httpcli');

const pokemonJsonDir = `${process.env.PWD}/../pokemon.json`;

const makeDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    return dir;
}

const clientSetup = () => {
    client.download
        .on('ready', (stream) => {
            const hrefItems = stream.url.href.split('/');
            const filename = hrefItems.pop();
            const mainDirName = filename.slice(0, 3);

            if (filename.split('.').shift().length >= 3 && /^([0-9]*|0)$/.test(mainDirName)) {
                const imgDir = makeDir(`${pokemonJsonDir}/img`);
                const mainDir = makeDir(`${imgDir}/${mainDirName}`);
                const subDir = makeDir(`${mainDir}/${hrefItems.pop()}`);

                stream.pipe(fs.createWriteStream(`${subDir}/${filename}`));
                console.log(stream.url.href + 'をダウンロードしました');
            }
        })
        .on('error', (err) => {
            console.error(err.url + 'をダウンロードできませんでした: ' + err.message);
        })
        .on('end', () => {
            console.log('ダウンロードが完了しました');
        });

    client.download.parallel = 4;
}

const imageDownload = async (i) => {
    const pokemonNo = String(i).padStart(3, '0');
    client.fetch(`http://hikochans.com/pixelart/pokemon/${pokemonNo}`, (err, $, res, body) => {
        $('table.material.material-mini img').download();
        $('table.material.material-gen1 img').download();
        $('table.material.material-gen2 img').download();
        $('table.material.material-gen3 img').download();
        $('table.material.material-gen4 img').download();
        $('table.material.material-gen5 img').download();
        $('table.material.material-gen6 img').download();
        $('img.actiongif').download();

        console.log('OK!', pokemonNo);
        if (i < 721) {
            imageDownload(i + 1);
        }
        return;
    });
}

(async () => {
    if (!fs.existsSync(pokemonJsonDir)) {
        throw new Error('npm script で実行してください。また pokemon.json プロジェクトをクローンしてください。');
    }
    clientSetup();
    imageDownload(1);
})();