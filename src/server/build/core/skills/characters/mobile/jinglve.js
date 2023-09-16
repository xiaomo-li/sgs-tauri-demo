"use strict";
var JingLve_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JingLveSiShi = exports.JingLve = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const functional_1 = require("core/shares/libs/functional");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let JingLve = JingLve_1 = class JingLve extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return (!owner.hasUsedSkill(this.Name) &&
            !room.AlivePlayers.find(player => player.getFlag(JingLve_1.JingLveMapper)));
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner && room.getPlayerById(target).getCardIds(0 /* HandArea */).length > 0;
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
        const originalPlayers = room.getFlag(event.fromId, this.Name) || [];
        originalPlayers.includes(event.toIds[0]) || originalPlayers.push(event.toIds[0]);
        room.setFlag(event.fromId, this.Name, originalPlayers);
        const options = {
            [0 /* HandArea */]: room.getPlayerById(event.toIds[0]).getCardIds(0 /* HandArea */),
        };
        const chooseCardEvent = {
            fromId: event.fromId,
            toId: event.toIds[0],
            options,
            triggeredBySkills: [this.Name],
        };
        const response = await room.askForChoosingPlayerCard(chooseCardEvent, event.fromId, false, true);
        if (!response) {
            return false;
        }
        const realId = card_1.VirtualCard.getActualCards([response.selectedCard])[0];
        const sishi = engine_1.Sanguosha.getCardById(response.selectedCard);
        room.setFlag(event.toIds[0], JingLve_1.JingLveMapper, { [event.fromId]: realId }, translation_json_tool_1.TranslationPack.translationJsonPatcher('sishi: {0} {1}', sishi.Name, functional_1.Functional.getCardSuitCharText(sishi.Suit) + functional_1.Functional.getCardNumberRawText(sishi.CardNumber)).toString(), [event.fromId]);
        room.getPlayerById(event.toIds[0]).hasShadowSkill(JingLveSiShi.Name) ||
            (await room.obtainSkill(event.toIds[0], JingLveSiShi.Name));
        return true;
    }
};
JingLve.JingLveMapper = 'jinglve_mapper';
JingLve = JingLve_1 = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'jinglve', description: 'jinglve_description' })
], JingLve);
exports.JingLve = JingLve;
let JingLveSiShi = class JingLveSiShi extends skill_1.TriggerSkill {
    afterDead(room, owner) {
        return !room.getFlag(owner, JingLve.JingLveMapper);
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return (stage === "CardUsing" /* CardUsing */ ||
            stage === "AfterCardMoved" /* AfterCardMoved */ ||
            stage === "PhaseChanged" /* PhaseChanged */);
    }
    canUse(room, owner, event) {
        const sishi = owner.getFlag(JingLve.JingLveMapper);
        if (!sishi) {
            return true;
        }
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = event;
            return (cardUseEvent.fromId === owner.Id &&
                card_1.VirtualCard.getActualCards([cardUseEvent.cardId]).includes(Object.values(sishi)[0]) &&
                !(engine_1.Sanguosha.getCardById(cardUseEvent.cardId).Skill instanceof skill_1.ResponsiveSkill && !cardUseEvent.toCardIds));
        }
        else if (identifier === 128 /* MoveCardEvent */) {
            return (event.infos.find(info => !(info.toId === owner.Id && info.toArea === 1 /* EquipArea */) &&
                info.toArea !== 6 /* ProcessingArea */ &&
                info.movingCards.find(cardInfo => cardInfo.card === Object.values(sishi)[0])) !== undefined);
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = event;
            return (phaseChangeEvent.from === 7 /* PhaseFinish */ &&
                phaseChangeEvent.fromPlayer === owner.Id &&
                owner.getCardIds().find(id => card_1.VirtualCard.getActualCards([id])[0] === Object.values(sishi)[0]) !== undefined);
        }
        return false;
    }
    async beforeUse(room, event) {
        if (!room.getFlag(event.fromId, JingLve.JingLveMapper)) {
            await room.loseSkill(event.fromId, this.Name);
            return false;
        }
        return true;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = unknownEvent;
            if (engine_1.Sanguosha.getCardById(cardUseEvent.cardId).Skill instanceof skill_1.ResponsiveSkill) {
                cardUseEvent.toCardIds = undefined;
            }
            else {
                cardUseEvent.targetGroup = undefined;
            }
        }
        else if (identifier === 128 /* MoveCardEvent */) {
            const sishi = Object.entries(room.getFlag(event.fromId, JingLve.JingLveMapper))[0];
            if (!room.getPlayerById(sishi[0]).Dead &&
                unknownEvent.infos.find(info => info.toArea === 4 /* DropStack */ &&
                    info.moveReason !== 8 /* CardUse */ &&
                    info.movingCards.find(cardInfo => cardInfo.card === sishi[1])) &&
                room.isCardInDropStack(sishi[1])) {
                await room.moveCards({
                    movingCards: [{ card: sishi[1], fromArea: 4 /* DropStack */ }],
                    toId: sishi[0],
                    toArea: 0 /* HandArea */,
                    moveReason: 1 /* ActivePrey */,
                    proposer: sishi[0],
                    triggeredBySkills: [this.Name],
                });
            }
        }
        else {
            const sishi = Object.entries(room.getFlag(event.fromId, JingLve.JingLveMapper))[0];
            if (!room.getPlayerById(sishi[0]).Dead) {
                const toGain = room
                    .getPlayerById(event.fromId)
                    .getCardIds()
                    .find(id => card_1.VirtualCard.getActualCards([id])[0] === sishi[1]);
                toGain &&
                    (await room.moveCards({
                        movingCards: [{ card: toGain, fromArea: room.getPlayerById(event.fromId).cardFrom(toGain) }],
                        fromId: event.fromId,
                        toId: sishi[0],
                        toArea: 0 /* HandArea */,
                        moveReason: 1 /* ActivePrey */,
                        proposer: event.fromId,
                        triggeredBySkills: [this.Name],
                    }));
            }
        }
        room.removeFlag(event.fromId, JingLve.JingLveMapper);
        await room.loseSkill(event.fromId, this.Name);
        return true;
    }
};
JingLveSiShi = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_jinglve_sishi', description: 's_jinglve_sishi_description' })
], JingLveSiShi);
exports.JingLveSiShi = JingLveSiShi;
