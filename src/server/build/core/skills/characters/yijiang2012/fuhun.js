"use strict";
var FuHunDamage_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuHunLoseSkill = exports.FuHunDamage = exports.FuHun = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const paoxiao_1 = require("../standard/paoxiao");
const wusheng_1 = require("../standard/wusheng");
let FuHun = class FuHun extends skill_1.ViewAsSkill {
    get RelatedSkills() {
        return ['wusheng', 'paoxiao'];
    }
    canViewAs() {
        return ['slash'];
    }
    canUse(room, owner) {
        return owner.canUseCard(room, new card_matcher_1.CardMatcher({ generalName: ['slash'] }));
    }
    cardFilter(room, owner, cards) {
        return cards.length === 2;
    }
    isAvailableCard(room, owner, pendingCardId, selectedCards, containerCard) {
        return pendingCardId !== containerCard;
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    viewAs(selectedCards) {
        return card_1.VirtualCard.create({
            cardName: 'slash',
            bySkill: this.Name,
        }, selectedCards);
    }
};
FuHun = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'fuhun', description: 'fuhun_description' })
], FuHun);
exports.FuHun = FuHun;
let FuHunDamage = FuHunDamage_1 = class FuHunDamage extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterDamageEffect" /* AfterDamageEffect */;
    }
    canUse(room, owner, content) {
        if (!content.cardIds) {
            return false;
        }
        let isFuHun = false;
        for (const cardId of content.cardIds) {
            const card = engine_1.Sanguosha.getCardById(cardId);
            if (card.isVirtualCard()) {
                const vCard = card;
                isFuHun = vCard.findByGeneratedSkill(this.GeneralName);
                if (isFuHun) {
                    break;
                }
            }
        }
        return content.fromId === owner.Id && isFuHun;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const from = room.getPlayerById(fromId);
        if (!room.getPlayerById(fromId).hasSkill(wusheng_1.WuSheng.Name)) {
            room.obtainSkill(fromId, wusheng_1.WuSheng.Name);
            from.setFlag(FuHunDamage_1.WuSheng, true);
        }
        if (!room.getPlayerById(fromId).hasSkill(paoxiao_1.PaoXiao.Name)) {
            room.obtainSkill(fromId, paoxiao_1.PaoXiao.Name);
            from.setFlag(FuHunDamage_1.PaoXiao, true);
        }
        return true;
    }
};
FuHunDamage.WuSheng = 'fuhun_wusheng';
FuHunDamage.PaoXiao = 'fuhun_paoxiao';
FuHunDamage = FuHunDamage_1 = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_1.CommonSkill({ name: FuHun.Name, description: FuHun.Description })
], FuHunDamage);
exports.FuHunDamage = FuHunDamage;
let FuHunLoseSkill = class FuHunLoseSkill extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    async whenLosingSkill(room, from) {
        if (from.getFlag(FuHunDamage.WuSheng)) {
            await room.loseSkill(from.Id, wusheng_1.WuSheng.Name);
            from.removeFlag(FuHunDamage.WuSheng);
        }
        if (room.getFlag(from.Id, FuHunDamage.PaoXiao)) {
            await room.loseSkill(from.Id, paoxiao_1.PaoXiao.Name);
            from.removeFlag(FuHunDamage.PaoXiao);
        }
    }
    afterDead() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, event) {
        return (event.fromPlayer === owner.Id &&
            event.from === 7 /* PhaseFinish */ &&
            (owner.getFlag(FuHunDamage.WuSheng) === true || owner.getFlag(FuHunDamage.PaoXiao) === true));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const from = room.getPlayerById(fromId);
        if (from.getFlag(FuHunDamage.WuSheng)) {
            await room.loseSkill(fromId, wusheng_1.WuSheng.Name);
            from.removeFlag(FuHunDamage.WuSheng);
        }
        if (room.getFlag(fromId, FuHunDamage.PaoXiao)) {
            await room.loseSkill(fromId, paoxiao_1.PaoXiao.Name);
            from.removeFlag(FuHunDamage.PaoXiao);
        }
        return true;
    }
};
FuHunLoseSkill = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_1.CommonSkill({ name: FuHunDamage.Name, description: FuHunDamage.Description })
], FuHunLoseSkill);
exports.FuHunLoseSkill = FuHunLoseSkill;
