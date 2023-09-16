"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XiangLe = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let XiangLe = class XiangLe extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterAimmed" /* AfterAimmed */;
    }
    canUse(room, owner, content) {
        return (content.toId === owner.Id &&
            content.byCardId !== undefined &&
            engine_1.Sanguosha.getCardById(content.byCardId).GeneralName === 'slash');
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const triggeredOnEvent = skillUseEvent.triggeredOnEvent;
        const liushanId = skillUseEvent.fromId;
        const liushan = room.getPlayerById(liushanId);
        const fromId = triggeredOnEvent.fromId;
        const from = room.getPlayerById(fromId);
        const response = await room.askForCardDrop(fromId, 1, [0 /* HandArea */], false, from
            .getCardIds(0 /* HandArea */)
            .filter(cardId => engine_1.Sanguosha.getCardById(cardId).BaseType !== 0 /* Basic */), this.Name, translation_json_tool_1.TranslationPack.translationJsonPatcher('xiangle: please drop 1 basic card else this Slash will be of no effect to {0}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(liushan)).extract());
        if (response.droppedCards.length === 0) {
            triggeredOnEvent.nullifiedTargets.push(liushanId);
        }
        else {
            await room.dropCards(4 /* SelfDrop */, response.droppedCards, fromId, fromId, this.Name);
        }
        return true;
    }
};
XiangLe = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'xiangle', description: 'xiangle_description' })
], XiangLe);
exports.XiangLe = XiangLe;
