"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerSocket = void 0;
const event_1 = require("core/event/event");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const socket_1 = require("core/network/socket");
const player_server_1 = require("core/player/player.server");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
class ServerSocket extends socket_1.Socket {
    constructor(socket, roomId, logger) {
        super();
        this.logger = logger;
        this.asyncResponseResolver = {};
        this.playerReconnectTimer = {};
        this.mapSocketIdToPlayerId = {};
        this.mapPlayerIdToObservers = {};
        this.roomId = roomId.toString();
        this.socket = socket;
        this.socket.on('connection', socket => {
            this.logger.info('User connected', socket.id);
            event_1.serverActiveListenerEvents.forEach(identifier => {
                socket.on(identifier.toString(), (content) => {
                    switch (identifier) {
                        case 150 /* PlayerEnterEvent */:
                            this.onPlayerEnter(socket, identifier, content);
                            break;
                        case 148 /* PlayerReenterEvent */:
                            this.onPlayerReenter(socket, identifier, content);
                            break;
                        case 151 /* PlayerLeaveEvent */:
                            this.onPlayerLeave(socket, identifier, content);
                            break;
                        case 183 /* PlayerReadyEvent */:
                            this.onPlayerReady(socket, identifier, content);
                            break;
                        case 100 /* UserMessageEvent */:
                            this.onPlayerMessage(identifier, content);
                            break;
                        case 101 /* PlayerStatusEvent */:
                            this.onPlayerStatusChanged(socket, identifier, content);
                            break;
                        case 182 /* BackToWaitingRoomEvent */:
                            this.onPlayerBackingToWaitingRoom(socket, identifier, content);
                            break;
                        case 181 /* ObserverRequestChangeEvent */:
                            this.onObserverRequestChangingView(socket, identifier, content);
                            break;
                        default:
                            logger.info('Not implemented active listener', identifier);
                    }
                });
            });
            event_1.serverResponsiveListenerEvents.forEach(identifier => {
                socket.on(identifier.toString(), (content) => {
                    const mappedPlayerId = Object.entries(this.mapSocketIdToPlayerId).find(([playerId, socketId]) => socketId === socket.id);
                    if (!mappedPlayerId) {
                        this.logger.info(`Unable to find playerId of socket ${socket.id}`);
                        return;
                    }
                    const playerId = mappedPlayerId[0];
                    content.status && this.room.updatePlayerStatus(content.status, playerId);
                    const asyncResolver = this.asyncResponseResolver[identifier] && this.asyncResponseResolver[identifier][playerId];
                    if (asyncResolver) {
                        asyncResolver(content);
                        delete this.asyncResponseResolver[identifier][playerId];
                        this.lastResponsiveEvent = undefined;
                    }
                });
            });
            socket.on('disconnect', () => {
                var _a, _b, _c;
                logger.info('User disconnected', socket.id);
                socket.leave(this.roomId);
                const mappedPlayerId = Object.entries(this.mapSocketIdToPlayerId).find(([playerId, socketId]) => socketId === socket.id);
                if (!mappedPlayerId) {
                    this.logger.info(`Unable to find playerId of socket ${socket.id}`);
                    return;
                }
                const playerId = mappedPlayerId[0];
                if (this.room && this.room.Players.find(player => player.Id === playerId) === undefined) {
                    return;
                }
                const room = this.room;
                const player = room.getPlayerById(playerId);
                if (player.isOnline()) {
                    player.setOffline();
                    this.delayToDisconnect(playerId);
                }
                else {
                    const playerLeaveEvent = {
                        playerId,
                        quit: true,
                        translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('player {0} has left the room', room.getPlayerById(playerId).Name).extract(),
                        ignoreNotifiedStatus: true,
                    };
                    this.broadcast(151 /* PlayerLeaveEvent */, event_packer_1.EventPacker.createIdentifierEvent(151 /* PlayerLeaveEvent */, playerLeaveEvent));
                }
                if (room.Players.every(player => !player.isOnline() || player.isSmartAI()) || room.Players.length === 0) {
                    this.logger.debug('room close with no player online');
                    room.close();
                    return;
                }
                if (!room.isPlaying()) {
                    room.removePlayer(playerId);
                }
                else if ((_a = this.room) === null || _a === void 0 ? void 0 : _a.AwaitingResponseEvent[playerId]) {
                    this.logger.debug('Room is Playing, Await Ai Resp');
                    const { identifier: awaitIdentifier, content } = (_b = this.room) === null || _b === void 0 ? void 0 : _b.AwaitingResponseEvent[playerId];
                    if (awaitIdentifier === undefined) {
                        throw new Error(`Unknown event without identifier: ${JSON.stringify((_c = this.room) === null || _c === void 0 ? void 0 : _c.AwaitingResponseEvent[playerId])}`);
                    }
                    if (content.toId !== playerId) {
                        return;
                    }
                    const toPlayer = room.getPlayerById(playerId);
                    const result = toPlayer.AI.onAction(this.room, awaitIdentifier, content);
                    if (this.asyncResponseResolver[awaitIdentifier][playerId]) {
                        this.asyncResponseResolver[awaitIdentifier][playerId](result);
                        delete this.asyncResponseResolver[awaitIdentifier][playerId];
                    }
                    this.room.unsetAwaitingResponseEvent(playerId);
                }
            });
        });
    }
    delayToDisconnect(playerId) {
        this.playerReconnectTimer[playerId] = setTimeout(() => {
            const playerLeaveEvent = {
                playerId,
                quit: true,
                translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('player {0} has left the room', this.room.getPlayerById(playerId).Name).extract(),
                ignoreNotifiedStatus: true,
            };
            this.broadcast(151 /* PlayerLeaveEvent */, event_packer_1.EventPacker.createIdentifierEvent(151 /* PlayerLeaveEvent */, playerLeaveEvent));
            this.room.getPlayerById(playerId).setOffline(true);
            delete this.mapSocketIdToPlayerId[playerId];
            delete this.playerReconnectTimer[playerId];
        }, 300 * 1000);
    }
    async onPlayerMessage(identifier, content) {
        const room = this.room;
        const player = room.getPlayerById(content.playerId);
        if (content.message) {
            content.originalMessage = content.message;
            content.message = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} {1} says: {2}', translation_json_tool_1.TranslationPack.patchPureTextParameter(player.Name), player.CharacterId === undefined ? '' : translation_json_tool_1.TranslationPack.patchPlayerInTranslation(player), translation_json_tool_1.TranslationPack.patchPureTextParameter(content.message)).toString();
            content.ignoreNotifiedStatus = true;
            this.broadcast(identifier, content);
        }
    }
    async onObserverRequestChangingView(socket, identifier, content) {
        var _a;
        for (const player of this.room.Players) {
            if ((_a = this.mapPlayerIdToObservers[player.Id]) === null || _a === void 0 ? void 0 : _a.includes(content.observerId)) {
                this.mapPlayerIdToObservers[player.Id] = this.mapPlayerIdToObservers[player.Id].filter(id => id !== content.observerId);
                break;
            }
        }
        this.mapPlayerIdToObservers[content.toObserverId] = this.mapPlayerIdToObservers[content.toObserverId] || [];
        this.mapPlayerIdToObservers[content.toObserverId].push(content.observerId);
    }
    async onPlayerBackingToWaitingRoom(socket, identifier, content) {
        socket.emit(identifier.toString(), Object.assign(Object.assign({}, this.room.WaitingRoomInfo), { playerId: content.playerId, playerName: content.playerName }));
    }
    async onPlayerStatusChanged(socket, identifier, content) {
        this.room.updatePlayerStatus(content.status, content.toId);
    }
    async onPlayerReenter(socket, identifier, event) {
        const room = this.room;
        if (this.mapSocketIdToPlayerId[event.playerId] !== undefined) {
            this.mapSocketIdToPlayerId[event.playerId] = socket.id;
            clearTimeout(this.playerReconnectTimer[event.playerId]);
            room.getPlayerById(event.playerId).setOnline();
        }
        const missingEvents = this.room.Analytics.getRecordEvents(e => {
            const timeStamp = event_packer_1.EventPacker.getTimestamp(e);
            if (!timeStamp) {
                return false;
            }
            return timeStamp > event.timestamp;
        });
        if (this.lastResponsiveEvent && this.lastResponsiveEvent.to === event.playerId) {
            missingEvents.push(this.lastResponsiveEvent.event);
        }
        socket.emit(149 /* PlayerBulkPacketEvent */.toString(), {
            timestamp: event.timestamp,
            stackedLostMessages: missingEvents,
        });
        this.broadcast(148 /* PlayerReenterEvent */, {
            toId: event.playerId,
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('player {0} re-enter in the room', translation_json_tool_1.TranslationPack.patchPureTextParameter(event.playerName)).extract(),
            ignoreNotifiedStatus: true,
        });
    }
    async onPlayerEnter(socket, identifier, event) {
        const room = this.room;
        let joinFailed = false;
        if (event.coreVersion !== engine_1.Sanguosha.Version) {
            joinFailed = true;
        }
        else if (!event.joinAsObserver && (room.isPlaying() || room.Info.numberOfPlayers <= room.Players.length)) {
            joinFailed = true;
        }
        if (joinFailed) {
            socket.emit(147 /* PlayerEnterRefusedEvent */.toString(), {
                playerId: event.playerId,
                playerName: event.playerName,
                timestamp: event.timestamp,
            });
            socket.disconnect();
            return;
        }
        this.mapSocketIdToPlayerId[event.playerId] = socket.id;
        if (!event.joinAsObserver) {
            const player = new player_server_1.ServerPlayer(event.playerId, event.playerName, room.Players.length);
            room.addPlayer(player);
            this.broadcast(150 /* PlayerEnterEvent */, {
                joiningPlayerName: event.playerName,
                joiningPlayerId: event.playerId,
                roomInfo: room.getRoomInfo(),
                playersInfo: room.Players.map(p => p.getPlayerInfo()),
                gameInfo: room.Info,
                translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('player {0} join in the room', translation_json_tool_1.TranslationPack.patchPureTextParameter(event.playerName)).extract(),
                timestamp: event.timestamp,
            });
        }
        else {
            const observePlayer = room.AlivePlayers[0];
            this.mapPlayerIdToObservers[observePlayer.Id] = this.mapPlayerIdToObservers[observePlayer.Id] || [];
            this.mapPlayerIdToObservers[observePlayer.Id].push(event.playerId);
            this.broadcast(180 /* ObserverEnterEvent */, {
                joiningPlayerName: event.playerName,
                joiningPlayerId: event.playerId,
                roomInfo: room.getRoomShortcutInfo(),
                playersInfo: room.Players.map(p => p.getPlayerShortcutInfo()),
                gameInfo: room.Info,
                translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('observer {0} join in the room', translation_json_tool_1.TranslationPack.patchPureTextParameter(event.playerName)).extract(),
                timestamp: event.timestamp,
                observePlayerId: observePlayer.Id,
                ignoreNotifiedStatus: true,
            });
        }
    }
    async onPlayerReady(socket, identifier, event) {
        const room = this.room;
        const player = room.Players.find(player => player.Id === event.playerId);
        if (player) {
            player.getReady();
        }
        if (room.Players.length === room.getRoomInfo().totalPlayers &&
            room.Players.every(player => player.isSmartAI() || player.isReady())) {
            await room.gameStart();
        }
    }
    async onPlayerLeave(socket, identifier, event) {
        const room = this.room;
        room.getPlayerById(event.playerId).setOffline(true);
        const playerLeaveEvent = {
            playerId: event.playerId,
            quit: true,
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('player {0} has left the room', room.getPlayerById(event.playerId).Name).extract(),
            ignoreNotifiedStatus: true,
        };
        this.broadcast(151 /* PlayerLeaveEvent */, event_packer_1.EventPacker.createIdentifierEvent(151 /* PlayerLeaveEvent */, playerLeaveEvent));
        if (room.Players.every(player => !player.isOnline()) || room.Players.length === 0) {
            room.close();
            return;
        }
        socket.disconnect();
    }
    emit(room) {
        if (!this.room) {
            this.room = room;
        }
    }
    notify(type, content, to) {
        var _a;
        const toPlayer = this.room.getPlayerById(to);
        this.lastResponsiveEvent = {
            to,
            identifier: type,
            event: content,
        };
        if (!toPlayer.isOnline()) {
            const result = toPlayer.AI.onAction(this.room, type, content);
            setTimeout(() => {
                var _a;
                const asyncResolver = this.asyncResponseResolver[type] && this.asyncResponseResolver[type][to];
                if (asyncResolver) {
                    asyncResolver(result);
                    delete this.asyncResponseResolver[type][to];
                    (_a = this.room) === null || _a === void 0 ? void 0 : _a.unsetAwaitingResponseEvent(to);
                }
            }, 1500);
        }
        else {
            (_a = this.room) === null || _a === void 0 ? void 0 : _a.setAwaitingResponseEvent(type, content, to);
            this.socket.to(this.mapSocketIdToPlayerId[to]).emit(type.toString(), content);
            const observers = this.mapPlayerIdToObservers[to];
            if (observers) {
                for (const observer of observers) {
                    this.socket.to(this.mapSocketIdToPlayerId[observer]).emit(type.toString(), content);
                }
            }
        }
    }
    broadcast(type, content) {
        this.socket.emit(type.toString(), event_packer_1.EventPacker.minifyPayload(content));
    }
    clearSubscriber(identifier, to) {
        if (this.asyncResponseResolver[identifier]) {
            delete this.asyncResponseResolver[identifier][to];
        }
    }
    async waitForResponse(identifier, playerId) {
        return await new Promise(resolve => {
            if (!this.asyncResponseResolver[identifier]) {
                this.asyncResponseResolver[identifier] = {
                    [playerId]: resolve,
                };
            }
            else {
                const identifierResolvers = this.asyncResponseResolver[identifier];
                identifierResolvers[playerId] = resolve;
            }
        }).then(response => {
            var _a;
            (_a = this.room) === null || _a === void 0 ? void 0 : _a.unsetAwaitingResponseEvent(playerId);
            return response;
        });
    }
}
exports.ServerSocket = ServerSocket;
