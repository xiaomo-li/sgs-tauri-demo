"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LongNuClear = exports.LongNuShaodw = exports.ThunderLongNu = exports.FireLongNu = exports.LongNu = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const game_props_1 = require("core/game/game_props");
const skill_1 = require("core/skills/skill");
let LongNu = class LongNu extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return owner.Id === content.playerId && 13 /* PlayCardStageStart */ === content.toStage;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const from = room.getPlayerById(fromId);
        const switchSkillState = from.getSwitchSkillState(this.Name);
        const judge = switchSkillState === 0 /* Yang */;
        if (judge) {
            await room.loseHp(fromId, 1);
        }
        else {
            await room.changeMaxHp(fromId, -1);
        }
        if (!from.Dead) {
            await room.drawCards(1, fromId, 'top', fromId, this.Name);
            await room.obtainSkill(fromId, judge ? FireLongNu.Name : ThunderLongNu.Name);
            room.setFlag(fromId, this.Name, switchSkillState);
        }
        return true;
    }
};
LongNu = tslib_1.__decorate([
    skill_1.SwitchSkill(),
    skill_1.CompulsorySkill({ name: 'longnu', description: 'longnu_description' })
], LongNu);
exports.LongNu = LongNu;
let FireLongNu = class FireLongNu extends skill_1.TransformSkill {
    async whenObtainingSkill(room, owner) {
        const cards = owner.getCardIds(0 /* HandArea */).map(cardId => {
            if (this.canTransform(owner, cardId, 0 /* HandArea */)) {
                return this.forceToTransformCardTo(cardId).Id;
            }
            return cardId;
        });
        room.broadcast(107 /* PlayerPropertiesChangeEvent */, {
            changedProperties: [
                {
                    toId: owner.Id,
                    handCards: cards,
                },
            ],
        });
    }
    async whenLosingSkill(room, owner) {
        const cards = owner.getCardIds(0 /* HandArea */).map(cardId => {
            if (!card_1.Card.isVirtualCardId(cardId)) {
                return cardId;
            }
            const card = engine_1.Sanguosha.getCardById(cardId);
            if (!card.findByGeneratedSkill(this.Name)) {
                return cardId;
            }
            return card.ActualCardIds[0];
        });
        owner.setupCards(0 /* HandArea */, cards);
    }
    canTransform(owner, cardId, area) {
        const card = engine_1.Sanguosha.getCardById(cardId);
        return card.Color === 0 /* Red */ && area === 0 /* HandArea */;
    }
    forceToTransformCardTo(cardId) {
        return card_1.VirtualCard.create({
            cardName: 'fire_slash',
            bySkill: this.Name,
        }, [cardId]);
    }
};
FireLongNu = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CompulsorySkill({ name: 'fire_longnu', description: 'fire_longnu_description' })
], FireLongNu);
exports.FireLongNu = FireLongNu;
let ThunderLongNu = class ThunderLongNu extends skill_1.TransformSkill {
    async whenObtainingSkill(room, owner) {
        const cards = owner.getCardIds(0 /* HandArea */).map(cardId => {
            if (this.canTransform(owner, cardId, 0 /* HandArea */)) {
                return this.forceToTransformCardTo(cardId).Id;
            }
            return cardId;
        });
        room.broadcast(107 /* PlayerPropertiesChangeEvent */, {
            changedProperties: [
                {
                    toId: owner.Id,
                    handCards: cards,
                },
            ],
        });
    }
    async whenLosingSkill(room, owner) {
        const cards = owner.getCardIds(0 /* HandArea */).map(cardId => {
            if (!card_1.Card.isVirtualCardId(cardId)) {
                return cardId;
            }
            const card = engine_1.Sanguosha.getCardById(cardId);
            if (!card.findByGeneratedSkill(this.Name)) {
                return cardId;
            }
            return card.ActualCardIds[0];
        });
        owner.setupCards(0 /* HandArea */, cards);
    }
    canTransform(owner, cardId, area) {
        const card = engine_1.Sanguosha.getCardById(cardId);
        return card.is(7 /* Trick */) && area === 0 /* HandArea */;
    }
    forceToTransformCardTo(cardId) {
        return card_1.VirtualCard.create({
            cardName: 'thunder_slash',
            bySkill: this.Name,
        }, [cardId]);
    }
};
ThunderLongNu = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CompulsorySkill({ name: 'thunder_longnu', description: 'thunder_longnu_description' })
], ThunderLongNu);
exports.ThunderLongNu = ThunderLongNu;
let LongNuShaodw = class LongNuShaodw extends skill_1.RulesBreakerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 4 /* PlayCardStage */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    breakCardUsableDistance(cardId, room, owner) {
        let match = false;
        const switchSkillState = owner.getFlag(this.GeneralName);
        if (switchSkillState !== 0 /* Yang */) {
            return 0;
        }
        if (cardId instanceof card_matcher_1.CardMatcher) {
            match = cardId.match(new card_matcher_1.CardMatcher({ name: ['fire_slash'] }));
        }
        else {
            const card = engine_1.Sanguosha.getCardById(cardId);
            match = card.Name === 'fire_slash';
        }
        return match ? game_props_1.INFINITE_TRIGGERING_TIMES : 0;
    }
    breakCardUsableTimes(cardId, room, owner) {
        let match = false;
        const switchSkillState = owner.getFlag(this.GeneralName);
        if (switchSkillState !== 1 /* Yin */) {
            return 0;
        }
        if (cardId instanceof card_matcher_1.CardMatcher) {
            match = cardId.match(new card_matcher_1.CardMatcher({ name: ['thunder_slash'] }));
        }
        else {
            const card = engine_1.Sanguosha.getCardById(cardId);
            match = card.Name === 'thunder_slash';
        }
        return match ? game_props_1.INFINITE_TRIGGERING_TIMES : 0;
    }
};
LongNuShaodw = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CompulsorySkill({ name: LongNu.Name, description: LongNu.Description })
], LongNuShaodw);
exports.LongNuShaodw = LongNuShaodw;
let LongNuClear = class LongNuClear extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 4 /* PlayCardStage */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, event) {
        return (owner.Id === event.fromPlayer &&
            event.from === 4 /* PlayCardStage */ &&
            owner.getFlag(this.GeneralName) !== undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        room.removeFlag(fromId, this.GeneralName);
        const from = room.getPlayerById(event.fromId);
        if (from.hasShadowSkill(FireLongNu.Name)) {
            await room.loseSkill(fromId, FireLongNu.Name);
        }
        if (from.hasShadowSkill(ThunderLongNu.Name)) {
            await room.loseSkill(fromId, ThunderLongNu.Name);
        }
        return true;
    }
};
LongNuClear = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CompulsorySkill({ name: LongNuShaodw.Name, description: LongNuShaodw.Description })
], LongNuClear);
exports.LongNuClear = LongNuClear;
