"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChuanYun = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let ChuanYun = class ChuanYun extends skill_1.TriggerSkill {
    get RelatedCharacters() {
        return ['tongyuan_c'];
    }
    audioIndex(characterName) {
        return characterName && this.RelatedCharacters.includes(characterName) ? 1 : 0;
    }
    isTriggerable(event, stage) {
        return stage === "AfterAim" /* AfterAim */;
    }
    canUse(room, owner, content) {
        return (content.fromId === owner.Id &&
            engine_1.Sanguosha.getCardById(content.byCardId).GeneralName === 'slash' &&
            room.getPlayerById(content.toId).getCardIds(1 /* EquipArea */).length > 0);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const to = room.getPlayerById(event.triggeredOnEvent.toId);
        const equips = to.getCardIds(1 /* EquipArea */);
        await room.dropCards(4 /* SelfDrop */, [equips[Math.floor(Math.random() * equips.length)]], to.Id, to.Id, this.Name);
        return true;
    }
};
ChuanYun = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'chuanyun', description: 'chuanyun_description' })
], ChuanYun);
exports.ChuanYun = ChuanYun;
