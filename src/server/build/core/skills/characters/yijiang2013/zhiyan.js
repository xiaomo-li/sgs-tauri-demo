"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhiYan = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZhiYan = class ZhiYan extends skill_1.TriggerSkill {
    get RelatedCharacters() {
        return ['gexuan'];
    }
    audioIndex(characterName) {
        return characterName && this.RelatedCharacters.includes(characterName) ? 1 : 2;
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return owner.Id === content.playerId && content.toStage === 19 /* FinishStageStart */;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget() {
        return true;
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose a target to draw a card?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId, toIds } = skillUseEvent;
        const toId = toIds[0];
        const cardId = (await room.drawCards(1, toId, 'top', fromId, this.Name))[0];
        const card = engine_1.Sanguosha.getCardById(cardId);
        const to = room.getPlayerById(toId);
        if (!to.hasCard(room, cardId, 0 /* HandArea */)) {
            return false;
        }
        const showCardEvent = {
            fromId: toId,
            displayCards: [cardId],
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} display hand card {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId)), translation_json_tool_1.TranslationPack.patchCardInTranslation(cardId)).extract(),
        };
        room.broadcast(126 /* CardDisplayEvent */, showCardEvent);
        if (card.is(0 /* Basic */)) {
            await room.drawCards(1, fromId, 'top', fromId, this.Name);
        }
        else if (card.is(1 /* Equip */) && to.canUseCard(room, cardId)) {
            await room.useCard({
                fromId: toId,
                cardId,
                triggeredBySkills: [this.Name],
            });
            await room.recover({
                toId,
                recoveredHp: 1,
                triggeredBySkills: [this.Name],
            });
        }
        return true;
    }
};
ZhiYan = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'zhiyan', description: 'zhiyan_description' })
], ZhiYan);
exports.ZhiYan = ZhiYan;
