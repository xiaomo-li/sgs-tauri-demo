"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoVersusTwoGameProcessor = void 0;
const functional_1 = require("core/shares/libs/functional");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const game_processor_standard_1 = require("./game_processor.standard");
const engine_1 = require("../engine");
class TwoVersusTwoGameProcessor extends game_processor_standard_1.StandardGameProcessor {
    assignRoles(players) {
        const roles = [2 /* Loyalist */, 3 /* Rebel */, 3 /* Rebel */, 2 /* Loyalist */];
        const reverseRole = {
            [2 /* Loyalist */]: 3 /* Rebel */,
            [3 /* Rebel */]: 2 /* Loyalist */,
        };
        const reverse = Math.random() >= 0.5;
        for (let i = 0; i < players.length; i++) {
            players[i].Role = reverse ? reverseRole[roles[i]] : roles[i];
        }
    }
    getRoles() {
        return [2 /* Loyalist */, 2 /* Loyalist */, 3 /* Rebel */, 3 /* Rebel */];
    }
    getWinners(players) {
        const rebels = players.filter(player => player.Role === 3 /* Rebel */ && player.Dead);
        const loyalists = players.filter(player => player.Role === 2 /* Loyalist */ && player.Dead);
        if (loyalists.length === 2) {
            return players.filter(player => player.Role === 3 /* Rebel */);
        }
        else if (rebels.length === 2) {
            return players.filter(player => player.Role === 2 /* Loyalist */);
        }
    }
    async drawGameBeginsCards(playerInfo) {
        const cardIds = this.room.getCards(playerInfo.Position === 3 ? 5 : 4, 'top');
        const playerId = playerInfo.Id;
        this.room.transformCard(this.room.getPlayerById(playerId), cardIds, 0 /* HandArea */);
        const drawEvent = {
            drawAmount: cardIds.length,
            fromId: playerId,
            askedBy: playerId,
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} draws {1} cards', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(this.room.getPlayerById(playerId)), cardIds.length).extract(),
        };
        this.room.broadcast(127 /* DrawCardEvent */, drawEvent);
        this.room.broadcast(128 /* MoveCardEvent */, {
            infos: [
                {
                    moveReason: 0 /* CardDraw */,
                    movingCards: cardIds.map(card => ({ card, fromArea: 5 /* DrawStack */ })),
                    toArea: 0 /* HandArea */,
                    toId: playerId,
                },
            ],
        });
        this.room
            .getPlayerById(playerId)
            .getCardIds(0 /* HandArea */)
            .push(...cardIds);
    }
    async onPlayerDrawCardStage(phase) {
        this.logger.debug('enter draw cards phase');
        await this.room.drawCards(this.currentPhasePlayer.Position === 0 && this.room.Circle === 0 ? 1 : 2, this.currentPhasePlayer.Id, 'top', undefined, undefined, 0 /* GameStage */);
    }
    async chooseCharacters(playersInfo, selectableCharacters) {
        const sequentialAsyncResponse = [];
        const selectedCharacters = [];
        const notifyOtherPlayer = playersInfo.map(info => info.Id);
        this.room.doNotify(notifyOtherPlayer);
        for (let i = 0; i < playersInfo.length; i++) {
            const playerInfo = playersInfo[i];
            const characters = this.getSelectableCharacters(5, selectableCharacters, selectedCharacters);
            characters.forEach(character => selectedCharacters.push(character.Id));
            this.room.notify(169 /* AskForChoosingCharacterEvent */, {
                amount: 1,
                characterIds: characters.map(character => character.Id),
                toId: playerInfo.Id,
                translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('your role is {0}, please choose a character', functional_1.Functional.getPlayerRoleRawText(playerInfo.Role, "2v2" /* TwoVersusTwo */)).extract(),
                ignoreNotifiedStatus: true,
            }, playerInfo.Id);
            sequentialAsyncResponse.push(this.room.onReceivingAsyncResponseFrom(169 /* AskForChoosingCharacterEvent */, playerInfo.Id));
        }
        const changedProperties = [];
        const askForChooseNationalities = [];
        for (const response of await Promise.all(sequentialAsyncResponse)) {
            const playerInfo = precondition_1.Precondition.exists(playersInfo.find(info => info.Id === response.fromId), 'Unexpected player id received');
            const character = engine_1.Sanguosha.getCharacterById(response.chosenCharacterIds[0]);
            changedProperties.push({
                toId: playerInfo.Id,
                characterId: character.Id,
                maxHp: playerInfo.Role === 1 /* Lord */ ? character.MaxHp + 1 : undefined,
                hp: playerInfo.Role === 1 /* Lord */ ? character.Hp + 1 : undefined,
            });
            if (character.Nationality === 4 /* God */) {
                askForChooseNationalities.push(this.askForChoosingNationalities(playerInfo.Id));
            }
        }
        this.room.doNotify(notifyOtherPlayer);
        const godNationalityPlayers = [];
        for (const response of await Promise.all(askForChooseNationalities)) {
            const property = precondition_1.Precondition.exists(changedProperties.find(obj => obj.toId === response.fromId), 'Unexpected player id received');
            godNationalityPlayers.push(property.toId);
            property.nationality = functional_1.Functional.getPlayerNationalityEnum(response.selectedOption);
        }
        this.room.sortPlayersByPosition(godNationalityPlayers);
        this.room.changePlayerProperties({ changedProperties });
        this.room.broadcast(103 /* CustomGameDialog */, {
            messages: godNationalityPlayers.map(id => {
                const player = this.room.getPlayerById(id);
                return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} select nationaliy {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(player), functional_1.Functional.getPlayerNationalityText(player.Nationality)).toString();
            }),
        });
    }
    async onHandlePlayerDiedEvent(identifier, event, onActualExecuted) {
        const deadPlayer = this.room.getPlayerById(event.playerId);
        await this.iterateEachStage(identifier, event, onActualExecuted, async (stage) => {
            if (stage === "PrePlayerDie" /* PrePlayerDied */) {
                this.room.broadcast(identifier, event);
                deadPlayer.bury();
                const winners = this.room.getGameWinners();
                if (winners) {
                    const winner = winners[0];
                    this.stageProcessor.clearProcess();
                    this.playerStages = [];
                    this.room.gameOver();
                    this.room.broadcast(146 /* GameOverEvent */, {
                        translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('game over, winner is {0}', functional_1.Functional.getPlayerRoleRawText(winner.Role, "2v2" /* TwoVersusTwo */)).extract(),
                        winnerIds: winners.map(w => w.Id),
                        loserIds: this.room.Players.filter(player => !winners.includes(player)).map(player => player.Id),
                    });
                }
            }
        });
        if (!this.room.isGameOver()) {
            const { playerId } = event;
            await this.room.moveCards({
                moveReason: 4 /* SelfDrop */,
                fromId: playerId,
                movingCards: deadPlayer
                    .getPlayerCards()
                    .map(cardId => ({ card: cardId, fromArea: deadPlayer.cardFrom(cardId) })),
                toArea: 4 /* DropStack */,
            });
            const outsideCards = Object.entries(deadPlayer.getOutsideAreaCards()).reduce((allCards, [areaName, cards]) => {
                if (!deadPlayer.isCharacterOutsideArea(areaName)) {
                    allCards.push(...cards);
                }
                return allCards;
            }, []);
            const allCards = [...deadPlayer.getCardIds(2 /* JudgeArea */), ...outsideCards];
            await this.room.moveCards({
                moveReason: 6 /* PlaceToDropStack */,
                fromId: playerId,
                movingCards: allCards.map(cardId => ({ card: cardId, fromArea: deadPlayer.cardFrom(cardId) })),
                toArea: 4 /* DropStack */,
            });
            this.room.getPlayerById(playerId).clearMarks();
            this.room.getPlayerById(playerId).clearFlags();
            if (this.room.CurrentPlayer.Id === playerId) {
                await this.room.skip(playerId);
            }
            const teammate = this.room.AlivePlayers.find(player => player.Role === deadPlayer.Role);
            if (teammate) {
                await this.room.drawCards(1, teammate.Id);
            }
        }
    }
}
exports.TwoVersusTwoGameProcessor = TwoVersusTwoGameProcessor;
