"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomService = void 0;
const system_1 = require("core/shares/libs/system");
class RoomService {
    constructor(lobbySocket, createGameServerSocket, createServerRoom, createRecordAnalytics, createGameCommonRules, createRoomEventStacker, createGameWaitingRoom, createWaitingRoomSocket, createDifferentModeGameProcessor) {
        this.lobbySocket = lobbySocket;
        this.createGameServerSocket = createGameServerSocket;
        this.createServerRoom = createServerRoom;
        this.createRecordAnalytics = createRecordAnalytics;
        this.createGameCommonRules = createGameCommonRules;
        this.createRoomEventStacker = createRoomEventStacker;
        this.createGameWaitingRoom = createGameWaitingRoom;
        this.createWaitingRoomSocket = createWaitingRoomSocket;
        this.createDifferentModeGameProcessor = createDifferentModeGameProcessor;
        this.rooms = [];
        this.waitingRooms = [];
        this.hostPlayerIps = new Map();
        this.waitingRoomMaps = new Map();
    }
    checkRoomExist(roomId) {
        return (this.rooms.find(room => room.RoomId === roomId) !== undefined ||
            this.waitingRooms.find(room => room.roomId === roomId && !room.isPlaying) !== undefined);
    }
    getRoomsInfo() {
        return [
            ...this.rooms.map(room => room.getRoomInfo()),
            ...this.waitingRooms.filter(room => !room.isPlaying).map(room => this.getWaitingRoomInfo(room)),
        ];
    }
    getWaitingRoomInfo(room) {
        const { roomInfo, players, roomId } = room;
        return {
            name: roomInfo.roomName,
            activePlayers: players.length,
            totalPlayers: roomInfo.numberOfPlayers,
            status: 'waiting',
            packages: roomInfo.characterExtensions,
            id: roomId,
            gameMode: roomInfo.gameMode,
            passcode: roomInfo.passcode,
            allowObserver: !!roomInfo.allowObserver,
        };
    }
    createRoom(gameInfo, roomInfo, waitingRoomId) {
        const roomId = roomInfo.roomId || Date.now();
        const roomSocket = this.createGameServerSocket(this.lobbySocket.of(`/room-${roomId}`), roomId);
        const room = this.createServerRoom(roomId, gameInfo, roomSocket, this.createDifferentModeGameProcessor(gameInfo.gameMode), this.createRecordAnalytics(), [], gameInfo.flavor, gameInfo.gameMode, this.createGameCommonRules(), this.createRoomEventStacker(), { roomInfo, roomId: waitingRoomId });
        room.onClosed(async () => {
            var _a;
            this.rooms = this.rooms.filter(r => r !== room);
            /**
             * To wait for players joining waiting room and room info being updated
             */
            await system_1.System.MainThread.sleep(1500);
            const waitingRoomIndex = this.waitingRooms.findIndex(r => r.roomId === room.WaitingRoomInfo.roomId);
            const waitingRoom = this.waitingRooms[waitingRoomIndex];
            if ((waitingRoom === null || waitingRoom === void 0 ? void 0 : waitingRoom.players.length) === 0) {
                this.waitingRooms.splice(waitingRoomIndex, 1);
                this.waitingRoomMaps.delete(waitingRoom.roomId);
            }
            else if (waitingRoom && waitingRoom.players.find(p => p.playerId === waitingRoom.hostPlayerId) == null) {
                (_a = this.waitingRoomMaps
                    .get(waitingRoom.roomId)) === null || _a === void 0 ? void 0 : _a.reassigHost(waitingRoom.hostPlayerId, waitingRoom.players[0].playerId);
            }
        });
        this.rooms.push(room);
        return {
            roomId,
            gameInfo: Object.assign(Object.assign({}, gameInfo), { campaignMode: !!gameInfo.campaignMode }),
        };
    }
    createWaitingRoom(roomInfo, hostIp) {
        const room = this.createGameWaitingRoom(roomInfo, roomInfo.roomId || Date.now());
        const roomSocket = this.createWaitingRoomSocket(this.lobbySocket.of(`/waiting-room-${room.roomId}`), room);
        this.waitingRoomMaps.set(room.roomId, roomSocket);
        roomSocket.onClosed(() => {
            this.waitingRooms = this.waitingRooms.filter(r => r !== room);
            const createdRooms = this.hostPlayerIps.get(hostIp) || 0;
            if (createdRooms > 0) {
                this.hostPlayerIps.set(hostIp, createdRooms - 1);
            }
        });
        roomSocket.onGameStarting(() => {
            const createdRooms = this.hostPlayerIps.get(hostIp) || 0;
            if (createdRooms > 0) {
                this.hostPlayerIps.set(hostIp, createdRooms - 1);
            }
        });
        this.waitingRooms.push(room);
        const createdRooms = this.hostPlayerIps.get(hostIp) || 0;
        this.hostPlayerIps.set(hostIp, createdRooms + 1);
        return {
            roomId: room.roomId,
            roomInfo,
        };
    }
    isValidToCreateWaitingRoom(playerIp) {
        return this.hostPlayerIps.get(playerIp) === undefined || this.hostPlayerIps.get(playerIp) < 2;
    }
}
exports.RoomService = RoomService;
