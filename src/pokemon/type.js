const axios = require('axios');
const { getLangId, filterLang } = require('./language');

exports.types = async () => {
    const apiUrl = 'https://pokeapi.co/api/v2/type';

    const { data } = await axios
        .get(apiUrl)
        .catch(console.error);

    const results = await Promise.all(
        data.results.map(async result => {
            const { data } = await axios.get(result.url).catch(console.error);
            const { id, name, names } = data;

            const types = names
                .filter(filterLang)
                .map(({ language, name }) => ({
                    typeGroupId: id,
                    name,
                    languageId: getLangId(language),
                }));

            return {
                typeGroups: {
                    id,
                    name
                },
                types
            };
        })
    );

    const [typeGroups, types] = results.reduce((a, c) => {
        const [AccumulatorTypeGroups, AccumulatorTypes] = a;
        const { typeGroups, types } = c;

        AccumulatorTypeGroups.push(typeGroups);

        return [
            AccumulatorTypeGroups,
            AccumulatorTypes.concat(types)
        ];
    }, [[], []]);

    console.log('typeGroups');
    console.log(typeGroups);
    console.log('==============================');
    console.log('types');
    console.log(types);
    console.log('==============================');

    return {
        typeGroups,
        types
    }
}