"use strict";
var GuanChao_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuanChaoShadow = exports.GuanChao = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let GuanChao = GuanChao_1 = class GuanChao extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return content.playerId === owner.Id && content.toStage === 13 /* PlayCardStageStart */;
    }
    async beforeUse(room, event) {
        const { fromId } = event;
        const options = ['guanchao:increase', 'guanchao:decrease'];
        const { selectedOption } = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
            options,
            toId: fromId,
            conversation: 'guanchao: please choose one option',
            triggeredBySkills: [this.Name],
        }, fromId);
        if (selectedOption) {
            const chosen = selectedOption === options[0];
            room.setFlag(fromId, chosen ? GuanChao_1.GuanChaoIncrease : GuanChao_1.GuanChaoDecrease, chosen ? 0 : 14, chosen ? 'guanchao increase' : 'guanchao decrease');
            return true;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect() {
        return true;
    }
};
GuanChao.GuanChaoIncrease = 'guanchao_increase';
GuanChao.GuanChaoDecrease = 'guanchao_decrease';
GuanChao = GuanChao_1 = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'guanchao', description: 'guanchao_description' })
], GuanChao);
exports.GuanChao = GuanChao;
let GuanChaoShadow = class GuanChaoShadow extends skill_1.TriggerSkill {
    constructor() {
        super(...arguments);
        this.GuanChaoFirst = 'guanchao_first';
    }
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 4 /* PlayCardStage */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill(room, event, stage) {
        return stage !== "CardUsing" /* CardUsing */;
    }
    isTriggerable(event, stage) {
        return (stage === "BeforeCardUseEffect" /* BeforeCardUseEffect */ ||
            stage === "CardUsing" /* CardUsing */ ||
            stage === "PhaseChanged" /* PhaseChanged */);
    }
    canUse(room, owner, content, stage) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = content;
            let canUse = cardUseEvent.fromId === owner.Id &&
                !(stage === "CardUsing" /* CardUsing */ && owner.getFlag(this.GuanChaoFirst));
            if (canUse) {
                const increase = owner.getFlag(GuanChao.GuanChaoIncrease);
                const decrease = owner.getFlag(GuanChao.GuanChaoDecrease);
                canUse = increase !== undefined || decrease !== undefined;
                if (canUse) {
                    owner.setFlag(this.Name, stage);
                }
            }
            return canUse;
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = content;
            return phaseChangeEvent.fromPlayer === owner.Id && phaseChangeEvent.from === 4 /* PlayCardStage */;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const unknownEvent = event.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 124 /* CardUseEvent */) {
            const stage = room.getFlag(fromId, this.Name);
            if (stage === "BeforeCardUseEffect" /* BeforeCardUseEffect */) {
                const cardNumber = engine_1.Sanguosha.getCardById(unknownEvent.cardId).CardNumber;
                if (cardNumber === 0) {
                    room.removeFlag(fromId, GuanChao.GuanChaoIncrease);
                    room.removeFlag(fromId, GuanChao.GuanChaoDecrease);
                    return true;
                }
                const increase = room.getFlag(fromId, GuanChao.GuanChaoIncrease);
                const from = room.getPlayerById(fromId);
                if (increase !== undefined) {
                    if (cardNumber > increase) {
                        if (increase === 0) {
                            from.setFlag(this.GuanChaoFirst, true);
                        }
                        else {
                            from.removeFlag(this.GuanChaoFirst);
                        }
                        room.setFlag(fromId, GuanChao.GuanChaoIncrease, cardNumber, translation_json_tool_1.TranslationPack.translationJsonPatcher('guanchao increase: {0}', cardNumber).toString());
                    }
                    else {
                        room.removeFlag(fromId, GuanChao.GuanChaoIncrease);
                    }
                }
                const decrease = room.getFlag(fromId, GuanChao.GuanChaoDecrease);
                if (decrease !== undefined) {
                    if (cardNumber < decrease) {
                        if (decrease === 14) {
                            from.setFlag(this.GuanChaoFirst, true);
                        }
                        else {
                            from.removeFlag(this.GuanChaoFirst);
                        }
                        room.setFlag(fromId, GuanChao.GuanChaoDecrease, cardNumber, translation_json_tool_1.TranslationPack.translationJsonPatcher('guanchao decrease: {0}', cardNumber).toString());
                    }
                    else {
                        room.removeFlag(fromId, GuanChao.GuanChaoDecrease);
                    }
                }
            }
            else {
                room.getFlag(fromId, GuanChao.GuanChaoIncrease) !== undefined &&
                    (await room.drawCards(1, event.fromId, 'top', event.fromId, this.GeneralName));
                room.getFlag(fromId, GuanChao.GuanChaoDecrease) !== undefined &&
                    (await room.drawCards(1, event.fromId, 'top', event.fromId, this.GeneralName));
            }
        }
        else {
            room.removeFlag(fromId, GuanChao.GuanChaoIncrease);
            room.removeFlag(fromId, GuanChao.GuanChaoDecrease);
            room.getPlayerById(fromId).removeFlag(this.GuanChaoFirst);
        }
        return true;
    }
};
GuanChaoShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: GuanChao.Name, description: GuanChao.Description })
], GuanChaoShadow);
exports.GuanChaoShadow = GuanChaoShadow;
