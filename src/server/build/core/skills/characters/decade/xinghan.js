"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XingHanShadow = exports.XingHan = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const zhenge_1 = require("./zhenge");
let XingHan = class XingHan extends skill_1.TriggerSkill {
    async whenObtainingSkill(room, owner) {
        const records = room.Analytics.getRecordEvents(event => event_packer_1.EventPacker.getIdentifier(event) === 124 /* CardUseEvent */ &&
            engine_1.Sanguosha.getCardById(event.cardId).GeneralName === 'slash', undefined, 'round', undefined, 1);
        if (records.length > 0 && !owner.getFlag(XingHanShadow.Name)) {
            owner.setFlag(XingHanShadow.Name, true);
            records[0].triggeredBySkills = [...(records[0].triggeredBySkills || []), this.Name];
        }
    }
    isTriggerable(event, stage) {
        return stage === "AfterDamageEffect" /* AfterDamageEffect */;
    }
    canUse(room, owner, content) {
        var _a;
        return (content.triggeredBySkills.includes(this.Name) &&
            content.cardIds !== undefined &&
            engine_1.Sanguosha.getCardById(content.cardIds[0]).GeneralName === 'slash' &&
            content.fromId !== undefined &&
            ((_a = owner.getFlag(zhenge_1.ZhenGe.ZhenGeTargets)) === null || _a === void 0 ? void 0 : _a.includes(content.fromId)));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const notRichest = room
            .getOtherPlayers(fromId)
            .find(player => room.getPlayerById(fromId).getCardIds(0 /* HandArea */).length <=
            player.getCardIds(0 /* HandArea */).length);
        await room.drawCards(notRichest
            ? Math.min(room
                .getPlayerById(event.triggeredOnEvent.fromId)
                .getAttackRange(room), 5)
            : 1, fromId, 'top', fromId, this.Name);
        return true;
    }
};
XingHan = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'xinghan', description: 'xinghan_description' })
], XingHan);
exports.XingHan = XingHan;
let XingHanShadow = class XingHanShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "BeforeCardUseEffect" /* BeforeCardUseEffect */ || stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = event;
            return !owner.getFlag(this.Name) && engine_1.Sanguosha.getCardById(cardUseEvent.cardId).GeneralName === 'slash';
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = event;
            return phaseChangeEvent.from === 7 /* PhaseFinish */ && owner.getFlag(this.Name);
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = unknownEvent;
            room.getPlayerById(event.fromId).setFlag(this.Name, true);
            cardUseEvent.triggeredBySkills = [...(cardUseEvent.triggeredBySkills || []), this.GeneralName];
        }
        else {
            room.removeFlag(event.fromId, this.Name);
        }
        return true;
    }
};
XingHanShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CompulsorySkill({ name: XingHan.Name, description: XingHan.Description })
], XingHanShadow);
exports.XingHanShadow = XingHanShadow;
