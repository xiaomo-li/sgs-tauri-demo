"use strict";
var XunYi_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.XunYiMove = exports.XunYiEffect = exports.XunYi = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let XunYi = XunYi_1 = class XunYi extends skill_1.TriggerSkill {
    async whenDead(room, owner) {
        const target = owner.getFlag(XunYi_1.XunYiTarget);
        if (target && !room.getPlayerById(target).Dead) {
            const users = room.getFlag(target, this.Name) || [];
            if (users.length === 1) {
                room.removeFlag(target, this.Name);
            }
            else if (users.length > 0) {
                const index = users.findIndex(user => user === owner.Id);
                index !== -1 && users.splice(index, 1);
                room.setFlag(target, this.Name, users, 'xunyi:yi');
            }
        }
        owner.removeFlag(XunYi_1.XunYiTarget);
    }
    isTriggerable(event, stage) {
        return stage === "AfterGameBegan" /* AfterGameBegan */;
    }
    canUse() {
        return true;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, targetId) {
        return targetId !== owner;
    }
    getSkillLog(room, owner) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose a target to gain 1 ‘Yi’?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        if (!toIds) {
            return false;
        }
        room.getPlayerById(fromId).setFlag(XunYi_1.XunYiTarget, toIds[0]);
        const originalUsers = room.getFlag(toIds[0], this.Name) || [];
        originalUsers.push(fromId);
        room.setFlag(toIds[0], this.Name, originalUsers, 'xunyi:yi');
        return true;
    }
};
XunYi.XunYiTarget = 'xunyi_target';
XunYi = XunYi_1 = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'xunyi', description: 'xunyi_description' })
], XunYi);
exports.XunYi = XunYi;
let XunYiEffect = class XunYiEffect extends skill_1.TriggerSkill {
    constructor() {
        super(...arguments);
        this.XunYiStage = 'xunyi_stage';
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterDamageEffect" /* AfterDamageEffect */ || stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    canUse(room, owner, content, stage) {
        if (!stage) {
            return false;
        }
        let canUse = false;
        const damageEvent = content;
        const target = owner.getFlag(XunYi.XunYiTarget);
        if (!target) {
            return false;
        }
        if (stage === "AfterDamageEffect" /* AfterDamageEffect */) {
            canUse =
                (target === damageEvent.fromId && damageEvent.toId !== owner.Id) ||
                    (owner.Id === damageEvent.fromId && target !== damageEvent.toId);
        }
        else {
            canUse =
                (target === damageEvent.toId && damageEvent.fromId !== owner.Id) ||
                    (owner.Id === damageEvent.toId && target !== damageEvent.fromId);
        }
        if (canUse) {
            owner.setFlag(this.XunYiStage, stage);
        }
        return canUse;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const from = room.getPlayerById(fromId);
        const damageEvent = triggeredOnEvent;
        const stage = from.getFlag(this.XunYiStage);
        from.removeFlag(this.XunYiStage);
        const target = room.getPlayerById(fromId).getFlag(XunYi.XunYiTarget);
        if (stage === "AfterDamageEffect" /* AfterDamageEffect */) {
            const player = target === damageEvent.fromId ? fromId : target;
            await room.drawCards(1, player, 'top', player, this.GeneralName);
        }
        else {
            const player = target === damageEvent.toId ? fromId : target;
            const response = await room.askForCardDrop(player, 1, [0 /* HandArea */, 1 /* EquipArea */], true, undefined, this.Name, translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please drop a card', this.Name).extract());
            response.droppedCards.length > 0 &&
                (await room.dropCards(4 /* SelfDrop */, response.droppedCards, player, player, this.GeneralName));
        }
        return true;
    }
};
XunYiEffect = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: XunYi.Name, description: XunYi.Description })
], XunYiEffect);
exports.XunYiEffect = XunYiEffect;
let XunYiMove = class XunYiMove extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "PlayerDied" /* PlayerDied */;
    }
    canUse(room, owner, content) {
        return owner.getFlag(XunYi.XunYiTarget) === content.playerId;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, targetId) {
        var _a;
        return targetId !== owner && !((_a = room.getFlag(targetId, this.GeneralName)) === null || _a === void 0 ? void 0 : _a.includes(owner));
    }
    getSkillLog(room, owner) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose a target to gain 1 ‘Yi’?', this.GeneralName).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        if (!toIds) {
            return false;
        }
        room.getPlayerById(fromId).setFlag(XunYi.XunYiTarget, toIds[0]);
        const originalUsers = room.getFlag(toIds[0], this.GeneralName) || [];
        originalUsers.push(fromId);
        room.setFlag(toIds[0], this.GeneralName, originalUsers, 'xunyi:yi');
        return true;
    }
};
XunYiMove = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: XunYiEffect.Name, description: XunYiEffect.Description })
], XunYiMove);
exports.XunYiMove = XunYiMove;
