"use strict";
var MouLi_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MouLiSide = exports.MouLiShaodw = exports.MouLi = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let MouLi = MouLi_1 = class MouLi extends skill_1.ActiveSkill {
    async whenDead(room, owner) {
        owner.removeFlag(this.Name);
        for (const other of room.getOtherPlayers(owner.Id)) {
            const users = room.getFlag(other.Id, MouLi_1.MouLiLi);
            if (users && users.includes(owner.Id)) {
                if (users.length === 1) {
                    room.removeFlag(other.Id, MouLi_1.MouLiLi);
                    if (room.getAlivePlayersFrom().find(player => player.getFlag(MouLi_1.MouLiLi))) {
                        room.installSideEffectSkill(3 /* MouLi */, MouLiSide.Name, owner.Id);
                    }
                    else {
                        room.uninstallSideEffectSkill(3 /* MouLi */);
                    }
                }
                else {
                    const index = users.findIndex(user => user === owner.Id);
                    index !== -1 && users.splice(index, 1);
                    room.setFlag(other.Id, MouLi_1.MouLiLi, users, MouLi_1.MouLiLi);
                }
            }
        }
    }
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name) && owner.getCardIds(0 /* HandArea */).length > 0;
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableTarget(owner, room, target) {
        return owner !== target;
    }
    isAvailableCard(owner, room, cardId) {
        return true;
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
        await room.moveCards({
            movingCards: [{ card: cardIds[0], fromArea: 0 /* HandArea */ }],
            fromId,
            toId: toIds[0],
            toArea: 0 /* HandArea */,
            moveReason: 2 /* ActiveMove */,
            proposer: fromId,
            triggeredBySkills: [this.Name],
        });
        const target = room.getPlayerById(toIds[0]);
        const originalUsers = target.getFlag(MouLi_1.MouLiLi) || [];
        originalUsers.includes(fromId) || originalUsers.push(fromId);
        room.setFlag(toIds[0], MouLi_1.MouLiLi, originalUsers, MouLi_1.MouLiLi);
        room.installSideEffectSkill(3 /* MouLi */, MouLiSide.Name, fromId);
        const from = room.getPlayerById(fromId);
        const originalTargets = from.getFlag(this.Name) || [];
        originalTargets.includes(toIds[0]) || originalTargets.push(toIds[0]);
        from.setFlag(this.Name, originalTargets);
        return true;
    }
};
MouLi.MouLiLi = 'mouli:li';
MouLi = MouLi_1 = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'mouli', description: 'mouli_description' })
], MouLi);
exports.MouLi = MouLi;
let MouLiShaodw = class MouLiShaodw extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return (room.CurrentPlayer.Id === owner &&
            room.CurrentPlayerPhase === 0 /* PhaseBegin */ &&
            stage === "AfterPhaseChanged" /* AfterPhaseChanged */);
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "CardUseFinishedEffect" /* CardUseFinishedEffect */ || stage === "AfterPhaseChanged" /* AfterPhaseChanged */;
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = content;
            const targets = owner.getFlag(this.GeneralName);
            return (targets &&
                targets.includes(cardUseEvent.fromId) &&
                (engine_1.Sanguosha.getCardById(cardUseEvent.cardId).GeneralName === 'slash' ||
                    engine_1.Sanguosha.getCardById(cardUseEvent.cardId).GeneralName === 'jink'));
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = content;
            return (phaseChangeEvent.toPlayer === owner.Id &&
                phaseChangeEvent.to === 0 /* PhaseBegin */ &&
                room
                    .getOtherPlayers(owner.Id)
                    .find(player => { var _a; return (_a = room.getFlag(player.Id, MouLi.MouLiLi)) === null || _a === void 0 ? void 0 : _a.includes(owner.Id); }) !== undefined);
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
        if (identifier === 124 /* CardUseEvent */) {
            const user = unknownEvent.fromId;
            const targets = room.getFlag(fromId, this.GeneralName);
            const index = targets.findIndex(target => target === user);
            if (index !== -1) {
                await room.drawCards(3, fromId, 'top', fromId, this.GeneralName);
                if (targets.length === 1) {
                    room.getPlayerById(fromId).removeFlag(this.GeneralName);
                }
                else {
                    targets.splice(index, 1);
                    room.getPlayerById(fromId).setFlag(this.GeneralName, targets);
                }
            }
        }
        else {
            room.getPlayerById(fromId).removeFlag(this.GeneralName);
            for (const other of room.getOtherPlayers(fromId)) {
                const users = room.getFlag(other.Id, MouLi.MouLiLi);
                if (users && users.includes(fromId)) {
                    if (users.length === 1) {
                        room.removeFlag(other.Id, MouLi.MouLiLi);
                        if (room.getAlivePlayersFrom().find(player => player.getFlag(MouLi.MouLiLi))) {
                            room.installSideEffectSkill(3 /* MouLi */, MouLiSide.Name, fromId);
                        }
                        else {
                            room.uninstallSideEffectSkill(3 /* MouLi */);
                        }
                    }
                    else {
                        const index = users.findIndex(user => user === fromId);
                        index !== -1 && users.splice(index, 1);
                        room.setFlag(other.Id, MouLi.MouLiLi, users, MouLi.MouLiLi);
                    }
                }
            }
        }
        return true;
    }
};
MouLiShaodw = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_1.CommonSkill({ name: MouLi.Name, description: MouLi.Description })
], MouLiShaodw);
exports.MouLiShaodw = MouLiShaodw;
let MouLiSide = class MouLiSide extends skill_1.ViewAsSkill {
    canViewAs(room, owner, selectedCards) {
        if (!selectedCards) {
            return ['jink', 'slash'];
        }
        else {
            const card = engine_1.Sanguosha.getCardById(selectedCards[0]);
            if (card.isRed()) {
                return ['jink'];
            }
            else if (card.isBlack()) {
                return ['slash'];
            }
            return [];
        }
    }
    canUse(room, owner, event) {
        const identifier = event && event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 160 /* AskForCardUseEvent */) {
            return (card_matcher_1.CardMatcher.match(event.cardMatcher, new card_matcher_1.CardMatcher({ generalName: ['slash'] })) ||
                card_matcher_1.CardMatcher.match(event.cardMatcher, new card_matcher_1.CardMatcher({ name: ['jink'] })));
        }
        return (owner.canUseCard(room, new card_matcher_1.CardMatcher({ name: ['slash'] })) &&
            identifier !== 159 /* AskForCardResponseEvent */);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(room, owner, pendingCardId, selectedCards, containerCard, cardMatcher) {
        var _a, _b, _c;
        if (cardMatcher) {
            let canUse = false;
            if ((_a = cardMatcher.Matcher.name) === null || _a === void 0 ? void 0 : _a.includes('jink')) {
                canUse = engine_1.Sanguosha.getCardById(pendingCardId).isRed();
            }
            else if (((_b = cardMatcher.Matcher.name) === null || _b === void 0 ? void 0 : _b.includes('slash')) || ((_c = cardMatcher.Matcher.generalName) === null || _c === void 0 ? void 0 : _c.includes('slash'))) {
                canUse = engine_1.Sanguosha.getCardById(pendingCardId).isBlack();
            }
            return canUse;
        }
        else {
            const card = engine_1.Sanguosha.getCardById(pendingCardId);
            return card.isBlack() && owner.canUseCard(room, new card_matcher_1.CardMatcher({ generalName: ['slash'] }));
        }
    }
    availableCardAreas() {
        return [0 /* HandArea */, 1 /* EquipArea */];
    }
    viewAs(selectedCards) {
        const card = engine_1.Sanguosha.getCardById(selectedCards[0]);
        if (card.isRed()) {
            return card_1.VirtualCard.create({
                cardName: 'jink',
                bySkill: this.Name,
            }, selectedCards);
        }
        else {
            return card_1.VirtualCard.create({
                cardName: 'slash',
                bySkill: this.Name,
            }, selectedCards);
        }
    }
};
MouLiSide = tslib_1.__decorate([
    skill_wrappers_1.SideEffectSkill,
    skill_1.CommonSkill({ name: 'side_mouli', description: 'side_mouli' })
], MouLiSide);
exports.MouLiSide = MouLiSide;
