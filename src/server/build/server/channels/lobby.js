"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LobbyEventChannel = void 0;
const engine_1 = require("core/game/engine");
class LobbyEventChannel {
    constructor(roomService, socket, config) {
        this.roomService = roomService;
        this.socket = socket;
        this.config = config;
        this.eventHandlers = {};
        this.installEventHandlers = (socket) => {
            for (const [eventEnum, handler] of Object.entries(this.eventHandlers)) {
                socket.on(eventEnum, handler(socket));
            }
        };
        this.onGameChat = (message) => {
            this.socket.of('/chat').emit("chat" /* Chat */, message);
        };
        this.registerEventHandler = (eventEnum, handler) => {
            this.eventHandlers[eventEnum] = handler;
        };
        this.matchCoreVersion = (socket) => (content) => {
            socket.emit(3 /* VersionMismatch */.toString(), content.version === engine_1.Sanguosha.Version);
        };
        this.onCheckingRoomExist = (socket) => (id) => {
            socket.emit(5 /* CheckRoomExist */.toString(), this.roomService.checkRoomExist(id));
        };
        this.onCreatingWaitingRoom = (socket) => (content) => {
            if (content.roomInfo.coreVersion !== engine_1.Sanguosha.Version) {
                socket.emit(6 /* CreateWaitingRoom */.toString(), {
                    error: 'unmatched core version',
                });
                return;
            }
            if (!this.roomService.isValidToCreateWaitingRoom(socket.handshake.address)) {
                socket.emit(6 /* CreateWaitingRoom */.toString(), {
                    error: 'host player is not allowed',
                });
                return;
            }
            const { roomId, roomInfo } = this.roomService.createWaitingRoom(content.roomInfo, socket.handshake.address);
            socket.emit(6 /* CreateWaitingRoom */.toString(), {
                roomId,
                roomInfo,
            });
        };
        /**
         * @deprecated game will not be created from lobby anymore.
         */
        this.onGameCreated = (socket) => (content) => {
            if (content.coreVersion !== engine_1.Sanguosha.Version) {
                socket.emit(1 /* GameCreated */.toString(), {
                    error: 'unmatched core version',
                });
                return;
            }
            const { roomId, gameInfo } = this.roomService.createRoom(content, Object.assign(Object.assign({}, content), { hostPlayerId: 'fake-id' }), -1);
            socket.emit(1 /* GameCreated */.toString(), {
                roomId,
                roomInfo: gameInfo,
            });
        };
        this.onQueryRoomsInfo = (socket) => () => {
            socket.emit(0 /* QueryRoomList */.toString(), this.roomService.getRoomsInfo());
        };
        this.join = (channelId) => this.socket.of(channelId);
        this.socket.of('/chat').on('connect', socket => {
            socket.on("chat" /* Chat */, this.onGameChat);
        });
        this.registerEventHandler(1 /* GameCreated */, this.onGameCreated);
        this.registerEventHandler(0 /* QueryRoomList */, this.onQueryRoomsInfo);
        this.registerEventHandler(6 /* CreateWaitingRoom */, this.onCreatingWaitingRoom);
        this.registerEventHandler(2 /* QueryVersion */, this.matchCoreVersion);
        this.registerEventHandler(5 /* CheckRoomExist */, this.onCheckingRoomExist);
    }
    start() {
        this.socket.of('/lobby').on('connect', socket => {
            this.installEventHandlers(socket);
            socket.on(4 /* PingServer */.toString(), () => {
                socket.emit(4 /* PingServer */.toString());
            });
        });
    }
}
exports.LobbyEventChannel = LobbyEventChannel;
