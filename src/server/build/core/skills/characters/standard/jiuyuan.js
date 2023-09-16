"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiuYuan = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let JiuYuan = class JiuYuan extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    canUse(room, owner, content) {
        const user = room.getPlayerById(content.fromId);
        return (content.byCardId !== undefined &&
            engine_1.Sanguosha.getCardById(content.byCardId).GeneralName === 'peach' &&
            content.toId === content.fromId &&
            user.Hp > owner.Hp &&
            user.Nationality === 2 /* Wu */);
    }
    isTriggerable(event, stage) {
        return stage === "OnAim" /* OnAim */;
    }
    async onTrigger(room, event) {
        return true;
    }
    async onEffect(room, event) {
        const { triggeredOnEvent } = event;
        const aimEvent = triggeredOnEvent;
        const askForInvokeSkill = {
            toId: aimEvent.fromId,
            options: ['yes', 'no'],
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('do you wanna transfer the card {0} target to {1}', translation_json_tool_1.TranslationPack.patchCardInTranslation(aimEvent.byCardId), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId))).extract(),
            triggeredBySkills: [this.Name],
        };
        room.notify(168 /* AskForChoosingOptionsEvent */, askForInvokeSkill, aimEvent.fromId);
        const { selectedOption } = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, aimEvent.fromId);
        if (selectedOption === 'yes') {
            aimEvent.toId = event.fromId;
            await room.drawCards(1, aimEvent.fromId, undefined, event.fromId, this.Name);
        }
        return true;
    }
};
JiuYuan = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'jiuyuan', description: 'jiuyuan_description' }),
    skill_1.LordSkill
], JiuYuan);
exports.JiuYuan = JiuYuan;
