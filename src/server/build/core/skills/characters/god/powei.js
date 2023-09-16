"use strict";
var PoWei_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoWeiRemove = exports.PoWeiShadow = exports.PoWei = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let PoWei = PoWei_1 = class PoWei extends skill_1.TriggerSkill {
    get RelatedSkills() {
        return ['shenzhuo'];
    }
    audioIndex() {
        return 3;
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return (stage === "AfterGameBegan" /* AfterGameBegan */ ||
            stage === "DamageEffect" /* DamageEffect */ ||
            stage === "AfterPhaseChanged" /* AfterPhaseChanged */ ||
            stage === "PlayerDying" /* PlayerDying */);
    }
    canUse(room, owner, content) {
        if (owner.getFlag(this.Name) !== undefined) {
            return false;
        }
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 137 /* DamageEvent */) {
            const damageEvent = content;
            return room.getPlayerById(damageEvent.toId).getMark("dulie_wei" /* Wei */) > 0;
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = content;
            const current = room.getPlayerById(phaseChangeEvent.toPlayer);
            return (phaseChangeEvent.to === 0 /* PhaseBegin */ &&
                ((current.getMark("dulie_wei" /* Wei */) > 0 &&
                    (owner.getCardIds(0 /* HandArea */).find(id => room.canDropCard(owner.Id, id)) !== undefined ||
                        (current !== owner &&
                            current.Hp <= owner.Hp &&
                            current.getCardIds(0 /* HandArea */).length > 0))) ||
                    phaseChangeEvent.toPlayer === owner.Id));
        }
        else if (identifier === 152 /* PlayerDyingEvent */) {
            const playerDyingEvent = content;
            return playerDyingEvent.dying === owner.Id && owner.Hp < 1;
        }
        return identifier === 143 /* GameBeginEvent */;
    }
    async beforeUse(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        if (event_packer_1.EventPacker.getIdentifier(unknownEvent) === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = unknownEvent;
            if (room.getMark(phaseChangeEvent.toPlayer, "dulie_wei" /* Wei */) > 0) {
                const { fromId } = event;
                const options = [];
                room
                    .getPlayerById(fromId)
                    .getCardIds(0 /* HandArea */)
                    .find(id => room.canDropCard(fromId, id)) && options.push('powei:dropCard');
                const current = room.getPlayerById(phaseChangeEvent.toPlayer);
                if (current.Hp <= room.getPlayerById(fromId).Hp && current.getCardIds(0 /* HandArea */).length > 0) {
                    options.push('powei:prey');
                }
                if (options.length > 0) {
                    options.push('cancel');
                    const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
                        options,
                        conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose powei options: {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(current)).extract(),
                        toId: fromId,
                        triggeredBySkills: [this.Name],
                    }, fromId, true);
                    response.selectedOption = response.selectedOption || options[0];
                    if (response.selectedOption && response.selectedOption !== 'cancel') {
                        event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: response.selectedOption }, event);
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const unknownEvent = event.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 143 /* GameBeginEvent */) {
            for (const player of room.getOtherPlayers(fromId)) {
                if (player.getMark("dulie_wei" /* Wei */) === 0) {
                    room.addMark(player.Id, "dulie_wei" /* Wei */, 1);
                }
            }
        }
        else if (identifier === 137 /* DamageEvent */) {
            const damageEvent = unknownEvent;
            room.addMark(damageEvent.toId, "dulie_wei" /* Wei */, -1);
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = unknownEvent;
            const selectedOption = event_packer_1.EventPacker.getMiddleware(this.Name, event);
            if (selectedOption === 'powei:dropCard') {
                const response = await room.askForCardDrop(fromId, 1, [0 /* HandArea */], true, undefined, this.Name);
                await room.dropCards(4 /* SelfDrop */, response.droppedCards, fromId, fromId, this.Name);
                await room.damage({
                    fromId,
                    toId: phaseChangeEvent.toPlayer,
                    damage: 1,
                    damageType: "normal_property" /* Normal */,
                    triggeredBySkills: [this.Name],
                });
            }
            else if (selectedOption === 'powei:prey') {
                const options = {
                    [0 /* HandArea */]: room
                        .getPlayerById(phaseChangeEvent.toPlayer)
                        .getCardIds(0 /* HandArea */),
                };
                const chooseCardEvent = {
                    fromId,
                    toId: phaseChangeEvent.toPlayer,
                    options,
                    triggeredBySkills: [this.Name],
                };
                const response = await room.askForChoosingPlayerCard(chooseCardEvent, chooseCardEvent.fromId, false, true);
                if (!response) {
                    return false;
                }
                await room.moveCards({
                    movingCards: [{ card: response.selectedCard, fromArea: response.fromArea }],
                    fromId: chooseCardEvent.toId,
                    toId: chooseCardEvent.fromId,
                    toArea: 0 /* HandArea */,
                    moveReason: 1 /* ActivePrey */,
                    proposer: chooseCardEvent.fromId,
                    movedByReason: this.Name,
                });
            }
            if (selectedOption) {
                room.setFlag(fromId, PoWei_1.Debuff, phaseChangeEvent.toPlayer);
            }
            if (phaseChangeEvent.toPlayer === fromId) {
                let hasWei = false;
                for (const player of room.getAlivePlayersFrom()) {
                    if (player.getMark("dulie_wei" /* Wei */) > 0) {
                        hasWei = true;
                        let nextPlayer = room.getNextAlivePlayer(player.Id);
                        if (nextPlayer.Id === fromId) {
                            if (room.getNextAlivePlayer(fromId).Id !== player.Id) {
                                nextPlayer = room.getNextAlivePlayer(fromId);
                            }
                            else {
                                continue;
                            }
                        }
                        room.addMark(player.Id, "dulie_wei" /* Wei */, -1);
                        room.addMark(nextPlayer.Id, "dulie_wei" /* Wei */, 1);
                    }
                }
                if (!hasWei) {
                    room.setFlag(fromId, this.Name, true, 'powei:succeeded');
                    await room.obtainSkill(fromId, 'shenzhuo');
                }
            }
        }
        else {
            room.setFlag(fromId, this.Name, false, 'powei:failed');
            await room.recover({
                toId: fromId,
                recoveredHp: 1 - room.getPlayerById(fromId).Hp,
                recoverBy: fromId,
            });
            for (const player of room.getAlivePlayersFrom()) {
                player.getMark("dulie_wei" /* Wei */) > 0 && room.removeMark(player.Id, "dulie_wei" /* Wei */);
            }
            const equips = room.getPlayerById(fromId).getCardIds(1 /* EquipArea */);
            equips.length > 0 && (await room.dropCards(4 /* SelfDrop */, equips, fromId, fromId, this.Name));
        }
        return true;
    }
};
PoWei.Debuff = 'powei_debuff';
PoWei = PoWei_1 = tslib_1.__decorate([
    skill_wrappers_1.QuestSkill({ name: 'powei', description: 'powei_description' })
], PoWei);
exports.PoWei = PoWei;
let PoWeiShadow = class PoWeiShadow extends skill_1.GlobalRulesBreakerSkill {
    breakWithinAttackDistance(room, owner, from, to) {
        return to === owner && to.getFlag(PoWei.Debuff) === from.Id;
    }
};
PoWeiShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: PoWei.Name, description: PoWei.Description })
], PoWeiShadow);
exports.PoWeiShadow = PoWeiShadow;
let PoWeiRemove = class PoWeiRemove extends skill_1.TriggerSkill {
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
        return event.from === 7 /* PhaseFinish */ && owner.getFlag(PoWei.Debuff) !== undefined;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.removeFlag(event.fromId, PoWei.Debuff);
        return true;
    }
};
PoWeiRemove = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: PoWeiShadow.Name, description: PoWeiShadow.Description })
], PoWeiRemove);
exports.PoWeiRemove = PoWeiRemove;
