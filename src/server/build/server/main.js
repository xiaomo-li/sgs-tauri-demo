"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const game_processor_1v2_1 = require("core/game/game_processor/game_processor.1v2");
const game_processor_2v2_1 = require("core/game/game_processor/game_processor.2v2");
const game_processor_pve_classic_1 = require("core/game/game_processor/game_processor.pve_classic");
const game_processor_pve_longshen_1 = require("core/game/game_processor/game_processor.pve_longshen");
const game_processor_standard_1 = require("core/game/game_processor/game_processor.standard");
const game_rules_1 = require("core/game/game_rules");
const record_analytics_1 = require("core/game/record_analytics");
const stage_processor_1 = require("core/game/stage_processor");
const socket_server_1 = require("core/network/socket.server");
const room_server_1 = require("core/room/room.server");
const room_event_stack_1 = require("core/room/utils/room_event_stack");
const create_1 = require("core/shares/libs/logger/create");
const translation_module_1 = require("core/translations/translation_module");
const SocketIO = tslib_1.__importStar(require("socket.io"));
const http = tslib_1.__importStar(require("http"));
const lobby_1 = require("./channels/lobby");
const waiting_room_1 = require("./channels/waiting_room");
const languages_1 = require("./languages");
const server_config_1 = require("./server_config");
const room_service_1 = require("./services/room_service");
const mode = process.env.REACT_APP_DEV_MODE || "dev" /* Dev */;
const config = server_config_1.getServerConfig(mode);
const server = http.createServer();
const lobbySocket = SocketIO.listen(server, {
    origins: '*:*',
});
server.listen(config.port);
const logger = create_1.createLogger(mode);
function createDifferentModeGameProcessor(gameMode) {
    logger.debug('game mode is ' + gameMode);
    switch (gameMode) {
        case "pve" /* Pve */:
            return new game_processor_pve_longshen_1.PveLongshenGameProcessor(new stage_processor_1.StageProcessor(logger), logger);
        case "pve-classic" /* PveClassic */:
            return new game_processor_pve_classic_1.PveClassicGameProcessor(new stage_processor_1.StageProcessor(logger), logger);
        case "1v2" /* OneVersusTwo */:
            return new game_processor_1v2_1.OneVersusTwoGameProcessor(new stage_processor_1.StageProcessor(logger), logger);
        case "2v2" /* TwoVersusTwo */:
            return new game_processor_2v2_1.TwoVersusTwoGameProcessor(new stage_processor_1.StageProcessor(logger), logger);
        case "standard-game" /* Standard */:
        default:
            return new game_processor_standard_1.StandardGameProcessor(new stage_processor_1.StageProcessor(logger), logger);
    }
}
class App {
    constructor(config, logger, lobbyEventChannel) {
        this.config = config;
        this.logger = logger;
        this.lobbyEventChannel = lobbyEventChannel;
    }
    async log() {
        this.logger.info('-----', 'Sanguosha Server Launched', '-----');
        this.logger.info('-----', 'Server listening at port ', `${this.config.port}`, '-----');
        this.logger.info('-----', 'Core Version', engine_1.Sanguosha.Version, '-----');
    }
    loadLanguages(language) {
        this.translator = translation_module_1.TranslationModule.setup(language, ["zh-CN" /* ZH_CN */, languages_1.SimplifiedChinese]);
        this.logger.Translator = this.translator;
    }
    start() {
        this.loadLanguages(this.config.language);
        engine_1.Sanguosha.initialize();
        this.lobbyEventChannel.start();
        this.log();
    }
}
const roomService = new room_service_1.RoomService(lobbySocket, (roomChannel, roomId) => new socket_server_1.ServerSocket(roomChannel, roomId, logger), (roomId, gameInfo, socket, gameProcessor, analytics, players, flavor, gameMode, gameCommonRules, eventStack, waitingRoomSettings) => new room_server_1.ServerRoom(roomId, gameInfo, socket, gameProcessor, analytics, players, flavor, logger, gameMode, gameCommonRules, eventStack, waitingRoomSettings), () => new record_analytics_1.RecordAnalytics(), () => new game_rules_1.GameCommonRules(), () => new room_event_stack_1.RoomEventStacker(), (info, roomId) => ({
    roomId,
    roomInfo: info,
    closedSeats: [],
    players: [],
    hostPlayerId: info.hostPlayerId,
    isPlaying: false,
}), (socket, roomInfo) => new waiting_room_1.WaitingRoomSocket(roomService, socket, mode, logger, roomInfo), createDifferentModeGameProcessor);
new App(config, logger, new lobby_1.LobbyEventChannel(roomService, lobbySocket, config)).start();
