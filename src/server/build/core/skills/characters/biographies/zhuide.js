"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhuiDe = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZhuiDe = class ZhuiDe extends skill_1.TriggerSkill {
    afterDead(room) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */;
    }
    isTriggerable(event, stage) {
        return stage === "PlayerDied" /* PlayerDied */;
    }
    canUse(room, owner, content) {
        return content.playerId === owner.Id;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, targetId) {
        return targetId !== owner;
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to let another player draw 4 defferent basic cards?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const toId = precondition_1.Precondition.exists(event.toIds, 'Unable to get zhuide target')[0];
        const basicNames = {};
        const allBasicCards = room.findCardsByMatcherFrom(new card_matcher_1.CardMatcher({ type: [0 /* Basic */] }));
        if (allBasicCards.length === 0) {
            return false;
        }
        for (const cardId of allBasicCards) {
            const card = engine_1.Sanguosha.getCardById(cardId);
            basicNames[card.GeneralName] = basicNames[card.GeneralName] || [];
            basicNames[card.GeneralName].push(cardId);
        }
        let zhuiDeNames = [];
        const names = Object.keys(basicNames);
        if (names.length <= 4) {
            zhuiDeNames = names;
        }
        else {
            while (zhuiDeNames.length < 4) {
                if (names.length === 0) {
                    break;
                }
                const randomName = names[Math.floor(Math.random() * names.length)];
                const index = names.findIndex(name => name === randomName);
                names.splice(index, 1);
                zhuiDeNames.push(randomName);
            }
        }
        const toGain = [];
        for (const name of zhuiDeNames) {
            const cardIds = basicNames[name];
            toGain.push(cardIds[Math.floor(Math.random() * cardIds.length)]);
        }
        await room.moveCards({
            movingCards: toGain.map(card => ({ card, fromArea: 5 /* DrawStack */ })),
            toId,
            toArea: 0 /* HandArea */,
            moveReason: 3 /* PassiveMove */,
            proposer: fromId,
        });
        return true;
    }
};
ZhuiDe = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'zhuide', description: 'zhuide_description' })
], ZhuiDe);
exports.ZhuiDe = ZhuiDe;
