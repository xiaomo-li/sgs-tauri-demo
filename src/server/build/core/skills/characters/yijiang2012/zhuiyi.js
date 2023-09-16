"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhuiYi = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZhuiYi = class ZhuiYi extends skill_1.TriggerSkill {
    afterDead(room) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */;
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "PlayerDied" /* PlayerDied */;
    }
    canUse(room, owner, content) {
        return content.playerId === owner.Id;
    }
    async beforeUse(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const playerDiedEvent = triggeredOnEvent;
        const players = room
            .getAlivePlayersFrom()
            .filter(player => player.Id !== playerDiedEvent.killedBy)
            .map(player => player.Id);
        if (players.length < 1) {
            return false;
        }
        const askForPlayerChoose = {
            toId: fromId,
            players,
            requiredAmount: 1,
            conversation: playerDiedEvent.killedBy
                ? translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose a target except {1} to draw 3 cards and recover 1 hp', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(playerDiedEvent.killedBy))).extract()
                : translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose a target to draw 3 cards and recover 1 hp', this.Name).extract(),
            triggeredBySkills: [this.Name],
        };
        room.notify(167 /* AskForChoosingPlayerEvent */, askForPlayerChoose, fromId);
        const resp = await room.onReceivingAsyncResponseFrom(167 /* AskForChoosingPlayerEvent */, fromId);
        if (!resp.selectedPlayers) {
            return false;
        }
        event.toIds = resp.selectedPlayers;
        return true;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        await room.drawCards(3, toIds[0], 'top', fromId, this.Name);
        await room.recover({
            toId: toIds[0],
            recoveredHp: 1,
            recoverBy: fromId,
        });
        return true;
    }
};
ZhuiYi = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'zhuiyi', description: 'zhuiyi_description' })
], ZhuiYi);
exports.ZhuiYi = ZhuiYi;
