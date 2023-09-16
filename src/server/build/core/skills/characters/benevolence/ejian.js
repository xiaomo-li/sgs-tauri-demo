"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EJian = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const functional_1 = require("core/shares/libs/functional");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const boming_1 = require("./boming");
let EJian = class EJian extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, event) {
        return !!event.infos.find(info => {
            var _a;
            return info.toId &&
                !(owner.getFlag(this.Name) || []).includes(info.toId) &&
                ((_a = info.triggeredBySkills) === null || _a === void 0 ? void 0 : _a.includes(boming_1.BoMing.Name));
        });
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        var _a;
        for (const info of event.triggeredOnEvent.infos) {
            if (info.toId &&
                !(room.getPlayerById(event.fromId).getFlag(this.Name) || []).includes(info.toId) &&
                ((_a = info.triggeredBySkills) === null || _a === void 0 ? void 0 : _a.includes(boming_1.BoMing.Name))) {
                const sameTypeCards = room
                    .getPlayerById(info.toId)
                    .getPlayerCards()
                    .filter(cardId => cardId !== info.movingCards[0].card &&
                    engine_1.Sanguosha.getCardById(info.movingCards[0].card).BaseType === engine_1.Sanguosha.getCardById(cardId).BaseType);
                if (sameTypeCards.length > 0) {
                    const options = ['ejian:damage', 'ejian:discard'];
                    const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
                        options,
                        conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose ejian options: {1}', this.Name, functional_1.Functional.getCardTypeRawText(engine_1.Sanguosha.getCardById(info.movingCards[0].card).BaseType)).extract(),
                        toId: info.toId,
                        triggeredBySkills: [this.Name],
                    }, info.toId);
                    response.selectedOption = response.selectedOption || options[0];
                    if (response.selectedOption === options[0]) {
                        await room.damage({
                            toId: info.toId,
                            damage: 1,
                            damageType: "normal_property" /* Normal */,
                            triggeredBySkills: [this.Name],
                        });
                    }
                    else {
                        const to = room.getPlayerById(info.toId);
                        const handCards = to.getCardIds(0 /* HandArea */);
                        const displayEvent = {
                            fromId: info.toId,
                            displayCards: handCards,
                            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} displayed cards {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(to), translation_json_tool_1.TranslationPack.patchCardInTranslation(...handCards)).extract(),
                        };
                        room.broadcast(126 /* CardDisplayEvent */, displayEvent);
                        await room.dropCards(4 /* SelfDrop */, sameTypeCards, info.toId, info.toId, this.Name);
                    }
                    const originalPlayers = room.getFlag(event.fromId, this.Name) || [];
                    originalPlayers.push(info.toId);
                    room.getPlayerById(event.fromId).setFlag(this.Name, originalPlayers);
                }
                break;
            }
        }
        return true;
    }
};
EJian = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'ejian', description: 'ejian_description' })
], EJian);
exports.EJian = EJian;
