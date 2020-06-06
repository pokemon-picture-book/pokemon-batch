const fs = require('fs');

const makeDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    return dir;
};

exports.save = (stream, targetDir = '.') => {
    const { path } = stream.url;
    const pathParts = path.split('/').filter(p => !!p && p !== 'material');
    const fileName = pathParts.pop();

    if (([...pathParts].shift() === 'icon' || [...pathParts].shift() === 'overworld') && ! /\.gif$/i.test(fileName)) {
        return stream.end();
    }

    const savedDirParts = targetDir.split('/').concat(pathParts);
    const firstSavedDirPart = savedDirParts.shift();
    const savedDir = savedDirParts.reduce((a, c) => {
        const subDir = makeDir(`${a}/${c}`);
        return subDir;
    }, firstSavedDirPart);

    stream.toBuffer((_, buffer) => {
        fs.writeFileSync(`${savedDir}/${fileName}`, buffer, 'binary');
    });
}