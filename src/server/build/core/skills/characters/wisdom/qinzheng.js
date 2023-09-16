"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QinZhengShadow = exports.QinZheng = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let QinZheng = class QinZheng extends skill_1.TriggerSkill {
    async whenObtainingSkill(room, owner) {
        const cardUsedNum = room.Analytics.getRecordEvents(event => (event_packer_1.EventPacker.getIdentifier(event) === 124 /* CardUseEvent */ ||
            event_packer_1.EventPacker.getIdentifier(event) === 123 /* CardResponseEvent */) &&
            event.fromId === owner.Id, owner.Id).length;
        room.setFlag(owner.Id, this.Name, cardUsedNum, translation_json_tool_1.TranslationPack.translationJsonPatcher('qinzheng times: {0}', cardUsedNum).toString());
    }
    async whenLosingSkill(room, owner) {
        if (owner.getFlag(this.Name) !== undefined) {
            room.removeFlag(owner.Id, this.Name);
        }
    }
    isTriggerable(event, stage) {
        return stage === "CardUsing" /* CardUsing */ || stage === "CardResponsing" /* CardResponsing */;
    }
    canUse(room, owner, content) {
        const cardUsedNum = owner.getFlag(this.Name) || 0;
        const factors = [3, 5, 8];
        return owner.Id === content.fromId && factors.find(factor => cardUsedNum % factor === 0) !== undefined;
    }
    async onTrigger() {
        return true;
    }
    async gainQinZhengCard(room, owner, patterns) {
        const toGain = [];
        for (const card of patterns) {
            const cards = room.findCardsByMatcherFrom(new card_matcher_1.CardMatcher({ generalName: [card] }));
            if (cards.length > 0) {
                toGain.push(cards[Math.floor(Math.random() * cards.length)]);
            }
        }
        if (toGain.length > 0) {
            await room.moveCards({
                movingCards: [{ card: toGain[Math.floor(Math.random() * toGain.length)], fromArea: 5 /* DrawStack */ }],
                toId: owner,
                moveReason: 2 /* ActiveMove */,
                toArea: 0 /* HandArea */,
                proposer: owner,
            });
        }
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const cardUsedNum = room.getFlag(fromId, this.Name);
        if (cardUsedNum % 3 === 0) {
            await this.gainQinZhengCard(room, fromId, ['slash', 'jink']);
        }
        if (cardUsedNum % 5 === 0) {
            await this.gainQinZhengCard(room, fromId, ['peach', 'alcohol']);
        }
        if (cardUsedNum % 8 === 0) {
            await this.gainQinZhengCard(room, fromId, ['wuzhongshengyou', 'duel']);
        }
        return true;
    }
};
QinZheng = tslib_1.__decorate([
    skill_1.CompulsorySkill({ name: 'qinzheng', description: 'qinzheng_description' })
], QinZheng);
exports.QinZheng = QinZheng;
let QinZhengShadow = class QinZhengShadow extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "BeforeCardUseEffect" /* BeforeCardUseEffect */ || stage === "PreCardResponse" /* PreCardResponse */;
    }
    canUse(room, owner, content) {
        return owner.Id === content.fromId;
    }
    isFlaggedSkill() {
        return true;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const cardUsedNum = room.getFlag(fromId, this.GeneralName) || 0;
        room.setFlag(fromId, this.GeneralName, cardUsedNum + 1, translation_json_tool_1.TranslationPack.translationJsonPatcher('qinzheng times: {0}', cardUsedNum + 1).toString());
        return true;
    }
};
QinZhengShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_1.CompulsorySkill({ name: QinZheng.Name, description: QinZheng.Description })
], QinZhengShadow);
exports.QinZhengShadow = QinZhengShadow;
