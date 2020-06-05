const fs = require('fs');
const { gameVersionGroups } = require('./game');

exports.images = () => {
    const pokemonId = 1;
    const pokemonImageDirName = String(pokemonId).padStart(3, '0');
    const pokemonImageDir = `../pokemon.json/img/${pokemonImageDirName}`;

    const files = fs.readdirSync(pokemonImageDir);

    const pokemonImages = files
        .filter(file => gameVersionGroups.some(gameVersionGroup => gameVersionGroup.alias === file))
        .map(file => {
            const imageFiles = fs.readdirSync(`${pokemonImageDir}/${file}`);
            return imageFiles.map(imageFile => ({
                pokemonId,
                path: `${pokemonImageDirName}/${file}/${imageFile}`,
                gameVersionGroupId: gameVersionGroups.find(gameVersionGroup => gameVersionGroup.alias === file).id
            }));
        })
        .flat();

    console.log(pokemonImages);

    const commonImages = files
        .filter(file => !gameVersionGroups.some(gameVersionGroup => gameVersionGroup.alias === file))
        .map(file => {
            const imageFiles = fs.readdirSync(`${pokemonImageDir}/${file}`);
            return imageFiles.map(imageFile => ({
                pokemonId,
                path: `${pokemonImageDirName}/${file}/${imageFile}`
            }));
        })
        .flat();

    console.log(commonImages);
}