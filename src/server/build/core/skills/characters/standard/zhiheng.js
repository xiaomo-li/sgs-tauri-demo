"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhiHeng = void 0;
const tslib_1 = require("tslib");
const zhiheng_1 = require("core/ai/skills/characters/standard/zhiheng");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
let ZhiHeng = class ZhiHeng extends skill_1.ActiveSkill {
    get RelatedCharacters() {
        return ['god_simayi'];
    }
    audioIndex(characterName) {
        return characterName && this.RelatedCharacters.includes(characterName) ? 1 : 2;
    }
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
    }
    isRefreshAt(room, owner, phase) {
        return phase === 4 /* PlayCardStage */;
    }
    numberOfTargets() {
        return 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length > 0;
    }
    isAvailableTarget() {
        return false;
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        skillUseEvent.cardIds = precondition_1.Precondition.exists(skillUseEvent.cardIds, 'Unable to get zhiheng cards');
        const handCards = room.getPlayerById(skillUseEvent.fromId).getCardIds(0 /* HandArea */);
        let additionalCardDraw = 0;
        if (skillUseEvent.cardIds.filter(zhihengCard => handCards.includes(zhihengCard)).length === handCards.length &&
            handCards.length > 0) {
            additionalCardDraw++;
        }
        await room.dropCards(4 /* SelfDrop */, skillUseEvent.cardIds, skillUseEvent.fromId, skillUseEvent.fromId, this.Name);
        await room.drawCards(skillUseEvent.cardIds.length + additionalCardDraw, skillUseEvent.fromId, undefined, skillUseEvent.fromId, this.Name);
        return true;
    }
};
ZhiHeng = tslib_1.__decorate([
    skill_1.AI(zhiheng_1.ZhiHengSkillTrigger),
    skill_1.CommonSkill({ name: 'zhiheng', description: 'zhiheng_description' })
], ZhiHeng);
exports.ZhiHeng = ZhiHeng;
