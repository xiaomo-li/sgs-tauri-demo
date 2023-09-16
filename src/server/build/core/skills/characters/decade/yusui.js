"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YuSui = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let YuSui = class YuSui extends skill_1.TriggerSkill {
    isRefreshAt(room, owner, stage) {
        return stage === 0 /* PhaseBegin */;
    }
    isTriggerable(event, stage) {
        return stage === "AfterAimmed" /* AfterAimmed */;
    }
    canUse(room, owner, event) {
        return (event.fromId !== owner.Id &&
            event.toId === owner.Id &&
            !owner.hasUsedSkill(this.Name) &&
            owner.Hp > 0 &&
            engine_1.Sanguosha.getCardById(event.byCardId).isBlack());
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.loseHp(event.fromId, 1);
        const from = room.getPlayerById(event.triggeredOnEvent.fromId);
        if (!from.Dead) {
            const options = [];
            from.getCardIds(0 /* HandArea */).length >
                room.getPlayerById(event.fromId).getCardIds(0 /* HandArea */).length && options.push('yusui:discard');
            from.Hp > room.getPlayerById(event.fromId).Hp && options.push('yusui:loseHp');
            if (options.length > 0) {
                const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
                    options,
                    conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose yusui options: {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from)).extract(),
                    toId: event.fromId,
                    triggeredBySkills: [this.Name],
                }, event.fromId, true);
                response.selectedOption = response.selectedOption || options[0];
                if (response.selectedOption === 'yusui:discard') {
                    const resp = await room.askForCardDrop(from.Id, from.getCardIds(0 /* HandArea */).length -
                        room.getPlayerById(event.fromId).getCardIds(0 /* HandArea */).length, [0 /* HandArea */], true, undefined, this.Name);
                    resp.droppedCards.length > 0 &&
                        (await room.dropCards(4 /* SelfDrop */, resp.droppedCards, from.Id, from.Id, this.Name));
                }
                else {
                    await room.loseHp(from.Id, from.Hp - room.getPlayerById(event.fromId).Hp);
                }
            }
        }
        return true;
    }
};
YuSui = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'yusui', description: 'yusui_description' })
], YuSui);
exports.YuSui = YuSui;
