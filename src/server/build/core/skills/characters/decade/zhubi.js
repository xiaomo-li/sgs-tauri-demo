"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhuBi = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZhuBi = class ZhuBi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, content) {
        return !!content.infos.find(info => info.toArea === 4 /* DropStack */ &&
            [4 /* SelfDrop */, 5 /* PassiveDrop */].includes(info.moveReason) &&
            info.movingCards.find(cardInfo => !cardInfo.asideMove && engine_1.Sanguosha.getCardById(cardInfo.card).Suit === 4 /* Diamond */));
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to put a random ‘wu zhong sheng you’ on the top of draw dile?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        let wuzhongCards = room.findCardsByMatcherFrom(new card_matcher_1.CardMatcher({ name: ['wuzhongshengyou'] }));
        const foundInDrawPile = wuzhongCards.length > 0;
        foundInDrawPile ||
            (wuzhongCards = room.findCardsByMatcherFrom(new card_matcher_1.CardMatcher({ name: ['wuzhongshengyou'] }), false));
        if (wuzhongCards.length > 0) {
            const randomIndex = Math.floor(Math.random() * wuzhongCards.length);
            await room.moveCards({
                movingCards: [
                    {
                        card: wuzhongCards[randomIndex],
                        fromArea: foundInDrawPile ? 5 /* DrawStack */ : 4 /* DropStack */,
                    },
                ],
                toArea: 5 /* DrawStack */,
                moveReason: 7 /* PlaceToDrawStack */,
                proposer: event.fromId,
                triggeredBySkills: [this.Name],
            });
        }
        return true;
    }
};
ZhuBi = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'zhubi', description: 'zhubi_description' })
], ZhuBi);
exports.ZhuBi = ZhuBi;
