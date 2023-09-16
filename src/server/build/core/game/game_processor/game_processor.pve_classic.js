"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PveClassicGameProcessor = void 0;
const card_1 = require("core/cards/card");
const event_packer_1 = require("core/event/event_packer");
const algorithm_1 = require("core/shares/libs/algorithm");
const functional_1 = require("core/shares/libs/functional");
const skills_1 = require("core/skills");
const pve_classic_ai_1 = require("core/skills/game_mode/pve/pve_classic_ai");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const game_processor_standard_1 = require("./game_processor.standard");
const engine_1 = require("../engine");
class PveClassicGameProcessor extends game_processor_standard_1.StandardGameProcessor {
    constructor() {
        super(...arguments);
        this.level = 0;
        this.markList = [];
    }
    getLevelMark() {
        if (this.markList.length === 0) {
            this.markList = [
                "pve_ji" /* PveJi */,
                "pve_jian" /* PveJian */,
                "pve_xi" /* PveXi */,
                "pve_ying" /* PveYing */,
                "pve_yu" /* PveYu */,
                "pve_zhi" /* PveZhi */,
            ];
            algorithm_1.Algorithm.shuffle(this.markList);
        }
        return this.markList.splice(0, this.room.Players.filter(player => !player.isSmartAI()).length * this.level);
    }
    assignRoles(players) {
        players.sort((a, _) => (a.isSmartAI() ? -1 : 0));
        for (let i = 0; i < players.length; i++) {
            players[i].Role = players[i].isSmartAI() ? 3 /* Rebel */ : 2 /* Loyalist */;
            players[i].Position = i;
            this.logger.info(`player ${i} is ${players[i].Id}: ${players[i].Position}`);
        }
    }
    async beforeGameStartPreparation() {
        this.room.Players.filter(player => player.isSmartAI()).map(player => this.room.obtainSkill(player.Id, pve_classic_ai_1.PveClassicAi.Name));
        await this.nextLevel();
    }
    async chooseCharacters(playersInfo, selectableCharacters) {
        const bossInfos = playersInfo.filter(info => this.room.getPlayerById(info.Id).isSmartAI());
        const bossCharacters = algorithm_1.Algorithm.shuffle(engine_1.Sanguosha.getAllCharacters().filter(character => character.Gender === 1 /* Female */ && character.Package !== "pve" /* Pve */)).slice(0, bossInfos.length);
        for (let i = 0; i < bossInfos.length; i++) {
            const bossPropertiesChangeEvent = {
                changedProperties: [{ toId: bossInfos[i].Id, characterId: bossCharacters[i].Id, playerPosition: i }],
            };
            this.room.changePlayerProperties(bossPropertiesChangeEvent);
        }
        const otherPlayersInfo = playersInfo.filter(info => !this.room.getPlayerById(info.Id).isSmartAI());
        await this.sequentialChooseCharacters(otherPlayersInfo, selectableCharacters, bossCharacters);
    }
    getWinners(players) {
        const alivePlayers = players.filter(player => !player.Dead);
        if (alivePlayers.every(player => player.isSmartAI()) ||
            (alivePlayers.every(player => !player.isSmartAI()) && this.level === 3)) {
            return alivePlayers;
        }
    }
    async nextLevel() {
        this.level++;
        const human = this.room.Players.filter(player => !player.isSmartAI());
        const allAI = this.room.Players.filter(player => player.isSmartAI());
        algorithm_1.Algorithm.shuffle(allAI);
        const changedProperties = [];
        allAI.splice(0, 3 - this.level);
        const activateAi = allAI;
        this.room.Players.filter(player => player.isSmartAI()).map(player => changedProperties.push(activateAi.includes(player)
            ? {
                toId: player.Id,
                activate: true,
                hp: engine_1.Sanguosha.getCharacterById(player.getPlayerInfo().CharacterId).Hp,
                maxHp: engine_1.Sanguosha.getCharacterById(player.getPlayerInfo().CharacterId).MaxHp,
            }
            : { toId: player.Id, activate: false, hp: 0, maxHp: 0 }));
        this.room.activate({ changedProperties });
        // level 1 draw game begins cards at game begin
        if (this.level > 1) {
            for (const player of activateAi) {
                this.drawGameBeginsCards(player.getPlayerInfo());
            }
        }
        const marks = this.getLevelMark();
        for (let i = 0; i < human.length; i++) {
            activateAi.map(player => {
                const mark = marks.pop();
                this.room.addMark(player.Id, mark, 1);
                return [];
            });
        }
        if (human.length === 1 && this.level === 1) {
            await this.room.obtainSkill(human[0].Id, skills_1.PveClassicGuYong.Name);
        }
        else if (this.level === 3) {
            await this.levelRewardSkill(human);
        }
        this.logger.debug(`room entry ${this.level} level`);
        for (const ai of activateAi) {
            for (const [mark, num] of Object.entries(ai.Marks)) {
                this.logger.debug(`player: ${ai.Id} has marks ${mark}:${num}`);
            }
        }
        const levelBeginEvent = {};
        await this.onHandleIncomingEvent(145 /* LevelBeginEvent */, event_packer_1.EventPacker.createIdentifierEvent(145 /* LevelBeginEvent */, levelBeginEvent));
    }
    async askForChooseSkill(playerId, options) {
        const askForChoosingOptionsEvent = {
            options,
            toId: playerId,
            conversation: 'Please announce a skill',
        };
        this.room.notify(168 /* AskForChoosingOptionsEvent */, event_packer_1.EventPacker.createUncancellableEvent(askForChoosingOptionsEvent), playerId);
        const chooseResp = await this.room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, playerId);
        return chooseResp;
    }
    async levelRewardSkill(players) {
        const sequentialAsyncResponse = [];
        const notifyOtherPlayer = players.map(player => player.Id);
        this.room.doNotify(notifyOtherPlayer);
        for (const player of players) {
            const candidateCharacters = this.room.getRandomCharactersFromLoadedPackage(5);
            this.room.notify(169 /* AskForChoosingCharacterEvent */, {
                amount: 1,
                characterIds: candidateCharacters,
                toId: player.Id,
                byHuaShen: true,
                conversation: 'Please choose a character to get a skill',
                ignoreNotifiedStatus: true,
            }, player.Id);
            sequentialAsyncResponse.push(this.room.onReceivingAsyncResponseFrom(169 /* AskForChoosingCharacterEvent */, player.Id));
        }
        const askForChoosingOptionsEvent = [];
        for (const resp of await Promise.all(sequentialAsyncResponse)) {
            const options = engine_1.Sanguosha.getCharacterById(resp.chosenCharacterIds[0])
                .Skills.filter(skill => !(skill.isShadowSkill() || skill.isLordSkill()))
                .map(skill => skill.GeneralName);
            askForChoosingOptionsEvent.push(this.askForChooseSkill(resp.fromId, options));
        }
        for (const resp of await Promise.all(askForChoosingOptionsEvent)) {
            await this.room.obtainSkill(resp.fromId, resp.selectedOption);
        }
    }
    async onHandlePlayerDiedEvent(identifier, event, onActualExecuted) {
        const deadPlayer = this.room.getPlayerById(event.playerId);
        await this.iterateEachStage(identifier, event, onActualExecuted, async (stage) => {
            if (stage === "PrePlayerDie" /* PrePlayerDied */) {
                this.room.broadcast(identifier, event);
                deadPlayer.bury();
                const winners = this.room.getGameWinners();
                if (winners !== undefined) {
                    this.stageProcessor.clearProcess();
                    this.playerStages = [];
                    this.room.gameOver();
                    this.room.broadcast(146 /* GameOverEvent */, {
                        translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('game over, winner is {0}', functional_1.Functional.getPlayerRoleRawText(winners[0].Role, "pve" /* Pve */)).extract(),
                        winnerIds: winners.map(winner => winner.Id),
                        loserIds: this.room.Players.filter(player => !winners.includes(player)).map(player => player.Id),
                    });
                }
            }
            else if (stage === "PlayerDied" /* PlayerDied */) {
                const { killedBy, playerId } = event;
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
                if (killedBy) {
                    const killer = this.room.getPlayerById(killedBy);
                    if (deadPlayer.Role === 3 /* Rebel */ && !killer.Dead) {
                        await this.room.drawCards(3, killedBy, 'top', undefined, undefined, 1 /* KillReward */);
                    }
                    else if (deadPlayer.Role === 2 /* Loyalist */ && killer.Role === 1 /* Lord */) {
                        const lordCards = card_1.VirtualCard.getActualCards(killer.getPlayerCards());
                        await this.room.moveCards({
                            moveReason: 4 /* SelfDrop */,
                            fromId: killer.Id,
                            movingCards: lordCards.map(cardId => ({ card: cardId, fromArea: killer.cardFrom(cardId) })),
                            toArea: 4 /* DropStack */,
                        });
                    }
                }
            }
            else if (stage === "AfterPlayerDied" /* AfterPlayerDied */) {
                if (this.room.Players.filter(player => player.isSmartAI()).every(player => player.Dead)) {
                    this.stageProcessor.clearProcess();
                    await this.nextLevel();
                }
            }
        });
        if (!this.room.isGameOver() && this.room.CurrentPhasePlayer.Id === event.playerId) {
            await this.room.skip(event.playerId);
        }
    }
}
exports.PveClassicGameProcessor = PveClassicGameProcessor;
