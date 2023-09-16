"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiZhi = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let JiZhi = class JiZhi extends skill_1.TriggerSkill {
    get RelatedCharacters() {
        return ['lukang', 'god_simayi'];
    }
    audioIndex(characterName) {
        return characterName && this.RelatedCharacters.includes(characterName) ? 1 : 2;
    }
    isRefreshAt(room, owner, stage) {
        return stage === 7 /* PhaseFinish */;
    }
    whenRefresh(room, owner) {
        room.syncGameCommonRules(owner.Id, user => {
            const extraHold = user.getInvisibleMark(this.Name);
            user.removeInvisibleMark(this.Name);
            room.CommonRules.addAdditionalHoldCardNumber(user, -extraHold);
        });
    }
    isTriggerable(event, stage) {
        return stage === "CardUsing" /* CardUsing */;
    }
    canUse(room, owner, content) {
        const card = engine_1.Sanguosha.getCardById(content.cardId);
        return content.fromId === owner.Id && card.is(7 /* Trick */) && !card.isVirtualCard();
    }
    async onTrigger(room, event) {
        event.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} triggered skill {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId)), this.Name).extract();
        return true;
    }
    async onEffect(room, event) {
        const cardId = (await room.drawCards(1, event.fromId, undefined, event.fromId, this.Name))[0];
        const realCardId = room
            .getPlayerById(event.fromId)
            .getCardIds(0 /* HandArea */)
            .find(id => card_1.VirtualCard.getActualCards([id])[0] === cardId && room.canDropCard(event.fromId, id));
        if (realCardId && engine_1.Sanguosha.getCardById(realCardId).is(0 /* Basic */)) {
            const askForOptionsEvent = event_packer_1.EventPacker.createUncancellableEvent({
                options: ['jizhi:discard', 'jizhi:keep'],
                toId: event.fromId,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('do you wanna discard {0}', translation_json_tool_1.TranslationPack.patchCardInTranslation(cardId)).extract(),
                triggeredBySkills: [this.Name],
            });
            room.notify(168 /* AskForChoosingOptionsEvent */, askForOptionsEvent, event.fromId);
            const response = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, event.fromId);
            if (response.selectedOption === 'jizhi:discard') {
                await room.dropCards(4 /* SelfDrop */, [cardId], event.fromId, event.fromId, this.Name);
                room.syncGameCommonRules(event.fromId, user => {
                    user.addInvisibleMark(this.Name, 1);
                    room.CommonRules.addAdditionalHoldCardNumber(user, 1);
                });
            }
        }
        return true;
    }
};
JiZhi = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'jizhi', description: 'jizhi_description' })
], JiZhi);
exports.JiZhi = JiZhi;
