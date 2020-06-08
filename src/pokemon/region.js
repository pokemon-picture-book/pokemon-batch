const axios = require('axios');
const { getLangId, filterLang } = require('./language');
const { toJSON } = require('./output');

exports.regions = async () => {
    const apiUrl = 'https://pokeapi.co/api/v2/region';

    const { data } = await axios
        .get(apiUrl)
        .catch(console.error);

    const results = await Promise.all(
        data.results.map(async result => {
            const { data } = await axios.get(result.url).catch(console.error);

            // TODO locations も管理したい
            const { id, name, names } = data;

            const regionNames = names
                .filter(filterLang)
                .map(({ language, name }) => ({
                    regionId: id,
                    name,
                    languageId: getLangId(language),
                }));

            return {
                regions: {
                    id,
                    name
                },
                regionNames
            };
        })
    );

    const [regions, regionNames] = results.reduce((a, c) => {
        const [AccumulatorRegions, AccumulatorRegionNames] = a;
        const { regions, regionNames } = c;

        AccumulatorRegions.push(regions);

        return [
            AccumulatorRegions,
            AccumulatorRegionNames.concat(regionNames)
        ];
    }, [[], []]);

    toJSON(regions, 'regions');
    toJSON(regionNames, 'region-names');

    return {
        regions,
        regionNames
    }
}
