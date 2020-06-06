const fs = require('fs');

const outputPath = '../pokemon.json/data';

const makeDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    return dir;
};

exports.toJSON = (data, fileName = 'non') => {
    if (!data) {
        throw new Error('出力したいデータがありません');
    }
    fs.writeFile(
        `${makeDir(outputPath)}/${fileName}.json`,
        JSON.stringify(data, null, '    '),
        err => {
            if (err) {
                throw err;
            }
            console.log(`${fileName} is saved!`);
        }
    );
}