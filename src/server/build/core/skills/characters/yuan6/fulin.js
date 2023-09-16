"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuLinShadow = exports.FuLin = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const event_packer_1 = require("core/event/event_packer");
const algorithm_1 = require("core/shares/libs/algorithm");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let FuLin = class FuLin extends skill_1.TriggerSkill {
    async whenObtainingSkill(room, player) {
        if (room.CurrentPlayer !== player) {
            return;
        }
        const cardIdsGainedThisRound = room.Analytics.getCardObtainedRecord(player.Id, 'round').reduce((cardIds, moveCardEvent) => {
            for (const info of moveCardEvent.infos) {
                if (info.toId !== player.Id || info.toArea !== 0 /* HandArea */) {
                    continue;
                }
                for (const cardInfo of info.movingCards) {
                    cardIds.push(...algorithm_1.Algorithm.unique(card_1.VirtualCard.getActualCards([cardInfo.card]), cardIds));
                }
            }
            return cardIds;
        }, []);
        room.setCardTag(player.Id, this.Name, cardIdsGainedThisRound);
    }
    async whenLosingSkill(room, player) {
        room.removeCardTag(player.Id, this.Name);
    }
    isTriggerable(event, stage) {
        return stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, content) {
        return (room.CurrentPlayer === owner &&
            !!content.infos.find(info => info.toId === owner.Id && info.toArea === 0 /* HandArea */));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const originalFuLinCardIds = room.getCardTag(event.fromId, this.Name) || [];
        const cardIdsGained = event.triggeredOnEvent.infos
            .filter(info => info.toId === event.fromId && info.toArea === 0 /* HandArea */)
            .reduce((cardIds, info) => {
            for (const cardInfo of info.movingCards) {
                cardIds.push(...algorithm_1.Algorithm.unique(card_1.VirtualCard.getActualCards([cardInfo.card]), originalFuLinCardIds));
            }
            return cardIds;
        }, []);
        room.setCardTag(event.fromId, this.Name, originalFuLinCardIds.concat(...cardIdsGained));
        return true;
    }
};
FuLin = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'fulin', description: 'fulin_description' })
], FuLin);
exports.FuLin = FuLin;
let FuLinShadow = class FuLinShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isTriggerable(event, stage) {
        return (event_packer_1.EventPacker.getIdentifier(event) === 162 /* AskForCardDropEvent */ ||
            stage === "PhaseChanged" /* PhaseChanged */);
    }
    isFlaggedSkill(room, event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, content) {
        if (!owner.getCardTag(this.GeneralName)) {
            return false;
        }
        if (event_packer_1.EventPacker.getIdentifier(content) === 162 /* AskForCardDropEvent */) {
            return room.CurrentPlayerPhase === 5 /* DropCardStage */ && room.CurrentPhasePlayer.Id === owner.Id;
        }
        else if (event_packer_1.EventPacker.getIdentifier(content) === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = content;
            return owner.Id === phaseChangeEvent.fromPlayer && phaseChangeEvent.from === 7 /* PhaseFinish */;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 162 /* AskForCardDropEvent */) {
            const askForCardDropEvent = unknownEvent;
            const player = room.getPlayerById(askForCardDropEvent.toId);
            const exceptCardIds = player
                .getCardIds(0 /* HandArea */)
                .filter(cardId => player.getCardTag(this.GeneralName).includes(cardId));
            if (exceptCardIds.length > 0) {
                const otherHandCards = player
                    .getCardIds(0 /* HandArea */)
                    .filter(card => !exceptCardIds.includes(card));
                const discardAmount = otherHandCards.length - player.getMaxCardHold(room);
                askForCardDropEvent.cardAmount = discardAmount;
                askForCardDropEvent.except = askForCardDropEvent.except
                    ? [...askForCardDropEvent.except, ...exceptCardIds]
                    : exceptCardIds;
            }
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            room.removeCardTag(event.fromId, this.GeneralName);
        }
        return true;
    }
};
FuLinShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CompulsorySkill({ name: FuLin.GeneralName, description: FuLin.Description })
], FuLinShadow);
exports.FuLinShadow = FuLinShadow;
