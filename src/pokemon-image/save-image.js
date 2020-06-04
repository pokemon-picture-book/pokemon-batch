const fs = require('fs');

const makeDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    return dir;
};

exports.save = (stream, pokemonNo, targetDir = '.') => {
    const { path } = stream.url;
    const pathParts = path.split('/').filter(p => !!p && p !== 'material');
    const fileName = pathParts.pop();

    if (([...pathParts].shift() === 'icon' || [...pathParts].shift() === 'overworld') && ! /\.gif$/i.test(fileName)) {
        return stream.end();
    }

    const imageDir = makeDir(`${targetDir}/imgTmp`);
    const pokemonImageDir = makeDir(`${imageDir}/${pokemonNo}`);

    const savedDir = pathParts.reduce((a, c) => {
        const subDir = makeDir(`${a}/${c}`);
        return subDir;
    }, pokemonImageDir);

    stream.toBuffer((_, buffer) => {
        fs.writeFileSync(`${savedDir}/${fileName}`, buffer, 'binary');
    });
}