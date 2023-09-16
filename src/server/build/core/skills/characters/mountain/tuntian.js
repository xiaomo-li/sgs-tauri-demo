"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TunTianShadow = exports.TunTian = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let TunTian = class TunTian extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, content) {
        if (room.CurrentPhasePlayer === owner) {
            return false;
        }
        return (content.infos.find(info => owner.Id === info.fromId &&
            !(owner.Id === info.toId &&
                (info.toArea === 0 /* HandArea */ || info.toArea === 1 /* EquipArea */)) &&
            info.movingCards.filter(card => card.fromArea === 0 /* HandArea */ || card.fromArea === 1 /* EquipArea */).length > 0) !== undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const judgeEvent = await room.judge(fromId, undefined, this.Name);
        if (!room.isCardInDropStack(judgeEvent.judgeCardId)) {
            return false;
        }
        if (engine_1.Sanguosha.getCardById(judgeEvent.judgeCardId).Suit !== 2 /* Heart */) {
            await room.moveCards({
                movingCards: [{ card: judgeEvent.judgeCardId, fromArea: 4 /* DropStack */ }],
                toId: fromId,
                toArea: 3 /* OutsideArea */,
                moveReason: 2 /* ActiveMove */,
                toOutsideArea: this.Name,
                isOutsideAreaInPublic: true,
                proposer: fromId,
                movedByReason: this.Name,
            });
        }
        else if (engine_1.Sanguosha.getCardById(judgeEvent.judgeCardId).Suit === 2 /* Heart */) {
            await room.moveCards({
                movingCards: [{ card: judgeEvent.judgeCardId, fromArea: 4 /* DropStack */ }],
                toId: fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                proposer: fromId,
                movedByReason: this.Name,
            });
        }
        return true;
    }
};
TunTian = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'tuntian', description: 'tuntian_description' })
], TunTian);
exports.TunTian = TunTian;
let TunTianShadow = class TunTianShadow extends skill_1.RulesBreakerSkill {
    breakOffenseDistance(room, owner) {
        return owner.getCardIds(3 /* OutsideArea */, this.GeneralName).length;
    }
};
TunTianShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_1.CommonSkill({ name: TunTian.Name, description: TunTian.Description })
], TunTianShadow);
exports.TunTianShadow = TunTianShadow;
