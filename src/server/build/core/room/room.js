"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const system_1 = require("core/shares/libs/system");
class Room {
    constructor() {
        this.circle = 0;
        this.awaitResponseEvent = {};
        this.gameStarted = false;
        this.gameOvered = false;
        this.onProcessingCards = {};
        this.sideEffectSkills = {};
    }
    get GameParticularAreas() {
        return ['muniuliuma', 'jinfan'];
    }
    updatePlayerStatus(status, toId) {
        const to = this.getPlayerById(toId);
        switch (status) {
            case 'online':
                to.setOnline();
                break;
            case 'offline':
                to.setOffline();
                break;
            case 'quit':
                to.setOffline(true);
                break;
            case 'trusted':
                to.delegateOnTrusted(true);
                break;
            case 'player':
                to.delegateOnTrusted(false);
                break;
            case 'smart-ai':
                to.delegateOnSmartAI();
                break;
            default:
                throw precondition_1.Precondition.UnreachableError(status);
        }
    }
    getSideEffectSkills(player) {
        const skills = [];
        for (const [applierEnumString, skillAssembly] of Object.entries(this.sideEffectSkills)) {
            if (system_1.System.SideEffectSkillAppliers[applierEnumString](player, this, skillAssembly === null || skillAssembly === void 0 ? void 0 : skillAssembly.sourceId)) {
                if (skillAssembly) {
                    const shadowSkills = engine_1.Sanguosha.getShadowSkillsBySkillName(skillAssembly.skillName).map(skill => skill.Name);
                    skills.push(skillAssembly === null || skillAssembly === void 0 ? void 0 : skillAssembly.skillName);
                    skills.push(...shadowSkills);
                }
            }
        }
        return skills;
    }
    installSideEffectSkill(applier, skillName, sourceId) {
        this.sideEffectSkills[applier] = { skillName, sourceId };
    }
    uninstallSideEffectSkill(applier) {
        delete this.sideEffectSkills[applier];
    }
    addProcessingCards(tag, ...cardIds) {
        this.onProcessingCards[tag] = this.onProcessingCards[tag] || [];
        for (const cardId of cardIds) {
            if (!cardId) {
                continue;
            }
            this.onProcessingCards[tag].push(cardId);
        }
    }
    getProcessingCards(tag) {
        return this.onProcessingCards[tag] || [];
    }
    isCardOnProcessing(cardId) {
        return Object.values(this.onProcessingCards).find(cards => cards.includes(cardId)) !== undefined;
    }
    clearOnProcessingCard() {
        this.onProcessingCards = {};
    }
    endProcessOnTag(tag) {
        delete this.onProcessingCards[tag];
    }
    endProcessOnCard(card) {
        for (const [tag, cards] of Object.entries(this.onProcessingCards)) {
            const cardIndex = cards.findIndex(inProcessingCard => card === inProcessingCard);
            if (cardIndex >= 0) {
                cards.splice(cardIndex, 1);
            }
            if (this.onProcessingCards[tag].length === 0) {
                delete this.onProcessingCards[tag];
            }
        }
    }
    getCardOwnerId(card) {
        for (const player of this.AlivePlayers) {
            if (player.getCardId(card) !== undefined) {
                return player.Id;
            }
        }
    }
    getPlayerById(playerId) {
        return precondition_1.Precondition.exists(this.players.find(player => player.Id === playerId), `Unable to find player by player ID: ${playerId}`);
    }
    async useCard(content, declared) {
        if (content.fromId) {
            const from = this.getPlayerById(content.fromId);
            const exclude = from
                .getSkills('filter')
                .find(skill => skill.excludeCardUseHistory(content.cardId, this, from.Id)) !== undefined;
            if (this.CurrentPlayer.Id === content.fromId && !content.extraUse && !exclude) {
                from.useCard(content.cardId);
            }
        }
    }
    async useSkill(content) {
        if (content.fromId) {
            const from = this.getPlayerById(content.fromId);
            from.useSkill(content.skillName);
            return true;
        }
        return false;
    }
    get AlivePlayers() {
        return this.players.filter(player => !player.Dead);
    }
    get Players() {
        return this.players;
    }
    get CommonRules() {
        return this.gameCommonRules;
    }
    sortPlayers() {
        this.players.sort((playerA, playerB) => {
            if (playerA.Position <= playerB.Position) {
                return -1;
            }
            else {
                return 1;
            }
        });
    }
    addPlayer(player) {
        this.players.push(player);
        return this.players;
    }
    removePlayer(playerId) {
        const playerIndex = this.players.findIndex(player => player.Id === playerId);
        if (playerIndex >= 0) {
            this.players.splice(playerIndex, 1);
        }
    }
    getAlivePlayersFrom(playerId, startsFromNext = false) {
        playerId = playerId === undefined ? this.CurrentPlayer.Id : playerId;
        while (this.getPlayerById(playerId).Dead) {
            playerId = this.getNextAlivePlayer(playerId).Id;
        }
        const alivePlayers = this.AlivePlayers;
        const fromIndex = alivePlayers.findIndex(player => player.Id === playerId);
        precondition_1.Precondition.assert(fromIndex >= 0, `Player ${playerId} is dead or doesn't exist`);
        return [...alivePlayers.slice(startsFromNext ? fromIndex + 1 : fromIndex), ...alivePlayers.slice(0, fromIndex)];
    }
    getAllPlayersFrom(playerId, startsFromNext = false) {
        playerId = playerId === undefined ? this.CurrentPlayer.Id : playerId;
        while (this.getPlayerById(playerId).Dead) {
            playerId = this.getNextAlivePlayer(playerId).Id;
        }
        const players = this.Players;
        const fromIndex = players.findIndex(player => player.Id === playerId);
        precondition_1.Precondition.assert(fromIndex >= 0, `Player ${playerId} is dead or doesn't exist`);
        return [...players.slice(startsFromNext ? fromIndex + 1 : fromIndex), ...players.slice(0, fromIndex)];
    }
    getOtherPlayers(playerId, from) {
        return this.getAlivePlayersFrom(from).filter(player => player.Id !== playerId);
    }
    getNextPlayer(playerId) {
        const fromIndex = this.players.findIndex(player => player.Id === playerId);
        const nextIndex = (fromIndex + 1) % this.players.length;
        return this.players[nextIndex];
    }
    getNextAlivePlayer(playerId) {
        let nextIndex = this.players.findIndex(player => player.Id === playerId);
        do {
            nextIndex = (nextIndex + 1) % this.players.length;
        } while (this.players[nextIndex].Dead);
        return this.players[nextIndex];
    }
    deadPlayerFilters(playerIds) {
        return playerIds.filter(playerId => !this.getPlayerById(playerId).Dead);
    }
    onSeatDistance(from, to) {
        const startPosition = Math.min(from.Position, to.Position);
        const endPosition = startPosition === from.Position ? to.Position : from.Position;
        let distance = 0;
        for (let start = startPosition; start < endPosition; start++) {
            if (!this.players[start].Dead) {
                distance++;
            }
        }
        return this.AlivePlayers.length / 2 >= distance ? distance : this.AlivePlayers.length - distance;
    }
    canAttack(from, to, slash, except, unlimited) {
        if (to.Id === from.Id) {
            return false;
        }
        let additionalAttackDistance = 0;
        if (slash) {
            additionalAttackDistance =
                this.gameCommonRules.getCardAdditionalAttackDistance(this, from, engine_1.Sanguosha.getCardById(slash)) +
                    from.getCardUsableDistance(this, slash, to) -
                    engine_1.Sanguosha.getCardById(slash).EffectUseDistance;
        }
        return (this.withinAttackDistance(from, to, additionalAttackDistance, except) &&
            this.canUseCardTo(slash || new card_matcher_1.CardMatcher({ generalName: ['slash'] }), from, to, unlimited));
    }
    distanceBetween(from, to, except) {
        if (from === to) {
            return 0;
        }
        for (const player of this.getAlivePlayersFrom()) {
            for (const skill of player.getPlayerSkills('globalBreaker')) {
                const breakDistance = skill.breakDistance(this, player, from, to);
                if (breakDistance > 0) {
                    return breakDistance;
                }
            }
        }
        for (const skill of from.getPlayerSkills('breaker')) {
            const breakDistance = skill.breakDistanceTo(this, from, to);
            if (breakDistance > 0) {
                return breakDistance;
            }
        }
        const ride = from.getEquipment(4 /* OffenseRide */);
        let fixed = 0;
        if (ride && except && except.includes(ride)) {
            const rideSkill = engine_1.Sanguosha.getCardById(ride).Skill;
            if (rideSkill) {
                fixed = rideSkill.breakOffenseDistance(this, from);
            }
        }
        const seatGap = to.getDefenseDistance(this) - from.getOffenseDistance(this) + fixed;
        return Math.max(this.onSeatDistance(from, to) + seatGap, 1);
    }
    cardUseDistanceBetween(room, cardId, from, to) {
        const card = engine_1.Sanguosha.getCardById(cardId);
        return Math.max(this.distanceBetween(from, to) - this.gameCommonRules.getCardAdditionalUsableDistance(room, from, card, to), 1);
    }
    withinAttackDistance(from, to, fixed = 0, except) {
        if (from === to) {
            return false;
        }
        for (const player of this.getAlivePlayersFrom()) {
            for (const skill of player.getPlayerSkills('globalBreaker')) {
                const breakWithinAttackDistance = skill.breakWithinAttackDistance(this, player, from, to);
                if (breakWithinAttackDistance) {
                    return breakWithinAttackDistance;
                }
            }
        }
        return Math.max(from.getAttackRange(this, except) + fixed, 0) >= this.distanceBetween(from, to, except);
    }
    isAvailableTarget(cardId, attacker, target) {
        for (const skill of this.getPlayerById(target).getSkills('filter')) {
            if (!skill.canBeUsedCard(cardId, this, target, attacker)) {
                return false;
            }
        }
        return true;
    }
    canUseCardTo(cardId, from, target, unlimited) {
        return from.canUseCardTo(this, cardId, target.Id, unlimited);
    }
    canPlaceCardTo(cardId, target) {
        const player = this.getPlayerById(target);
        const card = engine_1.Sanguosha.getCardById(cardId);
        if (card.is(1 /* Equip */)) {
            const equipCard = card;
            return player.getEquipment(equipCard.EquipType) === undefined && player.canEquip(equipCard);
        }
        else if (card.is(8 /* DelayedTrick */)) {
            const toJudgeArea = player.getCardIds(2 /* JudgeArea */).map(id => engine_1.Sanguosha.getCardById(id).GeneralName);
            return !toJudgeArea.includes(card.GeneralName) && this.canUseCardTo(cardId, player, player);
        }
        return false;
    }
    canPindian(fromId, targetId) {
        const from = this.getPlayerById(fromId);
        const target = this.getPlayerById(targetId);
        const targetSkills = target.getPlayerSkills('filter');
        return (fromId !== targetId &&
            from.getCardIds(0 /* HandArea */).length > 0 &&
            target.getCardIds(0 /* HandArea */).length > 0 &&
            targetSkills.find(skill => !skill.canBePindianTarget(this, targetId, fromId)) === undefined);
    }
    canDropCard(fromId, cardId) {
        return (this.getPlayerById(fromId)
            .getPlayerSkills('filter')
            .find(skill => !skill.canDropCard(cardId, this, fromId)) === undefined);
    }
    clearFlags(player) {
        this.getPlayerById(player).clearFlags();
    }
    removeFlag(player, name) {
        this.getPlayerById(player).removeFlag(name);
    }
    setFlag(player, name, value, tagName, visiblePlayers) {
        return this.getPlayerById(player).setFlag(name, value, tagName, visiblePlayers);
    }
    getFlag(player, name) {
        return this.getPlayerById(player).getFlag(name);
    }
    clearMarks(player) {
        this.getPlayerById(player).clearMarks();
    }
    removeMark(player, name) {
        this.getPlayerById(player).removeMark(name);
    }
    setMark(player, name, value) {
        return this.getPlayerById(player).setMark(name, value);
    }
    addMark(player, name, value) {
        return this.getPlayerById(player).addMark(name, value);
    }
    getMark(player, name) {
        return this.getPlayerById(player).getMark(name);
    }
    clearCardTags(player) {
        this.getPlayerById(player).clearCardTags();
    }
    removeCardTag(player, cardTag) {
        this.getPlayerById(player).removeCardTag(cardTag);
    }
    setCardTag(player, cardTag, cardIds) {
        this.getPlayerById(player).setCardTag(cardTag, cardIds);
    }
    getCardTag(player, cardTag) {
        return this.getPlayerById(player).getCardTag(cardTag);
    }
    async abortPlayerEquipSections(playerId, ...abortSections) {
        const player = this.getPlayerById(playerId);
        player.abortEquipSections(...abortSections);
    }
    resumePlayerEquipSections(playerId, ...abortSections) {
        const player = this.getPlayerById(playerId);
        player.resumeEquipSections(...abortSections);
    }
    async abortPlayerJudgeArea(playerId) {
        const player = this.getPlayerById(playerId);
        player.abortJudgeArea();
    }
    resumePlayerJudgeArea(playerId) {
        const player = this.getPlayerById(playerId);
        player.resumeJudgeArea();
    }
    refreshPlayerOnceSkill(playerId, skillName) {
        const player = this.getPlayerById(playerId);
        player.refreshOnceSkill(skillName);
    }
    sortPlayersByPosition(players) {
        players.sort((prev, next) => {
            const prevPosition = this.getPlayerById(prev).Position;
            const nextPosition = this.getPlayerById(next).Position;
            if (prevPosition < nextPosition) {
                return -1;
            }
            else if (prevPosition === nextPosition) {
                return 0;
            }
            return 1;
        });
        if (players.find(playerId => this.getPlayerById(playerId).Position >= this.CurrentPlayer.Position)) {
            while (this.getPlayerById(players[0]).Position < this.CurrentPlayer.Position) {
                const topPlayer = players.shift();
                players.push(topPlayer);
            }
        }
    }
    sortByPlayersPosition(array, extractor) {
        array.sort((el1, el2) => {
            const p1 = extractor(el1);
            const p2 = extractor(el2);
            const pos1 = (p1.Position - this.CurrentPhasePlayer.Position + this.Players.length) % this.Players.length;
            const pos2 = (p2.Position - this.CurrentPhasePlayer.Position + this.Players.length) % this.Players.length;
            return pos1 - pos2;
        });
    }
    transformCard(player, judgeEventOrCards, toArea) {
        const transformSkills = player.getSkills('transform');
        if (!(judgeEventOrCards instanceof Array)) {
            const judgeEvent = judgeEventOrCards;
            if (card_1.Card.isVirtualCardId(judgeEvent.judgeCardId)) {
                const judgeCard = engine_1.Sanguosha.getCardById(judgeEvent.judgeCardId);
                judgeEvent.judgeCardId = engine_1.Sanguosha.getCardById(judgeCard.ActualCardIds[0]).Id;
            }
            for (const skill of transformSkills.filter(skill => skill.includesJudgeCard())) {
                if (skill.canTransform(player, judgeEvent.judgeCardId)) {
                    judgeEvent.judgeCardId = skill.forceToTransformCardTo(judgeEvent.judgeCardId).Id;
                    break;
                }
            }
            return;
        }
        const cards = judgeEventOrCards;
        for (const skill of transformSkills) {
            for (let i = 0; i < cards.length; i++) {
                if (card_1.Card.isVirtualCardId(cards[i]) &&
                    engine_1.Sanguosha.getCardById(cards[i]).GeneratedBySkill === skill.GeneralName) {
                    continue;
                }
                if (skill.canTransform(player, cards[i], toArea)) {
                    cards[i] = skill.forceToTransformCardTo(cards[i]).Id;
                }
            }
        }
    }
    getRoomInfo() {
        return {
            name: this.gameInfo.roomName,
            activePlayers: this.players.filter(player => player.Status !== "quit" /* Quit */).length,
            totalPlayers: this.gameInfo.numberOfPlayers,
            packages: this.gameInfo.characterExtensions,
            status: this.gameStarted ? 'playing' : 'waiting',
            id: this.roomId,
            gameMode: this.gameInfo.gameMode,
            passcode: this.gameInfo.passcode,
            allowObserver: !!this.gameInfo.allowObserver,
        };
    }
    getRoomShortcutInfo() {
        const info = this.getRoomInfo();
        let currentPlayerId;
        let currentPhasePlayerId;
        try {
            currentPlayerId = this.CurrentPlayer.Id;
            currentPhasePlayerId = this.CurrentPhasePlayer.Id;
        }
        catch (_a) {
            currentPlayerId = this.players[0].Id;
            currentPhasePlayerId = this.players[0].Id;
        }
        return Object.assign(Object.assign({}, info), { currentPlayerId,
            currentPhasePlayerId, currentPlayerStage: this.CurrentPlayerStage, currentPlayerPhase: this.CurrentPlayerPhase });
    }
    enableToAwaken(skillName, player) {
        var _a;
        return (((_a = player.getFlag("flag:enable_to_awaken" /* EnableToAwaken */)) === null || _a === void 0 ? void 0 : _a.includes(skillName)) ||
            system_1.System.AwakeningSkillApplier[skillName](this, player));
    }
    hasDifferentCampWith(from, to) {
        switch (from.Role) {
            case 1 /* Lord */:
            case 2 /* Loyalist */:
                return to.Role === 3 /* Rebel */ || to.Role === 4 /* Renegade */;
            case 3 /* Rebel */:
                return to.Role === 1 /* Lord */ || to.Role === 2 /* Loyalist */;
            case 4 /* Renegade */:
                return from.Role !== to.Role;
            default:
                return false;
        }
    }
    get RoomId() {
        return this.roomId;
    }
    get Info() {
        return this.gameInfo;
    }
    get Analytics() {
        return this.analytics;
    }
    nextCircle() {
        this.circle++;
    }
    get Circle() {
        return this.circle;
    }
    set Circle(circle) {
        this.circle = circle;
    }
    isPlaying() {
        return this.gameStarted;
    }
    gameOver() {
        this.gameOvered = true;
    }
    isGameOver() {
        return this.gameOvered;
    }
    get AwaitingResponseEvent() {
        return this.awaitResponseEvent;
    }
    setAwaitingResponseEvent(identifier, content, toId) {
        this.awaitResponseEvent[toId] = {
            identifier,
            content,
        };
    }
    unsetAwaitingResponseEvent(toId) {
        if (toId === undefined) {
            this.awaitResponseEvent = {};
        }
        else {
            delete this.awaitResponseEvent[toId];
        }
    }
    get EventStack() {
        return this.eventStack;
    }
}
exports.Room = Room;
