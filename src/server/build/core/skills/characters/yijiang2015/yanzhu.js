"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YanZhuEX = exports.YanZhuDebuff = exports.YanZhu = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skills_1 = require("core/skills");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let YanZhu = class YanZhu extends skill_1.ActiveSkill {
    get RelatedSkills() {
        return ['yanzhu_ex'];
    }
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner && room.getPlayerById(target).getPlayerCards().length > 0;
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
        const response = await room.askForCardDrop(toIds[0], 1, [0 /* HandArea */, 1 /* EquipArea */], room.getPlayerById(toIds[0]).getCardIds(1 /* EquipArea */).length === 0, undefined, this.Name, room.getPlayerById(toIds[0]).getCardIds(1 /* EquipArea */).length > 0
            ? translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please discard a card, or you must give {1} all the cards in your eqiup area', this.Name).extract()
            : undefined);
        if (response.droppedCards.length > 0) {
            await room.dropCards(4 /* SelfDrop */, response.droppedCards, toIds[0], toIds[0], this.Name);
            const originalDamage = room.getFlag(toIds[0], this.Name) || 0;
            room.setFlag(toIds[0], this.Name, originalDamage + 1, translation_json_tool_1.TranslationPack.translationJsonPatcher('yanzhu points: {0}', originalDamage + 1).toString());
            room.getPlayerById(toIds[0]).hasShadowSkill(YanZhuDebuff.Name) ||
                (await room.obtainSkill(toIds[0], YanZhuDebuff.Name));
        }
        else {
            await room.moveCards({
                movingCards: room
                    .getPlayerById(toIds[0])
                    .getCardIds(1 /* EquipArea */)
                    .map(card => ({ card, fromArea: 1 /* EquipArea */ })),
                fromId: toIds[0],
                toId: fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                proposer: fromId,
                triggeredBySkills: [this.Name],
            });
            await room.updateSkill(fromId, this.Name, YanZhuEX.Name);
            await room.updateSkill(fromId, skills_1.XingXue.Name, skills_1.XingXueEX.Name);
        }
        return true;
    }
};
YanZhu = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'yanzhu', description: 'yanzhu_description' })
], YanZhu);
exports.YanZhu = YanZhu;
let YanZhuDebuff = class YanZhuDebuff extends skill_1.TriggerSkill {
    async whenDead(room, player) {
        await room.loseSkill(player.Id, this.Name);
        room.removeFlag(player.Id, YanZhu.Name);
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill(room, event, stage) {
        return stage === "AfterPhaseChanged" /* AfterPhaseChanged */;
    }
    isTriggerable(event, stage) {
        return stage === "DamagedEffect" /* DamagedEffect */ || stage === "AfterPhaseChanged" /* AfterPhaseChanged */;
    }
    canUse(room, owner, event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 137 /* DamageEvent */) {
            return event.toId === owner.Id;
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = event;
            return phaseChangeEvent.toPlayer === owner.Id && phaseChangeEvent.to === 0 /* PhaseBegin */;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const additionalDamage = room.getFlag(event.fromId, YanZhu.Name);
        if (additionalDamage) {
            room.removeFlag(event.fromId, YanZhu.Name);
            const unkownEvent = event.triggeredOnEvent;
            if (event_packer_1.EventPacker.getIdentifier(unkownEvent) === 137 /* DamageEvent */) {
                unkownEvent.damage += additionalDamage;
            }
        }
        await room.loseSkill(event.fromId, this.Name);
        return true;
    }
};
YanZhuDebuff = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_yanzhu_debuff', description: 's_yanzhu_debuff_description' })
], YanZhuDebuff);
exports.YanZhuDebuff = YanZhuDebuff;
let YanZhuEX = class YanZhuEX extends YanZhu {
    get GeneralName() {
        return YanZhu.Name;
    }
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name) && !owner.hasUsedSkill(this.GeneralName);
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner;
    }
    async onEffect(room, event) {
        const { toIds } = event;
        if (!toIds) {
            return false;
        }
        const originalDamage = room.getFlag(toIds[0], this.GeneralName) || 0;
        room.setFlag(toIds[0], this.GeneralName, originalDamage + 1, translation_json_tool_1.TranslationPack.translationJsonPatcher('yanzhu points: {0}', originalDamage + 1).toString());
        room.getPlayerById(toIds[0]).hasShadowSkill(YanZhuDebuff.Name) ||
            (await room.obtainSkill(toIds[0], YanZhuDebuff.Name));
        return true;
    }
};
YanZhuEX = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'yanzhu_ex', description: 'yanzhu_ex_description' })
], YanZhuEX);
exports.YanZhuEX = YanZhuEX;
