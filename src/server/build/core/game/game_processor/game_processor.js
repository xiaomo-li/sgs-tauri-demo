"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameProcessor = void 0;
const precondition_1 = require("core/shares/libs/precondition/precondition");
class GameProcessor {
    tryToThrowNotStartedError() {
        precondition_1.Precondition.assert(this.room !== undefined, 'Game is not started yet');
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    async beforeGameStartPreparation() { }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    async beforeGameBeginPreparation() { }
    get CurrentPlayer() {
        this.tryToThrowNotStartedError();
        return this.room.Players[this.playerPositionIndex];
    }
    get CurrentPhasePlayer() {
        this.tryToThrowNotStartedError();
        return this.currentPhasePlayer;
    }
    get CurrentPlayerPhase() {
        this.tryToThrowNotStartedError();
        return this.currentPlayerPhase;
    }
    get CurrentPlayerStage() {
        this.tryToThrowNotStartedError();
        return this.currentPlayerStage;
    }
    get CurrentProcessingStage() {
        this.tryToThrowNotStartedError();
        return this.currentProcessingStage;
    }
    get CurrentProcessingEvent() {
        this.tryToThrowNotStartedError();
        return this.currentProcessingEvent;
    }
}
exports.GameProcessor = GameProcessor;
