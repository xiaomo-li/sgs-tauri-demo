"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DingHan = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const aim_group_1 = require("core/shares/libs/utils/aim_group");
const qizhengxiangsheng_1 = require("core/skills/cards/character_skills/qizhengxiangsheng");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let DingHan = class DingHan extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "OnAimmed" /* OnAimmed */ || stage === "AfterPhaseChanged" /* AfterPhaseChanged */;
    }
    isAutoTrigger(room, owner, event) {
        return event_packer_1.EventPacker.getIdentifier(event) === 131 /* AimEvent */;
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 131 /* AimEvent */) {
            const aimEvent = content;
            const card = engine_1.Sanguosha.getCardById(aimEvent.byCardId);
            return (aimEvent.toId === owner.Id &&
                card.BaseType === 7 /* Trick */ &&
                (!room.getFlag(owner.Id, this.Name) ||
                    !room.getFlag(owner.Id, this.Name).includes(card.Name)));
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = content;
            return phaseChangeEvent.to === 0 /* PhaseBegin */ && phaseChangeEvent.toPlayer === owner.Id;
        }
        return false;
    }
    async onTrigger(room, skillUseEvent) {
        skillUseEvent.messages = skillUseEvent.messages || [];
        const unknownEvent = skillUseEvent.triggeredOnEvent;
        if (event_packer_1.EventPacker.getIdentifier(unknownEvent) === 131 /* AimEvent */) {
            const aimEvent = unknownEvent;
            skillUseEvent.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used skill {1}, which has been removed from target list of {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(aimEvent.toId)), this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(aimEvent.byCardId)).extract();
        }
        return true;
    }
    async onEffect(room, event) {
        var _a;
        const { fromId } = event;
        const unknownEvent = event.triggeredOnEvent;
        if (event_packer_1.EventPacker.getIdentifier(unknownEvent) === 131 /* AimEvent */) {
            const aimEvent = unknownEvent;
            aim_group_1.AimGroupUtil.cancelTarget(aimEvent, fromId);
            const existingCardNames = (_a = room.getFlag(fromId, this.Name)) !== null && _a !== void 0 ? _a : [];
            room.setFlag(fromId, this.Name, [...existingCardNames, engine_1.Sanguosha.getCardById(aimEvent.byCardId).Name], this.Name);
        }
        else {
            const askForChoosingOptionsEvent = {
                toId: fromId,
                options: [...engine_1.Sanguosha.getCardNameByType(types => types.includes(7 /* Trick */)), qizhengxiangsheng_1.QiZhengXiangShengSkill.Name],
                askedBy: fromId,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose a dinghan option', this.Name).extract(),
            };
            const { selectedOption } = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, askForChoosingOptionsEvent, fromId);
            if (!selectedOption) {
                return false;
            }
            const existingCardNames = room.getFlag(fromId, this.Name) || [];
            if (existingCardNames.includes(selectedOption)) {
                room.setFlag(fromId, this.Name, existingCardNames.filter(cardName => cardName !== selectedOption), this.Name);
            }
            else {
                room.setFlag(fromId, this.Name, [...existingCardNames, selectedOption], this.Name);
            }
        }
        return true;
    }
};
DingHan = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'dinghan', description: 'dinghan_description' })
], DingHan);
exports.DingHan = DingHan;
