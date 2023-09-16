"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerRoom = void 0;
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const game_props_1 = require("core/game/game_props");
const loader_cards_1 = require("core/game/package_loader/loader.cards");
const loader_characters_1 = require("core/game/package_loader/loader.characters");
const player_server_1 = require("core/player/player.server");
const algorithm_1 = require("core/shares/libs/algorithm");
const functional_1 = require("core/shares/libs/functional");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const system_1 = require("core/shares/libs/system");
const aim_group_1 = require("core/shares/libs/utils/aim_group");
const target_group_1 = require("core/shares/libs/utils/target_group");
const skill_1 = require("core/skills/skill");
const skill_rule_1 = require("core/skills/skill_rule");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const room_1 = require("./room");
class ServerRoom extends room_1.Room {
    constructor(roomId, gameInfo, socket, gameProcessor, analytics, players = [], flavor, logger, gameMode, gameCommonRules, eventStack, waitingRoomInfo) {
        super();
        this.roomId = roomId;
        this.gameInfo = gameInfo;
        this.socket = socket;
        this.gameProcessor = gameProcessor;
        this.analytics = analytics;
        this.players = players;
        this.flavor = flavor;
        this.logger = logger;
        this.gameMode = gameMode;
        this.gameCommonRules = gameCommonRules;
        this.eventStack = eventStack;
        this.waitingRoomInfo = waitingRoomInfo;
        this.loadedCharacters = [];
        this.selectedCharacters = [];
        this.drawStack = [];
        this.dropStack = [];
        this.roomClosed = false;
        this.onAim = async (event, aimEventCollaborators) => {
            const stages = ["OnAim" /* OnAim */, "OnAimmed" /* OnAimmed */, "AfterAim" /* AfterAim */, "AfterAimmed" /* AfterAimmed */];
            for (const stage of stages) {
                const involvedPlayerIds = target_group_1.TargetGroupUtil.getAllTargets(event.targetGroup);
                if (!involvedPlayerIds) {
                    return false;
                }
                this.sortByPlayersPosition(involvedPlayerIds, ids => this.getPlayerById(ids[0]));
                event.targetGroup = involvedPlayerIds;
                let aimGroup = aim_group_1.AimGroupUtil.initAimGroup(involvedPlayerIds.map(ids => ids[0]));
                const collabroatorsIndex = {};
                let isFirstTarget = true;
                do {
                    const toId = aim_group_1.AimGroupUtil.getUndoneOrDoneTargets(aimGroup)[0];
                    let aimEvent;
                    let initialEvent = false;
                    collabroatorsIndex[toId] = collabroatorsIndex[toId] || 0;
                    if (!aimEventCollaborators[toId] || collabroatorsIndex[toId] >= aimEventCollaborators[toId].length) {
                        aimEvent = event_packer_1.EventPacker.createIdentifierEvent(131 /* AimEvent */, {
                            fromId: event.fromId,
                            byCardId: event.cardId,
                            toId,
                            targetGroup: event.targetGroup,
                            nullifiedTargets: event.nullifiedTargets || [],
                            allTargets: aimGroup,
                            isFirstTarget,
                            additionalDamage: event.additionalDamage,
                            extraUse: event.extraUse,
                            triggeredBySkills: event.triggeredBySkills,
                        });
                        event_packer_1.EventPacker.copyPropertiesTo(event, aimEvent);
                        collabroatorsIndex[toId] = 1;
                        initialEvent = true;
                    }
                    else {
                        aimEvent = aimEventCollaborators[toId][collabroatorsIndex[toId]];
                        aimEvent.fromId = event.fromId;
                        aimEvent.byCardId = event.cardId;
                        aimEvent.allTargets = aimGroup;
                        aimEvent.targetGroup = event.targetGroup;
                        aimEvent.nullifiedTargets = event.nullifiedTargets || [];
                        aimEvent.isFirstTarget = isFirstTarget;
                        aimEvent.extraUse = event.extraUse;
                        aimEvent.triggeredBySkills = event.triggeredBySkills;
                    }
                    isFirstTarget = false;
                    await this.trigger(aimEvent, stage);
                    aim_group_1.AimGroupUtil.removeDeadTargets(this, aimEvent);
                    let aimEventTargetGroup = aimEvent.targetGroup;
                    if (aimEventTargetGroup) {
                        const aimEventTargets = target_group_1.TargetGroupUtil.getAllTargets(aimEventTargetGroup);
                        aimEventTargets && this.sortByPlayersPosition(aimEventTargets, ids => this.getPlayerById(ids[0]));
                        aimEventTargetGroup = aimEventTargets;
                    }
                    event.fromId = aimEvent.fromId;
                    event.targetGroup = aimEventTargetGroup;
                    event.nullifiedTargets = aimEvent.nullifiedTargets;
                    if (aimEvent.triggeredBySkills) {
                        event.triggeredBySkills = event.triggeredBySkills
                            ? [...event.triggeredBySkills, ...aimEvent.triggeredBySkills]
                            : aimEvent.triggeredBySkills;
                    }
                    event.extraUse = aimEvent.extraUse;
                    if (aim_group_1.AimGroupUtil.getAllTargets(aimEvent.allTargets).length === 0) {
                        return false;
                    }
                    const cancelledTargets = aim_group_1.AimGroupUtil.getCancelledTargets(aimEvent.allTargets);
                    if (cancelledTargets.length > 0) {
                        for (const target of cancelledTargets) {
                            aimEventCollaborators[target] = [];
                            collabroatorsIndex[target] = 0;
                        }
                    }
                    aimEvent.allTargets[2 /* Cancelled */] = [];
                    aimEventCollaborators[toId] = aimEventCollaborators[toId] || [];
                    if (!(event_packer_1.EventPacker.isTerminated(aimEvent) || this.getPlayerById(toId).Dead)) {
                        if (initialEvent) {
                            aimEventCollaborators[toId].push(aimEvent);
                        }
                        else {
                            aimEventCollaborators[toId][collabroatorsIndex[toId]] = aimEvent;
                        }
                        collabroatorsIndex[toId]++;
                    }
                    event_packer_1.EventPacker.isTerminated(aimEvent) || aim_group_1.AimGroupUtil.setTargetDone(aimGroup, toId);
                    aimGroup = aimEvent.allTargets;
                } while (aim_group_1.AimGroupUtil.getUndoneOrDoneTargets(aimGroup).length > 0);
            }
            return true;
        };
        this.init();
    }
    init() {
        this.loadedCharacters = loader_characters_1.CharacterLoader.getInstance()
            .getPackages(...this.gameInfo.characterExtensions)
            .filter(character => !this.gameInfo.excludedCharacters.includes(character.Id));
        this.drawStack = loader_cards_1.CardLoader.getInstance()
            .getPackages(...this.gameInfo.cardExtensions)
            .map(card => card.Id);
        this.numOfCards = this.drawStack.length;
        this.dropStack = [];
        this.socket.emit(this);
        this.addAIPlayers();
    }
    addAIPlayers() {
        const numOfAiPlayers = this.gameMode === "pve" /* Pve */ ? 1 : this.gameMode === "pve-classic" /* PveClassic */ ? 3 : 0;
        for (let i = 0; i < numOfAiPlayers; i++) {
            const fakePlayer = new player_server_1.SmartPlayer(this.Players.length, this.gameMode);
            this.addPlayer(fakePlayer);
        }
    }
    updatePlayerStatus(status, toId) {
        super.updatePlayerStatus(status, toId);
        this.broadcast(101 /* PlayerStatusEvent */, { status, toId, ignoreNotifiedStatus: true });
    }
    shuffle() {
        if (this.dropStack.length > 0) {
            algorithm_1.Algorithm.shuffle(this.dropStack);
            this.drawStack = this.drawStack.concat(this.dropStack);
            this.dropStack = [];
        }
        else {
            algorithm_1.Algorithm.shuffle(this.drawStack);
        }
        precondition_1.Precondition.debugBlock(this.gameInfo.flavor, () => {
            const cardsInProcessing = Object.values(this.onProcessingCards).reduce((total, cards) => {
                total += cards.length;
                return total;
            }, 0);
            const gameCards = this.getInGameCards();
            precondition_1.Precondition.alarm(this.numOfCards !== this.drawStack.length + gameCards.length + cardsInProcessing ? undefined : true, `some cards are lost: current total cards: ${this.drawStack.length + gameCards.length + cardsInProcessing}, should be: ${this.numOfCards}`);
            const allCards = loader_cards_1.CardLoader.getInstance()
                .getPackages(...this.gameInfo.cardExtensions)
                .map(card => card.Id);
            const missingCards = algorithm_1.Algorithm.unique(allCards, [...this.drawStack, ...gameCards]);
            missingCards.length > 0 &&
                this.logger.error('missing cards:', missingCards
                    .map(id => {
                    const card = engine_1.Sanguosha.getCardById(id);
                    return card.Name + ' ' + card.CardNumber + ' ' + functional_1.Functional.getCardSuitRawText(card.Suit);
                })
                    .join(', '));
        });
    }
    getInGameCards() {
        const totalCards = [];
        for (const player of this.AlivePlayers) {
            totalCards.push(...player.getAllGameCards());
        }
        return totalCards;
    }
    shuffleSeats() {
        algorithm_1.Algorithm.shuffle(this.players);
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].Position = i;
        }
        this.sortPlayers();
    }
    insertPlayerRound(player) {
        this.gameProcessor.insertPlayerRound(player);
    }
    insertPlayerPhase(player, phase) {
        this.gameProcessor.insertPlayerPhase(player, phase);
    }
    isExtraPhase() {
        return this.gameProcessor.isExtraPhase();
    }
    async gameStart() {
        this.shuffle();
        this.shuffleSeats();
        this.gameProcessor.assignRoles(this.players);
        const event = {
            gameStartInfo: {
                numberOfDrawStack: this.DrawStack.length,
                numberOfDropStack: this.DropStack.length,
                circle: 0,
                currentPlayerId: this.players[0].Id,
            },
            gameInfo: this.Info,
            playersInfo: this.Players.map(player => player.getPlayerInfo()),
            messages: ['game will start within 3 seconds'],
        };
        this.broadcast(141 /* GameReadyEvent */, event);
        this.gameStarted = true;
        await system_1.System.MainThread.sleep(3000);
        await this.gameProcessor.gameStart(this, this.loadedCharacters, () => {
            this.selectedCharacters = this.getAlivePlayersFrom().map(player => player.CharacterId);
        });
    }
    createPlayer(playerInfo) {
        const { Id, Name, Position, CharacterId } = playerInfo;
        this.players.push(new player_server_1.ServerPlayer(Id, Name, Position, CharacterId));
    }
    clearSocketSubscriber(identifier, to) {
        this.socket.clearSubscriber(identifier, to);
    }
    shuffleCardsIntoDrawStack(cardIds) {
        for (const cardId of cardIds) {
            const randomIndex = Math.floor(Math.random() * this.drawStack.length);
            this.drawStack.splice(randomIndex, 0, cardId);
        }
    }
    clearHeaded(toId) {
        this.getPlayerById(toId).clearHeaded();
        this.broadcast(118 /* DrunkEvent */, { toId, drunk: false });
    }
    notify(type, content, to) {
        !content.ignoreNotifiedStatus &&
            this.broadcast(102 /* NotifyEvent */, {
                toIds: [to],
                notificationTime: this.gameInfo.playingTimeLimit || 60,
            });
        content = event_packer_1.EventPacker.createIdentifierEvent(type, event_packer_1.EventPacker.minifyPayload(content));
        this.eventStack.push(content);
        this.socket.notify(type, content, to);
    }
    //TODO: enable to custom response time limit
    doNotify(toIds, timeLimitVariant = 0 /* PlayPhase */) {
        this.broadcast(102 /* NotifyEvent */, {
            toIds,
            notificationTime: timeLimitVariant === 0 /* PlayPhase */
                ? this.gameInfo.playingTimeLimit || 60
                : this.gameInfo.wuxiekejiTimeLimit || 15,
        });
    }
    broadcast(type, content) {
        if (this.isPlaying()) {
            content = event_packer_1.EventPacker.wrapGameRunningInfo(content, {
                numberOfDrawStack: this.drawStack.length,
                numberOfDropStack: this.dropStack.length,
                circle: this.circle,
                currentPlayerId: this.CurrentPlayer.Id,
            });
        }
        event_packer_1.EventPacker.createIdentifierEvent(type, content);
        if (type !== 102 /* NotifyEvent */) {
            event_packer_1.EventPacker.setTimestamp(content);
            this.analytics.record(content, this.isPlaying() ? this.CurrentPlayerPhase : undefined);
        }
        content = event_packer_1.EventPacker.createIdentifierEvent(type, event_packer_1.EventPacker.minifyPayload(content));
        this.eventStack.push(content);
        this.socket.broadcast(type, content);
    }
    playerTriggerableSkills(player, skillFrom, content, stage, exclude = []) {
        const { triggeredBySkills } = content;
        const bySkills = triggeredBySkills
            ? triggeredBySkills.map(skillName => engine_1.Sanguosha.getSkillBySkillName(skillName))
            : undefined;
        const canTriggerSkills = [];
        if (skillFrom === 'character') {
            const hookedSkills = player.HookedSkills.reduce((skills, skill) => {
                skill instanceof skill_1.TriggerSkill && skills.push(skill);
                return skills;
            }, []);
            const playerSkills = player.Dead && stage !== "PlayerDied" /* PlayerDied */ && stage !== "AfterPlayerDied" /* AfterPlayerDied */
                ? hookedSkills
                : player.getPlayerSkills('trigger');
            for (const skill of [...playerSkills]) {
                const canTrigger = bySkills
                    ? bySkills.find(bySkill => skill_rule_1.UniqueSkillRule.isProhibitedBySkillRule(bySkill, skill)) === undefined
                    : true;
                if (canTrigger &&
                    skill.isTriggerable(content, stage) &&
                    skill.canUse(this, player, content, stage) &&
                    !exclude.includes(skill)) {
                    canTriggerSkills.push(skill);
                }
            }
        }
        else if (!player.Dead) {
            for (const equip of player.getCardIds(1 /* EquipArea */)) {
                const equipCard = engine_1.Sanguosha.getCardById(equip);
                if (!(equipCard.Skill instanceof skill_1.TriggerSkill) ||
                    skill_rule_1.UniqueSkillRule.isProhibited(equipCard.Skill, player, equipCard)) {
                    continue;
                }
                const canTrigger = bySkills
                    ? bySkills.find(skill => !skill_rule_1.UniqueSkillRule.canTriggerCardSkillRule(skill, equipCard)) === undefined
                    : true;
                if (canTrigger &&
                    equipCard.Skill.isTriggerable(content, stage) &&
                    equipCard.Skill.canUse(this, player, content, stage) &&
                    !exclude.includes(equipCard.Skill)) {
                    canTriggerSkills.push(equipCard.Skill);
                }
            }
        }
        return canTriggerSkills;
    }
    async trigger(content, stage) {
        if (!this.CurrentPlayer || !this.isPlaying()) {
            this.logger.debug('Do Not Need to Trigger Skill Because GameEnd Or Not CurrentPlayer');
            return;
        }
        const effectedSkillList = [];
        const nullifySkillList = [];
        for (const player of this.getAlivePlayersFrom()) {
            for (const pSkill of player.getSkillProhibitedSkills()) {
                if (pSkill.toDeactivateSkills(this, player, content, stage)) {
                    for (const playerSkill of player.getSkillProhibitedSkills(true)) {
                        pSkill.skillFilter(playerSkill, player) && nullifySkillList.push(playerSkill);
                    }
                }
                else if (pSkill.toActivateSkills(this, player, content, stage)) {
                    for (const playerSkill of player.getSkillProhibitedSkills(true)) {
                        if (effectedSkillList.includes(playerSkill)) {
                            continue;
                        }
                        if (pSkill.skillFilter(playerSkill, player, undefined, true)) {
                            await skill_1.SkillLifeCycle.executeHookedOnEffecting(playerSkill, this, player);
                            effectedSkillList.push(playerSkill);
                        }
                    }
                }
            }
            for (const nullifySkill of nullifySkillList) {
                await skill_1.SkillLifeCycle.executeHookedOnNullifying(nullifySkill, this, player);
            }
        }
        const { triggeredBySkills } = content;
        const bySkills = triggeredBySkills
            ? triggeredBySkills.map(skillName => engine_1.Sanguosha.getSkillBySkillName(skillName))
            : undefined;
        const skillSource = ['character', 'equip'];
        try {
            for (const player of this.getAllPlayersFrom()) {
                if (event_packer_1.EventPacker.isTerminated(content)) {
                    return;
                }
                for (const skillFrom of skillSource) {
                    if (event_packer_1.EventPacker.isTerminated(content)) {
                        return;
                    }
                    let canTriggerSkills = this.playerTriggerableSkills(player, skillFrom, content, stage);
                    const triggeredSkills = [];
                    do {
                        if (event_packer_1.EventPacker.isTerminated(content)) {
                            return;
                        }
                        const skillsInPriorities = [];
                        const skillTriggerableTimes = {};
                        for (const skill of canTriggerSkills) {
                            const priority = skill.getPriority(this, player, content);
                            if (skillsInPriorities[priority]) {
                                skillsInPriorities[priority].push(skill);
                            }
                            else {
                                skillsInPriorities[priority] = [skill];
                            }
                            skillTriggerableTimes[skill.Name] = skill.triggerableTimes(content, player);
                        }
                        for (const skills of skillsInPriorities) {
                            if (event_packer_1.EventPacker.isTerminated(content)) {
                                return;
                            }
                            if (!skills) {
                                continue;
                            }
                            if (skills.length === 1) {
                                const skill = skills[0];
                                for (let i = 0; i < skill.triggerableTimes(content, player); i++) {
                                    const triggerSkillEvent = {
                                        fromId: player.Id,
                                        skillName: skill.Name,
                                        triggeredOnEvent: content,
                                        mute: skill.Muted,
                                    };
                                    if (skill.isAutoTrigger(this, player, content) ||
                                        skill.SkillType === 1 /* Compulsory */ ||
                                        skill.SkillType === 2 /* Awaken */) {
                                        await this.useSkill(triggerSkillEvent);
                                    }
                                    else {
                                        const event = {
                                            invokeSkillNames: [skill.Name],
                                            triggeredOnEvent: content,
                                            toId: player.Id,
                                            conversation: skill.getSkillLog(this, player, content),
                                        };
                                        if (skill.isUncancellable(this, content)) {
                                            event_packer_1.EventPacker.createUncancellableEvent(event);
                                        }
                                        this.notify(171 /* AskForSkillUseEvent */, event, player.Id);
                                        const { invoke, cardIds, toIds } = await this.onReceivingAsyncResponseFrom(171 /* AskForSkillUseEvent */, player.Id);
                                        const skillsUsing = player.getFlag("flag:skills_using" /* SkillsUsing */);
                                        if (!invoke && skillsUsing && skillsUsing.includes(skill.Name)) {
                                            await this.loseSkill(player.Id, skill.Name, true);
                                        }
                                        triggerSkillEvent.toIds = toIds;
                                        triggerSkillEvent.cardIds = cardIds;
                                        if (invoke) {
                                            await this.useSkill(triggerSkillEvent);
                                        }
                                    }
                                }
                            }
                            else {
                                let awaitedSkills = [];
                                for (const skill of skills) {
                                    if (skill.isFlaggedSkill(this, content, stage)) {
                                        const triggerSkillEvent = {
                                            fromId: player.Id,
                                            skillName: skill.Name,
                                            triggeredOnEvent: content,
                                            mute: skill.Muted,
                                        };
                                        await this.useSkill(triggerSkillEvent);
                                    }
                                    else {
                                        awaitedSkills.push(skill);
                                    }
                                }
                                while (awaitedSkills.length > 0) {
                                    const uncancellableSkills = awaitedSkills.filter(skill => skill.isAutoTrigger(this, player, content) ||
                                        skill.SkillType === 1 /* Compulsory */ ||
                                        skill.SkillType === 2 /* Awaken */);
                                    const event = {
                                        invokeSkillNames: awaitedSkills.map(skill => skill.Name),
                                        toId: player.Id,
                                    };
                                    if (awaitedSkills.length === 1 && uncancellableSkills.length === 1) {
                                        const triggerSkillEvent = {
                                            fromId: player.Id,
                                            skillName: awaitedSkills[0].Name,
                                            triggeredOnEvent: content,
                                            mute: awaitedSkills[0].Muted,
                                        };
                                        for (let i = 0; i < skillTriggerableTimes[awaitedSkills[0].Name]; i++) {
                                            await this.useSkill(triggerSkillEvent);
                                        }
                                        break;
                                    }
                                    if (uncancellableSkills.length > 1) {
                                        event_packer_1.EventPacker.createUncancellableEvent(event);
                                    }
                                    this.notify(171 /* AskForSkillUseEvent */, event, player.Id);
                                    const { invoke, cardIds, toIds } = await this.onReceivingAsyncResponseFrom(171 /* AskForSkillUseEvent */, player.Id);
                                    if (invoke === undefined) {
                                        for (const skill of uncancellableSkills) {
                                            const triggerSkillEvent = {
                                                fromId: player.Id,
                                                skillName: skill.Name,
                                                triggeredOnEvent: content,
                                                mute: skill.Muted,
                                            };
                                            await this.useSkill(triggerSkillEvent);
                                        }
                                        break;
                                    }
                                    const awaitedSkill = awaitedSkills.find(skill => skill.Name === invoke);
                                    const triggerSkillEvent = {
                                        fromId: player.Id,
                                        skillName: invoke,
                                        triggeredOnEvent: content,
                                        mute: awaitedSkill === null || awaitedSkill === void 0 ? void 0 : awaitedSkill.Muted,
                                    };
                                    triggerSkillEvent.toIds = toIds;
                                    triggerSkillEvent.cardIds = cardIds;
                                    await this.useSkill(triggerSkillEvent);
                                    const index = awaitedSkills.findIndex(skill => skill.Name === invoke);
                                    if (index >= 0) {
                                        skillTriggerableTimes[awaitedSkills[index].Name]--;
                                        if (skillTriggerableTimes[awaitedSkills[index].Name] <= 0) {
                                            awaitedSkills.splice(index, 1);
                                        }
                                    }
                                    awaitedSkills = awaitedSkills.filter(skill => {
                                        const canTrigger = bySkills
                                            ? bySkills.find(bySkill => skill_rule_1.UniqueSkillRule.isProhibitedBySkillRule(bySkill, skill)) === undefined
                                            : true;
                                        return (canTrigger && skill.isTriggerable(content, stage) && skill.canUse(this, player, content, stage));
                                    });
                                }
                            }
                        }
                        triggeredSkills.push(...canTriggerSkills);
                        canTriggerSkills = this.playerTriggerableSkills(player, skillFrom, content, stage, triggeredSkills);
                    } while (canTriggerSkills.length > 0);
                }
            }
        }
        catch (e) {
            this.logger.error(e);
            const message = translation_json_tool_1.TranslationPack.translationJsonPatcher('Room running with exceptions, please re-create your room').toString();
            this.broadcast(100 /* UserMessageEvent */, {
                message,
                originalMessage: message,
                playerId: this.players[0].Id,
            });
            this.gameOvered = true;
            this.close();
            return;
        }
        for (const p of this.getAlivePlayersFrom()) {
            if (p.HookedSkills.length === 0) {
                continue;
            }
            const toUnhook = p.HookedSkills.filter(skill => {
                const hookedSkill = skill;
                if (hookedSkill.afterLosingSkill && hookedSkill.afterLosingSkill(this, p.Id, content, stage)) {
                    return true;
                }
                if (hookedSkill.afterDead && hookedSkill.afterDead(this, p.Id, content, stage)) {
                    return true;
                }
                return false;
            });
            if (toUnhook.length > 0) {
                p.removeHookedSkills(toUnhook);
                this.broadcast(179 /* UnhookSkillsEvent */, {
                    toId: p.Id,
                    skillNames: toUnhook.map(skill => skill.Name),
                });
            }
        }
    }
    async onReceivingAsyncResponseFrom(identifier, playerId) {
        return await this.socket.waitForResponse(identifier, playerId);
    }
    bury(...cardIds) {
        for (const cardId of cardIds) {
            if (this.getCardOwnerId(cardId) !== undefined) {
                continue;
            }
            if (card_1.Card.isVirtualCardId(cardId)) {
                this.bury(...engine_1.Sanguosha.getCardById(cardId).ActualCardIds);
            }
            else {
                engine_1.Sanguosha.getCardById(cardId).reset();
                this.dropStack.push(cardId);
            }
        }
    }
    isBuried(cardId) {
        return this.dropStack.includes(cardId);
    }
    putCards(place, ...cardIds) {
        if (place === 'top') {
            for (let i = cardIds.length - 1; i >= 0; i--) {
                const cardId = cardIds[i];
                if (card_1.Card.isVirtualCardId(cardId)) {
                    this.putCards(place, ...engine_1.Sanguosha.getCardById(cardId).ActualCardIds);
                }
                this.drawStack.unshift(cardId);
            }
        }
        else {
            for (const cardId of cardIds) {
                if (card_1.Card.isVirtualCardId(cardId)) {
                    this.putCards(place, ...engine_1.Sanguosha.getCardById(cardId).ActualCardIds);
                }
                else {
                    this.drawStack.push(cardId);
                }
            }
        }
    }
    async chainedOn(playerId) {
        const player = this.getPlayerById(playerId);
        const linked = !player.ChainLocked;
        await this.gameProcessor.onHandleIncomingEvent(119 /* ChainLockedEvent */, event_packer_1.EventPacker.createIdentifierEvent(119 /* ChainLockedEvent */, {
            toId: playerId,
            linked,
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} {1} character card', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(player), linked ? 'rotate' : 'reset').extract(),
        }));
    }
    getRandomCharactersFromLoadedPackage(numberOfCharacter, except = []) {
        const characters = engine_1.Sanguosha.getRandomCharacters(numberOfCharacter, this.loadedCharacters, [
            ...this.selectedCharacters,
            ...except,
        ]).map(character => character.Id);
        return characters;
    }
    setCharacterOutsideAreaCards(player, areaName, characterIds, translationsMessage, unengagedMessage) {
        this.getPlayerById(player).setCharacterOutsideAreaCards(areaName, characterIds);
        this.broadcast(108 /* SetOutsideCharactersEvent */, {
            toId: player,
            characterIds,
            areaName,
            isPublic: false,
            translationsMessage,
            engagedPlayerIds: [player],
            unengagedMessage,
        });
    }
    changePlayerProperties(event) {
        const { changedProperties } = event;
        let newCurrentPlayerPosition;
        for (const property of changedProperties) {
            const player = this.getPlayerById(property.toId);
            property.characterId !== undefined && (player.CharacterId = property.characterId);
            property.armor !== undefined && (player.Armor = property.armor);
            property.maxHp !== undefined && (player.MaxHp = property.maxHp);
            property.hp !== undefined && (player.Hp = property.hp);
            property.nationality !== undefined && (player.Nationality = property.nationality);
            property.gender !== undefined && (player.Gender = property.gender);
            if (property.activate !== undefined) {
                property.activate && player.Dead && player.revive();
                property.activate || player.Dead || player.bury();
            }
            if (property.playerPosition !== undefined) {
                player.Position = property.playerPosition;
                player === this.CurrentPlayer && (newCurrentPlayerPosition = property.playerPosition);
            }
        }
        if (changedProperties.find(property => property.playerPosition)) {
            this.sortPlayers();
            newCurrentPlayerPosition !== undefined && this.gameProcessor.fixCurrentPosition(newCurrentPlayerPosition);
        }
        this.broadcast(107 /* PlayerPropertiesChangeEvent */, event);
    }
    activate(event) {
        const { changedProperties } = event;
        for (const property of changedProperties) {
            if (property.activate) {
                precondition_1.Precondition.assert(property.hp !== undefined && property.hp > 0, 'can only activate player who hp > 0 and dead');
            }
            this.changePlayerProperties(event);
        }
    }
    async changeGeneral(event, keepSkills) {
        const { changedProperties } = event;
        if (!keepSkills) {
            for (const property of changedProperties) {
                if (!property.characterId) {
                    continue;
                }
                const player = this.getPlayerById(property.toId);
                const skills = player.getPlayerSkills(undefined, true).filter(skill => !skill.isShadowSkill());
                for (const skill of skills) {
                    await this.loseSkill(property.toId, skill.Name);
                }
            }
        }
        this.changePlayerProperties(event);
        for (const property of changedProperties) {
            if (!property.characterId) {
                continue;
            }
            const character = engine_1.Sanguosha.getCharacterById(property.characterId);
            for (const skill of character.Skills) {
                skill.isShadowSkill() || (await this.obtainSkill(property.toId, skill.Name));
            }
        }
    }
    async askForCardDrop(playerId, discardAmount, fromArea, uncancellable, except, bySkill, conversation, hideExclusive) {
        const cannotDropIds = [];
        except = except || [];
        const cardFilter = (id) => !(this.canDropCard(playerId, id) || except.includes(id));
        for (const area of fromArea) {
            cannotDropIds.push(...this.getPlayerById(playerId).getCardIds(area).filter(cardFilter));
        }
        if (cannotDropIds.length > 0) {
            except = except || [];
            except.push(...cannotDropIds);
        }
        const event = event_packer_1.EventPacker.createIdentifierEvent(162 /* AskForCardDropEvent */, {
            cardAmount: discardAmount,
            fromArea,
            toId: playerId,
            except,
            triggeredBySkills: bySkill ? [bySkill] : undefined,
            conversation,
            hideExclusive,
        });
        if (uncancellable) {
            event_packer_1.EventPacker.createUncancellableEvent(event);
        }
        await this.trigger(event);
        const askForDropCardsFunc = async (isContinuous) => {
            const canDropCards = [];
            const autoResponse = {
                fromId: playerId,
                droppedCards: [],
            };
            if (event.cardAmount <= 0) {
                return autoResponse;
            }
            if (event.responsedEvent) {
                event_packer_1.EventPacker.terminate(event);
                return event.responsedEvent;
            }
            else if (event_packer_1.EventPacker.isUncancellableEvent(event)) {
                for (const area of fromArea) {
                    canDropCards.push(...this.getPlayerById(playerId)
                        .getCardIds(area)
                        .filter(id => !(except === null || except === void 0 ? void 0 : except.includes(id))));
                }
                if (canDropCards.length <= 0) {
                    return autoResponse;
                }
                else if (canDropCards.length <= (event.cardAmount instanceof Array ? event.cardAmount[0] : event.cardAmount) ||
                    (isContinuous && event.cardAmount instanceof Array && canDropCards.length <= event.cardAmount[1])) {
                    autoResponse.droppedCards = canDropCards;
                    return autoResponse;
                }
            }
            this.notify(162 /* AskForCardDropEvent */, event, playerId);
            const response = await this.onReceivingAsyncResponseFrom(162 /* AskForCardDropEvent */, playerId);
            if (event_packer_1.EventPacker.isUncancellableEvent(event) && response.droppedCards.length === 0) {
                while (canDropCards.length === 0 ||
                    response.droppedCards.length === (event.cardAmount instanceof Array ? event.cardAmount[0] : event.cardAmount)) {
                    const index = Math.floor(Math.random() * canDropCards.length);
                    response.droppedCards.push(canDropCards[index]);
                    canDropCards.splice(index, 1);
                }
            }
            return response;
        };
        if (hideExclusive && typeof discardAmount === 'number' && typeof event.cardAmount === 'number' && uncancellable) {
            const realResponse = {
                fromId: playerId,
                droppedCards: [],
            };
            let totalCount = event.cardAmount;
            while (totalCount > 0) {
                event.cardAmount = [1, totalCount];
                event.except = event.except || [];
                event.except.push(...realResponse.droppedCards);
                const subResponse = await askForDropCardsFunc();
                if (subResponse.droppedCards.length > 0) {
                    totalCount -= subResponse.droppedCards.length;
                    realResponse.droppedCards.push(...subResponse.droppedCards);
                }
                else {
                    break;
                }
            }
            return realResponse;
        }
        else {
            return await askForDropCardsFunc();
        }
    }
    async askForPeach(event) {
        event_packer_1.EventPacker.createIdentifierEvent(158 /* AskForPeachEvent */, event);
        precondition_1.Precondition.assert(this.getPlayerById(event.toId).Hp <= 0, "room.server.ts -> askForPeach() : ask for peach while player's hp greater than 0");
        const player = this.getPlayerById(event.fromId);
        let responseEvent;
        const peachMatcher = new card_matcher_1.CardMatcher({ name: event.fromId === event.toId ? ['alcohol', 'peach'] : ['peach'] });
        do {
            this.notify(158 /* AskForPeachEvent */, event, event.fromId);
            responseEvent = await this.onReceivingAsyncResponseFrom(158 /* AskForPeachEvent */, event.fromId);
            const preUseEvent = {
                fromId: responseEvent.fromId,
                targetGroup: [[event.toId]],
                cardId: responseEvent.cardId,
            };
            if (responseEvent.cardId === undefined || (await this.preUseCard(preUseEvent))) {
                responseEvent.cardId = preUseEvent.cardId;
                responseEvent.fromId = preUseEvent.fromId;
                responseEvent.extraUse = preUseEvent.extraUse;
                event_packer_1.EventPacker.copyPropertiesTo(preUseEvent, responseEvent);
                break;
            }
            else {
                responseEvent.cardId = undefined;
            }
        } while (player.hasCard(this, peachMatcher) ||
            this.GameParticularAreas.find(areaName => player.hasCard(this, peachMatcher, 3 /* OutsideArea */, areaName) === undefined));
        return responseEvent;
    }
    async askForCardUse(event, to) {
        event_packer_1.EventPacker.createIdentifierEvent(160 /* AskForCardUseEvent */, event);
        await this.trigger(event);
        if (event.responsedEvent) {
            event_packer_1.EventPacker.terminate(event);
            return event.responsedEvent;
        }
        let responseEvent = {
            fromId: to,
        };
        if (this.isGameOver()) {
            event_packer_1.EventPacker.terminate(event);
            return responseEvent;
        }
        do {
            this.logger.debug('notify AskForCardUseEvent of socket');
            this.notify(160 /* AskForCardUseEvent */, event, to);
            responseEvent = await this.onReceivingAsyncResponseFrom(160 /* AskForCardUseEvent */, to);
            const preUseEvent = {
                fromId: to,
                targetGroup: responseEvent.toIds && [responseEvent.toIds],
                cardId: responseEvent.cardId,
            };
            if (responseEvent.cardId === undefined || (await this.preUseCard(preUseEvent))) {
                responseEvent.cardId = preUseEvent.cardId;
                responseEvent.toIds = target_group_1.TargetGroupUtil.getRealTargets(preUseEvent.targetGroup);
                responseEvent.fromId = preUseEvent.fromId;
                break;
            }
            else {
                responseEvent.cardId = undefined;
            }
        } while (true);
        return responseEvent;
    }
    async askForCardResponse(event, to) {
        event_packer_1.EventPacker.createIdentifierEvent(159 /* AskForCardResponseEvent */, event);
        await this.trigger(event);
        if (event.responsedEvent) {
            event_packer_1.EventPacker.terminate(event);
            return event.responsedEvent;
        }
        let responseEvent;
        do {
            this.notify(159 /* AskForCardResponseEvent */, event, to);
            responseEvent = await this.onReceivingAsyncResponseFrom(159 /* AskForCardResponseEvent */, to);
            const preResponseEvent = {
                fromId: to,
                cardId: responseEvent.cardId,
            };
            if (responseEvent.cardId === undefined || (await this.preResponseCard(preResponseEvent))) {
                responseEvent.cardId = preResponseEvent.cardId;
                responseEvent.fromId = preResponseEvent.fromId;
                break;
            }
        } while (true);
        return responseEvent;
    }
    async askForChoosingPlayerCard(event, to, toDiscard, uncancellable) {
        uncancellable &&
            event_packer_1.EventPacker.createUncancellableEvent(event);
        if (to === event.toId) {
            const newOption = {};
            for (const [area, cardIds] of Object.entries(event.options)) {
                if (cardIds) {
                    let ids = Number(area) === 0 /* HandArea */
                        ? this.getPlayerById(to).getCardIds(0 /* HandArea */)
                        : cardIds;
                    if (ids instanceof Array) {
                        toDiscard && (ids = ids.filter(id => this.canDropCard(to, id)));
                        ids.length > 0 && (newOption[area] = ids);
                    }
                    else {
                        newOption[area] = ids;
                    }
                }
            }
            event.options = newOption;
        }
        if (Object.values(event.options).length === 0) {
            return;
        }
        this.notify(170 /* AskForChoosingCardFromPlayerEvent */, event, to);
        const response = await this.onReceivingAsyncResponseFrom(170 /* AskForChoosingCardFromPlayerEvent */, to);
        if (response.selectedCardIndex !== undefined) {
            const cardIds = to === event.toId
                ? this.getPlayerById(to)
                    .getCardIds(0 /* HandArea */)
                    .filter(id => this.canDropCard(to, id))
                : this.getPlayerById(event.toId).getCardIds(0 /* HandArea */);
            response.selectedCard = cardIds[Math.floor(Math.random() * cardIds.length)];
        }
        else if (event_packer_1.EventPacker.isUncancellableEvent(event) && response.selectedCard === undefined) {
            const cardIds = Object.values(event.options).reduce((allIds, option) => {
                if (option) {
                    return allIds.concat(option);
                }
                return allIds;
            }, []);
            response.selectedCard = cardIds[Math.floor(Math.random() * cardIds.length)];
        }
        return response;
    }
    async doAskForCommonly(type, event, toId, uncancellable) {
        if (uncancellable) {
            event_packer_1.EventPacker.createUncancellableEvent(event);
        }
        this.notify(type, event, toId);
        return await this.onReceivingAsyncResponseFrom(type, toId);
    }
    async reforge(cardId, from) {
        await this.moveCards({
            fromId: from.Id,
            movingCards: [{ card: cardId, fromArea: 0 /* HandArea */ }],
            moveReason: 10 /* Reforge */,
            toArea: 4 /* DropStack */,
            proposer: from.Id,
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} reforged card {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from), translation_json_tool_1.TranslationPack.patchCardInTranslation(cardId)).extract(),
        });
        await this.drawCards(1, from.Id, 'top', undefined, undefined, 2 /* Reforge */);
    }
    async preUseCard(cardUseEvent) {
        event_packer_1.EventPacker.createIdentifierEvent(124 /* CardUseEvent */, cardUseEvent);
        const card = engine_1.Sanguosha.getCardById(cardUseEvent.cardId);
        await card.Skill.onUse(this, cardUseEvent);
        if (card.is(1 /* Equip */) && !cardUseEvent.targetGroup) {
            cardUseEvent.targetGroup = [[cardUseEvent.fromId]];
        }
        if (card_1.Card.isVirtualCardId(cardUseEvent.cardId)) {
            const from = this.getPlayerById(cardUseEvent.fromId);
            const skill = engine_1.Sanguosha.getSkillBySkillName(card.GeneratedBySkill);
            const skillUseEvent = {
                fromId: cardUseEvent.fromId,
                skillName: card.GeneratedBySkill,
                toIds: target_group_1.TargetGroupUtil.getRealTargets(cardUseEvent.targetGroup),
                animation: card.Skill.getAnimationSteps(cardUseEvent),
                translationsMessage: card.ActualCardIds.length === 0 || card.isActualCardHidden()
                    ? translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used skill {1}, use card {2}' + (cardUseEvent.targetGroup ? ' to {3}' : ''), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from), card.GeneratedBySkill, translation_json_tool_1.TranslationPack.patchCardInTranslation(card.Id), cardUseEvent.targetGroup
                        ? translation_json_tool_1.TranslationPack.patchPlayerInTranslation(...target_group_1.TargetGroupUtil.getRealTargets(cardUseEvent.targetGroup).map(id => this.getPlayerById(id)))
                        : '').extract()
                    : translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used skill {1}, transformed {2} as {3} card' +
                        (cardUseEvent.targetGroup ? ' used to {4}' : ' to use'), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from), card.GeneratedBySkill || '', translation_json_tool_1.TranslationPack.patchCardInTranslation(...card.ActualCardIds), translation_json_tool_1.TranslationPack.patchCardInTranslation(card.Id), cardUseEvent.targetGroup
                        ? translation_json_tool_1.TranslationPack.patchPlayerInTranslation(...target_group_1.TargetGroupUtil.getRealTargets(cardUseEvent.targetGroup).map(id => this.getPlayerById(id)))
                        : '').extract(),
            };
            if (skill instanceof skill_1.ViewAsSkill) {
                const result = await this.useSkill(skillUseEvent);
                if (!result) {
                    return false;
                }
            }
            else {
                this.broadcast(132 /* SkillUseEvent */, skillUseEvent);
            }
        }
        await this.trigger(cardUseEvent, "PreCardUse" /* PreCardUse */);
        return !event_packer_1.EventPacker.isTerminated(cardUseEvent);
    }
    async preResponseCard(cardResponseEvent) {
        event_packer_1.EventPacker.createIdentifierEvent(123 /* CardResponseEvent */, cardResponseEvent);
        if (cardResponseEvent.cardId !== undefined && card_1.Card.isVirtualCardId(cardResponseEvent.cardId)) {
            const from = this.getPlayerById(cardResponseEvent.fromId);
            const card = engine_1.Sanguosha.getCardById(cardResponseEvent.cardId);
            const skill = engine_1.Sanguosha.getSkillBySkillName(card.GeneratedBySkill);
            const result = await this.useSkill({
                fromId: cardResponseEvent.fromId,
                skillName: card.GeneratedBySkill,
                translationsMessage: card.ActualCardIds.length === 0 || card.isActualCardHidden()
                    ? translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used skill {1}, response card {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from), card.GeneratedBySkill, translation_json_tool_1.TranslationPack.patchCardInTranslation(card.Id)).extract()
                    : translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used skill {1}, transformed {2} as {3} card to response', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from), card.GeneratedBySkill, translation_json_tool_1.TranslationPack.patchCardInTranslation(...card.ActualCardIds), translation_json_tool_1.TranslationPack.patchCardInTranslation(card.Id)).extract(),
                mute: skill.Muted,
            });
            if (!result) {
                return false;
            }
        }
        await this.trigger(cardResponseEvent, "PreCardResponse" /* PreCardResponse */);
        return !event_packer_1.EventPacker.isTerminated(cardResponseEvent);
    }
    async useCard(event, declared) {
        event_packer_1.EventPacker.createIdentifierEvent(124 /* CardUseEvent */, event);
        if (!declared && !(await this.preUseCard(event))) {
            return;
        }
        await super.useCard(event);
        if (event.responseToEvent &&
            event_packer_1.EventPacker.getIdentifier(event.responseToEvent) === 125 /* CardEffectEvent */) {
            const cardEffectEvent = event.responseToEvent;
            cardEffectEvent.cardIdsResponded = cardEffectEvent.cardIdsResponded || [];
            cardEffectEvent.cardIdsResponded.push(event.cardId);
        }
        await this.gameProcessor.onHandleIncomingEvent(124 /* CardUseEvent */, event, async (stage) => {
            if (stage !== "CardUseFinishedEffect" /* CardUseFinishedEffect */ &&
                engine_1.Sanguosha.getCardById(event.cardId).Skill instanceof skill_1.ResponsiveSkill
                ? !event.toCardIds || event.toCardIds.length === 0
                : target_group_1.TargetGroupUtil.getRealTargets(event.targetGroup).length === 0) {
                return true;
            }
            if (stage === "AfterCardUseEffect" /* AfterCardUseEffect */) {
                const card = engine_1.Sanguosha.getCardById(event.cardId);
                const aimEventCollaborators = {};
                if (target_group_1.TargetGroupUtil.getAllTargets(event.targetGroup) && !(await this.onAim(event, aimEventCollaborators))) {
                    return true;
                }
                if (card.is(1 /* Equip */)) {
                    if (this.isCardOnProcessing(event.cardId)) {
                        const from = this.getPlayerById(event.fromId);
                        if (from.Dead) {
                            await this.moveCards({
                                movingCards: [{ card: card.Id, fromArea: 6 /* ProcessingArea */ }],
                                moveReason: 6 /* PlaceToDropStack */,
                                toArea: 4 /* DropStack */,
                            });
                        }
                        else {
                            let existingEquipId = from.getEquipment(card.EquipType);
                            if (card.isVirtualCard()) {
                                const actualEquip = engine_1.Sanguosha.getCardById(card.ActualCardIds[0]);
                                existingEquipId = from.getEquipment(actualEquip.EquipType);
                            }
                            if (existingEquipId !== undefined) {
                                await this.moveCards({
                                    fromId: from.Id,
                                    moveReason: 6 /* PlaceToDropStack */,
                                    toArea: 4 /* DropStack */,
                                    movingCards: [{ card: existingEquipId, fromArea: 1 /* EquipArea */ }],
                                }, {
                                    movingCards: [{ card: card.Id, fromArea: 6 /* ProcessingArea */ }],
                                    moveReason: 8 /* CardUse */,
                                    toId: from.Id,
                                    toArea: 1 /* EquipArea */,
                                });
                            }
                            else {
                                await this.moveCards({
                                    movingCards: [{ card: card.Id, fromArea: 6 /* ProcessingArea */ }],
                                    moveReason: 8 /* CardUse */,
                                    toId: from.Id,
                                    toArea: 1 /* EquipArea */,
                                });
                            }
                        }
                    }
                    this.endProcessOnTag(card.Id.toString());
                    return true;
                }
                else if (card.is(8 /* DelayedTrick */)) {
                    const realTargets = target_group_1.TargetGroupUtil.getAllTargets(event.targetGroup);
                    const moveToIds = realTargets === null || realTargets === void 0 ? void 0 : realTargets.map(ids => ids[0]);
                    const to = moveToIds && this.getPlayerById(moveToIds[0]);
                    if (to && !to.Dead && this.isCardOnProcessing(event.cardId)) {
                        await this.moveCards({
                            fromId: event.fromId,
                            movingCards: [{ card: card.Id, fromArea: 6 /* ProcessingArea */ }],
                            toId: to.Id,
                            toArea: 2 /* JudgeArea */,
                            moveReason: 8 /* CardUse */,
                        });
                    }
                    else {
                        await this.moveCards({
                            fromId: event.fromId,
                            movingCards: [{ card: card.Id, fromArea: 6 /* ProcessingArea */ }],
                            toArea: 4 /* DropStack */,
                            moveReason: 6 /* PlaceToDropStack */,
                        });
                    }
                    this.endProcessOnTag(card.Id.toString());
                    return true;
                }
                const cardEffectEvent = Object.assign(Object.assign({}, event), { allTargets: target_group_1.TargetGroupUtil.getRealTargets(event.targetGroup) });
                await card.Skill.beforeEffect(this, cardEffectEvent);
                const onCardEffect = async (ev) => {
                    await this.gameProcessor.onHandleIncomingEvent(125 /* CardEffectEvent */, event_packer_1.EventPacker.createIdentifierEvent(125 /* CardEffectEvent */, ev));
                    event_packer_1.EventPacker.copyPropertiesTo(ev, event);
                };
                const list = event.disresponsiveList;
                if (card.Skill instanceof skill_1.ResponsiveSkill) {
                    cardEffectEvent.disresponsiveList = event_packer_1.EventPacker.isDisresponsiveEvent(event, true)
                        ? this.getAllPlayersFrom().map(player => player.Id)
                        : event.disresponsiveList;
                    await onCardEffect(cardEffectEvent);
                }
                else {
                    const collabroatorsIndex = {};
                    for (const groupTargets of target_group_1.TargetGroupUtil.getAllTargets(event.targetGroup) || []) {
                        const toId = groupTargets[0];
                        const nullifiedTargets = event.nullifiedTargets || [];
                        if (nullifiedTargets.includes(toId) || this.getPlayerById(toId).Dead) {
                            continue;
                        }
                        const singleCardEffectEvent = Object.assign(Object.assign({}, cardEffectEvent), { toIds: groupTargets, nullifiedTargets });
                        if (aimEventCollaborators[toId]) {
                            collabroatorsIndex[toId] = collabroatorsIndex[toId] || 0;
                            const aimEvent = aimEventCollaborators[toId][collabroatorsIndex[toId]];
                            event_packer_1.EventPacker.copyPropertiesTo(aimEvent, singleCardEffectEvent);
                            if (aimEvent.additionalDamage) {
                                singleCardEffectEvent.additionalDamage = singleCardEffectEvent.additionalDamage || 0;
                                singleCardEffectEvent.additionalDamage += aimEvent.additionalDamage;
                            }
                            if (!event_packer_1.EventPacker.isDisresponsiveEvent(singleCardEffectEvent) &&
                                list &&
                                list.length > 0 &&
                                list.includes(toId)) {
                                event_packer_1.EventPacker.setDisresponsiveEvent(singleCardEffectEvent);
                            }
                            collabroatorsIndex[toId]++;
                        }
                        await onCardEffect(singleCardEffectEvent);
                        if (singleCardEffectEvent.cardIdsResponded) {
                            event.cardIdsResponded = event.cardIdsResponded || [];
                            event.cardIdsResponded.push(...singleCardEffectEvent.cardIdsResponded);
                        }
                    }
                }
                await card.Skill.afterEffect(this, cardEffectEvent);
            }
            return true;
        });
    }
    async useSkill(content) {
        const skill = engine_1.Sanguosha.getSkillBySkillName(content.skillName);
        if (event_packer_1.EventPacker.isTerminated(content) || !(await skill.beforeUse(this, content))) {
            return false;
        }
        if (!(await super.useSkill(content))) {
            return false;
        }
        content.toIds && skill.resortTargets() && this.sortPlayersByPosition(content.toIds);
        await this.gameProcessor.onHandleIncomingEvent(132 /* SkillUseEvent */, event_packer_1.EventPacker.createIdentifierEvent(132 /* SkillUseEvent */, content));
        if (!event_packer_1.EventPacker.isTerminated(content)) {
            const isDamageEvent = content.triggeredOnEvent &&
                event_packer_1.EventPacker.getIdentifier(content.triggeredOnEvent) ===
                    137 /* DamageEvent */;
            const preDamage = isDamageEvent
                ? content.triggeredOnEvent.damage
                : 0;
            await this.gameProcessor.onHandleIncomingEvent(133 /* SkillEffectEvent */, event_packer_1.EventPacker.createIdentifierEvent(133 /* SkillEffectEvent */, content));
            if (isDamageEvent) {
                const damageEvent = content.triggeredOnEvent;
                if (!event_packer_1.EventPacker.isTerminated(damageEvent)) {
                    preDamage > damageEvent.damage && (await this.trigger(damageEvent, "DamageReduced" /* DamageReduced */));
                }
                else {
                    const copyDamageEvent = Object.assign({}, damageEvent);
                    event_packer_1.EventPacker.recall(copyDamageEvent);
                    await this.trigger(copyDamageEvent, "DamageTerminated" /* DamageTerminated */);
                }
            }
        }
        return true;
    }
    async loseSkill(playerId, skillName, broadcast) {
        const player = this.getPlayerById(playerId);
        const lostSkill = player.loseSkill(skillName);
        if (lostSkill.length === 0) {
            return;
        }
        const lostSkillNames = lostSkill.map(skill => skill.Name);
        this.broadcast(120 /* LoseSkillEvent */, {
            toId: playerId,
            skillName: lostSkillNames,
            translationsMessage: broadcast
                ? translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} lost skill {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(player), typeof skillName === 'string'
                    ? skillName
                    : translation_json_tool_1.TranslationPack.wrapArrayParams(...lostSkillNames.reduce((total, currentSkill) => {
                        if (!total.find(skillName => currentSkill.endsWith(skillName))) {
                            total.push(currentSkill);
                        }
                        return total;
                    }, []))).extract()
                : undefined,
        });
        for (const skill of lostSkill) {
            const outsideCards = player.getCardIds(3 /* OutsideArea */, skill.Name);
            await skill_1.SkillLifeCycle.executeHookOnLosingSkill(skill, this, player);
            if (outsideCards.length > 0) {
                if (player.isCharacterOutsideArea(skill.Name)) {
                    outsideCards.splice(0, outsideCards.length);
                }
                else {
                    await this.moveCards({
                        movingCards: outsideCards.map(card => ({ card, fromArea: 3 /* OutsideArea */ })),
                        fromId: player.Id,
                        toArea: 4 /* DropStack */,
                        moveReason: 6 /* PlaceToDropStack */,
                    });
                }
            }
        }
    }
    async obtainSkill(playerId, skillName, broadcast, insertIndex) {
        const player = this.getPlayerById(playerId);
        player.obtainSkill(skillName, insertIndex);
        this.broadcast(121 /* ObtainSkillEvent */, {
            toId: playerId,
            skillName,
            insertIndex,
            translationsMessage: broadcast
                ? translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} obtained skill {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(player), skillName).extract()
                : undefined,
        });
        await skill_1.SkillLifeCycle.executeHookOnObtainingSkill(engine_1.Sanguosha.getSkillBySkillName(skillName), this, player);
    }
    async updateSkill(playerId, oldSkillName, newSkillName) {
        const player = this.getPlayerById(playerId);
        const index = player.getPlayerSkills(undefined, true).findIndex(skill => skill.Name === oldSkillName);
        if (index === -1) {
            return;
        }
        await this.loseSkill(playerId, oldSkillName);
        await this.obtainSkill(playerId, newSkillName, false, index);
    }
    async loseHp(playerId, lostHp) {
        await this.gameProcessor.onHandleIncomingEvent(135 /* LoseHpEvent */, {
            toId: playerId,
            lostHp,
        });
    }
    async changeMaxHp(playerId, additionalMaxHp) {
        const lostMaxHpEvent = {
            toId: playerId,
            additionalMaxHp,
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher(`{0} ${additionalMaxHp >= 0 ? 'obtained' : 'lost'} {1} max hp`, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(this.getPlayerById(playerId)), Math.abs(additionalMaxHp)).extract(),
        };
        event_packer_1.EventPacker.createIdentifierEvent(136 /* ChangeMaxHpEvent */, lostMaxHpEvent);
        this.broadcast(136 /* ChangeMaxHpEvent */, lostMaxHpEvent);
        const player = this.getPlayerById(playerId);
        player.MaxHp += additionalMaxHp;
        if (player.Hp > player.MaxHp) {
            player.Hp = player.MaxHp;
        }
        if (player.MaxHp <= 0) {
            await this.kill(player);
        }
        await this.trigger(lostMaxHpEvent);
    }
    async changeArmor(playerId, amount) {
        if (amount === 0 ||
            (amount > 0 && this.getPlayerById(playerId).Armor >= game_props_1.UPPER_LIMIT_OF_ARMOR) ||
            (amount < 0 && this.getPlayerById(playerId).Armor < 1)) {
            return;
        }
        const armorChangeEvent = {
            toId: playerId,
            amount,
            leftDamage: 0,
        };
        event_packer_1.EventPacker.createIdentifierEvent(188 /* ArmorChangeEvent */, armorChangeEvent);
        await this.gameProcessor.onHandleIncomingEvent(188 /* ArmorChangeEvent */, armorChangeEvent, async (armorChangeStage) => {
            if (armorChangeStage === "ArmorChanging" /* ArmorChanging */) {
                armorChangeEvent.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher(`{0} ${armorChangeEvent.amount > 0 ? 'obtained' : 'lost'} {1} armor`, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(this.getPlayerById(playerId)), Math.abs(armorChangeEvent.amount)).extract();
                this.broadcast(188 /* ArmorChangeEvent */, armorChangeEvent);
            }
            return true;
        });
    }
    getCards(numberOfCards, from) {
        const cards = [];
        while (numberOfCards-- > 0) {
            if (this.drawStack.length === 0) {
                this.shuffle();
            }
            let card;
            if (from === 'top') {
                card = this.drawStack[0];
                this.drawStack.shift();
            }
            else {
                card = this.drawStack.pop();
            }
            cards.push(card);
        }
        return cards;
    }
    async drawCards(numberOfCards, playerId, from = 'top', askedBy, byReason, bySpecialReason) {
        askedBy = askedBy || playerId || this.CurrentPlayer.Id;
        playerId = playerId || this.CurrentPlayer.Id;
        const drawEvent = {
            drawAmount: numberOfCards,
            fromId: playerId,
            askedBy,
            triggeredBySkills: byReason ? [byReason] : undefined,
            bySpecialReason,
            from,
        };
        let drawedCards = [];
        await this.gameProcessor.onHandleIncomingEvent(127 /* DrawCardEvent */, event_packer_1.EventPacker.createIdentifierEvent(127 /* DrawCardEvent */, drawEvent), async (stage) => {
            if (stage === "CardDrawing" /* CardDrawing */) {
                drawedCards = this.drawStack.slice(0, drawEvent.drawAmount);
            }
            return true;
        });
        return drawedCards;
    }
    async dropCards(moveReason, cardIds, playerId, droppedBy, byReason) {
        if (droppedBy !== undefined && droppedBy === playerId && moveReason === 4 /* SelfDrop */) {
            cardIds = cardIds.filter(id => this.canDropCard(droppedBy, id));
        }
        if (cardIds.length === 0) {
            return;
        }
        droppedBy = droppedBy || playerId || this.CurrentPlayer.Id;
        playerId = playerId || this.CurrentPlayer.Id;
        const player = this.getPlayerById(playerId);
        await this.moveCards({
            movingCards: cardIds.map(card => ({ card, fromArea: player.cardFrom(card) })),
            fromId: playerId,
            toArea: 4 /* DropStack */,
            moveReason,
            movedByReason: byReason,
            proposer: droppedBy,
        });
    }
    async turnOver(playerId) {
        const turnOverEvent = {
            toId: playerId,
        };
        await this.gameProcessor.onHandleIncomingEvent(156 /* PlayerTurnOverEvent */, event_packer_1.EventPacker.createIdentifierEvent(156 /* PlayerTurnOverEvent */, turnOverEvent));
    }
    async moveCards(...infos) {
        const toRemove = [];
        for (const info of infos) {
            if (info.movingCards.length === 0) {
                toRemove.push(info);
                continue;
            }
            const from = info.fromId ? this.getPlayerById(info.fromId) : undefined;
            info.movingCards = info.movingCards.reduce((allCards, cardInfo) => {
                if (card_1.Card.isVirtualCardId(cardInfo.card)) {
                    const card = engine_1.Sanguosha.getCardById(cardInfo.card);
                    if (!engine_1.Sanguosha.isTransformCardSill(card.GeneratedBySkill)) {
                        allCards.push(...card.ActualCardIds.map(cardId => ({
                            card: cardId,
                            fromArea: from === null || from === void 0 ? void 0 : from.cardFrom(cardId),
                            asideMove: true,
                        })));
                    }
                }
                allCards.push(cardInfo);
                return allCards;
            }, []);
        }
        infos.filter(info => !toRemove.includes(info));
        if (!infos || infos.length === 0) {
            return;
        }
        await this.gameProcessor.onHandleIncomingEvent(128 /* MoveCardEvent */, event_packer_1.EventPacker.createIdentifierEvent(128 /* MoveCardEvent */, { infos }));
    }
    async damage(event) {
        event_packer_1.EventPacker.createIdentifierEvent(137 /* DamageEvent */, event);
        const processingEvent = this.gameProcessor.CurrentProcessingEvent;
        await this.gameProcessor.onHandleIncomingEvent(137 /* DamageEvent */, event, async (stage) => {
            if (stage === "DamagedEffect" /* DamagedEffect */) {
                if (processingEvent && event_packer_1.EventPacker.getIdentifier(processingEvent) === 125 /* CardEffectEvent */) {
                    event_packer_1.EventPacker.setDamageSignatureInCardUse(processingEvent);
                }
            }
            return true;
        });
    }
    async recover(event) {
        const to = this.getPlayerById(event.toId);
        if (to.Hp === to.MaxHp || event.recoveredHp < 1) {
            return;
        }
        event.recoveredHp = Math.min(event.recoveredHp, to.MaxHp - to.Hp);
        event.translationsMessage =
            event.recoverBy !== undefined
                ? translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} recovered {2} hp for {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(this.getPlayerById(event.recoverBy)), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(this.getPlayerById(event.toId)), event.recoveredHp).extract()
                : translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} recovered {1} hp', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(this.getPlayerById(event.toId)), event.recoveredHp).extract();
        event_packer_1.EventPacker.createIdentifierEvent(138 /* RecoverEvent */, event);
        await this.gameProcessor.onHandleIncomingEvent(138 /* RecoverEvent */, event);
    }
    async responseCard(event) {
        let validResponse = false;
        event_packer_1.EventPacker.createIdentifierEvent(123 /* CardResponseEvent */, event);
        await this.gameProcessor.onHandleIncomingEvent(123 /* CardResponseEvent */, event, async (stage) => {
            if (stage === "AfterCardResponseEffect" /* AfterCardResponseEffect */) {
                if (event.responseToEvent) {
                    event_packer_1.EventPacker.terminate(event.responseToEvent);
                    validResponse = true;
                }
            }
            return true;
        });
        return validResponse;
    }
    async judge(to, byCard, bySkill, judgeMatcherEnum) {
        const event = {
            toId: to,
            judgeCardId: -1,
            realJudgeCardId: -1,
            byCard,
            bySkill,
            judgeMatcherEnum,
        };
        await this.trigger(event_packer_1.EventPacker.createIdentifierEvent(140 /* JudgeEvent */, event), "beforeJudge" /* BeforeJudge */);
        if (event.realJudgeCardId === -1) {
            const judgeCardId = this.getCards(1, 'top')[0];
            event.judgeCardId = judgeCardId;
            event.realJudgeCardId = judgeCardId;
        }
        else {
            event.judgeCardId = event.realJudgeCardId;
        }
        await this.gameProcessor.onHandleIncomingEvent(140 /* JudgeEvent */, event);
        return event;
    }
    async pindian(fromId, toIds, bySkill) {
        const from = this.getPlayerById(fromId);
        const pindianEvent = {
            fromId,
            toIds,
            procedures: [],
            randomPinDianCardPlayer: [],
        };
        let responses = [];
        await this.gameProcessor.onHandleIncomingEvent(134 /* PinDianEvent */, pindianEvent, async (stage) => {
            if (stage === "BeforePinDianEffect" /* BeforePinDianEffect */) {
                if (pindianEvent.toIds.length === 0) {
                    return false;
                }
                const pindianEventTemplate = event_packer_1.EventPacker.createIdentifierEvent(164 /* AskForPinDianCardEvent */, {
                    fromId,
                    toId: '',
                    conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} proposed a pindian event, please choose a hand card to pindian', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from)).extract(),
                    triggeredBySkills: [bySkill],
                });
                const targetList = [fromId, ...pindianEvent.toIds];
                this.doNotify(targetList);
                for (const target of targetList) {
                    const askForPinDianEvent = Object.assign(Object.assign({}, pindianEventTemplate), { toId: target, randomPinDianCard: pindianEvent.randomPinDianCardPlayer.includes(target), ignoreNotifiedStatus: true });
                    this.notify(164 /* AskForPinDianCardEvent */, askForPinDianEvent, target);
                }
                responses = await Promise.all(targetList.map(target => this.onReceivingAsyncResponseFrom(164 /* AskForPinDianCardEvent */, target).then(async (result) => {
                    if (result.fromId === fromId) {
                        pindianEvent.cardId = result.pindianCard;
                    }
                    return result;
                })));
                responses.sort((p1, p2) => {
                    const pos1 = (this.getPlayerById(p1.fromId).Position - from.Position + this.Players.length) % this.Players.length;
                    const pos2 = (this.getPlayerById(p2.fromId).Position - from.Position + this.Players.length) % this.Players.length;
                    return pos1 < pos2 ? 1 : -1;
                });
                const moveCardInfos = [];
                for (const target of targetList) {
                    const currentResponse = responses.find(resp => resp.fromId === target);
                    if (!currentResponse) {
                        continue;
                    }
                    moveCardInfos.push({
                        movingCards: [{ card: currentResponse.pindianCard, fromArea: 0 /* HandArea */ }],
                        fromId: target,
                        toArea: 6 /* ProcessingArea */,
                        moveReason: 2 /* ActiveMove */,
                    });
                }
                await this.moveCards(...moveCardInfos);
                return true;
            }
            if (stage === "PinDianEffect" /* PinDianEffect */) {
                this.broadcast(103 /* CustomGameDialog */, {
                    translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used {1} to respond pindian', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from), translation_json_tool_1.TranslationPack.patchCardInTranslation(pindianEvent.cardId)).extract(),
                });
                for (const response of responses) {
                    if (response.fromId === fromId) {
                        continue;
                    }
                    const proposerCardNumber = engine_1.Sanguosha.getCardById(pindianEvent.cardId).CardNumber;
                    const procedure = {
                        toId: response.fromId,
                        cardId: response.pindianCard,
                        winner: '',
                    };
                    const rivalCardNumber = engine_1.Sanguosha.getCardById(procedure.cardId).CardNumber;
                    if (proposerCardNumber > rivalCardNumber) {
                        procedure.winner = fromId;
                    }
                    else if (proposerCardNumber < rivalCardNumber) {
                        procedure.winner = procedure.toId;
                    }
                    pindianEvent.procedures.push(procedure);
                    const messages = [
                        translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used {1} to respond pindian', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(this.getPlayerById(procedure.toId)), translation_json_tool_1.TranslationPack.patchCardInTranslation(procedure.cardId)).toString(),
                        procedure.winner
                            ? translation_json_tool_1.TranslationPack.translationJsonPatcher('pindian result:{0} win', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(this.getPlayerById(procedure.winner))).toString()
                            : 'pindian result:draw',
                    ];
                    this.broadcast(129 /* ObserveCardsEvent */, {
                        cardIds: [pindianEvent.cardId, procedure.cardId],
                        selected: [
                            { card: pindianEvent.cardId, player: pindianEvent.fromId },
                            { card: procedure.cardId, player: procedure.toId },
                        ],
                        messages,
                    });
                    await this.trigger(pindianEvent, "PinDianConfirmed" /* PinDianResultConfirmed */);
                    await system_1.System.MainThread.sleep(2500);
                    this.broadcast(130 /* ObserveCardFinishEvent */, {});
                }
                return true;
            }
            return true;
        });
        const droppedCards = pindianEvent.cardId ? [pindianEvent.cardId] : [];
        for (const { cardId } of pindianEvent.procedures) {
            if (this.isCardOnProcessing(cardId)) {
                this.endProcessOnCard(cardId);
                this.getCardOwnerId(cardId) === undefined && droppedCards.push(cardId);
            }
        }
        droppedCards.length > 0 &&
            (await this.moveCards({
                movingCards: droppedCards.map(card => ({ card, fromArea: 6 /* ProcessingArea */ })),
                toArea: 4 /* DropStack */,
                moveReason: 6 /* PlaceToDropStack */,
            }));
        const report = {
            pindianCardId: pindianEvent.cardId,
            pindianRecord: pindianEvent.procedures,
        };
        return report;
    }
    async skip(player, phase) {
        if (this.CurrentPhasePlayer.Id === player) {
            this.gameProcessor.skip(phase);
            if (phase !== undefined) {
                const event = event_packer_1.EventPacker.createIdentifierEvent(154 /* PhaseSkippedEvent */, {
                    playerId: player,
                    skippedPhase: phase,
                });
                this.analytics.record(event, this.isPlaying() ? this.CurrentPlayerPhase : undefined);
                await this.trigger(event);
            }
        }
    }
    endPhase(phase) {
        this.gameProcessor.endPhase(phase);
    }
    syncGameCommonRules(playerId, updateActions) {
        const player = this.getPlayerById(playerId);
        updateActions(player);
        this.notify(106 /* SyncGameCommonRulesEvent */, {
            toId: playerId,
            commonRules: this.CommonRules.toSocketObject(player),
        }, playerId);
    }
    async kill(deadPlayer, killedBy, killedByCards) {
        deadPlayer.Dying = false;
        const playerDiedEvent = {
            playerId: deadPlayer.Id,
            killedBy,
            messages: [
                translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} was killed' + (killedBy === undefined ? '' : ' by {1}'), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(deadPlayer), killedBy ? translation_json_tool_1.TranslationPack.patchPlayerInTranslation(this.getPlayerById(killedBy)) : '').toString(),
            ],
            killedByCards,
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('the role of {0} is {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(deadPlayer), functional_1.Functional.getPlayerRoleRawText(deadPlayer.Role, this.gameMode)).extract(),
        };
        await this.gameProcessor.onHandleIncomingEvent(153 /* PlayerDiedEvent */, event_packer_1.EventPacker.createIdentifierEvent(153 /* PlayerDiedEvent */, playerDiedEvent), async (stage) => {
            if (stage === "AfterPlayerDied" /* AfterPlayerDied */) {
                for (const skill of deadPlayer.getPlayerSkills()) {
                    const toHookUp = [];
                    if (skill_1.SkillLifeCycle.isHookedAfterDead(skill)) {
                        toHookUp.push(skill);
                    }
                    if (toHookUp.length > 0) {
                        deadPlayer.hookUpSkills(toHookUp);
                        this.broadcast(178 /* HookUpSkillsEvent */, {
                            toId: deadPlayer.Id,
                            skillNames: toHookUp.map(skill => skill.Name),
                        });
                    }
                    await skill_1.SkillLifeCycle.executeHookedOnDead(skill, this, deadPlayer);
                }
            }
            return true;
        });
    }
    clearFlags(player) {
        this.broadcast(113 /* ClearFlagEvent */, {
            to: player,
        });
        super.clearFlags(player);
    }
    removeFlag(player, name) {
        this.broadcast(112 /* RemoveFlagEvent */, {
            to: player,
            name,
        });
        super.removeFlag(player, name);
    }
    setFlag(player, name, value, tagName, visiblePlayers) {
        this.broadcast(111 /* SetFlagEvent */, {
            to: player,
            value,
            name,
            tagName,
            visiblePlayers,
        });
        return super.setFlag(player, name, value);
    }
    getFlag(player, name) {
        return this.getPlayerById(player).getFlag(name);
    }
    clearMarks(player) {
        this.broadcast(117 /* ClearMarkEvent */, {
            to: player,
        });
        super.clearMarks(player);
    }
    removeMark(player, name) {
        this.broadcast(116 /* RemoveMarkEvent */, {
            to: player,
            name,
        });
        super.removeMark(player, name);
    }
    setMark(player, name, value) {
        this.broadcast(115 /* SetMarkEvent */, {
            to: player,
            name,
            value,
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} {1} {2} {3} marks', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(this.getPlayerById(player)), value > 0 ? 'obtained' : 'lost', value < 0 ? -value : value, name).extract(),
        });
        return super.setMark(player, name, value);
    }
    addMark(player, name, value) {
        this.broadcast(114 /* AddMarkEvent */, {
            to: player,
            value,
            name,
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} {1} {2} {3} marks', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(this.getPlayerById(player)), value > 0 ? 'obtained' : 'lost', value < 0 ? -value : value, name).extract(),
        });
        return super.addMark(player, name, value);
    }
    clearCardTags(player) {
        this.broadcast(187 /* ClearCardTagsEvent */, {
            toId: player,
        });
        super.clearCardTags(player);
    }
    removeCardTag(player, cardTag) {
        this.broadcast(186 /* RemoveCardTagEvent */, {
            toId: player,
            cardTag,
        });
        super.removeCardTag(player, cardTag);
    }
    setCardTag(player, cardTag, cardIds) {
        this.broadcast(185 /* SetCardTagEvent */, {
            toId: player,
            cardTag,
            cardIds,
        });
        return super.setCardTag(player, cardTag, cardIds);
    }
    getCardTag(player, cardTag) {
        return this.getPlayerById(player).getCardTag(cardTag);
    }
    findCardsByMatcherFrom(cardMatcher, fromDrawStack = true) {
        const fromStack = fromDrawStack ? this.drawStack : this.dropStack;
        return fromStack.filter(cardId => cardMatcher.match(engine_1.Sanguosha.getCardById(cardId)));
    }
    displayCards(fromId, displayCards, toIds, translations) {
        const cardDisplayEvent = {
            fromId,
            engagedPlayerIds: toIds,
            displayCards,
            unengagedMessage: toIds
                ? translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} displayed {1} cards to {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(this.getPlayerById(fromId)), displayCards.length, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(...toIds.map(id => this.getPlayerById(id)))).extract()
                : undefined,
            translationsMessage: translations ||
                translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} displayed cards {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(this.getPlayerById(fromId)), translation_json_tool_1.TranslationPack.patchCardInTranslation(...displayCards)).extract(),
        };
        this.broadcast(126 /* CardDisplayEvent */, cardDisplayEvent);
    }
    isCardInDropStack(cardId) {
        return this.dropStack.includes(cardId);
    }
    isCardInDrawStack(cardId) {
        return this.drawStack.includes(cardId);
    }
    getCardFromDropStack(cardId) {
        const index = this.dropStack.findIndex(card => card === cardId);
        return index < 0 ? undefined : this.dropStack.splice(index, 1)[0];
    }
    getCardFromDrawStack(cardId) {
        const index = this.drawStack.findIndex(card => card === cardId);
        return index < 0 ? undefined : this.drawStack.splice(index, 1)[0];
    }
    getCardsByNameFromStack(cardName, stackName, amount = 0) {
        const stack = stackName === 'draw' ? this.drawStack : this.dropStack;
        const cards = stack.filter(cardId => engine_1.Sanguosha.getCardById(cardId).GeneralName === cardName);
        if (cards.length === 0) {
            return cards;
        }
        algorithm_1.Algorithm.shuffle(cards);
        return amount === 0 ? cards : cards.slice(0, amount);
    }
    installSideEffectSkill(applier, skillName, sourceId) {
        super.installSideEffectSkill(applier, skillName, sourceId);
        this.broadcast(110 /* UpgradeSideEffectSkillsEvent */, {
            sideEffectSkillApplier: applier,
            skillName,
            sourceId,
        });
    }
    uninstallSideEffectSkill(applier) {
        super.uninstallSideEffectSkill(applier);
        this.broadcast(110 /* UpgradeSideEffectSkillsEvent */, {
            sideEffectSkillApplier: applier,
            skillName: undefined,
        });
    }
    async abortPlayerEquipSections(playerId, ...abortSections) {
        const player = this.getPlayerById(playerId);
        player.abortEquipSections(...abortSections);
        const abortEvent = {
            toId: playerId,
            toSections: abortSections,
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} aborted {1} equip section', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(player), translation_json_tool_1.TranslationPack.wrapArrayParams(...abortSections)).extract(),
        };
        this.broadcast(175 /* AbortOrResumePlayerSectionsEvent */, abortEvent);
        const equipSectionMapper = {
            ["weapon section" /* Weapon */]: 2 /* Weapon */,
            ["shield section" /* Shield */]: 3 /* Shield */,
            ["defense ride section" /* DefenseRide */]: 5 /* DefenseRide */,
            ["offense ride section" /* OffenseRide */]: 4 /* OffenseRide */,
            ["precious" /* Precious */]: 6 /* Precious */,
        };
        const droppedEquips = [];
        for (const section of abortSections) {
            const equip = player.getEquipment(equipSectionMapper[section]);
            if (equip !== undefined) {
                droppedEquips.push(equip);
            }
        }
        await this.dropCards(6 /* PlaceToDropStack */, droppedEquips, playerId);
    }
    resumePlayerEquipSections(playerId, ...abortSections) {
        const player = this.getPlayerById(playerId);
        player.resumeEquipSections(...abortSections);
        const abortEvent = {
            toId: playerId,
            toSections: abortSections,
            isResumption: true,
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} resumed {1} equip section', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(player), translation_json_tool_1.TranslationPack.wrapArrayParams(...abortSections)).extract(),
        };
        this.broadcast(175 /* AbortOrResumePlayerSectionsEvent */, abortEvent);
    }
    async abortPlayerJudgeArea(playerId) {
        const player = this.getPlayerById(playerId);
        const judgeAreaCards = player.getCardIds(2 /* JudgeArea */);
        judgeAreaCards.length > 0 &&
            (await this.dropCards(6 /* PlaceToDropStack */, judgeAreaCards, playerId, playerId));
        player.abortJudgeArea();
        const abortEvent = {
            toId: playerId,
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} aborted judge area', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(player)).extract(),
        };
        this.broadcast(176 /* AbortOrResumePlayerJudgeAreaEvent */, abortEvent);
    }
    resumePlayerJudgeArea(playerId) {
        const player = this.getPlayerById(playerId);
        player.resumeJudgeArea();
        const abortEvent = {
            toId: playerId,
            isResumption: true,
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} resumed judge area', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(player)).extract(),
        };
        this.broadcast(176 /* AbortOrResumePlayerJudgeAreaEvent */, abortEvent);
    }
    refreshPlayerOnceSkill(playerId, skillName) {
        const player = this.getPlayerById(playerId);
        if (!player.refreshOnceSkill(skillName)) {
            return;
        }
        const refreshEvent = {
            toId: playerId,
            skillName,
        };
        this.broadcast(177 /* RefreshOnceSkillEvent */, refreshEvent);
    }
    getGameWinners() {
        return this.gameProcessor.getWinners(this.players);
    }
    get CurrentPhasePlayer() {
        return this.gameProcessor.CurrentPhasePlayer;
    }
    get CurrentPlayerPhase() {
        return this.gameProcessor.CurrentPlayerPhase;
    }
    get CurrentPlayerStage() {
        return this.gameProcessor.CurrentPlayerStage;
    }
    get CurrentPlayer() {
        return this.gameProcessor.CurrentPlayer;
    }
    get CurrentProcessingStage() {
        return this.gameProcessor.CurrentProcessingStage;
    }
    get DrawStack() {
        return this.drawStack;
    }
    get DropStack() {
        return this.dropStack;
    }
    get Logger() {
        return this.logger;
    }
    get Flavor() {
        return this.flavor;
    }
    get GameInfo() {
        return this.gameInfo;
    }
    get WaitingRoomInfo() {
        return this.waitingRoomInfo;
    }
    close() {
        this.onClosedCallback && this.onClosedCallback();
        this.roomClosed = true;
    }
    isClosed() {
        return this.roomClosed;
    }
    onClosed(fn) {
        this.onClosedCallback = fn;
    }
}
exports.ServerRoom = ServerRoom;
