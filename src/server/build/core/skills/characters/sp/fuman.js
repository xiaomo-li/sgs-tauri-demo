"use strict";
var FuMan_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuManShadow = exports.FuMan = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let FuMan = FuMan_1 = class FuMan extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return owner.getCardIds(0 /* HandArea */).length > 0;
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableTarget(owner, room, target) {
        var _a;
        return owner !== target && !((_a = room.getFlag(owner, this.Name)) === null || _a === void 0 ? void 0 : _a.includes(target));
    }
    isAvailableCard(owner, room, cardId) {
        return engine_1.Sanguosha.getCardById(cardId).GeneralName === 'slash';
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds, cardIds } = event;
        if (!toIds || !cardIds) {
            return false;
        }
        const originalPlayers = room.getFlag(fromId, this.Name) || [];
        originalPlayers.includes(toIds[0]) || originalPlayers.push(toIds[0]);
        room.setFlag(fromId, this.Name, originalPlayers);
        await room.moveCards({
            movingCards: [{ card: cardIds[0], fromArea: room.getPlayerById(fromId).cardFrom(cardIds[0]) }],
            fromId,
            toId: toIds[0],
            toArea: 0 /* HandArea */,
            moveReason: 2 /* ActiveMove */,
            proposer: fromId,
            movedByReason: this.Name,
        });
        const originalMappers = room.getFlag(fromId, FuMan_1.FuManMappers) || [];
        originalMappers[toIds[0]] = originalMappers[toIds[0]] || [];
        originalMappers[toIds[0]].includes(cardIds[0]) || originalMappers[toIds[0]].push(cardIds[0]);
        room.getPlayerById(fromId).setFlag(FuMan_1.FuManMappers, originalMappers);
        return true;
    }
};
FuMan.FuManMappers = 'fuman_mappers';
FuMan = FuMan_1 = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'fuman', description: 'fuman_description' })
], FuMan);
exports.FuMan = FuMan;
let FuManShadow = class FuManShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner) {
        return !room.getFlag(owner, FuMan.FuManMappers);
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill(room, event, stage) {
        return stage !== "CardUsing" /* CardUsing */;
    }
    isTriggerable(event, stage) {
        return stage === "CardUsing" /* CardUsing */ || stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, content) {
        const fuManMappers = owner.getFlag(FuMan.FuManMappers);
        if (!fuManMappers) {
            return false;
        }
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = content;
            return (Object.keys(fuManMappers).includes(cardUseEvent.fromId) &&
                card_1.VirtualCard.getActualCards([cardUseEvent.cardId]).find(id => Object.values(fuManMappers[cardUseEvent.fromId]).includes(id)) !== undefined);
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = content;
            return ((phaseChangeEvent.fromPlayer === owner.Id ||
                (phaseChangeEvent.fromPlayer !== undefined &&
                    Object.keys(fuManMappers).includes(phaseChangeEvent.fromPlayer))) &&
                phaseChangeEvent.from === 7 /* PhaseFinish */);
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const identifier = event_packer_1.EventPacker.getIdentifier(event.triggeredOnEvent);
        if (identifier === 124 /* CardUseEvent */) {
            await room.drawCards(1, fromId, 'top', fromId, this.Name);
        }
        else {
            const phaseChangeEvent = event.triggeredOnEvent;
            if (phaseChangeEvent.fromPlayer === fromId) {
                room.removeFlag(fromId, this.GeneralName);
            }
            else {
                const originalMappers = room.getFlag(fromId, FuMan.FuManMappers);
                if (Object.keys(originalMappers).length === 1) {
                    room.removeFlag(fromId, FuMan.FuManMappers);
                }
                else {
                    delete originalMappers[phaseChangeEvent.fromPlayer];
                    room.getPlayerById(fromId).setFlag(FuMan.FuManMappers, originalMappers);
                }
            }
        }
        return true;
    }
};
FuManShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: FuMan.Name, description: FuMan.Description })
], FuManShadow);
exports.FuManShadow = FuManShadow;
