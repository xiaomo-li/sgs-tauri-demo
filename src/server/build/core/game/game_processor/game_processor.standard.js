"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StandardGameProcessor = void 0;
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const algorithm_1 = require("core/shares/libs/algorithm");
const functional_1 = require("core/shares/libs/functional");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const target_group_1 = require("core/shares/libs/utils/target_group");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const game_processor_1 = require("./game_processor");
const game_props_1 = require("../game_props");
class StandardGameProcessor extends game_processor_1.GameProcessor {
    constructor(stageProcessor, logger) {
        super();
        this.stageProcessor = stageProcessor;
        this.logger = logger;
        this.playerPositionIndex = 0;
        this.playerStages = [];
        this.inExtraRound = false;
        this.inExtraPhase = false;
        this.playRoundInsertions = [];
        this.playPhaseInsertions = [];
        this.dumpedLastPlayerPositionIndex = -1;
        this.proposalCharacters = [];
        this.processingPhaseStages = [
            1 /* PhaseBegin */,
            4 /* PrepareStage */,
            8 /* JudgeStage */,
            11 /* DrawCardStage */,
            14 /* PlayCardStage */,
            17 /* DropCardStage */,
            20 /* FinishStage */,
            23 /* PhaseFinish */,
        ];
        this.isTerminated = (event) => event_packer_1.EventPacker.isTerminated(event) || this.room.isClosed();
        this.iterateEachStage = async (identifier, event, onActualExecuted, processor) => {
            let processingStage = this.stageProcessor.involve(identifier);
            while (true) {
                if (this.isTerminated(event)) {
                    this.stageProcessor.skipEventProcess();
                    break;
                }
                this.currentProcessingStage = processingStage;
                await this.room.trigger(event, this.currentProcessingStage);
                this.currentProcessingStage = processingStage;
                if (this.isTerminated(event)) {
                    this.stageProcessor.skipEventProcess();
                    break;
                }
                if (onActualExecuted) {
                    this.currentProcessingStage = processingStage;
                    await onActualExecuted(processingStage);
                    this.currentProcessingStage = processingStage;
                }
                if (this.isTerminated(event)) {
                    this.stageProcessor.skipEventProcess();
                    break;
                }
                if (processor) {
                    this.currentProcessingStage = processingStage;
                    await processor(processingStage);
                    this.currentProcessingStage = processingStage;
                }
                if (this.isTerminated(event)) {
                    this.stageProcessor.skipEventProcess();
                    break;
                }
                const nextStage = this.stageProcessor.popStage();
                if (nextStage) {
                    processingStage = nextStage;
                }
                else {
                    break;
                }
            }
        };
    }
    assignRoles(players) {
        const roles = this.getRoles(players.length);
        algorithm_1.Algorithm.shuffle(roles);
        for (let i = 0; i < players.length; i++) {
            players[i].Role = roles[i];
        }
        const lordIndex = players.findIndex(player => player.Role === 1 /* Lord */);
        if (lordIndex !== 0) {
            [players[0], players[lordIndex]] = [players[lordIndex], players[0]];
            [players[0].Position, players[lordIndex].Position] = [players[lordIndex].Position, players[0].Position];
        }
    }
    fixCurrentPosition(playerPosition) {
        this.playerPositionIndex = playerPosition;
    }
    async askForChoosingNationalities(playerId) {
        const askForNationality = event_packer_1.EventPacker.createUncancellableEvent({
            options: ['wei', 'shu', 'wu', 'qun'],
            toId: playerId,
            conversation: 'please choose a nationality',
        });
        this.room.notify(168 /* AskForChoosingOptionsEvent */, askForNationality, playerId);
        const nationalityResponse = await this.room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, playerId);
        return nationalityResponse;
    }
    getWinners(players) {
        const rebellion = [];
        let renegade;
        const loyalist = [];
        let lordDied = false;
        for (const player of players) {
            if (player.Dead) {
                if (player.Role === 1 /* Lord */) {
                    lordDied = true;
                }
                continue;
            }
            switch (player.Role) {
                case 1 /* Lord */:
                case 2 /* Loyalist */:
                    loyalist.push(player);
                    break;
                case 3 /* Rebel */:
                    rebellion.push(player);
                    break;
                case 4 /* Renegade */:
                    renegade = player;
                    break;
                default:
            }
        }
        if (lordDied) {
            if (rebellion.length > 0) {
                return players.filter(player => player.Role === 3 /* Rebel */);
            }
            else if (renegade) {
                return [renegade];
            }
        }
        else if (renegade === undefined && rebellion.length === 0) {
            return players.filter(player => player.Role === 1 /* Lord */ || player.Role === 2 /* Loyalist */);
        }
    }
    getRoles(totalPlayers) {
        switch (totalPlayers) {
            case 2:
                return [1 /* Lord */, 3 /* Rebel */];
            case 3:
                return [1 /* Lord */, 3 /* Rebel */, 4 /* Renegade */];
            case 4:
                return [1 /* Lord */, 3 /* Rebel */, 2 /* Loyalist */, 4 /* Renegade */];
            case 5:
                return [1 /* Lord */, 3 /* Rebel */, 3 /* Rebel */, 2 /* Loyalist */, 4 /* Renegade */];
            case 6:
                return [
                    1 /* Lord */,
                    3 /* Rebel */,
                    3 /* Rebel */,
                    3 /* Rebel */,
                    2 /* Loyalist */,
                    4 /* Renegade */,
                ];
            case 7:
                return [
                    1 /* Lord */,
                    3 /* Rebel */,
                    3 /* Rebel */,
                    3 /* Rebel */,
                    2 /* Loyalist */,
                    2 /* Loyalist */,
                    4 /* Renegade */,
                ];
            case 8:
                return [
                    1 /* Lord */,
                    3 /* Rebel */,
                    3 /* Rebel */,
                    3 /* Rebel */,
                    3 /* Rebel */,
                    2 /* Loyalist */,
                    2 /* Loyalist */,
                    4 /* Renegade */,
                ];
            default:
                throw new Error('Unable to create roles with invalid number of players');
        }
    }
    getSelectableCharacters(selectable, selectableCharacters, selected, filter) {
        const canChooseAllCharacters = this.room.Flavor === "dev" /* Dev */ || (this.room.GameInfo.campaignMode && this.room.GameInfo.allowAllCharacters);
        if (canChooseAllCharacters) {
            return engine_1.Sanguosha.getAllCharacters();
        }
        else {
            return engine_1.Sanguosha.getRandomCharacters(selectable, selectableCharacters, selected, filter);
        }
    }
    // Someone choose Special Character, return the character
    // Use for Lord or Boss
    async chooseSpecialCharacters(playerInfo, selectableCharacters, playerRole) {
        this.room.broadcast(103 /* CustomGameDialog */, {
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} is {1}, waiting for selecting a character', playerInfo.Name, functional_1.Functional.getPlayerRoleRawText(playerRole, "standard-game" /* Standard */)).extract(),
        });
        const chooseCharacterEvent = {
            amount: 1,
            characterIds: [...selectableCharacters.map(character => character.Id)],
            toId: playerInfo.Id,
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('your role is {0}, please choose a lord', functional_1.Functional.getPlayerRoleRawText(playerInfo.Role, "standard-game" /* Standard */)).extract(),
        };
        this.room.notify(169 /* AskForChoosingCharacterEvent */, chooseCharacterEvent, playerInfo.Id);
        const playerResp = await this.room.onReceivingAsyncResponseFrom(169 /* AskForChoosingCharacterEvent */, playerInfo.Id);
        return engine_1.Sanguosha.getCharacterById(playerResp.chosenCharacterIds[0]);
    }
    // Some Players Choose Character, return the characters
    async sequentialChooseCharacters(playersInfo, selectableCharacters, selectedCharacters, lordCharacter) {
        const sequentialAsyncResponse = [];
        const notifyOtherPlayer = playersInfo.map(info => info.Id);
        this.room.doNotify(notifyOtherPlayer);
        selectedCharacters.push(...this.proposalCharacters.map(characterName => engine_1.Sanguosha.getCharacterByCharaterName(characterName)));
        for (const playerInfo of playersInfo) {
            const characterName = algorithm_1.Algorithm.shuffle(this.proposalCharacters).pop();
            const extraCharacters = characterName ? [engine_1.Sanguosha.getCharacterByCharaterName(characterName)] : [];
            const candCharacters = this.getSelectableCharacters(5 - extraCharacters.length, selectableCharacters, selectedCharacters.map(character => character.Id));
            selectedCharacters = [...candCharacters, ...selectedCharacters];
            const translationsMessage = lordCharacter !== undefined
                ? translation_json_tool_1.TranslationPack.translationJsonPatcher('lord is {0}, your role is {1}, please choose a character', engine_1.Sanguosha.getCharacterById(lordCharacter.Id).Name, functional_1.Functional.getPlayerRoleRawText(playerInfo.Role, "standard-game" /* Standard */)).extract()
                : translation_json_tool_1.TranslationPack.translationJsonPatcher('your role is {0}, please choose a character', functional_1.Functional.getPlayerRoleRawText(playerInfo.Role, "1v2" /* OneVersusTwo */)).extract();
            this.room.notify(169 /* AskForChoosingCharacterEvent */, {
                amount: 1,
                characterIds: extraCharacters.concat(candCharacters).map(character => character.Id),
                toId: playerInfo.Id,
                translationsMessage,
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
    async chooseCharacters(playersInfo, selectableCharacters) {
        // lord choose character
        const lordInfo = playersInfo[0];
        const stdLordCharacters = selectableCharacters.filter(character => character.isLord());
        const lordCharacters = [
            ...stdLordCharacters,
            ...this.getSelectableCharacters(4, selectableCharacters, stdLordCharacters.map(character => character.Id)),
        ];
        const lordCharacter = await this.chooseSpecialCharacters(lordInfo, lordCharacters, 1 /* Lord */);
        const additionalPropertyValue = playersInfo.length >= 5 ? 1 : 0;
        const playerPropertiesChangeEvent = {
            changedProperties: [
                {
                    toId: lordInfo.Id,
                    characterId: lordCharacter.Id,
                    maxHp: additionalPropertyValue ? lordCharacter.MaxHp + additionalPropertyValue : undefined,
                    hp: additionalPropertyValue || lordCharacter.Hp !== lordCharacter.MaxHp
                        ? lordCharacter.Hp + additionalPropertyValue
                        : undefined,
                    nationality: lordCharacter.Nationality === 4 /* God */
                        ? functional_1.Functional.getPlayerNationalityEnum((await this.askForChoosingNationalities(lordInfo.Id)).selectedOption)
                        : undefined,
                },
            ],
        };
        this.room.changePlayerProperties(playerPropertiesChangeEvent);
        const lord = this.room.getPlayerById(lordInfo.Id);
        lord.Character.Nationality === 4 /* God */ &&
            this.room.broadcast(103 /* CustomGameDialog */, {
                messages: [
                    translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} select nationaliy {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(lord), functional_1.Functional.getPlayerNationalityText(lord.Nationality)).toString(),
                ],
            });
        // other player choose character
        await this.sequentialChooseCharacters(playersInfo.slice(1), selectableCharacters, [lordCharacter], lordCharacter);
    }
    async drawGameBeginsCards(playerInfo) {
        const cardIds = this.room.getCards(4, 'top');
        const playerId = playerInfo.Id;
        this.room.transformCard(this.room.getPlayerById(playerId), cardIds, 0 /* HandArea */);
        const drawEvent = {
            drawAmount: cardIds.length,
            fromId: playerId,
            askedBy: playerId,
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} draws {1} cards', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(this.room.getPlayerById(playerId)), 4).extract(),
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
    async beforeGameBeginPreparation() {
        if (!this.room.WaitingRoomInfo.roomInfo.fortuneCardsExchangeLimit) {
            return;
        }
        const human = this.room.Players.filter(player => !player.isSmartAI());
        const allChangeCardActions = [];
        this.room.doNotify(human.map(player => player.Id), 0 /* PlayPhase */);
        for (const player of human) {
            const fortuneCardUse = {
                conversation: 'do you wanna change your handcards?',
                ignoreNotifiedStatus: true,
            };
            allChangeCardActions.push(async () => {
                let changeLimit = this.room.WaitingRoomInfo.roomInfo.fortuneCardsExchangeLimit || 0;
                while (changeLimit-- > 0) {
                    this.room.notify(184 /* AskForFortuneCardExchangeEvent */, fortuneCardUse, player.Id);
                    const resp = await this.room.onReceivingAsyncResponseFrom(184 /* AskForFortuneCardExchangeEvent */, player.Id);
                    const { doChange } = resp;
                    if (!doChange) {
                        return;
                    }
                    const handCards = player.getCardIds(0 /* HandArea */).slice();
                    const handCardsNum = handCards.length;
                    player.dropCards(...handCards);
                    this.room.bury(...handCards);
                    const newCardIds = this.room.getCards(handCardsNum, 'top');
                    player.obtainCardIds(...newCardIds);
                    this.room.broadcast(128 /* MoveCardEvent */, {
                        infos: [
                            {
                                moveReason: 6 /* PlaceToDropStack */,
                                toArea: 4 /* DropStack */,
                                fromId: player.Id,
                                movingCards: handCards.map(card => ({ card, fromArea: 0 /* HandArea */ })),
                                engagedPlayerIds: [player.Id],
                            },
                            {
                                moveReason: 0 /* CardDraw */,
                                toArea: 0 /* HandArea */,
                                toId: player.Id,
                                movingCards: newCardIds.map(card => ({ card, fromArea: 5 /* DrawStack */ })),
                                engagedPlayerIds: [player.Id],
                            },
                        ],
                        ignoreNotifiedStatus: true,
                    });
                }
            });
        }
        await Promise.all(allChangeCardActions.map(caller => caller()));
        this.room.shuffle();
    }
    async gameStart(room, selectableCharacters, setSelectedCharacters) {
        this.room = room;
        const playersInfo = this.room.Players.map(player => player.getPlayerInfo());
        await this.chooseCharacters(playersInfo, selectableCharacters);
        setSelectedCharacters();
        await this.beforeGameStartPreparation();
        const gameStartEvent = {
            players: playersInfo,
        };
        await this.onHandleIncomingEvent(142 /* GameStartEvent */, event_packer_1.EventPacker.createIdentifierEvent(142 /* GameStartEvent */, gameStartEvent));
        for (const player of this.room.AlivePlayers.map(player => player.getPlayerInfo())) {
            await this.drawGameBeginsCards(player);
        }
        let lastPlayerPosition = this.playerPositionIndex;
        await this.beforeGameBeginPreparation();
        while (this.room.isPlaying() && !this.room.isGameOver() && !this.room.isClosed()) {
            if (this.room.Circle === 0) {
                this.room.nextCircle();
                await this.onHandleIncomingEvent(143 /* GameBeginEvent */, event_packer_1.EventPacker.createIdentifierEvent(143 /* GameBeginEvent */, {}));
                const circleStartEvent = {};
                await this.onHandleIncomingEvent(144 /* CircleStartEvent */, event_packer_1.EventPacker.createIdentifierEvent(144 /* CircleStartEvent */, circleStartEvent));
            }
            else if (!this.inExtraRound) {
                if (this.playerPositionIndex < lastPlayerPosition) {
                    this.room.nextCircle();
                    this.room.Analytics.turnToNextCircle();
                    for (const player of this.room.getAlivePlayersFrom()) {
                        const skillsUsed = Object.keys(player.SkillUsedHistory);
                        if (skillsUsed.length > 0) {
                            for (const skill of skillsUsed) {
                                if (player.hasUsedSkill(skill)) {
                                    const reaSkill = engine_1.Sanguosha.getSkillBySkillName(skill);
                                    reaSkill.isCircleSkill() && player.resetSkillUseHistory(skill);
                                }
                            }
                        }
                    }
                    const circleStartEvent = {};
                    await this.onHandleIncomingEvent(144 /* CircleStartEvent */, event_packer_1.EventPacker.createIdentifierEvent(144 /* CircleStartEvent */, circleStartEvent));
                }
                lastPlayerPosition = this.playerPositionIndex;
            }
            await this.play(this.CurrentPlayer);
            await this.turnToNextPlayer();
        }
    }
    async onPlayerJudgeStage(phase) {
        this.logger.debug('enter judge cards phase');
        const judgeCardIds = this.currentPhasePlayer.getCardIds(2 /* JudgeArea */);
        for (let i = judgeCardIds.length - 1; i >= 0; i--) {
            const judgeCardId = judgeCardIds[i];
            const cardEffectEvent = {
                cardId: judgeCardId,
                toIds: [this.currentPhasePlayer.Id],
                nullifiedTargets: [],
                allTargets: [this.currentPhasePlayer.Id],
            };
            this.room.addProcessingCards(judgeCardId.toString(), judgeCardId);
            await this.room.moveCards({
                fromId: this.currentPhasePlayer.Id,
                movingCards: [
                    {
                        fromArea: 2 /* JudgeArea */,
                        card: judgeCardId,
                    },
                ],
                toArea: 6 /* ProcessingArea */,
                moveReason: 2 /* ActiveMove */,
            });
            await this.onHandleIncomingEvent(125 /* CardEffectEvent */, event_packer_1.EventPacker.createIdentifierEvent(125 /* CardEffectEvent */, cardEffectEvent));
            if (this.room.getProcessingCards(judgeCardId.toString()).length > 0) {
                await this.room.moveCards({
                    movingCards: [
                        {
                            fromArea: 6 /* ProcessingArea */,
                            card: judgeCardId,
                        },
                    ],
                    toArea: 4 /* DropStack */,
                    moveReason: 6 /* PlaceToDropStack */,
                });
                this.room.endProcessOnCard(judgeCardId);
            }
            if (this.toEndPhase === phase) {
                this.toEndPhase = undefined;
                break;
            }
        }
    }
    async onPlayerDrawCardStage(phase) {
        this.logger.debug('enter draw cards phase');
        await this.room.drawCards(2, this.currentPhasePlayer.Id, 'top', undefined, undefined, 0 /* GameStage */);
    }
    async onPlayerPlayCardStage(phase) {
        this.logger.debug('enter play cards phase');
        do {
            this.room.notify(157 /* AskForPlayCardsOrSkillsEvent */, {
                toId: this.currentPhasePlayer.Id,
            }, this.currentPhasePlayer.Id);
            const response = await this.room.onReceivingAsyncResponseFrom(157 /* AskForPlayCardsOrSkillsEvent */, this.currentPhasePlayer.Id);
            if (response.end) {
                break;
            }
            if (response.eventName === 124 /* CardUseEvent */) {
                const event = response.event;
                const card = engine_1.Sanguosha.getCardById(event.cardId);
                const targetGroup = event.toIds && [...card.Skill.targetGroupDispatcher(event.toIds)];
                await this.room.useCard(Object.assign({ targetGroup }, event));
            }
            else if (response.eventName === 132 /* SkillUseEvent */) {
                await this.room.useSkill(response.event);
            }
            else {
                const reforgeEvent = response.event;
                await this.room.reforge(reforgeEvent.cardId, this.room.getPlayerById(reforgeEvent.fromId));
            }
            if (this.currentPhasePlayer.Dead) {
                break;
            }
            if (this.toEndPhase === phase) {
                this.toEndPhase = undefined;
                break;
            }
        } while (!this.room.Players.every(player => !player.isOnline()));
    }
    async onPlayerDropCardStage(phase) {
        this.logger.debug(`${this.currentPhasePlayer.Id} enter drop cards phase`);
        const maxCardHold = this.currentPhasePlayer.getMaxCardHold(this.room);
        const discardAmount = this.currentPhasePlayer.getCardIds(0 /* HandArea */).length - maxCardHold;
        this.logger.debug(`${this.currentPhasePlayer.Id},  Upper Limit: ${maxCardHold}`);
        const response = await this.room.askForCardDrop(this.currentPhasePlayer.Id, discardAmount, [0 /* HandArea */], true, undefined, undefined, undefined, true);
        await this.room.dropCards(4 /* SelfDrop */, response.droppedCards, this.currentPhasePlayer.Id);
    }
    async onPhase(phase) {
        precondition_1.Precondition.assert(phase !== undefined, 'Undefined phase');
        if (this.room.isClosed() || !this.room.isPlaying() || this.room.isGameOver()) {
            return;
        }
        switch (phase) {
            case 2 /* JudgeStage */:
                return await this.onPlayerJudgeStage(phase);
            case 3 /* DrawCardStage */:
                return await this.onPlayerDrawCardStage(phase);
            case 4 /* PlayCardStage */:
                return await this.onPlayerPlayCardStage(phase);
            case 5 /* DropCardStage */:
                return await this.onPlayerDropCardStage(phase);
            default:
                break;
        }
    }
    skip(phase) {
        if (this.inExtraPhase) {
            return;
        }
        if (phase === undefined) {
            this.playerStages = [];
        }
        else {
            this.toEndPhase = phase;
            this.playerStages = this.playerStages.filter(stage => !this.stageProcessor.isInsidePlayerPhase(phase, stage));
            if (phase !== undefined &&
                this.currentPlayerStage !== undefined &&
                this.stageProcessor.isInsidePlayerPhase(phase, this.currentPlayerStage)) {
                this.currentPlayerStage = this.playerStages.shift();
            }
        }
    }
    endPhase(phase) {
        this.toEndPhase = phase;
        this.playerStages = this.playerStages.filter(stage => !this.stageProcessor.isInsidePlayerPhase(phase, stage));
        if (phase !== undefined &&
            this.currentPlayerStage !== undefined &&
            this.stageProcessor.isInsidePlayerPhase(phase, this.currentPlayerStage)) {
            this.currentPlayerStage = this.playerStages.shift();
        }
    }
    async play(player, specifiedStages) {
        if (!player.isFaceUp()) {
            await this.room.turnOver(player.Id);
            return;
        }
        let lastPlayer = this.currentPhasePlayer;
        this.playerStages = specifiedStages ? specifiedStages : this.stageProcessor.createPlayerStage();
        while (this.playerStages.length > 0) {
            let nextPhase;
            if (this.playPhaseInsertions.length > 0) {
                const { phase, player: nextPlayer } = this.playPhaseInsertions.shift();
                nextPhase = phase;
                this.currentPhasePlayer = this.room.getPlayerById(nextPlayer);
                this.inExtraPhase = true;
                this.playerStages.unshift(...this.stageProcessor.createPlayerStage(phase));
            }
            else {
                this.currentPhasePlayer = player;
                nextPhase = this.stageProcessor.getInsidePlayerPhase(this.playerStages[0]);
                this.inExtraPhase = false;
            }
            for (const player of this.room.AlivePlayers) {
                if (nextPhase === 0 /* PhaseBegin */) {
                    player.resetCardUseHistory();
                    player.hasDrunk() && this.room.clearHeaded(player.Id);
                }
                else {
                    player.resetCardUseHistory('slash');
                }
                const skillsUsed = Object.keys(player.SkillUsedHistory);
                if (skillsUsed.length > 0) {
                    for (const skill of skillsUsed) {
                        if (player.hasUsedSkill(skill)) {
                            const reaSkill = engine_1.Sanguosha.getSkillBySkillName(skill);
                            if (reaSkill.isCircleSkill()) {
                                continue;
                            }
                            if (reaSkill.isRefreshAt(this.room, player, nextPhase)) {
                                reaSkill.whenRefresh(this.room, player);
                                player.resetSkillUseHistory(skill);
                            }
                        }
                    }
                }
            }
            const phaseChangeEvent = event_packer_1.EventPacker.createIdentifierEvent(104 /* PhaseChangeEvent */, {
                from: this.currentPlayerPhase,
                to: nextPhase,
                fromPlayer: lastPlayer === null || lastPlayer === void 0 ? void 0 : lastPlayer.Id,
                toPlayer: player.Id,
            });
            await this.onHandleIncomingEvent(104 /* PhaseChangeEvent */, phaseChangeEvent, async (stage) => {
                if (this.toEndPhase === nextPhase) {
                    event_packer_1.EventPacker.terminate(phaseChangeEvent);
                    this.toEndPhase = undefined;
                    return false;
                }
                if (stage === "PhaseChanged" /* PhaseChanged */) {
                    this.room.Analytics.turnToNextPhase();
                    this.currentPlayerPhase = nextPhase;
                    if (this.currentPlayerPhase === 0 /* PhaseBegin */) {
                        this.room.Analytics.turnTo(this.CurrentPlayer.Id);
                    }
                }
                return true;
            });
            if (event_packer_1.EventPacker.isTerminated(phaseChangeEvent)) {
                continue;
            }
            do {
                await this.onHandleIncomingEvent(105 /* PhaseStageChangeEvent */, event_packer_1.EventPacker.createIdentifierEvent(105 /* PhaseStageChangeEvent */, {
                    toStage: this.currentPlayerStage,
                    playerId: this.currentPhasePlayer.Id,
                }), async (stage) => {
                    if (stage === "StageChanged" /* StageChanged */ &&
                        this.processingPhaseStages.includes(this.currentPlayerStage)) {
                        await this.onPhase(this.currentPlayerPhase);
                    }
                    return true;
                });
                this.currentPlayerStage = this.playerStages.shift();
            } while (this.currentPlayerStage !== undefined &&
                this.stageProcessor.isInsidePlayerPhase(this.currentPlayerPhase, this.currentPlayerStage));
            lastPlayer = this.currentPhasePlayer;
        }
    }
    async doCardEffect(identifier, event) {
        var _a;
        const card = engine_1.Sanguosha.getCardById(event.cardId);
        if (card.is(7 /* Trick */)) {
            const pendingResponses = {};
            const notifierAllPlayers = [];
            const wuxiekejiMatcher = new card_matcher_1.CardMatcher({
                name: ['wuxiekeji'].filter(cardName => !(event.disresponsiveCards || []).includes(cardName)),
            });
            for (const player of this.room.getAlivePlayersFrom(this.CurrentPlayer.Id)) {
                notifierAllPlayers.push(player.Id);
                if (((_a = event.disresponsiveList) === null || _a === void 0 ? void 0 : _a.includes(player.Id)) ||
                    event_packer_1.EventPacker.isDisresponsiveEvent(event, true) ||
                    (!player.hasCard(this.room, wuxiekejiMatcher) &&
                        this.room.GameParticularAreas.find(areaName => player.hasCard(this.room, wuxiekejiMatcher, 3 /* OutsideArea */, areaName)) === undefined)) {
                    continue;
                }
                const wuxiekejiEvent = {
                    toId: player.Id,
                    conversation: event.fromId !== undefined
                        ? translation_json_tool_1.TranslationPack.translationJsonPatcher('do you wanna use {0} for {1} from {2}' + (event.toIds ? ' to {3}' : ''), 'wuxiekeji', translation_json_tool_1.TranslationPack.patchCardInTranslation(event.cardId), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(this.room.getPlayerById(event.fromId)), event.toIds
                            ? translation_json_tool_1.TranslationPack.patchPlayerInTranslation(...event.toIds.map(toId => this.room.getPlayerById(toId)))
                            : '').extract()
                        : translation_json_tool_1.TranslationPack.translationJsonPatcher('do you wanna use {0} for {1}' + (event.toIds ? ' to {2}' : ''), 'wuxiekeji', translation_json_tool_1.TranslationPack.patchCardInTranslation(event.cardId), event.toIds
                            ? translation_json_tool_1.TranslationPack.patchPlayerInTranslation(...event.toIds.map(toId => this.room.getPlayerById(toId)))
                            : '').extract(),
                    cardMatcher: wuxiekejiMatcher.toSocketPassenger(),
                    byCardId: event.cardId,
                    cardUserId: event.fromId,
                    scopedTargets: event.toIds,
                    ignoreNotifiedStatus: true,
                };
                pendingResponses[player.Id] = this.room.askForCardUse(wuxiekejiEvent, player.Id);
            }
            //TODO: enable to custom wuxiekeji response time limit
            this.room.doNotify(notifierAllPlayers, 1 /* AskForWuxiekeji */);
            let cardUseEvent;
            while (Object.keys(pendingResponses).length > 0) {
                const response = await Promise.race(Object.values(pendingResponses));
                if (response.cardId !== undefined) {
                    cardUseEvent = {
                        fromId: response.fromId,
                        cardId: response.cardId,
                        toCardIds: [event.cardId],
                        responseToEvent: event,
                    };
                    break;
                }
                else {
                    delete pendingResponses[response.fromId];
                }
            }
            for (const player of this.room.getAlivePlayersFrom(this.CurrentPlayer.Id)) {
                this.room.clearSocketSubscriber(identifier, player.Id);
            }
            if (cardUseEvent) {
                await this.room.useCard(cardUseEvent, true);
                if (!event_packer_1.EventPacker.terminate(cardUseEvent) || event.isCancelledOut) {
                    await this.room.trigger(event, "CardEffectCancelledOut" /* CardEffectCancelledOut */);
                    event.isCancelledOut && event_packer_1.EventPacker.terminate(event);
                }
            }
            event_packer_1.EventPacker.isTerminated(event) && (await card.Skill.onEffectRejected(this.room, event));
        }
        else if (card.GeneralName === 'slash') {
            const { toIds, fromId, cardId } = event;
            const targets = precondition_1.Precondition.exists(toIds, 'Unable to get slash target');
            precondition_1.Precondition.assert(targets.length === 1, 'slash effect target should be only one target');
            const toId = targets[0];
            if (!event_packer_1.EventPacker.isDisresponsiveEvent(event, true)) {
                const askForUseCardEvent = {
                    toId,
                    cardMatcher: new card_matcher_1.CardMatcher({ name: ['jink'] }).toSocketPassenger(),
                    byCardId: cardId,
                    cardUserId: fromId,
                    triggeredBySkills: event.triggeredBySkills
                        ? [...event.triggeredBySkills, card.GeneralName]
                        : [card.GeneralName],
                    conversation: fromId !== undefined
                        ? translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used {1} to you, please use a {2} card', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(this.room.getPlayerById(fromId)), translation_json_tool_1.TranslationPack.patchCardInTranslation(cardId), 'jink').extract()
                        : translation_json_tool_1.TranslationPack.translationJsonPatcher('please use a {0} card to response {1}', 'jink', translation_json_tool_1.TranslationPack.patchCardInTranslation(cardId)).extract(),
                    triggeredOnEvent: event,
                };
                const response = await this.room.askForCardUse(askForUseCardEvent, toId);
                if (response.cardId !== undefined) {
                    const jinkUseEvent = {
                        fromId: toId,
                        cardId: response.cardId,
                        toCardIds: [cardId],
                        responseToEvent: event,
                    };
                    await this.room.useCard(jinkUseEvent, true);
                    if (!event_packer_1.EventPacker.terminate(jinkUseEvent) || event.isCancelledOut) {
                        await this.room.trigger(event, "CardEffectCancelledOut" /* CardEffectCancelledOut */);
                        event.isCancelledOut && event_packer_1.EventPacker.terminate(event);
                    }
                }
            }
        }
    }
    async onHandleIncomingEvent(identifier, event, onActualExecuted) {
        if (this.room.isClosed() || !this.room.isPlaying() || this.room.isGameOver()) {
            return;
        }
        const processingEvent = this.currentProcessingEvent;
        this.currentProcessingEvent = event;
        switch (identifier) {
            case 104 /* PhaseChangeEvent */:
                await this.onHandlePhaseChangeEvent(identifier, event, onActualExecuted);
                break;
            case 105 /* PhaseStageChangeEvent */:
                await this.onHandlePhaseStageChangeEvent(identifier, event, onActualExecuted);
                break;
            case 142 /* GameStartEvent */:
                await this.onHandleGameStartEvent(identifier, event, onActualExecuted);
                break;
            case 143 /* GameBeginEvent */:
                await this.onHandleGameBeginEvent(identifier, event, onActualExecuted);
                break;
            case 144 /* CircleStartEvent */:
                await this.onHandleCircleStartEvent(identifier, event, onActualExecuted);
                break;
            case 124 /* CardUseEvent */:
                await this.onHandleCardUseEvent(identifier, event, onActualExecuted);
                break;
            case 137 /* DamageEvent */:
                await this.onHandleDamgeEvent(identifier, event, onActualExecuted);
                break;
            case 134 /* PinDianEvent */:
                await this.onHandlePinDianEvent(event, onActualExecuted);
                break;
            case 127 /* DrawCardEvent */:
                await this.onHandleDrawCardEvent(identifier, event, onActualExecuted);
                break;
            case 125 /* CardEffectEvent */:
                await this.onHandleCardEffectEvent(identifier, event, onActualExecuted);
                break;
            case 123 /* CardResponseEvent */:
                await this.onHandleCardResponseEvent(identifier, event, onActualExecuted);
                break;
            case 128 /* MoveCardEvent */:
                await this.onHandleMoveCardEvent(identifier, event, onActualExecuted);
                break;
            case 132 /* SkillUseEvent */:
                await this.onHandleSkillUseEvent(identifier, event, onActualExecuted);
                break;
            case 133 /* SkillEffectEvent */:
                await this.onHandleSkillEffectEvent(identifier, event, onActualExecuted);
                break;
            case 140 /* JudgeEvent */:
                await this.onHandleJudgeEvent(identifier, event, onActualExecuted);
                break;
            case 135 /* LoseHpEvent */:
                await this.onHandleLoseHpEvent(identifier, event, onActualExecuted);
                break;
            case 138 /* RecoverEvent */:
                await this.onHandleRecoverEvent(identifier, event, onActualExecuted);
                break;
            case 156 /* PlayerTurnOverEvent */:
                await this.onHandlePlayerTurnOverEvent(identifier, event, onActualExecuted);
                break;
            case 153 /* PlayerDiedEvent */:
                await this.onHandlePlayerDiedEvent(identifier, event, onActualExecuted);
                break;
            case 152 /* PlayerDyingEvent */:
                await this.onHandleDyingEvent(identifier, event, onActualExecuted);
                break;
            case 188 /* ArmorChangeEvent */:
                await this.onHandleArmorChangeEvent(identifier, event, onActualExecuted);
                break;
            case 139 /* HpChangeEvent */:
                await this.onHandleHpChangeEvent(identifier, event, onActualExecuted);
                break;
            case 119 /* ChainLockedEvent */:
                await this.onHandleChainLockedEvent(identifier, event, onActualExecuted);
                break;
            case 145 /* LevelBeginEvent */:
                await this.onHandleLevelBeginEvent(identifier, event, onActualExecuted);
                break;
            default:
                throw new Error(`Unknown incoming event: ${identifier}`);
        }
        this.currentProcessingEvent = processingEvent;
        return;
    }
    async onHandleDrawCardEvent(identifier, event, onActualExecuted) {
        const from = this.room.getPlayerById(event.fromId);
        return await this.iterateEachStage(identifier, event, onActualExecuted, async (stage) => {
            if (from.Dead) {
                event_packer_1.EventPacker.terminate(event);
                return;
            }
            if (stage === "CardDrawing" /* CardDrawing */ && event.drawAmount > 0) {
                if (!event.translationsMessage) {
                    event.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} draws {1} cards', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from), event.drawAmount).extract();
                }
                this.room.broadcast(identifier, event);
                const drawedCards = this.room.getCards(event.drawAmount, event.from || 'top');
                await this.room.moveCards({
                    movingCards: drawedCards.map(cardId => ({ card: cardId, fromArea: 5 /* DrawStack */ })),
                    toId: event.fromId,
                    toArea: 0 /* HandArea */,
                    moveReason: 0 /* CardDraw */,
                    hideBroadcast: true,
                    movedByReason: event.triggeredBySkills ? event.triggeredBySkills[0] : undefined,
                });
            }
        });
    }
    async onHandleDamgeEvent(identifier, event, onActualExecuted) {
        event.fromId = event.fromId ? (this.room.getPlayerById(event.fromId).Dead ? undefined : event.fromId) : undefined;
        return await this.iterateEachStage(identifier, event, onActualExecuted, async (stage) => {
            if (stage === "DamageDone" /* DamageDone */ && !this.room.getPlayerById(event.toId).Dead) {
                const { toId, damage, damageType, fromId } = event;
                const from = fromId ? this.room.getPlayerById(fromId) : undefined;
                const to = this.room.getPlayerById(toId);
                event.translationsMessage = !from
                    ? translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} got hurt for {1} hp with {2} property', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(this.room.getPlayerById(toId)), damage, damageType).extract()
                    : translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} hits {1} {2} hp of damage type {3}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(this.room.getPlayerById(toId)), damage, damageType).extract();
                let leftDamage = damage;
                let hasBroadcasted = false;
                if (to.Armor > 0) {
                    const armorChangeEvent = {
                        fromId,
                        toId,
                        amount: -damage,
                        leftDamage,
                        byCardIds: event.cardIds,
                        beginnerOfTheDamage: event.beginnerOfTheDamage,
                        damageType: event.damageType,
                    };
                    event_packer_1.EventPacker.createIdentifierEvent(188 /* ArmorChangeEvent */, armorChangeEvent);
                    await this.onHandleIncomingEvent(188 /* ArmorChangeEvent */, armorChangeEvent, async (armorChangeStage) => {
                        if (armorChangeStage === "ArmorChanging" /* ArmorChanging */) {
                            this.room.broadcast(identifier, event);
                            hasBroadcasted = true;
                            this.room.broadcast(188 /* ArmorChangeEvent */, armorChangeEvent);
                        }
                        return true;
                    });
                    event.beginnerOfTheDamage = armorChangeEvent.beginnerOfTheDamage;
                    event_packer_1.EventPacker.copyPropertiesTo(armorChangeEvent, event);
                    leftDamage = armorChangeEvent.leftDamage;
                }
                if (leftDamage > 0) {
                    const hpChangeEvent = {
                        fromId,
                        toId,
                        amount: leftDamage,
                        byReaon: 'damage',
                        byCardIds: event.cardIds,
                        beginnerOfTheDamage: event.beginnerOfTheDamage,
                        damageType: event.damageType,
                    };
                    event_packer_1.EventPacker.createIdentifierEvent(139 /* HpChangeEvent */, hpChangeEvent);
                    await this.onHandleIncomingEvent(139 /* HpChangeEvent */, hpChangeEvent, async (hpChangeStage) => {
                        if (hpChangeStage === "HpChanging" /* HpChanging */) {
                            hasBroadcasted || this.room.broadcast(identifier, event);
                            this.room.broadcast(139 /* HpChangeEvent */, hpChangeEvent);
                        }
                        return true;
                    });
                    event.beginnerOfTheDamage = hpChangeEvent.beginnerOfTheDamage;
                    event_packer_1.EventPacker.copyPropertiesTo(hpChangeEvent, event);
                    if (event_packer_1.EventPacker.isTerminated(event)) {
                        return;
                    }
                    const dyingEvent = {
                        dying: to.Id,
                        killedBy: event.fromId,
                        killedByCards: event.cardIds,
                        triggeredBySkills: event.triggeredBySkills,
                    };
                    if (to.Hp <= 0) {
                        await this.onHandleIncomingEvent(152 /* PlayerDyingEvent */, event_packer_1.EventPacker.createIdentifierEvent(152 /* PlayerDyingEvent */, dyingEvent));
                    }
                }
            }
            else if (stage === "AfterDamagedEffect" /* AfterDamagedEffect */) {
                if (event.beginnerOfTheDamage === event.toId) {
                    await this.onChainedDamage(event);
                }
            }
        });
    }
    async onChainedDamage(event) {
        if (event.isFromChainedDamage) {
            return;
        }
        const { fromId, toId, cardIds, damage, damageType, triggeredBySkills, beginnerOfTheDamage } = event;
        for (const player of this.room.getOtherPlayers(toId)) {
            if (player.ChainLocked) {
                await this.room.damage({
                    fromId,
                    toId: player.Id,
                    cardIds,
                    damage,
                    damageType,
                    triggeredBySkills,
                    isFromChainedDamage: true,
                    beginnerOfTheDamage,
                });
            }
        }
    }
    async onHandleDyingEvent(identifier, event, onActualExecuted) {
        const { dying, killedBy, killedByCards } = event;
        const to = this.room.getPlayerById(dying);
        this.room.broadcast(152 /* PlayerDyingEvent */, {
            dying: to.Id,
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} is dying', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(to)).extract(),
            killedByCards,
        });
        to.Dying = true;
        await this.iterateEachStage(identifier, event, onActualExecuted, async (stage) => {
            if (stage === "PlayerDying" /* PlayerDying */) {
                const filterSkills = this.room.AlivePlayers.reduce((skills, player) => {
                    skills.push({
                        player,
                        skills: player.getSkills('globalFilter'),
                    });
                    return skills;
                }, []);
                for (const player of this.room.getAlivePlayersFrom()) {
                    event.rescuer = player.Id;
                    await this.room.trigger(event, "RequestRescue" /* RequestRescue */);
                    event.rescuer = undefined;
                    if (to.Hp > 0) {
                        break;
                    }
                    if (filterSkills.find(({ skills, player: owner }) => skills.find(skill => !skill.canUseCardTo(new card_matcher_1.CardMatcher({ name: player.Id !== to.Id ? ['peach'] : ['peach', 'alcohol'] }), this.room, owner, player, to)) !== undefined)) {
                        continue;
                    }
                    let continueRequest = true;
                    while (continueRequest && to.Hp <= 0) {
                        continueRequest = false;
                        const response = await this.room.askForPeach({
                            fromId: player.Id,
                            toId: to.Id,
                            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} asks for {1} peach', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(to), 1 - to.Hp).extract(),
                        });
                        if (response && response.cardId !== undefined) {
                            continueRequest = true;
                            const cardUseEvent = {
                                fromId: response.fromId,
                                cardId: response.cardId,
                                targetGroup: [[to.Id]],
                                extraUse: response.extraUse,
                            };
                            event_packer_1.EventPacker.copyPropertiesTo(response, cardUseEvent);
                            await this.room.useCard(cardUseEvent, true);
                        }
                    }
                    if (to.Hp > 0) {
                        break;
                    }
                }
                if (to.Hp <= 0) {
                    await this.room.kill(to, killedBy, killedByCards);
                }
            }
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
                    let winner = winners.find(player => player.Role === 1 /* Lord */);
                    if (winner === undefined) {
                        winner = winners.find(player => player.Role === 3 /* Rebel */);
                    }
                    if (winner === undefined) {
                        winner = winners.find(player => player.Role === 4 /* Renegade */);
                    }
                    this.stageProcessor.clearProcess();
                    this.playerStages = [];
                    this.room.gameOver();
                    this.room.broadcast(146 /* GameOverEvent */, {
                        translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('game over, winner is {0}', functional_1.Functional.getPlayerRoleRawText(winner.Role, "standard-game" /* Standard */)).extract(),
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
        });
        if (!this.room.isGameOver() && this.room.CurrentPhasePlayer.Id === event.playerId) {
            await this.room.skip(event.playerId);
        }
    }
    async onHandleSkillUseEvent(identifier, event, onActualExecuted) {
        return await this.iterateEachStage(identifier, event, onActualExecuted, async (stage) => {
            event.toIds = event.toIds && this.room.deadPlayerFilters(event.toIds);
            if (stage === "SkillUsing" /* SkillUsing */) {
                if (!event.translationsMessage && !engine_1.Sanguosha.isShadowSkillName(event.skillName)) {
                    event.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used skill {1}' + (event.toIds && event.toIds.length > 0 ? ' to {2}' : ''), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(this.room.getPlayerById(event.fromId)), event.skillName, event.toIds
                        ? translation_json_tool_1.TranslationPack.patchPlayerInTranslation(...event.toIds.map(to => this.room.getPlayerById(to)))
                        : '').extract();
                }
                if (engine_1.Sanguosha.isShadowSkillName(event.skillName)) {
                    event.mute = true;
                }
                const skill = engine_1.Sanguosha.getSkillBySkillName(event.skillName);
                await skill.onUse(this.room, event);
                event.animation = event.animation || skill.getAnimationSteps(event);
            }
            else if (stage === "AfterSkillUsed" /* AfterSkillUsed */) {
                this.room.broadcast(identifier, event);
            }
        });
    }
    async onHandleSkillEffectEvent(identifier, event, onActualExecuted) {
        return await this.iterateEachStage(identifier, event, onActualExecuted, async (stage) => {
            event.toIds = event.toIds && this.room.deadPlayerFilters(event.toIds);
            if (stage === "SkillEffecting" /* SkillEffecting */) {
                const { skillName } = event;
                await engine_1.Sanguosha.getSkillBySkillName(skillName).onEffect(this.room, event);
            }
        });
    }
    async onHandleCardEffectEvent(identifier, event, onActualExecuted) {
        const card = engine_1.Sanguosha.getCardById(event.cardId);
        return await this.iterateEachStage(identifier, event, onActualExecuted, async (stage) => {
            event.toIds = event.toIds && this.room.deadPlayerFilters(event.toIds);
            event.allTargets = event.allTargets && this.room.deadPlayerFilters(event.allTargets);
            if (event.toIds && (event.toIds.length === 0 || event.nullifiedTargets.includes(event.toIds[0]))) {
                event_packer_1.EventPacker.terminate(event);
                return;
            }
            if (stage === "PreCardEffect" /* PreCardEffect */) {
                await this.doCardEffect(identifier, event);
            }
            if (event.toIds && (event.toIds.length === 0 || event.nullifiedTargets.includes(event.toIds[0]))) {
                event_packer_1.EventPacker.terminate(event);
                return;
            }
            if (stage === "CardEffecting" /* CardEffecting */) {
                await card.Skill.onEffect(this.room, event);
            }
        });
    }
    async onHandleCardUseEvent(identifier, event, onActualExecuted) {
        const from = this.room.getPlayerById(event.fromId);
        const card = engine_1.Sanguosha.getCardById(event.cardId);
        if (!event.translationsMessage) {
            if (card.is(1 /* Equip */)) {
                event.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} equipped {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from), translation_json_tool_1.TranslationPack.patchCardInTranslation(event.cardId)).extract();
            }
            else {
                event.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used card {1}' + (event.targetGroup || event.toCardIds ? ' to {2}' : ''), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from), translation_json_tool_1.TranslationPack.patchCardInTranslation(event.cardId), event.targetGroup
                    ? translation_json_tool_1.TranslationPack.patchPlayerInTranslation(...target_group_1.TargetGroupUtil.getRealTargets(event.targetGroup).map(id => this.room.getPlayerById(id)))
                    : event.toCardIds
                        ? translation_json_tool_1.TranslationPack.patchCardInTranslation(...event.toCardIds)
                        : '').extract();
            }
        }
        if (!card.is(1 /* Equip */)) {
            event.animation = event.animation || card.Skill.getAnimationSteps(event);
        }
        this.room.broadcast(identifier, event);
        event.translationsMessage = undefined;
        if (!this.room.isCardOnProcessing(event.cardId)) {
            this.room.addProcessingCards(event.cardId.toString(), event.cardId);
            await this.room.moveCards({
                movingCards: [{ card: event.cardId, fromArea: event.customFromArea || from.cardFrom(event.cardId) }],
                toArea: 6 /* ProcessingArea */,
                fromId: event.customFromId || from.Id,
                moveReason: 8 /* CardUse */,
            });
        }
        if (!event.withoutInvokes) {
            await this.iterateEachStage(identifier, event, onActualExecuted);
            await this.room.trigger(event, "CardUseFinishedEffect" /* CardUseFinishedEffect */);
            if (this.room.isCardOnProcessing(event.cardId)) {
                await this.room.moveCards({
                    movingCards: [{ card: event.cardId, fromArea: 6 /* ProcessingArea */ }],
                    moveReason: 8 /* CardUse */,
                    toArea: 4 /* DropStack */,
                    hideBroadcast: true,
                    proposer: event.fromId,
                });
            }
            this.room.endProcessOnTag(card.Id.toString());
        }
    }
    async onHandleCardResponseEvent(identifier, event, onActualExecuted) {
        const from = this.room.getPlayerById(event.fromId);
        if (!event.translationsMessage) {
            event.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} responses card {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(this.room.getPlayerById(event.fromId)), translation_json_tool_1.TranslationPack.patchCardInTranslation(event.cardId)).extract();
        }
        this.room.broadcast(123 /* CardResponseEvent */, event);
        event.translationsMessage = undefined;
        if (!this.room.isCardOnProcessing(event.cardId)) {
            this.room.addProcessingCards(event.cardId.toString(), event.cardId);
            await this.room.moveCards({
                movingCards: [{ card: event.cardId, fromArea: from.cardFrom(event.cardId) }],
                toArea: 6 /* ProcessingArea */,
                fromId: event.fromId,
                moveReason: 9 /* CardResponse */,
                hideBroadcast: true,
            });
        }
        if (event.responseToEvent &&
            event_packer_1.EventPacker.getIdentifier(event.responseToEvent) === 125 /* CardEffectEvent */) {
            const cardEffectEvent = event.responseToEvent;
            cardEffectEvent.cardIdsResponded = cardEffectEvent.cardIdsResponded || [];
            cardEffectEvent.cardIdsResponded.push(event.cardId);
        }
        await this.iterateEachStage(identifier, event, onActualExecuted);
        if (!event.withoutInvokes) {
            if (this.room.isCardOnProcessing(event.cardId)) {
                await this.room.moveCards({
                    movingCards: [{ card: event.cardId, fromArea: 6 /* ProcessingArea */ }],
                    moveReason: 9 /* CardResponse */,
                    toArea: 4 /* DropStack */,
                    hideBroadcast: true,
                    proposer: event.fromId,
                });
            }
            this.room.endProcessOnTag(event.cardId.toString());
        }
    }
    async onHandleMoveCardEvent(identifier, event, onActualExecuted) {
        const moveCardInfos = [];
        for (const info of event.infos) {
            const { fromId, toId, movingCards, toArea } = info;
            let to = toId ? this.room.getPlayerById(toId) : undefined;
            if (to && toArea === 1 /* EquipArea */) {
                const droppedMoves = [];
                const equipMoves = [];
                for (const moving of movingCards) {
                    if (to.canEquip(engine_1.Sanguosha.getCardById(moving.card))) {
                        equipMoves.push(moving);
                    }
                    else {
                        droppedMoves.push(moving);
                    }
                }
                if (droppedMoves.length > 0) {
                    moveCardInfos.push(Object.assign(Object.assign({}, info), { movingCards: droppedMoves, toArea: 4 /* DropStack */, moveReason: 6 /* PlaceToDropStack */ }));
                    if (equipMoves.length > 0) {
                        moveCardInfos.push(Object.assign(Object.assign({}, info), { movingCards: equipMoves }));
                    }
                    continue;
                }
            }
            else if (to && (to.Dead || (toArea === 2 /* JudgeArea */ && to.judgeAreaDisabled()))) {
                info.toId = undefined;
                info.toArea = 4 /* DropStack */;
                info.moveReason = 6 /* PlaceToDropStack */;
                to = undefined;
            }
            const from = fromId ? this.room.getPlayerById(fromId) : undefined;
            const cardIds = movingCards.reduce((cards, cardInfo) => {
                if (!cardInfo.asideMove) {
                    cards.push(cardInfo.card);
                }
                return cards;
            }, []);
            const actualCardIds = card_1.VirtualCard.getActualCards(cardIds);
            this.createCardMoveMessage(from, to, cardIds, actualCardIds, info);
            moveCardInfos.push(info);
        }
        if (moveCardInfos.length === 0) {
            return;
        }
        event.infos = moveCardInfos;
        return await this.iterateEachStage(identifier, event, onActualExecuted, async (stage) => {
            if (stage === "CardMoving" /* CardMoving */) {
                for (const info of event.infos) {
                    const { fromId, toId, movingCards } = info;
                    const from = fromId ? this.room.getPlayerById(fromId) : undefined;
                    const to = toId ? this.room.getPlayerById(toId) : undefined;
                    const cardIds = movingCards.reduce((cards, cardInfo) => {
                        if (!cardInfo.asideMove) {
                            cards.push(cardInfo.card);
                        }
                        return cards;
                    }, []);
                    const actualCardIds = card_1.VirtualCard.getActualCards(cardIds);
                    await this.moveCardInGameboard(from, to, cardIds, actualCardIds, info);
                }
                this.room.broadcast(identifier, event);
            }
            else if (stage === "AfterCardMoved" /* AfterCardMoved */) {
                for (const info of event.infos) {
                    if (!info.fromId) {
                        continue;
                    }
                    const from = this.room.getPlayerById(info.fromId);
                    const movingEquips = info.movingCards.filter(cardInfo => cardInfo.fromArea === 1 /* EquipArea */);
                    for (const cardInfo of movingEquips) {
                        await skill_1.SkillLifeCycle.executeHookOnLosingSkill(engine_1.Sanguosha.getCardById(cardInfo.card).Skill, this.room, from);
                    }
                }
            }
        });
    }
    createCardMoveMessage(from, to, cardIds, actualCardIds, event) {
        const { fromId, toArea, toId, movingCards, moveReason, hideBroadcast, placeAtTheBottomOfDrawStack, isOutsideAreaInPublic, proposer, } = event;
        if (!hideBroadcast) {
            if (from) {
                event.messages = event.messages || [];
                const cards = movingCards.map(cardInfo => cardInfo.card);
                if (moveReason === 6 /* PlaceToDropStack */) {
                    event.messages.push(translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} has been placed into drop stack from {1}', translation_json_tool_1.TranslationPack.patchCardInTranslation(...card_1.VirtualCard.getActualCards(cards)), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from)).toString());
                }
                else if (moveReason === 7 /* PlaceToDrawStack */) {
                    event.messages.push(translation_json_tool_1.TranslationPack.translationJsonPatcher(`{0} has been placed on the ${placeAtTheBottomOfDrawStack ? 'bottom' : 'top'} of draw stack from {1}`, translation_json_tool_1.TranslationPack.patchCardInTranslation(...card_1.VirtualCard.getActualCards(cards)), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from)).toString());
                }
                else {
                    const lostCards = movingCards
                        .filter(cardInfo => cardInfo.fromArea === 1 /* EquipArea */)
                        .map(cardInfo => cardInfo.card);
                    if (lostCards.length > 0) {
                        event.messages.push(translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} lost card {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from), translation_json_tool_1.TranslationPack.patchCardInTranslation(...card_1.VirtualCard.getActualCards(lostCards))).toString());
                    }
                }
                const moveOwnedCards = movingCards
                    .filter(cardInfo => cardInfo.fromArea === 0 /* HandArea */)
                    .map(cardInfo => cardInfo.card);
                if ([4 /* SelfDrop */, 5 /* PassiveDrop */].includes(moveReason) && moveOwnedCards.length > 0) {
                    event.messages.push(translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} drops cards {1}' + (proposer !== undefined && proposer !== fromId ? ' by {2}' : ''), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from), translation_json_tool_1.TranslationPack.patchCardInTranslation(...moveOwnedCards), proposer !== undefined ? translation_json_tool_1.TranslationPack.patchPlayerInTranslation(this.room.getPlayerById(proposer)) : '').toString());
                }
                else if (![8 /* CardUse */, 9 /* CardResponse */].includes(moveReason) &&
                    moveOwnedCards.length > 0 &&
                    fromId !== toId) {
                    event.messages.push(translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} lost {1} cards', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from), moveOwnedCards.length).toString());
                }
            }
            if (!event.translationsMessage && to) {
                if (toArea === 0 /* HandArea */) {
                    if (!event.engagedPlayerIds) {
                        event.engagedPlayerIds = [];
                        fromId && event.engagedPlayerIds.push(fromId);
                        toId && event.engagedPlayerIds.push(toId);
                    }
                    event.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} obtains cards {1}' + (fromId ? ' from {2}' : ''), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(to), translation_json_tool_1.TranslationPack.patchCardInTranslation(...actualCardIds), fromId ? translation_json_tool_1.TranslationPack.patchPlayerInTranslation(this.room.getPlayerById(fromId)) : '').extract();
                    event.unengagedMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} obtains {1} cards' + (fromId ? ' from {2}' : ''), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(to), cardIds.length, fromId ? translation_json_tool_1.TranslationPack.patchPlayerInTranslation(this.room.getPlayerById(fromId)) : '').extract();
                }
                else if (toArea === 3 /* OutsideArea */) {
                    if (isOutsideAreaInPublic) {
                        event.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} move cards {1} onto the top of {2} character card', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(to), translation_json_tool_1.TranslationPack.patchCardInTranslation(...actualCardIds), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(to)).extract();
                    }
                    else {
                        event.engagedPlayerIds = [to.Id];
                        event.unengagedMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} move {1} cards onto the top of {2} character card', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(to), actualCardIds.length, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(to)).extract();
                    }
                }
            }
        }
    }
    async moveCardInGameboard(from, to, cardIds, actualCardIds, event) {
        const { toArea, movingCards, toOutsideArea, placeAtTheBottomOfDrawStack } = event;
        for (const { card, fromArea, asideMove } of movingCards) {
            if (asideMove) {
                continue;
            }
            else if (fromArea === 5 /* DrawStack */) {
                this.room.getCardFromDrawStack(card);
            }
            else if (fromArea === 4 /* DropStack */) {
                this.room.getCardFromDropStack(card);
            }
            else if (fromArea === 6 /* ProcessingArea */) {
                this.room.endProcessOnCard(card);
            }
            else if (from) {
                from.dropCards(card);
            }
        }
        if (toArea === 5 /* DrawStack */) {
            this.room.putCards(placeAtTheBottomOfDrawStack ? 'bottom' : 'top', ...cardIds);
        }
        else if (toArea === 4 /* DropStack */) {
            this.room.bury(...cardIds);
        }
        else if (toArea === 6 /* ProcessingArea */) {
            const processingCards = cardIds.filter(cardId => !this.room.isCardOnProcessing(cardId));
            if (processingCards.length > 0) {
                this.room.addProcessingCards(processingCards.join('+'), ...processingCards);
            }
        }
        else if (toArea === 7 /* UniqueCardArea */) {
            this.room.bury(...card_1.VirtualCard.getActualCards(cardIds).filter(cardId => !engine_1.Sanguosha.getCardById(cardId).isUniqueCard()));
        }
        else {
            if (to) {
                if (toArea === 1 /* EquipArea */) {
                    this.room.transformCard(to, actualCardIds, 1 /* EquipArea */);
                    for (const cardId of actualCardIds) {
                        const card = engine_1.Sanguosha.getCardById(cardId);
                        const existingEquip = to.getEquipment(card.EquipType);
                        precondition_1.Precondition.assert(existingEquip === undefined, `Cannot move card ${cardId} to equip area since there is an existing same type of equip`);
                        to.equip(card);
                    }
                }
                else if (toArea === 3 /* OutsideArea */) {
                    to.getCardIds(toArea, precondition_1.Precondition.exists(toOutsideArea, 'outside area must have an area name')).push(...actualCardIds);
                }
                else if (toArea === 0 /* HandArea */) {
                    this.room.transformCard(to, actualCardIds, 0 /* HandArea */);
                    to.getCardIds(toArea).push(...actualCardIds);
                }
                else {
                    const transformedDelayedTricks = cardIds.map(cardId => {
                        if (!card_1.Card.isVirtualCardId(cardId)) {
                            return cardId;
                        }
                        const card = engine_1.Sanguosha.getCardById(cardId);
                        if (card.ActualCardIds.length === 1) {
                            const originalCard = engine_1.Sanguosha.getCardById(card.ActualCardIds[0]);
                            if (card.Suit !== originalCard.Suit) {
                                card.Suit = originalCard.Suit;
                            }
                            if (card.CardNumber !== originalCard.CardNumber) {
                                card.CardNumber = originalCard.CardNumber;
                            }
                            return card.Id;
                        }
                        return cardId;
                    });
                    to.getCardIds(toArea).push(...transformedDelayedTricks);
                }
            }
        }
    }
    async onHandleJudgeEvent(identifier, event, onActualExecuted) {
        let fromArea = 5 /* DrawStack */;
        const { toId, bySkill, byCard, judgeCardId } = event;
        let ownerId = this.room.getCardOwnerId(judgeCardId);
        if (ownerId) {
            const cardArea = this.room.getPlayerById(ownerId).cardFrom(judgeCardId);
            fromArea = cardArea === undefined ? fromArea : cardArea;
        }
        const to = this.room.getPlayerById(toId);
        const outsideAreaName = to.getOutsideAreaNameOf(judgeCardId);
        if (outsideAreaName && !to.isCharacterOutsideArea(outsideAreaName)) {
            fromArea = 3 /* OutsideArea */;
            ownerId = toId;
        }
        await this.room.moveCards({
            movingCards: [{ card: judgeCardId, fromArea }],
            fromId: fromArea !== 5 /* DrawStack */ ? ownerId : undefined,
            moveReason: 2 /* ActiveMove */,
            toArea: 6 /* ProcessingArea */,
            proposer: toId,
            movedByReason: "JudgeProcess" /* JudgeProcess */,
            triggeredBySkills: bySkill ? [bySkill] : undefined,
        });
        await this.iterateEachStage(identifier, event, onActualExecuted, async (stage) => {
            if (stage === "OnJudge" /* OnJudge */) {
                this.room.broadcast(103 /* CustomGameDialog */, {
                    translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} starts a judge of {1}, judge card is {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(this.room.getPlayerById(event.toId)), byCard ? translation_json_tool_1.TranslationPack.patchCardInTranslation(byCard) : bySkill, translation_json_tool_1.TranslationPack.patchCardInTranslation(event.judgeCardId)).extract(),
                });
            }
            else if (stage === "JudgeEffect" /* JudgeEffect */) {
                const to = this.room.getPlayerById(toId);
                this.room.transformCard(to, event);
                event.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} got judged card {2} on {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(to), byCard ? translation_json_tool_1.TranslationPack.patchCardInTranslation(byCard) : bySkill, translation_json_tool_1.TranslationPack.patchCardInTranslation(judgeCardId)).extract();
                this.room.broadcast(identifier, event);
            }
        });
        if (this.room.isCardOnProcessing(event.judgeCardId)) {
            await this.room.moveCards({
                movingCards: [{ card: event.judgeCardId, fromArea: 6 /* ProcessingArea */ }],
                moveReason: 6 /* PlaceToDropStack */,
                toArea: 4 /* DropStack */,
                proposer: event.toId,
                movedByReason: "JudgeProcess" /* JudgeProcess */,
                triggeredBySkills: bySkill ? [bySkill] : undefined,
            });
        }
        this.room.endProcessOnTag(event.judgeCardId.toString());
    }
    async onHandlePinDianEvent(event, onActualExecuted) {
        return await this.iterateEachStage(134 /* PinDianEvent */, event, onActualExecuted);
    }
    async onHandlePhaseChangeEvent(identifier, event, onActualExecuted) {
        return await this.iterateEachStage(identifier, event, onActualExecuted, async (stage) => {
            const to = this.room.getPlayerById(event.toPlayer);
            if (to.Dead) {
                this.skip();
                event_packer_1.EventPacker.terminate(event);
            }
            else if (stage === "PhaseChanged" /* PhaseChanged */) {
                if (event.to === 0 /* PhaseBegin */) {
                    event.messages = event.messages || [];
                    event.messages.push(translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} round start', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(to)).toString());
                }
                this.room.broadcast(104 /* PhaseChangeEvent */, event);
            }
        });
    }
    async onHandlePhaseStageChangeEvent(identifier, event, onActualExecuted) {
        return await this.iterateEachStage(identifier, event, onActualExecuted, async (stage) => {
            if (this.room.getPlayerById(event.playerId).Dead) {
                this.skip();
                event_packer_1.EventPacker.terminate(event);
            }
            else if (stage === "StageChanged" /* StageChanged */) {
                this.room.broadcast(105 /* PhaseStageChangeEvent */, event);
            }
        });
    }
    async onHandleGameStartEvent(identifier, event, onActualExecuted) {
        this.room.broadcast(142 /* GameStartEvent */, event);
        return await this.iterateEachStage(identifier, event, onActualExecuted);
    }
    async onHandleGameBeginEvent(identifier, event, onActualExecuted) {
        return await this.iterateEachStage(identifier, event, onActualExecuted);
    }
    async onHandleCircleStartEvent(identifier, event, onActualExecuted) {
        this.room.broadcast(144 /* CircleStartEvent */, event);
        return await this.iterateEachStage(identifier, event, onActualExecuted);
    }
    async onHandleLevelBeginEvent(identifier, event, onActualExecuted) {
        this.room.broadcast(145 /* LevelBeginEvent */, event);
        return await this.iterateEachStage(identifier, event, onActualExecuted);
    }
    async onHandleLoseHpEvent(identifier, event, onActualExecuted) {
        const victim = this.room.getPlayerById(event.toId);
        return await this.iterateEachStage(identifier, event, onActualExecuted, async (stage) => {
            if (victim.Dead) {
                event_packer_1.EventPacker.terminate(event);
                return;
            }
            if (stage === "LosingHp" /* LosingHp */) {
                if (event.translationsMessage === undefined) {
                    event.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} lost {1} hp', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(victim), event.lostHp).extract();
                }
                const hpChangeEvent = {
                    toId: victim.Id,
                    amount: event.lostHp,
                    byReaon: 'lostHp',
                };
                event_packer_1.EventPacker.createIdentifierEvent(139 /* HpChangeEvent */, hpChangeEvent);
                await this.onHandleIncomingEvent(139 /* HpChangeEvent */, hpChangeEvent, async (stage) => {
                    if (stage === "HpChanging" /* HpChanging */) {
                        this.room.broadcast(identifier, event);
                    }
                    return true;
                });
                event_packer_1.EventPacker.copyPropertiesTo(hpChangeEvent, event);
                if (event_packer_1.EventPacker.isTerminated(event)) {
                    return;
                }
                const dyingEvent = {
                    dying: victim.Id,
                };
                if (victim.Hp <= 0) {
                    await this.onHandleIncomingEvent(152 /* PlayerDyingEvent */, event_packer_1.EventPacker.createIdentifierEvent(152 /* PlayerDyingEvent */, dyingEvent));
                }
            }
        });
    }
    async onHandleArmorChangeEvent(identifier, event, onActualExecuted) {
        const to = this.room.getPlayerById(event.toId);
        if (to.ChainLocked && event.damageType !== "normal_property" /* Normal */) {
            await this.room.chainedOn(to.Id);
            event.beginnerOfTheDamage = event.beginnerOfTheDamage || to.Id;
        }
        return await this.iterateEachStage(identifier, event, onActualExecuted, async (stage) => {
            if (stage === "ArmorChanging" /* ArmorChanging */) {
                if (event.amount >= 0) {
                    event.amount = Math.min(game_props_1.UPPER_LIMIT_OF_ARMOR - to.Armor, event.amount);
                    if (event.amount < 1) {
                        event_packer_1.EventPacker.terminate(event);
                        return;
                    }
                }
                else {
                    if (event.amount === -to.Armor && event.leftDamage > 0) {
                        event_packer_1.EventPacker.setLosingAllArmorTag(event, to.Armor);
                    }
                    event.amount = Math.max(event.amount, -to.Armor);
                }
                to.changeArmor(event.amount);
                event.leftDamage && (event.leftDamage = event.leftDamage + event.amount);
            }
        });
    }
    async onHandleHpChangeEvent(identifier, event, onActualExecuted) {
        const to = this.room.getPlayerById(event.toId);
        if (event.byReaon === 'damage') {
            if (to.ChainLocked && event.damageType !== "normal_property" /* Normal */) {
                await this.room.chainedOn(to.Id);
                event.beginnerOfTheDamage = event.beginnerOfTheDamage || to.Id;
            }
        }
        return await this.iterateEachStage(identifier, event, onActualExecuted, async (stage) => {
            if (stage === "HpChanging" /* HpChanging */) {
                if (event.byReaon === 'recover') {
                    to.changeHp(event.amount);
                    if (to.Dying && to.Hp > 0) {
                        to.Dying = false;
                    }
                }
                else {
                    to.changeHp(0 - event.amount);
                }
            }
        });
    }
    async onHandleRecoverEvent(identifier, event, onActualExecuted) {
        const to = this.room.getPlayerById(event.toId);
        return await this.iterateEachStage(identifier, event, onActualExecuted, async (stage) => {
            if (to.Dead) {
                event_packer_1.EventPacker.terminate(event);
                return;
            }
            event.recoveredHp = Math.min(event.recoveredHp, to.MaxHp - to.Hp);
            if (stage === "RecoverEffecting" /* RecoverEffecting */) {
                const hpChangeEvent = {
                    fromId: event.recoverBy,
                    toId: to.Id,
                    amount: event.recoveredHp,
                    byReaon: 'recover',
                    byCardIds: event.cardIds,
                };
                event_packer_1.EventPacker.createIdentifierEvent(139 /* HpChangeEvent */, hpChangeEvent);
                await this.onHandleIncomingEvent(139 /* HpChangeEvent */, hpChangeEvent, async (stage) => {
                    if (stage === "HpChanging" /* HpChanging */) {
                        this.room.broadcast(identifier, event);
                    }
                    return true;
                });
                event_packer_1.EventPacker.copyPropertiesTo(hpChangeEvent, event);
            }
        });
    }
    async onHandleChainLockedEvent(identifier, event, onActualExecuted) {
        return await this.iterateEachStage(identifier, event, onActualExecuted, async (stage) => {
            if (stage === "Chaining" /* Chaining */) {
                const player = this.room.getPlayerById(event.toId);
                player.ChainLocked = event.linked;
                this.room.broadcast(identifier, event);
            }
        });
    }
    async onHandlePlayerTurnOverEvent(identifier, event, onActualExecuted) {
        return await this.iterateEachStage(identifier, event, onActualExecuted, async (stage) => {
            if (stage === "TurningOver" /* TurningOver */) {
                const player = this.room.getPlayerById(event.toId);
                player.turnOver();
                if (event.translationsMessage === undefined) {
                    event.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} turned over the charactor card, who is {1} right now', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(player), player.isFaceUp() ? 'facing up' : 'turning over').extract();
                }
                this.room.broadcast(identifier, event);
            }
        });
    }
    insertPlayerRound(player) {
        this.playRoundInsertions.push(player);
    }
    insertPlayerPhase(player, phase) {
        this.playPhaseInsertions.push({
            player,
            phase,
        });
    }
    isExtraPhase() {
        return this.inExtraPhase;
    }
    async turnToNextPlayer() {
        this.tryToThrowNotStartedError();
        this.playerStages = [];
        let chosen = false;
        if (this.playRoundInsertions.length > 0) {
            while (this.playRoundInsertions.length > 0 && !chosen) {
                const player = this.room.getPlayerById(this.playRoundInsertions.shift());
                if (player.Dead) {
                    continue;
                }
                else {
                    this.dumpedLastPlayerPositionIndex = this.playerPositionIndex;
                    this.playerPositionIndex = player.Position;
                    chosen = true;
                    break;
                }
            }
        }
        this.inExtraRound = chosen;
        while (!chosen) {
            const nextIndex = (this.dumpedLastPlayerPositionIndex >= 0 ? this.dumpedLastPlayerPositionIndex : this.playerPositionIndex) + 1;
            this.dumpedLastPlayerPositionIndex = -1;
            this.playerPositionIndex = nextIndex % this.room.Players.length;
            chosen = !this.room.Players[this.playerPositionIndex].Dead;
        }
    }
}
exports.StandardGameProcessor = StandardGameProcessor;
