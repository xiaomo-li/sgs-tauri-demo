"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuZhu = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let FuZhu = class FuZhu extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        if (content.playerId !== owner.Id &&
            content.toStage === 19 /* FinishStageStart */ &&
            !room.getPlayerById(content.playerId).Dead &&
            room.getPlayerById(content.playerId).Gender === 0 /* Male */) {
            const drawPile = room.findCardsByMatcherFrom(new card_matcher_1.CardMatcher({ type: [0 /* Basic */, 7 /* Trick */, 1 /* Equip */] }));
            const firstSlash = drawPile.find(cardId => engine_1.Sanguosha.getCardById(cardId).GeneralName === 'slash');
            return (owner.Hp * 10 >= drawPile.length &&
                !!firstSlash &&
                room.canUseCardTo(firstSlash, owner, room.getPlayerById(content.playerId), true));
        }
        return false;
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to use this skill to {1} ?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.playerId))).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const toId = event.triggeredOnEvent.playerId;
        for (let i = 0; i < room.Players.length; i++) {
            if (room.getPlayerById(toId).Dead) {
                break;
            }
            const slashs = room.findCardsByMatcherFrom(new card_matcher_1.CardMatcher({ generalName: ['slash'] }));
            if (slashs.length === 0) {
                break;
            }
            room.canUseCardTo(slashs[0], room.getPlayerById(event.fromId), room.getPlayerById(toId), true) &&
                (await room.useCard({
                    fromId: event.fromId,
                    targetGroup: [[toId]],
                    cardId: slashs[0],
                    customFromArea: 5 /* DrawStack */,
                    triggeredBySkills: [this.Name],
                }));
        }
        room.shuffle();
        return true;
    }
};
FuZhu = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'fuzhu', description: 'fuzhu_description' })
], FuZhu);
exports.FuZhu = FuZhu;
