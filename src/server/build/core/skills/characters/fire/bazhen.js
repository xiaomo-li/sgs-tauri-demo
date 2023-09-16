"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaZhen = void 0;
const tslib_1 = require("tslib");
const baguazhen_1 = require("core/skills/cards/standard/baguazhen");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let BaZhen = class BaZhen extends baguazhen_1.BaGuaZhenSkill {
    get RelatedCharacters() {
        return ['pangtong'];
    }
    async beforeUse(room, event) {
        const askForInvoke = {
            toId: event.fromId,
            invokeSkillNames: [this.Name],
        };
        room.notify(171 /* AskForSkillUseEvent */, askForInvoke, event.fromId);
        const { invoke } = await room.onReceivingAsyncResponseFrom(171 /* AskForSkillUseEvent */, event.fromId);
        return invoke !== undefined;
    }
    canUse(room, owner, content) {
        return (super.canUse(room, owner, content) &&
            owner.getEquipment(3 /* Shield */) === undefined &&
            owner.canEquipTo("shield section" /* Shield */));
    }
};
BaZhen = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'bazhen', description: 'bazhen_description' })
], BaZhen);
exports.BaZhen = BaZhen;
