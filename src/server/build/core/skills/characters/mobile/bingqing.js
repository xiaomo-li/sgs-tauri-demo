"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BingQingShadow = exports.BingQing = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let BingQing = class BingQing extends skill_1.TriggerSkill {
    async whenObtainingSkill(room, owner) {
        if (room.CurrentPhasePlayer !== owner || room.CurrentPlayerPhase !== 4 /* PlayCardStage */) {
            return;
        }
        const records = room.Analytics.getCardUseRecord(owner.Id, 'phase');
        if (records.length > 0) {
            for (const cardUseEvent of records) {
                const originalSuits = owner.getFlag(this.Name) || [];
                const suit = engine_1.Sanguosha.getCardById(cardUseEvent.cardId).Suit;
                if (suit !== 0 /* NoSuit */ && !originalSuits.includes(suit)) {
                    originalSuits.push(suit);
                    owner.setFlag(this.Name, originalSuits);
                    event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: true }, cardUseEvent);
                }
            }
        }
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "CardUseFinishedEffect" /* CardUseFinishedEffect */;
    }
    canUse(room, owner, content) {
        return (content.fromId === owner.Id &&
            room.CurrentPlayerPhase === 4 /* PlayCardStage */ &&
            room.CurrentPhasePlayer === owner &&
            event_packer_1.EventPacker.getMiddleware(this.Name, content) === true &&
            (owner.getFlag(this.Name) || []).length > 1);
    }
    async beforeUse(room, event) {
        const { fromId } = event;
        const suits = room.getFlag(fromId, this.Name) || [];
        let targets = room.AlivePlayers;
        let prompt = '{0}: do you want to draw 2 cards?';
        if (suits.length === 3) {
            targets = targets.filter(player => player.getCardIds().length > 0 &&
                !(player.Id === fromId && !player.getCardIds().find(id => room.canDropCard(fromId, id))));
            prompt = '{0}: do you want to discard a card from the area of a player?';
        }
        else if (suits.length === 4) {
            const index = targets.findIndex(player => player.Id === fromId);
            index !== -1 && targets.splice(index, 1);
            prompt = '{0}: do you want to deal 1 damage to another player?';
        }
        const players = targets.map(player => player.Id);
        const response = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
            players,
            toId: fromId,
            requiredAmount: 1,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher(prompt, this.Name).toString(),
            triggeredBySkills: [this.Name],
        }, fromId);
        if (response.selectedPlayers && response.selectedPlayers.length > 0) {
            event.toIds = response.selectedPlayers;
            return true;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        const suits = room.getFlag(event.fromId, this.Name) || [];
        if (suits.length === 2) {
            await room.drawCards(2, event.toIds[0], 'top', event.fromId, this.Name);
        }
        else if (suits.length === 3) {
            const to = room.getPlayerById(event.toIds[0]);
            const options = {
                [2 /* JudgeArea */]: to.getCardIds(2 /* JudgeArea */),
                [1 /* EquipArea */]: to.getCardIds(1 /* EquipArea */),
                [0 /* HandArea */]: to.getCardIds(0 /* HandArea */).length,
            };
            const chooseCardEvent = {
                fromId: event.fromId,
                toId: event.toIds[0],
                options,
                triggeredBySkills: [this.Name],
            };
            const response = await room.askForChoosingPlayerCard(chooseCardEvent, event.fromId, true, true);
            if (!response) {
                return false;
            }
            response.selectedCard !== undefined &&
                (await room.dropCards(event.fromId === event.toIds[0] ? 4 /* SelfDrop */ : 5 /* PassiveDrop */, [response.selectedCard], event.toIds[0], event.fromId, this.Name));
        }
        else if (suits.length === 4) {
            await room.damage({
                fromId: event.fromId,
                toId: event.toIds[0],
                damage: 1,
                damageType: "normal_property" /* Normal */,
                triggeredBySkills: [this.Name],
            });
        }
        return true;
    }
};
BingQing = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'bingqing', description: 'bingqing_description' })
], BingQing);
exports.BingQing = BingQing;
let BingQingShadow = class BingQingShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return content.from === 4 /* PlayCardStage */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    getPriority(room, owner, event) {
        return event_packer_1.EventPacker.getIdentifier(event) === 124 /* CardUseEvent */
            ? 0 /* High */
            : 1 /* Medium */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "CardUseFinishedEffect" /* CardUseFinishedEffect */ || stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = event;
            const suits = owner.getFlag(this.GeneralName) || [];
            return (cardUseEvent.fromId === owner.Id &&
                !suits.includes(engine_1.Sanguosha.getCardById(cardUseEvent.cardId).Suit) &&
                suits.length < 4 &&
                room.CurrentPlayerPhase === 4 /* PlayCardStage */ &&
                room.CurrentPhasePlayer === owner &&
                engine_1.Sanguosha.getCardById(cardUseEvent.cardId).Suit !== 0 /* NoSuit */);
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = event;
            return phaseChangeEvent.from === 4 /* PlayCardStage */ && !!owner.getFlag(this.GeneralName);
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = unknownEvent;
            const originalSuits = room.getFlag(event.fromId, this.GeneralName) || [];
            originalSuits.push(engine_1.Sanguosha.getCardById(cardUseEvent.cardId).Suit);
            room.getPlayerById(event.fromId).setFlag(this.GeneralName, originalSuits);
            event_packer_1.EventPacker.addMiddleware({ tag: this.GeneralName, data: true }, cardUseEvent);
        }
        else {
            room.removeFlag(event.fromId, this.GeneralName);
        }
        return true;
    }
};
BingQingShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: BingQing.Name, description: BingQing.Description })
], BingQingShadow);
exports.BingQingShadow = BingQingShadow;
