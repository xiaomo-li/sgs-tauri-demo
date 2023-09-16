"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiZhiShadow = exports.ShiZhiTransform = exports.ShiZhi = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let ShiZhi = class ShiZhi extends skill_1.TriggerSkill {
    audioIndex() {
        return 0;
    }
    isTriggerable(event, stage) {
        return stage === "AfterDamageEffect" /* AfterDamageEffect */;
    }
    canUse(room, owner, content) {
        if (content.fromId !== owner.Id || !content.cardIds || content.isFromChainedDamage) {
            return false;
        }
        const card = engine_1.Sanguosha.getCardById(content.cardIds[0]);
        return card.isVirtualCard() && card.findByGeneratedSkill(this.GeneralName);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.recover({
            toId: event.fromId,
            recoveredHp: 1,
            recoverBy: event.fromId,
        });
        return true;
    }
};
ShiZhi = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'shizhi', description: 'shizhi_description' })
], ShiZhi);
exports.ShiZhi = ShiZhi;
let ShiZhiTransform = class ShiZhiTransform extends skill_1.TransformSkill {
    async whenObtainingSkill(room, owner) {
        const cards = owner.getCardIds(0 /* HandArea */).map(cardId => {
            if (this.canTransform(owner, cardId)) {
                return this.forceToTransformCardTo(cardId).Id;
            }
            return cardId;
        });
        owner.setupCards(0 /* HandArea */, cards);
    }
    async whenLosingSkill(room, owner) {
        const cards = owner.getCardIds(0 /* HandArea */).map(cardId => {
            if (!card_1.Card.isVirtualCardId(cardId)) {
                return cardId;
            }
            const card = engine_1.Sanguosha.getCardById(cardId);
            if (!card.findByGeneratedSkill(ShiZhi.Name)) {
                return cardId;
            }
            return card.ActualCardIds[0];
        });
        owner.setupCards(0 /* HandArea */, cards);
    }
    canTransform(owner, cardId) {
        const card = engine_1.Sanguosha.getCardById(cardId);
        return owner.Hp === 1 && card.GeneralName === 'jink';
    }
    includesJudgeCard() {
        return true;
    }
    forceToTransformCardTo(cardId) {
        return card_1.VirtualCard.create({
            cardName: 'slash',
            bySkill: ShiZhi.Name,
        }, [cardId]);
    }
};
ShiZhiTransform = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CompulsorySkill({ name: 's_shizhi_transform', description: 's_shizhi_transform_description' })
], ShiZhiTransform);
exports.ShiZhiTransform = ShiZhiTransform;
let ShiZhiShadow = class ShiZhiShadow extends skill_1.TriggerSkill {
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterHpChange" /* AfterHpChange */;
    }
    canUse(room, owner, content) {
        return (content.toId === owner.Id &&
            ((owner.Hp === 1 && !owner.hasShadowSkill(ShiZhiTransform.Name)) ||
                (owner.Hp !== 1 && owner.hasShadowSkill(ShiZhiTransform.Name))));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const from = room.getPlayerById(event.fromId);
        if (from.Hp === 1) {
            await room.obtainSkill(event.fromId, ShiZhiTransform.Name);
        }
        else {
            await room.loseSkill(event.fromId, ShiZhiTransform.Name);
        }
        return true;
    }
};
ShiZhiShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CompulsorySkill({ name: ShiZhi.Name, description: ShiZhi.Description })
], ShiZhiShadow);
exports.ShiZhiShadow = ShiZhiShadow;
