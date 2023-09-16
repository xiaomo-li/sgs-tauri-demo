"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShuiMeng = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ShuiMeng = class ShuiMeng extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            content.toStage === 15 /* PlayCardStageEnd */ &&
            owner.getCardIds(0 /* HandArea */).length > 0);
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return room.canPindian(owner, target);
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose a target to pindian?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        if (!event.toIds) {
            return false;
        }
        const pindianEvent = await room.pindian(fromId, event.toIds, this.Name);
        if (pindianEvent.pindianRecord[0].winner === fromId) {
            const from = room.getPlayerById(fromId);
            const virtualWuZhong = card_1.VirtualCard.create({ cardName: 'wuzhongshengyou', bySkill: this.Name }).Id;
            room.canUseCardTo(virtualWuZhong, from, from) &&
                (await room.useCard({
                    fromId,
                    cardId: virtualWuZhong,
                }));
        }
        else {
            const virtualGuoHe = card_1.VirtualCard.create({ cardName: 'guohechaiqiao', bySkill: this.Name }).Id;
            room.getPlayerById(event.toIds[0]).canUseCardTo(room, virtualGuoHe, fromId) &&
                (await room.useCard({
                    fromId: event.toIds[0],
                    targetGroup: [[fromId]],
                    cardId: virtualGuoHe,
                }));
        }
        return true;
    }
};
ShuiMeng = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'shuimeng', description: 'shuimeng_description' })
], ShuiMeng);
exports.ShuiMeng = ShuiMeng;
