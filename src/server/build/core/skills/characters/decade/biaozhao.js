"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BiaoZhao = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let BiaoZhao = class BiaoZhao extends skill_1.TriggerSkill {
    isAutoTrigger(room, owner, event) {
        return (event !== undefined &&
            !(event_packer_1.EventPacker.getIdentifier(event) === 105 /* PhaseStageChangeEvent */ &&
                event.toStage === 19 /* FinishStageStart */));
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ || stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 105 /* PhaseStageChangeEvent */) {
            const phaseStageChangeEvent = content;
            return (phaseStageChangeEvent.playerId === owner.Id &&
                ((phaseStageChangeEvent.toStage === 19 /* FinishStageStart */ &&
                    owner.getCardIds(3 /* OutsideArea */, this.Name).length === 0 &&
                    owner.getPlayerCards().length > 0) ||
                    (phaseStageChangeEvent.toStage === 3 /* PrepareStageStart */ &&
                        owner.getCardIds(3 /* OutsideArea */, this.Name).length > 0)));
        }
        else if (identifier === 128 /* MoveCardEvent */) {
            const biao = owner.getCardIds(3 /* OutsideArea */, this.Name);
            return (biao.length > 0 &&
                content.infos.find(info => info.toArea === 4 /* DropStack */ &&
                    info.movingCards.find(cardInfo => !engine_1.Sanguosha.isVirtualCardId(cardInfo.card) &&
                        engine_1.Sanguosha.getCardById(cardInfo.card).Suit === engine_1.Sanguosha.getCardById(biao[0]).Suit &&
                        engine_1.Sanguosha.getCardById(cardInfo.card).CardNumber === engine_1.Sanguosha.getCardById(biao[0]).CardNumber)) !== undefined);
        }
        return false;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        return true;
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to put a card on your general card as ‘Biao’?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 105 /* PhaseStageChangeEvent */) {
            if (unknownEvent.toStage ===
                19 /* FinishStageStart */) {
                if (!event.cardIds) {
                    return false;
                }
                await room.moveCards({
                    movingCards: [
                        { card: event.cardIds[0], fromArea: room.getPlayerById(event.fromId).cardFrom(event.cardIds[0]) },
                    ],
                    fromId: event.fromId,
                    toId: event.fromId,
                    toArea: 3 /* OutsideArea */,
                    moveReason: 2 /* ActiveMove */,
                    isOutsideAreaInPublic: false,
                    toOutsideArea: this.Name,
                    triggeredBySkills: [this.Name],
                });
            }
            else {
                await room.moveCards({
                    movingCards: [
                        {
                            card: room.getPlayerById(event.fromId).getCardIds(3 /* OutsideArea */, this.Name)[0],
                            fromArea: 3 /* OutsideArea */,
                        },
                    ],
                    fromId: event.fromId,
                    toArea: 4 /* DropStack */,
                    moveReason: 6 /* PlaceToDropStack */,
                    triggeredBySkills: [this.Name],
                });
                const players = room.AlivePlayers.map(player => player.Id);
                let most = 0;
                for (const player of room.AlivePlayers) {
                    if (player.getCardIds(0 /* HandArea */).length > most) {
                        most = Math.min(5, player.getCardIds(0 /* HandArea */).length);
                    }
                    if (most === 5) {
                        break;
                    }
                }
                const resp = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
                    players,
                    toId: event.fromId,
                    requiredAmount: 1,
                    conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('biaozhao: please choose a target to let him recover 1 hp, and then he draws {1} cards', this.Name, most).extract(),
                    triggeredBySkills: [this.Name],
                }, event.fromId, true);
                resp.selectedPlayers = resp.selectedPlayers || [players[Math.floor(Math.random() * players.length)]];
                await room.recover({
                    toId: resp.selectedPlayers[0],
                    recoveredHp: 1,
                    recoverBy: event.fromId,
                });
                const diff = most - room.getPlayerById(resp.selectedPlayers[0]).getCardIds(0 /* HandArea */).length;
                diff > 0 && (await room.drawCards(diff, resp.selectedPlayers[0], 'top', event.fromId, this.Name));
            }
        }
        else {
            const biao = room.getPlayerById(event.fromId).getCardIds(3 /* OutsideArea */, this.Name);
            const infos = unknownEvent.infos.filter(info => info.toArea === 4 /* DropStack */ &&
                (info.moveReason === 4 /* SelfDrop */ || info.moveReason === 5 /* PassiveDrop */) &&
                info.proposer !== undefined &&
                info.proposer !== event.fromId &&
                info.movingCards.find(cardInfo => !engine_1.Sanguosha.isVirtualCardId(cardInfo.card) &&
                    engine_1.Sanguosha.getCardById(cardInfo.card).Suit === engine_1.Sanguosha.getCardById(biao[0]).Suit &&
                    engine_1.Sanguosha.getCardById(cardInfo.card).CardNumber === engine_1.Sanguosha.getCardById(biao[0]).CardNumber));
            if (infos.length > 0) {
                const proposer = infos[0].proposer;
                await room.moveCards({
                    movingCards: [{ card: biao[0], fromArea: 3 /* OutsideArea */ }],
                    fromId: event.fromId,
                    toId: proposer,
                    toArea: 0 /* HandArea */,
                    moveReason: 1 /* ActivePrey */,
                    proposer,
                    triggeredBySkills: [this.Name],
                });
            }
            else {
                await room.moveCards({
                    movingCards: [{ card: biao[0], fromArea: 3 /* OutsideArea */ }],
                    fromId: event.fromId,
                    toArea: 4 /* DropStack */,
                    moveReason: 6 /* PlaceToDropStack */,
                    proposer: event.fromId,
                    triggeredBySkills: [this.Name],
                });
            }
            await room.loseHp(event.fromId, 1);
        }
        return true;
    }
};
BiaoZhao = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'biaozhao', description: 'biaozhao_description' })
], BiaoZhao);
exports.BiaoZhao = BiaoZhao;
