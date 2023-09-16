"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhiJi = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZhiJi = class ZhiJi extends skill_1.TriggerSkill {
    get RelatedSkills() {
        return ['guanxing'];
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ && event.toStage === 3 /* PrepareStageStart */;
    }
    canUse(room, owner, content) {
        return content.playerId === owner.Id && room.enableToAwaken(this.Name, owner);
    }
    async onTrigger(room, skillUseEvent) {
        skillUseEvent.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} activated awakening skill {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(skillUseEvent.fromId)), this.Name).extract();
        return true;
    }
    async onEffect(room, skillEffectEvent) {
        const { fromId } = skillEffectEvent;
        const from = room.getPlayerById(fromId);
        await room.changeMaxHp(fromId, -1);
        if (from.Hp >= from.MaxHp) {
            await room.drawCards(2, fromId, undefined, fromId, this.Name);
        }
        else {
            const askForChoose = {
                toId: fromId,
                options: ['zhiji:drawcards', 'zhiji:recover'],
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose', this.Name).extract(),
                triggeredBySkills: [this.Name],
            };
            room.notify(168 /* AskForChoosingOptionsEvent */, event_packer_1.EventPacker.createUncancellableEvent(askForChoose), fromId);
            const { selectedOption } = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, fromId);
            if (selectedOption === undefined || selectedOption === 'zhiji:drawcards') {
                await room.drawCards(2, fromId, undefined, fromId, this.Name);
            }
            else {
                await room.recover({
                    toId: fromId,
                    recoveredHp: 1,
                    recoverBy: fromId,
                    triggeredBySkills: [this.Name],
                });
            }
        }
        await room.obtainSkill(fromId, 'guanxing', true);
        return true;
    }
};
ZhiJi = tslib_1.__decorate([
    skill_wrappers_1.AwakeningSkill({ name: 'zhiji', description: 'zhiji_description' })
], ZhiJi);
exports.ZhiJi = ZhiJi;
