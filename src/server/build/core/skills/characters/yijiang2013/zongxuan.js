"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZongXuan = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let ZongXuan = class ZongXuan extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, content) {
        return (content.infos.find(info => info.fromId === owner.Id &&
            (info.moveReason === 5 /* PassiveDrop */ || info.moveReason === 4 /* SelfDrop */) &&
            info.movingCards.find(node => room.isCardInDropStack(node.card)) !== undefined) !== undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId, triggeredOnEvent } = skillUseEvent;
        const moveCardEvent = triggeredOnEvent;
        const cardIds = [];
        if (moveCardEvent.infos.length === 1) {
            cardIds.push(...moveCardEvent.infos[0].movingCards.filter(node => room.isCardInDropStack(node.card)).map(node => node.card));
        }
        else {
            const infos = moveCardEvent.infos.filter(info => info.fromId === fromId &&
                (info.moveReason === 5 /* PassiveDrop */ || info.moveReason === 4 /* SelfDrop */) &&
                info.movingCards.find(node => room.isCardInDropStack(node.card)) !== undefined);
            cardIds.push(...infos.reduce((ids, info) => ids.concat(info.movingCards.filter(node => room.isCardInDropStack(node.card)).map(node => node.card)), []));
        }
        const tricks = cardIds.filter(id => engine_1.Sanguosha.getCardById(id).is(7 /* Trick */));
        if (tricks.length > 0) {
            const askForChooseCardEvent = {
                toId: fromId,
                cardIds: tricks,
                amount: 1,
                customTitle: 'zongxuan: please choose one of these cards',
                ignoreNotifiedStatus: true,
            };
            const response = await room.doAskForCommonly(165 /* AskForChoosingCardEvent */, askForChooseCardEvent, fromId);
            if (response.selectedCards && response.selectedCards.length > 0) {
                const resp = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
                    players: room.getOtherPlayers(fromId).map(player => player.Id),
                    toId: fromId,
                    requiredAmount: 1,
                    conversation: 'zongxuan: please choose another player',
                    triggeredBySkills: [this.Name],
                }, fromId, true);
                if (resp.selectedPlayers && resp.selectedPlayers.length > 0) {
                    await room.moveCards({
                        movingCards: [{ card: response.selectedCards[0], fromArea: 4 /* DropStack */ }],
                        toId: resp.selectedPlayers[0],
                        toArea: 0 /* HandArea */,
                        moveReason: 2 /* ActiveMove */,
                        triggeredBySkills: [this.Name],
                    });
                    const index = cardIds.findIndex(id => id === response.selectedCards[0]);
                    cardIds.splice(index, 1);
                }
            }
        }
        if (cardIds.length < 1) {
            return true;
        }
        const numOfCards = cardIds.length;
        const askForGuanxing = event_packer_1.EventPacker.createUncancellableEvent({
            toId: fromId,
            cardIds,
            top: numOfCards,
            topStackName: 'drop stack',
            bottom: numOfCards,
            bottomStackName: 'draw stack top',
            bottomMinCard: 1,
            movable: true,
            triggeredBySkills: [this.GeneralName],
        });
        room.notify(172 /* AskForPlaceCardsInDileEvent */, askForGuanxing, fromId);
        const { bottom } = await room.onReceivingAsyncResponseFrom(172 /* AskForPlaceCardsInDileEvent */, fromId);
        room.putCards('top', ...bottom);
        return true;
    }
};
ZongXuan = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'zongxuan', description: 'zongxuan_description' })
], ZongXuan);
exports.ZongXuan = ZongXuan;
