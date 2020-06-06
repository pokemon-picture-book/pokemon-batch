const { toJSON } = require('./output');

const getLanguages = () => {
    // const languages = [
    //     { id: 1, name: 'zh-Hans' },
    //     { id: 2, name: 'ja' },
    //     { id: 3, name: 'en' },
    //     { id: 4, name: 'it' },
    //     { id: 5, name: 'es' },
    //     { id: 6, name: 'de' },
    //     { id: 7, name: 'fr' },
    //     { id: 8, name: 'zh-Hant' },
    //     { id: 9, name: 'ko' },
    //     { id: 10, name: 'roomaji' },
    //     { id: 11, name: 'ja-Hrkt' },
    // ];

    return [
        { id: 1, name: 'ja-Hrkt' },
        { id: 2, name: 'en' }
    ];
}

exports.languages = () => {
    toJSON(getLanguages(), 'languages');
}

exports.getLangId = (language) =>
    getLanguages().find(({ name }) => name === language.name).id;

exports.filterLang = ({ language }) =>
    getLanguages().map(lang => lang.name).includes(language.name);
