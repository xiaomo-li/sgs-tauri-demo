"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FenYinShadow = exports.FenYin = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let FenYin = class FenYin extends skill_1.TriggerSkill {
    async whenObtainingSkill(room, player) {
        if (room.CurrentPlayerPhase !== 4 /* PlayCardStage */ || room.CurrentPhasePlayer !== player) {
            return;
        }
        const records = room.Analytics.getCardUseRecord(player.Id, 'phase');
        if (records.length > 0) {
            const lastColor = engine_1.Sanguosha.getCardById(records[records.length - 1].cardId).Color;
            if (lastColor !== 2 /* None */) {
                player.setFlag(this.Name, lastColor);
                const precolor = engine_1.Sanguosha.getCardById(records[records.length - 2].cardId).Color;
                if (records.length > 1 && precolor !== 2 /* None */ && lastColor !== precolor) {
                    event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: true }, records[records.length - 1]);
                }
            }
        }
    }
    async whenDead(room, player) {
        player.removeFlag(this.Name);
    }
    isTriggerable(event, stage) {
        return stage === "CardUsing" /* CardUsing */;
    }
    canUse(room, owner, event) {
        return (event.fromId === owner.Id &&
            room.CurrentPlayerPhase === 4 /* PlayCardStage */ &&
            room.CurrentPhasePlayer === owner &&
            event_packer_1.EventPacker.getMiddleware(this.Name, event) === true);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.drawCards(1, event.fromId, 'top', event.fromId, this.Name);
        return true;
    }
};
FenYin = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'fenyin', description: 'fenyin_description' })
], FenYin);
exports.FenYin = FenYin;
let FenYinShadow = class FenYinShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 4 /* PlayCardStage */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "BeforeCardUseEffect" /* BeforeCardUseEffect */ || stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 124 /* CardUseEvent */) {
            return (event.fromId === owner.Id &&
                room.CurrentPlayerPhase === 4 /* PlayCardStage */ &&
                room.CurrentPhasePlayer === owner);
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = event;
            return (phaseChangeEvent.fromPlayer === owner.Id &&
                phaseChangeEvent.from === 4 /* PlayCardStage */ &&
                owner.getFlag(this.GeneralName) !== undefined);
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        if (event_packer_1.EventPacker.getIdentifier(unknownEvent) === 124 /* CardUseEvent */) {
            const card = engine_1.Sanguosha.getCardById(event.triggeredOnEvent.cardId);
            if (card.Color === 2 /* None */) {
                room.getPlayerById(event.fromId).removeFlag(this.GeneralName);
            }
            else {
                const precolor = room.getFlag(event.fromId, this.GeneralName);
                if (precolor !== undefined && precolor !== card.Color) {
                    event_packer_1.EventPacker.addMiddleware({ tag: this.GeneralName, data: true }, unknownEvent);
                }
                room.getPlayerById(event.fromId).setFlag(this.GeneralName, card.Color);
            }
        }
        else {
            room.getPlayerById(event.fromId).removeFlag(this.GeneralName);
        }
        return true;
    }
};
FenYinShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: FenYin.Name, description: FenYin.Description })
], FenYinShadow);
exports.FenYinShadow = FenYinShadow;
