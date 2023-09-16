"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HuaiYiShadow = exports.HuaiYi = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let HuaiYi = class HuaiYi extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return ((owner.getFlag(this.Name) ? owner.hasUsedSkillTimes(this.Name) < 2 : !owner.hasUsedSkill(this.Name)) &&
            owner.getCardIds(0 /* HandArea */).length > 0);
    }
    numberOfTargets() {
        return 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableTarget(owner, room, target) {
        return false;
    }
    isAvailableCard() {
        return false;
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const handcards = room.getPlayerById(fromId).getCardIds(0 /* HandArea */);
        const displayEvent = {
            fromId,
            displayCards: handcards,
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} displayed cards {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId)), translation_json_tool_1.TranslationPack.patchCardInTranslation(...handcards)).extract(),
        };
        room.broadcast(126 /* CardDisplayEvent */, displayEvent);
        if (!handcards.find(id => engine_1.Sanguosha.getCardById(handcards[0]).Color !== engine_1.Sanguosha.getCardById(id).Color)) {
            await room.drawCards(1, fromId, 'top', fromId, this.Name);
            room.setFlag(fromId, this.Name, true);
        }
        else {
            const options = ['huaiyi:black', 'huaiyi:red'];
            const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
                options,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose a color and discard all hand cards with that color', this.Name).extract(),
                toId: fromId,
                triggeredBySkills: [this.Name],
            }, fromId, true);
            response.selectedOption = response.selectedOption || options[0];
            const color = response.selectedOption === options[1] ? 0 /* Red */ : 1 /* Black */;
            const todrop = handcards.filter(id => engine_1.Sanguosha.getCardById(id).Color === color && room.canDropCard(fromId, id));
            if (todrop.length > 0) {
                await room.dropCards(4 /* SelfDrop */, todrop, fromId, fromId, this.Name);
                const players = room
                    .getOtherPlayers(fromId)
                    .filter(player => player.getPlayerCards().length > 0)
                    .map(player => player.Id);
                if (players.length > 0) {
                    const resp = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
                        players,
                        toId: fromId,
                        requiredAmount: [1, players.length],
                        conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose {1} targets to prey a card from each of them?', this.Name, todrop.length).extract(),
                        triggeredBySkills: [this.Name],
                    }, fromId, true);
                    resp.selectedPlayers = resp.selectedPlayers || [players[Math.floor(Math.random() * players.length)]];
                    for (const target of resp.selectedPlayers) {
                        const to = room.getPlayerById(target);
                        const options = {
                            [1 /* EquipArea */]: to.getCardIds(1 /* EquipArea */),
                            [0 /* HandArea */]: to.getCardIds(0 /* HandArea */).length,
                        };
                        const chooseCardEvent = {
                            fromId,
                            toId: target,
                            options,
                            triggeredBySkills: [this.Name],
                        };
                        const newResp = await room.askForChoosingPlayerCard(chooseCardEvent, fromId, false, true);
                        newResp &&
                            (await room.moveCards({
                                movingCards: [{ card: newResp.selectedCard, fromArea: newResp.fromArea }],
                                fromId: target,
                                toId: fromId,
                                toArea: 0 /* HandArea */,
                                moveReason: 1 /* ActivePrey */,
                                proposer: fromId,
                                triggeredBySkills: [this.Name],
                            }));
                    }
                    resp.selectedPlayers.length >= 2 && (await room.loseHp(fromId, 1));
                }
            }
        }
        return true;
    }
};
HuaiYi = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'huaiyi', description: 'huaiyi_description' })
], HuaiYi);
exports.HuaiYi = HuaiYi;
let HuaiYiShadow = class HuaiYiShadow extends skill_1.TriggerSkill {
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
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, event) {
        return (owner.Id === event.fromPlayer &&
            event.from === 4 /* PlayCardStage */ &&
            owner.getFlag(this.GeneralName) !== undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.removeFlag(event.fromId, this.GeneralName);
        return true;
    }
};
HuaiYiShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: HuaiYi.Name, description: HuaiYi.Description })
], HuaiYiShadow);
exports.HuaiYiShadow = HuaiYiShadow;
