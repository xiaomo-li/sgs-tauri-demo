"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhiQiAi = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZhiQiAi = class ZhiQiAi extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name) && owner.getCardIds(0 /* HandArea */).length > 0;
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableTarget(owner, room, target) {
        return owner !== target;
    }
    isAvailableCard(owner, room, cardId) {
        return !engine_1.Sanguosha.getCardById(cardId).is(0 /* Basic */);
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, cardIds } = event;
        const toId = precondition_1.Precondition.exists(event.toIds, 'Unable to get zhi_qiai target')[0];
        const from = room.getPlayerById(fromId);
        await room.moveCards({
            movingCards: [{ card: cardIds[0], fromArea: from.cardFrom(cardIds[0]) }],
            fromId,
            toId,
            toArea: 0 /* HandArea */,
            moveReason: 2 /* ActiveMove */,
            proposer: fromId,
            movedByReason: this.Name,
        });
        const options = ['zhi_qiai:draw'];
        if (from.LostHp > 0) {
            options.push('zhi_qiai:recover');
        }
        if (!room.getPlayerById(toId).Dead) {
            const askForChooseEvent = event_packer_1.EventPacker.createUncancellableEvent({
                options,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose zhi_qiai options: {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId))).extract(),
                toId,
                triggeredBySkills: [this.Name],
            });
            const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, askForChooseEvent, toId);
            response.selectedOption = response.selectedOption || options[0];
            if (response.selectedOption === options[0]) {
                await room.drawCards(2, fromId, 'top', toId, this.Name);
            }
            else {
                await room.recover({
                    toId: fromId,
                    recoveredHp: 1,
                    recoverBy: toId,
                });
            }
        }
        return true;
    }
};
ZhiQiAi = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'zhi_qiai', description: 'zhi_qiai_description' })
], ZhiQiAi);
exports.ZhiQiAi = ZhiQiAi;
