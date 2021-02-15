'use strict';

let enDict = require('./en');

class Languages {
    getLang(lang) {
        if (!lang) {
            return 'en';
        }

        return lang.toLowerCase();
    };

    getText(lang, key) {
        let text;
        switch (languages.getLang(lang)) {
            case 'en':
                text = enDict.getValue(key);
                break;

            default:
                text = enDict.getValue(key);
                break;
        }

        if (text === key) {
            text = enDict.getValue(key);
        }

        return (text === undefined) ? key : text;
    };
}

let languages = new Languages();
exports = module.exports = languages;