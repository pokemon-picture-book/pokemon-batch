const axios = require('axios');
const { getLangId, filterLang } = require('./language');
const { toJSON } = require('./output');

exports.types = async () => {
    const apiUrl = 'https://pokeapi.co/api/v2/type';

    const { data } = await axios
        .get(apiUrl)
        .catch(console.error);

    const results = await Promise.all(
        data.results.map(async result => {
            const { data } = await axios.get(result.url).catch(console.error);
            const { id, name, names } = data;

            const typeNames = names
                .filter(filterLang)
                .map(({ language, name }) => ({
                    typeGroupId: id,
                    name,
                    languageId: getLangId(language),
                }));

            return {
                type: {
                    id,
                    name
                },
                typeNames
            };
        })
    );

    const [types, typeNames] = results.reduce((a, c) => {
        const [AccumulatorTypes, AccumulatorTypeNames] = a;
        const { type, typeNames } = c;

        AccumulatorTypes.push(type);

        return [
            AccumulatorTypes,
            AccumulatorTypeNames.concat(typeNames)
        ];
    }, [[], []]);

    toJSON(types, 'types');
    toJSON(typeNames, 'type-names');

    return {
        types,
        typeNames
    }
}