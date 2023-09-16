"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartPlayer = exports.ServerPlayer = void 0;
const smart_ai_1 = require("core/ai/smart_ai");
const trust_ai_1 = require("core/ai/trust_ai");
const player_1 = require("core/player/player");
class ServerPlayer extends player_1.Player {
    constructor(playerId, playerName, playerPosition, playerCharacterId, playerCards, ai = trust_ai_1.TrustAI.Instance) {
        super(playerCards, playerCharacterId, ai);
        this.playerId = playerId;
        this.playerName = playerName;
        this.playerPosition = playerPosition;
        this.status = "online" /* Online */;
    }
}
exports.ServerPlayer = ServerPlayer;
class SmartPlayer extends ServerPlayer {
    constructor(playerPosition, gameMode) {
        super(`SmartAI-${playerPosition}:${Date.now()}`, 'AI', playerPosition, undefined, undefined, smart_ai_1.SmartAI.Instance);
        this.playerPosition = playerPosition;
        this.delegateOnSmartAI();
    }
}
exports.SmartPlayer = SmartPlayer;
