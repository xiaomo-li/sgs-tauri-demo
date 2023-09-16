"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationPack = exports.getAllLanguages = void 0;
const engine_1 = require("core/game/engine");
function getAllLanguages() {
    return ["en-US" /* EN_US */, "zh-CN" /* ZH_CN */, "zh-HK" /* ZH_HK */, "zh-TW" /* ZH_TW */];
}
exports.getAllLanguages = getAllLanguages;
class TranslationPack {
    constructor(translationJson) {
        this.translationJson = translationJson;
    }
    static create(translationJon) {
        return new TranslationPack(translationJon);
    }
    updateRawText(newText) {
        this.translationJson.original = newText;
        return this;
    }
    updateParams(newParams) {
        this.translationJson.params = newParams;
        return this;
    }
    extract() {
        return this.translationJson;
    }
    toString() {
        return TranslationPack.translationObjectSign + JSON.stringify(this.translationJson);
    }
    translateTo(translationsDictionary) {
        let target = translationsDictionary[this.translationJson.original];
        if (target === undefined) {
            // tslint:disable-next-line: no-console
            console.warn(`Translations Warning - Missing translation: ${target}`);
            return this.translationJson.original;
        }
        if (this.translationJson.params.length > 0) {
            for (let i = 0; i < this.translationJson.params.length; i++) {
                const param = this.translationJson.params[i].toString();
                target = target.replace(new RegExp(`\\{${i}\\}`, 'g'), translationsDictionary[param] || param);
            }
        }
        return target;
    }
    static patchCardInTranslation(...cardIds) {
        return (TranslationPack.translateCardObjectSign +
            JSON.stringify(cardIds.map(cardId => {
                const card = engine_1.Sanguosha.getCardById(cardId);
                return `${card.Name} ${TranslationPack.patchEmojiOrImageInTranslation(card.Suit)} ${card.CardNumber}`;
            })));
    }
    static patchPlayerInTranslation(...players) {
        return (TranslationPack.translatePlayerObjectSign +
            JSON.stringify(players.map(player => `${player.Character.Name} ${player.Position}`)));
    }
    static isCardObjectText(text) {
        return text.startsWith(TranslationPack.translateCardObjectSign);
    }
    static isTextArrayText(text) {
        return text.startsWith(TranslationPack.translateTextArraySign);
    }
    static isPlayerObjectText(text) {
        return text.startsWith(TranslationPack.translatePlayerObjectSign);
    }
    static patchPureTextParameter(text) {
        return TranslationPack.pureTextSign + text;
    }
    static isPureTextParameter(text) {
        return text.startsWith(TranslationPack.pureTextSign);
    }
    static patchEmojiOrImageInTranslation(rawText) {
        return TranslationPack.translateCardObjectSign + rawText;
    }
    static dispatchEmojiOrImageInTranslation(rawText) {
        return parseInt(rawText.slice(TranslationPack.translateCardObjectSign.length), 10);
    }
    static dispatch(wrappedString) {
        try {
            const translateObject = JSON.parse(wrappedString.slice(TranslationPack.translationObjectSign.length));
            if (!translateObject.tag || translateObject.tag !== TranslationPack.translationObjectSign) {
                return;
            }
            return translateObject;
        }
        catch (_a) {
            return;
        }
    }
    static wrapArrayParams(...params) {
        return TranslationPack.translateTextArraySign + params.join(',');
    }
    static translationJsonPatcher(originalText, ...stringParams) {
        const translationJson = {
            tag: TranslationPack.translationObjectSign,
            original: originalText,
            params: stringParams,
        };
        return new TranslationPack(translationJson);
    }
    static translationJsonDispatcher(wrappedString, translationsDictionary) {
        const dispatchedTranslationObject = this.dispatch(wrappedString);
        if (dispatchedTranslationObject === undefined) {
            return wrappedString;
        }
        let target = translationsDictionary[dispatchedTranslationObject.original];
        if (target === undefined) {
            // tslint:disable-next-line: no-console
            console.warn(`Translations Warning - Missing translation: ${target}`);
            return wrappedString;
        }
        if (dispatchedTranslationObject.params.length > 0) {
            for (let i = 0; i < dispatchedTranslationObject.params.length; i++) {
                const param = dispatchedTranslationObject.params[i].toString();
                let parsedParam = param;
                if (TranslationPack.isTextArrayText(param)) {
                    parsedParam = param
                        .slice(TranslationPack.translateTextArraySign.length)
                        .split(',')
                        .map(subParam => translationsDictionary[subParam] || subParam)
                        .join(',');
                }
                else {
                    parsedParam = translationsDictionary[param] || param;
                }
                target = target.replace(new RegExp(`\\{${i}\\}`, 'g'), parsedParam);
            }
        }
        return target;
    }
}
exports.TranslationPack = TranslationPack;
TranslationPack.translationObjectSign = '@@translate:';
TranslationPack.translateCardObjectSign = TranslationPack.translationObjectSign + 'card:';
TranslationPack.translatePlayerObjectSign = TranslationPack.translationObjectSign + 'player:';
TranslationPack.translateTextArraySign = TranslationPack.translationObjectSign + 'array:';
TranslationPack.pureTextSign = '@@pure:';
