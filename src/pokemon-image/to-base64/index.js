const fs = require('fs');
const filetype = require('file-type')

const getImagePaths = (dirName) => {
    const dirNames = fs.readdirSync(dirName);
    return dirNames
        .flatMap(dn => {
            const path = `${dirName}/${dn}`;
            const stat = fs.statSync(path);
            if (stat.isDirectory()) {
                return getImagePaths(path);
            }
            return path;
        })
        .filter(path => {
            return !path.includes('.DS_Store')
        });
}

(async () => {
    const imageDir = '../pokemon.json/img';

    const pokemonImageDirName = String(/* pokemonId */ 1).padStart(3, '0');
    const pokemonImageDir = `${imageDir}/${pokemonImageDirName}`;

    if (!fs.existsSync(pokemonImageDir)) {
        throw new Error(`${/* pokemonId */ 1}, pokemon.json プロジェクトをクローンしてください。`);
    }

    const imagePaths = getImagePaths(pokemonImageDir);
    for(const imagePath of imagePaths) {
        const file = fs.readFileSync(imagePath);
        const base64 = file.toString('base64');
        const { mime } = await filetype.fromBuffer(file);
        console.log(imagePath);
        console.log(`data:${mime};base64,${base64}`);
        console.log(`==========`);
    }
})();
