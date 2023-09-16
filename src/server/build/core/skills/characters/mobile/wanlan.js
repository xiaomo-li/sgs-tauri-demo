"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WanLanShadow = exports.WanLan = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let WanLan = class WanLan extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "PlayerDying" /* PlayerDying */;
    }
    canUse(room, owner, event) {
        return !room.getPlayerById(event.dying).Dead && room.getPlayerById(event.dying).Hp <= 0;
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to use this skill, discard all your hand cards, then let {1} recover to 1 hp, and deal 1 damage to current player?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.dying))).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.dropCards(4 /* SelfDrop */, room.getPlayerById(event.fromId).getCardIds(0 /* HandArea */), event.fromId, event.fromId, this.Name);
        const dying = event.triggeredOnEvent.dying;
        await room.recover({
            toId: dying,
            recoveredHp: 1 - room.getPlayerById(dying).Hp,
            recoverBy: event.fromId,
        });
        event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: true }, event.triggeredOnEvent);
        return true;
    }
};
WanLan = tslib_1.__decorate([
    skill_wrappers_1.LimitSkill({ name: 'wanlan', description: 'wanlan_description' })
], WanLan);
exports.WanLan = WanLan;
let WanLanShadow = class WanLanShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return (event_packer_1.EventPacker.getMiddleware(this.GeneralName, content) === true &&
            stage === "AfterPlayerDying" /* AfterPlayerDying */);
    }
    isTriggerable(event, stage) {
        return stage === "AfterPlayerDying" /* AfterPlayerDying */;
    }
    canUse(room, owner, event) {
        return (event_packer_1.EventPacker.getMiddleware(this.GeneralName, event) === true &&
            !owner.Dead &&
            room.CurrentPlayer !== undefined &&
            !room.CurrentPlayer.Dead);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.damage({
            fromId: event.fromId,
            toId: room.CurrentPlayer.Id,
            damage: 1,
            damageType: "normal_property" /* Normal */,
            triggeredBySkills: [this.Name],
        });
        return true;
    }
};
WanLanShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: WanLan.Name, description: WanLan.Description })
], WanLanShadow);
exports.WanLanShadow = WanLanShadow;
