const client = require('cheerio-httpcli');
const { save } = require('./save-image');

exports.clientSetup = (targetDir) => {
    client.download
        .on('ready', (stream) => {
            save(stream, targetDir);
        })
        .on('error', (err) => {
            console.error(err.url + 'をダウンロードできませんでした: ' + err.message);
        })
        .on('end', () => {
            console.log('ダウンロードが完了しました');
        });

    client.download.parallel = 5;
}

exports.imageDownload = (pokemonNo, unown = '') => {
    const { $, error } = client.fetchSync(`http://hikochans.com/pixelart/pokemon/${pokemonNo}${unown}`);
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