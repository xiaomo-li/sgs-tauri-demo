"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuYinRemove = exports.FuYin = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const target_group_1 = require("core/shares/libs/utils/target_group");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let FuYin = class FuYin extends skill_1.TriggerSkill {
    async whenObtainingSkill(room, player) {
        room.Analytics.getRecordEvents(event => {
            var _a;
            return ((_a = target_group_1.TargetGroupUtil.getRealTargets(event.targetGroup)) === null || _a === void 0 ? void 0 : _a.includes(player.Id)) &&
                (engine_1.Sanguosha.getCardById(event.cardId).GeneralName === 'slash' ||
                    engine_1.Sanguosha.getCardById(event.cardId).GeneralName === 'duel');
        }, undefined, 'round').length > 0 && player.setFlag(this.Name, true);
    }
    isTriggerable(event, stage) {
        return stage === "AfterAimmed" /* AfterAimmed */;
    }
    canUse(room, owner, content) {
        if (owner.getFlag(this.Name)) {
            return false;
        }
        const canUse = content.toId === owner.Id &&
            content.byCardId !== undefined &&
            (engine_1.Sanguosha.getCardById(content.byCardId).GeneralName === 'slash' ||
                engine_1.Sanguosha.getCardById(content.byCardId).GeneralName === 'duel');
        canUse && owner.setFlag(this.Name, true);
        return (canUse &&
            room.getPlayerById(content.fromId).getCardIds(0 /* HandArea */).length >=
                owner.getCardIds(0 /* HandArea */).length);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const aimEvent = event.triggeredOnEvent;
        aimEvent.nullifiedTargets.push(event.fromId);
        return true;
    }
};
FuYin = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'fuyin', description: 'fuyin_description' })
], FuYin);
exports.FuYin = FuYin;
let FuYinRemove = class FuYinRemove extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, event) {
        return event.from === 7 /* PhaseFinish */ && owner.getFlag(this.GeneralName) !== undefined;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.removeFlag(event.fromId, this.GeneralName);
        return true;
    }
};
FuYinRemove = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CompulsorySkill({ name: FuYin.Name, description: FuYin.Description })
], FuYinRemove);
exports.FuYinRemove = FuYinRemove;
