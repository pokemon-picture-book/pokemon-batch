const axios = require('axios');
const { getLangId, filterLang } = require('./language');

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

            const regions = names
                .filter(filterLang)
                .map(({ language, name }) => ({
                    regionGroupId: id,
                    name,
                    languageId: getLangId(language),
                }));

            return {
                regionGroups: {
                    id,
                    name
                },
                regions
            };
        })
    );

    const [regionGroups, regions] = results.reduce((a, c) => {
        const [AccumulatorRegionGroups, AccumulatorRegions] = a;
        const { regionGroups, regions } = c;

        AccumulatorRegionGroups.push(regionGroups);

        return [
            AccumulatorRegionGroups,
            AccumulatorRegions.concat(regions)
        ];
    }, [[], []]);

    console.log('regionGroups');
    console.log(regionGroups);
    console.log('==============================');
    console.log('regions');
    console.log(regions);
    console.log('==============================');

    return {
        regionGroups,
        regions
    }
}
