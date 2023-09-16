"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SongShu = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let SongShu = class SongShu extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.getFlag(this.Name) && owner.getCardIds(0 /* HandArea */).length > 0;
    }
    async whenRefresh(room, owner) {
        room.removeFlag(owner.Id, this.Name);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return room.canPindian(owner, target);
    }
    isAvailableCard() {
        return false;
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        const { pindianRecord } = await room.pindian(event.fromId, event.toIds, this.Name);
        if (pindianRecord[0].winner !== event.fromId) {
            await room.drawCards(2, event.toIds[0], 'top', event.toIds[0], this.Name);
            room.setFlag(event.fromId, this.Name, true);
        }
        return true;
    }
};
SongShu = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'songshu', description: 'songshu_description' })
], SongShu);
exports.SongShu = SongShu;
