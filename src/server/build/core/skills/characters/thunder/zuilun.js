"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZuiLun = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZuiLun = class ZuiLun extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return content.playerId === owner.Id && content.toStage === 19 /* FinishStageStart */;
    }
    getSkillLog(room, player) {
        const events = room.Analytics.getRecordEvents(event => {
            const identifier = event_packer_1.EventPacker.getIdentifier(event);
            if (identifier === 137 /* DamageEvent */) {
                const damageEvent = event;
                return damageEvent.fromId === player.Id;
            }
            else if (identifier === 128 /* MoveCardEvent */) {
                const moveCardEvent = event;
                return (moveCardEvent.infos.find(info => info.fromId === player.Id &&
                    info.movingCards &&
                    info.movingCards.find(card => card.fromArea === 0 /* HandArea */ || card.fromArea === 1 /* EquipArea */) !== undefined &&
                    info.moveReason === 4 /* SelfDrop */) !== undefined);
            }
            return false;
        }, player.Id, 'round');
        let n = 0;
        events.find(event => event_packer_1.EventPacker.getIdentifier(event) === 137 /* DamageEvent */) && n++;
        events.find(event => event_packer_1.EventPacker.getIdentifier(event) === 128 /* MoveCardEvent */) || n++;
        room
            .getOtherPlayers(player.Id)
            .find(p => p.getCardIds(0 /* HandArea */).length < player.getCardIds(0 /* HandArea */).length) ||
            n++;
        player.setFlag(this.Name, n);
        return n > 0
            ? translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to obtain {1} card(s) from the top of draw stack?', this.Name, n).extract()
            : translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to view 3 cards from the top of draw stack, then choose another player to lose 1 hp with him?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const topCards = room.getCards(3, 'top');
        const n = room.getPlayerById(fromId).getFlag(this.Name);
        if (n === 3) {
            await room.moveCards({
                movingCards: topCards.map(card => ({ card, fromArea: 5 /* DrawStack */ })),
                toId: fromId,
                toArea: 0 /* HandArea */,
                moveReason: 2 /* ActiveMove */,
                proposer: fromId,
                triggeredBySkills: [this.Name],
            });
        }
        else {
            const askForPlaceCardsInDileEvent = n > 0
                ? {
                    toId: fromId,
                    cardIds: topCards,
                    top: topCards.length,
                    topStackName: 'draw stack top',
                    bottom: n,
                    bottomStackName: 'to obtain',
                    bottomMaxCard: n,
                    bottomMinCard: n,
                    movable: true,
                    triggeredBySkills: [this.Name],
                }
                : {
                    toId: fromId,
                    cardIds: topCards,
                    top: topCards.length,
                    topStackName: 'draw stack top',
                    bottom: 0,
                    bottomStackName: 'to obtain',
                    movable: true,
                    triggeredBySkills: [this.Name],
                };
            const { top, bottom } = await room.doAskForCommonly(172 /* AskForPlaceCardsInDileEvent */, event_packer_1.EventPacker.createUncancellableEvent(askForPlaceCardsInDileEvent), fromId);
            room.putCards('top', ...top);
            if (bottom.length > 0) {
                await room.moveCards({
                    movingCards: bottom.map(card => ({ card, fromArea: 5 /* DrawStack */ })),
                    toId: fromId,
                    toArea: 0 /* HandArea */,
                    moveReason: 2 /* ActiveMove */,
                    proposer: fromId,
                    triggeredBySkills: [this.Name],
                });
            }
            else {
                const players = room.getOtherPlayers(fromId).map(player => player.Id);
                const resp = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, event_packer_1.EventPacker.createUncancellableEvent({
                    players,
                    toId: fromId,
                    requiredAmount: 1,
                    conversation: 'zuilun: please choose another player to lose 1 hp with you',
                    triggeredBySkills: [this.Name],
                }), fromId);
                resp.selectedPlayers = resp.selectedPlayers || [players[Math.floor(Math.random() * players.length)]];
                await room.loseHp(fromId, 1);
                await room.loseHp(resp.selectedPlayers[0], 1);
            }
        }
        return true;
    }
};
ZuiLun = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'zuilun', description: 'zuilun_description' })
], ZuiLun);
exports.ZuiLun = ZuiLun;
