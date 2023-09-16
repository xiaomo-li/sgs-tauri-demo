"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PveClassicLianZhenBuf = exports.PveClassicLianZhen = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let PveClassicLianZhen = class PveClassicLianZhen extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterPhaseChanged" /* AfterPhaseChanged */;
    }
    canUse(room, owner, content) {
        return content.toPlayer === owner.Id && content.to === 0 /* PhaseBegin */;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return owner !== target;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (event.toIds && event.toIds[0]) {
            room.getPlayerById(event.fromId).setFlag(this.GeneralName, event.toIds[0]);
        }
        else {
            room.getPlayerById(event.fromId).removeFlag(this.GeneralName);
        }
        return true;
    }
};
PveClassicLianZhen = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'pve_classic_lianzhen', description: 'pve_classic_lianzhen_description' })
], PveClassicLianZhen);
exports.PveClassicLianZhen = PveClassicLianZhen;
let PveClassicLianZhenBuf = class PveClassicLianZhenBuf extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, content) {
        return (owner.getFlag(this.GeneralName) !== undefined &&
            content.infos.find(info => info.toId === owner.getFlag(this.GeneralName) && info.toArea === 0 /* HandArea */) !== undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const owner = room.getPlayerById(event.fromId);
        const moveCardEvent = event.triggeredOnEvent;
        const cardNumber = moveCardEvent.infos
            .filter(info => info.toId === owner.getFlag(this.GeneralName))
            .map(info => info.movingCards.length)
            .reduce((aur, cur) => aur + cur);
        await room.drawCards(room.CurrentPlayer === owner ? cardNumber * 2 : cardNumber, owner.Id);
        return true;
    }
};
PveClassicLianZhenBuf = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CompulsorySkill({ name: PveClassicLianZhen.Name, description: PveClassicLianZhen.Description })
], PveClassicLianZhenBuf);
exports.PveClassicLianZhenBuf = PveClassicLianZhenBuf;
