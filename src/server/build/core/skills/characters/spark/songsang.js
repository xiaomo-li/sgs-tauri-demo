"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SongSang = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let SongSang = class SongSang extends skill_1.TriggerSkill {
    get RelatedSkills() {
        return ['zhanji'];
    }
    isTriggerable(event, stage) {
        return stage === "PlayerDied" /* PlayerDied */;
    }
    canUse(room, owner, content) {
        return content.playerId !== owner.Id;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        if (room.getPlayerById(fromId).LostHp > 0) {
            await room.recover({
                toId: fromId,
                recoveredHp: 1,
                recoverBy: fromId,
            });
        }
        else {
            await room.changeMaxHp(fromId, 1);
        }
        await room.obtainSkill(fromId, 'zhanji');
        return true;
    }
};
SongSang = tslib_1.__decorate([
    skill_wrappers_1.LimitSkill({ name: 'songsang', description: 'songsang_description' })
], SongSang);
exports.SongSang = SongSang;
