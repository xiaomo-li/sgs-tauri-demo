"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SongCiShadow = exports.SongCi = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let SongCi = class SongCi extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return (owner.getFlag(this.Name) || []).length < room.AlivePlayers.length;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        var _a;
        return !((_a = room.getFlag(owner, this.Name)) === null || _a === void 0 ? void 0 : _a.includes(target));
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
        const { toIds } = event;
        if (!toIds) {
            return false;
        }
        const originalPlayers = room.getFlag(event.fromId, this.Name) || [];
        originalPlayers.includes(toIds[0]) || originalPlayers.push(toIds[0]);
        room.setFlag(event.fromId, this.Name, originalPlayers);
        if (room.getPlayerById(toIds[0]).Hp < room.getPlayerById(toIds[0]).getCardIds(0 /* HandArea */).length) {
            const { droppedCards } = await room.askForCardDrop(toIds[0], 2, [0 /* HandArea */, 1 /* EquipArea */], true, undefined, this.Name);
            await room.dropCards(4 /* SelfDrop */, droppedCards, toIds[0], toIds[0], this.Name);
        }
        else {
            await room.drawCards(2, toIds[0], 'top', toIds[0], this.Name);
        }
        return true;
    }
};
SongCi = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'songci', description: 'songci_description' })
], SongCi);
exports.SongCi = SongCi;
let SongCiShadow = class SongCiShadow extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, event) {
        return (event.playerId === owner.Id &&
            event.toStage === 18 /* DropCardStageEnd */ &&
            (owner.getFlag(this.GeneralName) || []).length >= room.AlivePlayers.length);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.drawCards(1, event.fromId, 'top', event.fromId, this.Name);
        return true;
    }
};
SongCiShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: SongCi.Name, description: SongCi.Description })
], SongCiShadow);
exports.SongCiShadow = SongCiShadow;
