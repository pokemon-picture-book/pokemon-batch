const fs = require('fs');
const { gameVersionGroups } = require('./game');

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
        });
}

const isSomeGameVersionGroup = imagePath => {
    return gameVersionGroups.some(gameVersionGroup => imagePath.includes(`/${gameVersionGroup.alias}/`))
}

const isIncludeGameVersionGroup = imagePath => {
    return isSomeGameVersionGroup(imagePath) ||
        imagePath.includes('/icon/') ||
        imagePath.includes('/iconxy/');
}

exports.images = () => {
    const imageDir = `../pokemon.json/img`;
    const pokemonId = 1;
    const pokemonImageDirName = String(pokemonId).padStart(3, '0');
    const pokemonImageDir = `${imageDir}/${pokemonImageDirName}`;

    if (!fs.existsSync(pokemonImageDir)) {
        throw new Error('npm script で実行してください。また pokemon.json プロジェクトをクローンしてください。');
    }

    const imagePaths = getImagePaths(pokemonImageDir);

    const pokemonImages = imagePaths
        .filter(isIncludeGameVersionGroup)
        .flatMap(imagePath => {
            const path = imagePath.split(imageDir).pop()

            if (isSomeGameVersionGroup(imagePath)) {
                // gameVersionGroup のエイリアスとディレクトリ名称が一致している場合
                const gameVersionGroup = gameVersionGroups.find(gameVersionGroup => imagePath.includes(`/${gameVersionGroup.alias}/`));
                return {
                    pokemonId,
                    path,
                    gameVersionGroupId: gameVersionGroup.id
                }
            } else if (imagePath.includes('/1/')) {
                // icon 内のディレクトリが "1" である場合、赤青黄バージョン
                return {
                    pokemonId,
                    path,
                    gameVersionGroupId: 1
                }
            } else if (imagePath.includes('/2/')) {
                // icon 内のディレクトリが "2" である場合、金銀クリスタルバージョン
                return {
                    pokemonId,
                    path,
                    gameVersionGroupId: 2
                }
            } else if (imagePath.includes('/iconxy/')) {
                // ディレクトリ名が "iconxy" である場合、xy のアイコン
                return {
                    pokemonId,
                    path,
                    gameVersionGroupId: 12
                }
            }
            // その他のゲームのアイコンは共通
            return [3, 4, 5, 6, 7, 8, 13].map(gameVersionGroupId => ({
                pokemonId,
                path,
                gameVersionGroupId
            }))
        });

    console.log(pokemonImages);

    const commonImages = imagePaths
        .filter(imagePath => !isIncludeGameVersionGroup(imagePath))
        .map(imagePath => {
            const path = imagePath.split(imageDir).pop()
            return {
                pokemonId,
                path
            }
        });

    console.log(commonImages);
}