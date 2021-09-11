const fs = require('fs');
const { gameVersionGroups } = require('./game');
const { toJSON } = require('./output');
const { POKEMON_IDS } = require('./pokemon');

const supportedGameVersionGroups = gameVersionGroups.filter(gameVersionGroup => ![9, 10, 11, 15].includes(gameVersionGroup.id));

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
        .filter(path => !path.includes('.DS_Store'));
}

const isSomeGameVersionGroup = imagePath => {
    return supportedGameVersionGroups.some(gameVersionGroup => imagePath.includes(`/${gameVersionGroup.alias}/`))
}

const isIncludeGameVersionGroup = imagePath => {
    return isSomeGameVersionGroup(imagePath) ||
        imagePath.includes('/icon/') ||
        imagePath.includes('/iconxy/');
}

/**
 * メイン画像かのboolean値を返す.
 *
 * - メイン画像である場合の画像パスパターン
 *   - /rgby/{pokemonId}_rg.png
 *   - /gsc/{pokemonId}_kin.png
 *   - /rse/{pokemonId}_rs.png
 *   - /frlg/{pokemonId}_fl.png
 *   - /dp/{pokemonId}.png
 *   - /pt/{pokemonId}.png
 *   - /hgss/{pokemonId}.png
 *   - /bw/{pokemonId}.gif
 *   - /xy/{pokemonId}.gif
 *   - /oras/{pokemonId}.png
 *
 * 特殊画像(メイン画像のパスが上記ルールと異なる)
 * - pokemonID:201
 * - pokemonID:666
 *
 * @param {string} imagePath 画像パス
 * @param {string} pokemonId 0埋めされた3桁のポケモンID
 * @returns boolean メイン画像だった場合:true, そうでない場合:false
 */
const isMain = (imagePath, pokemonId) => {
    const pokemonIdStr = ((pokemonId) => {
        const formatPokemonId = String(pokemonId).padStart(3, '0');
        switch (pokemonId) {
            case 201:
                return `${formatPokemonId}a`;
            case 412:
            case 413:
                return `${formatPokemonId}kusaki`;
            case 666:
                return `${formatPokemonId}-1`;
            default:
                return formatPokemonId;
        }
    })(pokemonId);

    return imagePath.includes(`/rgby/${pokemonIdStr}_rg.png`) ||
        imagePath.includes(`/gsc/${pokemonIdStr}_kin.png`) ||
        imagePath.includes(`/rse/${pokemonIdStr}_rs.png`) ||
        imagePath.includes(`/frlg/${pokemonIdStr}_fl.png`) ||
        imagePath.includes(`/dp/${pokemonIdStr}.png`) ||
        imagePath.includes(`/pt/${pokemonIdStr}.png`) ||
        imagePath.includes(`/hgss/${pokemonIdStr}.png`) ||
        imagePath.includes(`/bw/${pokemonIdStr}.gif`) ||
        imagePath.includes(`/xy/${pokemonIdStr}.gif`) ||
        imagePath.includes(`/xy/thum/${pokemonIdStr}.gif`) ||
        imagePath.includes(`/oras/${pokemonIdStr}.png`);
}

const isShiny = (path, pokemonId) => {
    const pokemonIdStr = String(pokemonId).padStart(3, '0');
    return path.includes(`${pokemonIdStr}s`);
}

exports.images = () => {
    const imageDir = '../pokemon-api/pokemon-img';

    const [pokemonGameImages, pokemonFootmarkImages, pokemonWarkImages] = POKEMON_IDS
        .map(pokemonId => {
            const pokemonImageDirName = String(pokemonId).padStart(3, '0');
            const pokemonImageDir = `${imageDir}/${pokemonImageDirName}`;

            if (!fs.existsSync(pokemonImageDir)) {
                throw new Error(`${pokemonId}, pokemon-api プロジェクトをクローンしてください。`);
            }

            const imagePaths = getImagePaths(pokemonImageDir);

            const pokemonGameImages = imagePaths
                .filter(isIncludeGameVersionGroup)
                .flatMap(imagePath => {
                    const path = imagePath.split(imageDir).pop()

                    if (isSomeGameVersionGroup(imagePath)) {
                        // gameVersionGroup のエイリアスとディレクトリ名称が一致している場合
                        const gameVersionGroup = supportedGameVersionGroups.find(gameVersionGroup => imagePath.includes(`/${gameVersionGroup.alias}/`));
                        return {
                            pokemonId,
                            path,
                            gameVersionGroupId: gameVersionGroup.id,
                            isMain: isMain(imagePath, pokemonId),
                            isHandheldIcon: false,
                            isShiny: isShiny(imagePath, pokemonId)
                        }
                    } else if (imagePath.includes('/icon/') && imagePath.includes('/1/')) {
                        // icon 内のディレクトリが "1" である場合、赤青黄バージョン
                        return {
                            pokemonId,
                            path,
                            gameVersionGroupId: 1,
                            isMain: false,
                            isHandheldIcon: true,
                            isShiny: false
                        }
                    } else if (imagePath.includes('/icon/') && imagePath.includes('/2/')) {
                        // icon 内のディレクトリが "2" である場合、金銀クリスタルバージョン
                        return {
                            pokemonId,
                            path,
                            gameVersionGroupId: 2,
                            isMain: false,
                            isHandheldIcon: true,
                            isShiny: false
                        }
                    } else if (imagePath.includes('/iconxy/')) {
                        // ディレクトリ名が "iconxy" である場合、xy のアイコン
                        return {
                            pokemonId,
                            path,
                            gameVersionGroupId: 12,
                            isMain: false,
                            isHandheldIcon: true,
                            isShiny: imagePath.includes('/s/')
                        }
                    }
                    // その他のゲームのアイコンは共通
                    const isMainOther = isMain(imagePath, pokemonId)
                    const isShinyOther = imagePath.includes('/s/')
                    return [3, 4, 5, 6, 7, 8, 13].map(gameVersionGroupId => ({
                        pokemonId,
                        path,
                        gameVersionGroupId,
                        isMain: isMainOther,
                        isHandheldIcon: true,
                        isShiny: isShinyOther
                    }))
                });

            const otherPokemonImages = imagePaths.filter(imagePath => !isIncludeGameVersionGroup(imagePath))
            const pokemonFootmarkImages = otherPokemonImages
                .filter(imagePath => imagePath.includes('/footmark/'))
                .map(imagePath => {
                    const path = imagePath.split(imageDir).pop()
                    return {
                        pokemonId,
                        path
                    }
                });

            const pokemonWarkImages = imagePaths
                .filter(imagePath => imagePath.includes('/overworld/'))
                .map(imagePath => {
                    const path = imagePath.split(imageDir).pop()
                    return {
                        pokemonId,
                        path
                    }
                });

            return {
                pokemonGameImages,
                pokemonFootmarkImages,
                pokemonWarkImages
            }
        })
        .reduce((a, c) => {
            const [pokemonGameImages, pokemonFootmarkImages, pokemonWarkImages] = a;
            pokemonGameImages.push(...c.pokemonGameImages);
            pokemonFootmarkImages.push(...c.pokemonFootmarkImages);
            pokemonWarkImages.push(...c.pokemonWarkImages);
            return [pokemonGameImages, pokemonFootmarkImages, pokemonWarkImages];
        }, [[], [], []]);

    toJSON(pokemonGameImages, 'pokemon-game-images');
    toJSON(pokemonFootmarkImages, 'pokemon-footmark-images');
    toJSON(pokemonWarkImages, 'pokemon-wark-images');
}
