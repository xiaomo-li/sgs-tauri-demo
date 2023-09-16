"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaitingRoomSocket = void 0;
const engine_1 = require("core/game/engine");
class WaitingRoomSocket {
    constructor(roomService, socket, flavor, logger, waitingRoomInfo) {
        this.roomService = roomService;
        this.socket = socket;
        this.flavor = flavor;
        this.logger = logger;
        this.waitingRoomInfo = waitingRoomInfo;
        this.connectedPlayersMap = {};
        this.defaultNumberOfPlayers = 8;
        this.onGameInfoUpdate = (socket) => (evt) => {
            for (const key of Object.keys(evt.roomInfo)) {
                this.waitingRoomInfo.roomInfo[key] = evt.roomInfo[key];
            }
            this.broadcast("GameInfoUpdate" /* GameInfoUpdate */, evt);
        };
        this.onGameStart = (socket) => (evt) => {
            const { roomId, gameInfo } = this.roomService.createRoom(Object.assign(Object.assign({}, evt.roomInfo), { campaignMode: !!evt.roomInfo.campaignMode, flavor: this.flavor }), this.waitingRoomInfo.roomInfo, this.waitingRoomInfo.roomId);
            this.waitingRoomInfo.isPlaying = true;
            this.broadcast("GameStart" /* GameStart */, {
                roomId,
                otherPlayersId: this.waitingRoomInfo.players.map(player => player.playerId),
                roomInfo: gameInfo,
            });
        };
        this.onSendMessage = (socket) => (evt) => {
            this.broadcast("PlayerChatMessage" /* PlayerChatMessage */, Object.assign(Object.assign({}, evt), { timestamp: Date.now() }));
        };
        this.onPlayerEnter = (socket) => (evt) => {
            this.waitingRoomInfo.isPlaying = false;
            const seatId = this.getAvailabeSeatId();
            if (seatId < 0 ||
                this.waitingRoomInfo.players.length > this.waitingRoomInfo.roomInfo.numberOfPlayers ||
                evt.coreVersion !== engine_1.Sanguosha.Version) {
                this.broadcast("PlayerLeave" /* PlayerLeave */, { leftPlayerId: evt.playerInfo.playerId, byKicked: false });
            }
            else {
                this.connectedPlayersMap[socket.id] = evt.playerInfo.playerId;
                const playerInfo = Object.assign(Object.assign({}, evt.playerInfo), { seatId, playerReady: false });
                this.waitingRoomInfo.players.push(playerInfo);
                this.broadcast("PlayerEnter" /* PlayerEnter */, {
                    hostPlayerId: this.waitingRoomInfo.hostPlayerId,
                    playerInfo,
                    otherPlayersInfo: this.waitingRoomInfo.players.filter(p => p.playerId !== playerInfo.playerId),
                    roomInfo: this.waitingRoomInfo.roomInfo,
                    disableSeats: this.waitingRoomInfo.closedSeats,
                });
            }
        };
        this.onPlayerLeave = (socket) => (evt) => {
            this.waitingRoomInfo.players = this.waitingRoomInfo.players.filter(p => p.playerId !== evt.leftPlayerId);
            let newHostPlayerId;
            if (evt.leftPlayerId === this.waitingRoomInfo.hostPlayerId && this.waitingRoomInfo.players.length > 0) {
                newHostPlayerId = this.waitingRoomInfo.players[0].playerId;
            }
            this.broadcast("PlayerLeave" /* PlayerLeave */, Object.assign(Object.assign({}, evt), { byKicked: false, newHostPlayerId }));
        };
        this.onPlayerReady = (socket) => (evt) => {
            const player = this.waitingRoomInfo.players.find(p => p.playerId === evt.readyPlayerId);
            if (player) {
                player.playerReady = evt.isReady;
            }
            this.broadcast("PlayerReady" /* PlayerReady */, evt);
        };
        this.onSeatDisabled = (socket) => (evt) => {
            if (evt.disabled) {
                this.waitingRoomInfo.closedSeats.push(evt.seatId);
                this.waitingRoomInfo.roomInfo.numberOfPlayers--;
            }
            else {
                this.waitingRoomInfo.closedSeats = this.waitingRoomInfo.closedSeats.filter(s => s !== evt.seatId);
                this.waitingRoomInfo.roomInfo.numberOfPlayers++;
            }
            if (evt.kickedPlayerId) {
                this.broadcast("PlayerLeave" /* PlayerLeave */, { leftPlayerId: evt.kickedPlayerId, byKicked: true });
                this.waitingRoomInfo.players = this.waitingRoomInfo.players.filter(p => p.playerId !== evt.kickedPlayerId);
            }
            this.broadcast("SeatDisabled" /* SeatDisabled */, evt);
        };
        this.onHostChanged = (socket) => (evt) => {
            this.broadcast("ChangeHost" /* ChangeHost */, evt);
        };
        this.onRoomCreated = (socket) => (evt) => {
            if (evt.roomInfo.coreVersion !== engine_1.Sanguosha.Version) {
                this.broadcast("RoomCreated" /* RoomCreated */, { error: 'unmatched core version' });
            }
            else {
                this.broadcast("RoomCreated" /* RoomCreated */, Object.assign(Object.assign({ error: null }, evt), { roomId: this.waitingRoomInfo.roomId, disabledSeats: this.waitingRoomInfo.closedSeats }));
            }
        };
        this.onClosed = (disposeCallback) => {
            this.disposeCallback = disposeCallback;
        };
        this.onGameStarting = (hangOutCallback) => {
            this.hangOutCallback = hangOutCallback;
        };
        this.reassigHost = (prevHostPlayerId, newHostPlayerId) => {
            this.broadcast("ChangeHost" /* ChangeHost */, { prevHostPlayerId, newHostPlayerId });
        };
        this.socket.on('connection', socket => {
            logger.info('user ' + socket.id + ' connected');
            socket.on("RoomCreated" /* RoomCreated */, this.onRoomCreated(socket));
            socket.on("GameInfoUpdate" /* GameInfoUpdate */, this.onGameInfoUpdate(socket));
            socket.on("GameStart" /* GameStart */, this.onGameStart(socket));
            socket.on("PlayerChatMessage" /* PlayerChatMessage */, this.onSendMessage(socket));
            socket.on("PlayerEnter" /* PlayerEnter */, this.onPlayerEnter(socket));
            socket.on("PlayerLeave" /* PlayerLeave */, this.onPlayerLeave(socket));
            socket.on("PlayerReady" /* PlayerReady */, this.onPlayerReady(socket));
            socket.on("SeatDisabled" /* SeatDisabled */, this.onSeatDisabled(socket));
            socket.on("ChangeHost" /* ChangeHost */, this.onHostChanged(socket));
            socket.on('disconnect', () => {
                var _a, _b;
                logger.info('user ' + socket.id + ' disconnected');
                if (this.connectedPlayersMap[socket.id]) {
                    this.broadcast("PlayerLeave" /* PlayerLeave */, {
                        leftPlayerId: this.connectedPlayersMap[socket.id],
                        byKicked: false,
                    });
                    socket.leave(this.waitingRoomInfo.roomId.toString());
                    delete this.connectedPlayersMap[socket.id];
                }
                if (Object.keys(this.connectedPlayersMap).length === 0) {
                    if (this.waitingRoomInfo.isPlaying) {
                        (_a = this.hangOutCallback) === null || _a === void 0 ? void 0 : _a.call(this);
                    }
                    else {
                        (_b = this.disposeCallback) === null || _b === void 0 ? void 0 : _b.call(this);
                    }
                }
            });
        });
    }
    broadcast(e, content) {
        this.socket.emit(e, content);
    }
    getAvailabeSeatId() {
        for (let i = 0; i < this.defaultNumberOfPlayers; i++) {
            if (!this.waitingRoomInfo.closedSeats.includes(i) && !this.waitingRoomInfo.players.find(p => p.seatId === i)) {
                return i;
            }
        }
        return -1;
    }
}
exports.WaitingRoomSocket = WaitingRoomSocket;
