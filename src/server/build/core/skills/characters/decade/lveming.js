"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LveMing = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const functional_1 = require("core/shares/libs/functional");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let LveMing = class LveMing extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return (target !== owner &&
            room.getPlayerById(target).getCardIds(1 /* EquipArea */).length <
                room.getPlayerById(owner).getCardIds(1 /* EquipArea */).length);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableCard() {
        return false;
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        if (!toIds) {
            return false;
        }
        const originalTimes = room.getFlag(fromId, this.Name) || 0;
        room.setFlag(fromId, this.Name, originalTimes + 1, translation_json_tool_1.TranslationPack.translationJsonPatcher('lveming times: {0}', originalTimes + 1).toString());
        const options = [];
        for (let i = 1; i < 14; i++) {
            options.push(functional_1.Functional.getCardNumberRawText(i));
        }
        const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
            options,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose lveming options', this.Name).extract(),
            toId: toIds[0],
            triggeredBySkills: [this.Name],
        }, toIds[0], true);
        response.selectedOption = response.selectedOption || options[Math.floor(Math.random() * options.length)];
        room.broadcast(103 /* CustomGameDialog */, {
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} chose {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(toIds[0])), response.selectedOption).extract(),
        });
        const judgeEvent = await room.judge(fromId, undefined, this.Name);
        const chosen = options.findIndex(option => option === response.selectedOption) + 1;
        if (engine_1.Sanguosha.getCardById(judgeEvent.judgeCardId).CardNumber === Number(chosen)) {
            await room.damage({
                fromId,
                toId: toIds[0],
                damage: 2,
                damageType: "normal_property" /* Normal */,
                triggeredBySkills: [this.Name],
            });
        }
        else {
            const cardsInArea = room.getPlayerById(toIds[0]).getCardIds();
            if (cardsInArea.length > 0) {
                const randomCard = cardsInArea[Math.floor(Math.random() * cardsInArea.length)];
                await room.moveCards({
                    movingCards: [{ card: randomCard, fromArea: room.getPlayerById(toIds[0]).cardFrom(randomCard) }],
                    fromId: toIds[0],
                    toId: fromId,
                    toArea: 0 /* HandArea */,
                    moveReason: 1 /* ActivePrey */,
                    proposer: fromId,
                    triggeredBySkills: [this.Name],
                });
            }
        }
        return true;
    }
};
LveMing = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'lveming', description: 'lveming_description' })
], LveMing);
exports.LveMing = LveMing;
