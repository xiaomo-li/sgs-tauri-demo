"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecadeKuangCaiShadow = exports.DecadeKuangCai = void 0;
const tslib_1 = require("tslib");
const game_props_1 = require("core/game/game_props");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let DecadeKuangCai = class DecadeKuangCai extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, event) {
        if (event.playerId === owner.Id) {
            if (event.toStage === 16 /* DropCardStageStart */) {
                const cardUseRecord = room.Analytics.getCardUseRecord(owner.Id, 'round', undefined, 1);
                return (cardUseRecord.length === 0 || room.Analytics.getDamageRecord(owner.Id, 'round', undefined, 1).length === 0);
            }
            else if (event.toStage === 19 /* FinishStageStart */) {
                return room.Analytics.getDamageRecord(owner.Id, 'round', undefined, 1).length > 0;
            }
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (event.triggeredOnEvent.toStage ===
            16 /* DropCardStageStart */) {
            room.syncGameCommonRules(event.fromId, user => {
                let changedNum = 0;
                if (room.Analytics.getCardUseRecord(event.fromId, 'round', undefined, 1).length === 0) {
                    changedNum = 1;
                }
                else if (room.Analytics.getDamageRecord(event.fromId, 'round', undefined, 1).length === 0) {
                    changedNum = -1;
                }
                let kuangcaiCount = user.getFlag(this.Name) || 0;
                kuangcaiCount += changedNum;
                if (kuangcaiCount !== 0) {
                    room.setFlag(event.fromId, this.Name, kuangcaiCount, translation_json_tool_1.TranslationPack.translationJsonPatcher(`kuangcai: ${kuangcaiCount > 0 ? '+' : ''}{0}`, kuangcaiCount).toString());
                }
                else {
                    room.removeFlag(event.fromId, this.Name);
                }
                room.CommonRules.addAdditionalHoldCardNumber(user, changedNum);
            });
        }
        else {
            await room.drawCards(Math.min(room.Analytics.getDamage(event.fromId, 'round'), 5), event.fromId, 'top', event.fromId, this.Name);
        }
        return true;
    }
};
DecadeKuangCai = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'decade_kuangcai', description: 'decade_kuangcai_description' })
], DecadeKuangCai);
exports.DecadeKuangCai = DecadeKuangCai;
let DecadeKuangCaiShadow = class DecadeKuangCaiShadow extends skill_1.RulesBreakerSkill {
    breakCardUsableDistance() {
        return game_props_1.INFINITE_DISTANCE;
    }
    breakCardUsableTimes() {
        return game_props_1.INFINITE_TRIGGERING_TIMES;
    }
};
DecadeKuangCaiShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CompulsorySkill({ name: DecadeKuangCai.Name, description: DecadeKuangCai.Description })
], DecadeKuangCaiShadow);
exports.DecadeKuangCaiShadow = DecadeKuangCaiShadow;
