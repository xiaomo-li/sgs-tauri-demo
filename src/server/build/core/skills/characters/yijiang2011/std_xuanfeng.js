"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StdXuanFeng = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let StdXuanFeng = class StdXuanFeng extends skill_1.TriggerSkill {
    get RelatedCharacters() {
        return ['heqi'];
    }
    audioIndex(characterName) {
        return characterName && this.RelatedCharacters.includes(characterName) ? 1 : 2;
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ || stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, content) {
        const unknownEvent = event_packer_1.EventPacker.getIdentifier(content);
        if (unknownEvent === 105 /* PhaseStageChangeEvent */) {
            const phaseStageChangeEvent = content;
            let isUseable = owner.Id === phaseStageChangeEvent.playerId &&
                phaseStageChangeEvent.toStage === 18 /* DropCardStageEnd */;
            if (isUseable) {
                let droppedCardNum = 0;
                const moveEvents = room.Analytics.getRecordEvents(event => event_packer_1.EventPacker.getIdentifier(event) === 128 /* MoveCardEvent */ &&
                    event.infos.find(info => info.fromId === phaseStageChangeEvent.playerId && info.moveReason === 4 /* SelfDrop */) !== undefined, phaseStageChangeEvent.playerId, 'round', [5 /* DropCardStage */]);
                for (const moveEvent of moveEvents) {
                    if (droppedCardNum >= 2) {
                        break;
                    }
                    if (moveEvent.infos.length === 1) {
                        droppedCardNum += moveEvent.infos[0].movingCards.filter(cardInfo => !engine_1.Sanguosha.isVirtualCardId(cardInfo.card) && cardInfo.fromArea === 0 /* HandArea */).length;
                    }
                    else {
                        const infos = moveEvent.infos.filter(info => info.fromId === phaseStageChangeEvent.playerId && info.moveReason === 4 /* SelfDrop */);
                        droppedCardNum += infos.reduce((sum, info) => sum +
                            info.movingCards.filter(cardInfo => !engine_1.Sanguosha.isVirtualCardId(cardInfo.card) && cardInfo.fromArea === 0 /* HandArea */).length, 0);
                    }
                }
                isUseable = droppedCardNum >= 2;
            }
            return isUseable;
        }
        else if (unknownEvent === 128 /* MoveCardEvent */) {
            const moveCardEvent = content;
            return (moveCardEvent.infos.find(info => owner.Id === info.fromId && info.movingCards.find(card => card.fromArea === 1 /* EquipArea */)) !== undefined);
        }
        return false;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return owner !== target && room.getPlayerById(target).getPlayerCards().length > 0;
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose a target to drop a card?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async xuanFengDropCard(room, fromId, toId) {
        const to = room.getPlayerById(toId);
        if (to.getPlayerCards().length < 1) {
            return;
        }
        const options = {
            [1 /* EquipArea */]: to.getCardIds(1 /* EquipArea */),
            [0 /* HandArea */]: to.getCardIds(0 /* HandArea */).length,
        };
        const chooseCardEvent = {
            fromId,
            toId,
            options,
            triggeredBySkills: [this.Name],
        };
        const response = await room.askForChoosingPlayerCard(chooseCardEvent, fromId, true, true);
        if (!response) {
            return;
        }
        await room.dropCards(5 /* PassiveDrop */, [response.selectedCard], chooseCardEvent.toId, fromId, this.Name);
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const targetIds = precondition_1.Precondition.exists(event.toIds, 'Unable to get xuanfeng targets');
        const xuanfengTargets = [];
        await this.xuanFengDropCard(room, fromId, targetIds[0]);
        xuanfengTargets.push(targetIds[0]);
        const targets = room
            .getOtherPlayers(fromId)
            .filter(player => player.getPlayerCards().length > 0)
            .map(player => player.Id);
        if (targets.length > 0) {
            const choosePlayerEvent = {
                players: targets,
                toId: fromId,
                requiredAmount: 1,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose a target to drop a card?', this.Name).extract(),
                triggeredBySkills: [this.Name],
            };
            room.notify(167 /* AskForChoosingPlayerEvent */, choosePlayerEvent, fromId);
            const choosePlayerResponse = await room.onReceivingAsyncResponseFrom(167 /* AskForChoosingPlayerEvent */, fromId);
            const chosenOne = choosePlayerResponse.selectedPlayers;
            if (chosenOne) {
                await this.xuanFengDropCard(room, fromId, chosenOne[0]);
                xuanfengTargets.push(chosenOne[0]);
            }
        }
        return true;
    }
};
StdXuanFeng = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'std_xuanfeng', description: 'std_xuanfeng_description' })
], StdXuanFeng);
exports.StdXuanFeng = StdXuanFeng;
