"use strict";
var LeiYongSi_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeiYongSiRemove = exports.LeiYongSiShadow = exports.LeiYongSi = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let LeiYongSi = LeiYongSi_1 = class LeiYongSi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "CardDrawing" /* CardDrawing */ || stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 127 /* DrawCardEvent */) {
            const drawCardEvent = content;
            return (owner.Id === drawCardEvent.fromId &&
                room.CurrentPlayerPhase === 3 /* DrawCardStage */ &&
                drawCardEvent.bySpecialReason === 0 /* GameStage */);
        }
        else if (identifier === 105 /* PhaseStageChangeEvent */) {
            const phaseStageChangeEvent = content;
            let damage = 1;
            if (phaseStageChangeEvent.playerId === owner.Id &&
                phaseStageChangeEvent.toStage === 15 /* PlayCardStageEnd */) {
                const events = room.Analytics.getDamageRecord(owner.Id, 'phase');
                if (events.length > 0) {
                    damage = events.reduce((sum, event) => sum + event.damage, 0);
                }
                else if (owner.getCardIds(0 /* HandArea */).length < owner.Hp) {
                    damage = 0;
                }
                damage !== 1 && owner.setFlag(this.Name, damage);
            }
            return damage !== 1;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const unknownEvent = triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 127 /* DrawCardEvent */) {
            const drawCardEvent = unknownEvent;
            const nations = room.AlivePlayers.reduce((allNations, player) => {
                if (!allNations.includes(player.Nationality)) {
                    allNations.push(player.Nationality);
                }
                return allNations;
            }, []);
            drawCardEvent.drawAmount = nations.length;
        }
        else if (identifier === 105 /* PhaseStageChangeEvent */) {
            const from = room.getPlayerById(fromId);
            const damage = from.getFlag(this.Name);
            if (damage === 0) {
                await room.drawCards(from.Hp - from.getCardIds(0 /* HandArea */).length, fromId, 'top', fromId, this.Name);
            }
            else {
                room.setFlag(fromId, LeiYongSi_1.LeiYongSiCardHold, true);
            }
        }
        return true;
    }
};
LeiYongSi.LeiYongSiCardHold = 'lei_yongsi_cardhold';
LeiYongSi = LeiYongSi_1 = tslib_1.__decorate([
    skill_1.CompulsorySkill({ name: 'lei_yongsi', description: 'lei_yongsi_description' })
], LeiYongSi);
exports.LeiYongSi = LeiYongSi;
let LeiYongSiShadow = class LeiYongSiShadow extends skill_1.RulesBreakerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    breakBaseCardHoldNumber(room, owner) {
        return owner.getFlag(LeiYongSi.LeiYongSiCardHold) ? owner.LostHp : -1;
    }
};
LeiYongSiShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_1.CompulsorySkill({ name: LeiYongSi.Name, description: LeiYongSi.Description })
], LeiYongSiShadow);
exports.LeiYongSiShadow = LeiYongSiShadow;
let LeiYongSiRemove = class LeiYongSiRemove extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, event) {
        return (owner.Id === event.fromPlayer &&
            event.from === 7 /* PhaseFinish */ &&
            owner.getFlag(LeiYongSi.LeiYongSiCardHold) !== undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.removeFlag(event.fromId, LeiYongSi.LeiYongSiCardHold);
        return true;
    }
};
LeiYongSiRemove = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_1.CompulsorySkill({ name: LeiYongSiShadow.Name, description: LeiYongSiShadow.Description })
], LeiYongSiRemove);
exports.LeiYongSiRemove = LeiYongSiRemove;
