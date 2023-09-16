"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationModule = void 0;
const precondition_1 = require("core/shares/libs/precondition/precondition");
const translation_json_tool_1 = require("./translation_json_tool");
class TranslationModule {
    constructor(...dictionaries) {
        this.dictionary = new Map();
        for (const subDictionary of dictionaries) {
            this.dictionary.set(subDictionary[0], subDictionary[1]);
        }
    }
    static setup(currentLanguage, ...dictionaries) {
        const translator = new TranslationModule(...dictionaries);
        translator.currentLanguage = currentLanguage;
        return translator;
    }
    tr(rawText) {
        if (typeof rawText === 'object') {
            precondition_1.Precondition.assert(rawText.tag === translation_json_tool_1.TranslationPack.translationObjectSign, `Unexpected translation object: ${JSON.stringify(rawText)}`);
            const dict = this.dictionary.get(this.currentLanguage);
            return dict ? translation_json_tool_1.TranslationPack.create(rawText).translateTo(dict) : rawText.original;
        }
        else if (rawText.startsWith(translation_json_tool_1.TranslationPack.translationObjectSign)) {
            const dict = this.dictionary.get(this.currentLanguage);
            return dict
                ? translation_json_tool_1.TranslationPack.translationJsonDispatcher(rawText.slice(translation_json_tool_1.TranslationPack.translationObjectSign.length), dict)
                : rawText.slice(translation_json_tool_1.TranslationPack.translationObjectSign.length);
        }
        else {
            const targetDictionary = this.dictionary.get(this.currentLanguage);
            if (targetDictionary && targetDictionary[rawText]) {
                return targetDictionary[rawText];
            }
            return rawText;
        }
    }
    set Language(lang) {
        this.currentLanguage = lang;
    }
}
exports.TranslationModule = TranslationModule;
