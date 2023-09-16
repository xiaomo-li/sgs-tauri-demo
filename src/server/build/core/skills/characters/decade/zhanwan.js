"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhanWan = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const liushi_1 = require("./liushi");
let ZhanWan = class ZhanWan extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ && event.toStage === 18 /* DropCardStageEnd */;
    }
    canUse(room, owner, event) {
        return (room.getFlag(event.playerId, liushi_1.LiuShi.Name) !== undefined &&
            room.Analytics.getCardDropRecord(event.playerId, 'phase').find(event => event.infos.find(info => info.movingCards.find(card => card.fromArea === 0 /* HandArea */ || card.fromArea === 1 /* EquipArea */))) !== undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const playerId = event.triggeredOnEvent.playerId;
        await room.drawCards(room.Analytics.getCardDropRecord(playerId, 'phase').reduce((sum, event) => {
            for (const info of event.infos) {
                if (!(info.fromId === playerId && info.moveReason === 4 /* SelfDrop */)) {
                    continue;
                }
                sum += info.movingCards.filter(card => card.fromArea === 0 /* HandArea */ || card.fromArea === 1 /* EquipArea */).length;
            }
            return sum;
        }, 0), event.fromId, 'top', event.fromId, this.Name);
        room.syncGameCommonRules(playerId, user => {
            const liushiNum = room.getFlag(user.Id, liushi_1.LiuShi.Name);
            room.CommonRules.addAdditionalHoldCardNumber(user, liushiNum);
            room.removeFlag(user.Id, liushi_1.LiuShi.Name);
        });
        return true;
    }
};
ZhanWan = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'zhanwan', description: 'zhanwan_description' })
], ZhanWan);
exports.ZhanWan = ZhanWan;
