"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QiZhengXiangShengSkill = void 0;
const tslib_1 = require("tslib");
const qizhengxiangsheng_1 = require("core/ai/skills/cards/qizhengxiangsheng");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let QiZhengXiangShengSkill = class QiZhengXiangShengSkill extends skill_1.ActiveSkill {
    canUse() {
        return true;
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter() {
        return true;
    }
    isAvailableCard() {
        return false;
    }
    isCardAvailableTarget(owner, room, target, selectedCards, selectedTargets, containerCard) {
        return target !== owner && room.getPlayerById(owner).canUseCardTo(room, containerCard, target);
    }
    isAvailableTarget(owner, room, target, selectedCards, selectedTargets, containerCard) {
        return this.isCardAvailableTarget(owner, room, target, selectedCards, selectedTargets, containerCard);
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, event) {
        const toId = precondition_1.Precondition.exists(event.toIds, 'Unknown targets in guohechaiqiao')[0];
        const fromId = precondition_1.Precondition.exists(event.fromId, 'Unknown targets in guohechaiqiao');
        const { cardId } = event;
        if (toId === fromId) {
            return true;
        }
        const askForChoosingOptionsEvent = {
            options: ['qibing', 'zhengbing'],
            toId: fromId,
            conversation: 'please choose',
        };
        const { selectedOption } = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, askForChoosingOptionsEvent, fromId, true);
        const isQiBingSelected = selectedOption === 'qibing';
        const askForCardEvent = {
            cardMatcher: new card_matcher_1.CardMatcher({
                generalName: ['slash', 'jink'],
            }).toSocketPassenger(),
            byCardId: cardId,
            cardUserId: fromId,
            conversation: fromId !== undefined
                ? translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used {1} to you, please response a {2} or {3} card', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId)), translation_json_tool_1.TranslationPack.patchCardInTranslation(cardId), 'slash', 'jink').extract()
                : translation_json_tool_1.TranslationPack.translationJsonPatcher('please response a {0} or {1} card', 'slash', 'jink').extract(),
            triggeredBySkills: event.triggeredBySkills ? [...event.triggeredBySkills, this.Name] : [this.Name],
        };
        const response = await room.askForCardResponse(Object.assign(Object.assign({}, askForCardEvent), { toId, triggeredBySkills: [this.Name] }), toId);
        const responseCard = response.cardId;
        if (responseCard) {
            const cardResponsedEvent = {
                fromId: toId,
                cardId: responseCard,
                responseToEvent: event,
                triggeredBySkills: [this.Name],
            };
            await room.responseCard(cardResponsedEvent);
            if (isQiBingSelected && engine_1.Sanguosha.getCardById(responseCard).GeneralName !== 'slash') {
                await this.doQiBingSelection(fromId, toId, room, cardId);
            }
            else if (!isQiBingSelected && engine_1.Sanguosha.getCardById(responseCard).GeneralName !== 'jink') {
                await this.doZhengBingSelection(fromId, toId, room);
            }
        }
        else {
            if (isQiBingSelected) {
                await this.doQiBingSelection(fromId, toId, room, cardId);
            }
            else {
                await this.doZhengBingSelection(fromId, toId, room);
            }
        }
        return true;
    }
    async doQiBingSelection(from, to, room, cardId) {
        const fromPlayer = room.getPlayerById(from);
        const toPlayer = room.getPlayerById(to);
        await room.damage({
            fromId: from,
            toId: to,
            damage: 1,
            damageType: "normal_property" /* Normal */,
            triggeredBySkills: [this.Name],
            cardIds: [cardId],
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('player {0} selected {1}, {2} get 1 damage hit from {0}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(fromPlayer), 'qibing', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(toPlayer)).extract(),
        });
    }
    async doZhengBingSelection(from, to, room) {
        const toPlayer = room.getPlayerById(to);
        if (toPlayer.getPlayerCards().length === 0) {
            return;
        }
        const options = {
            [1 /* EquipArea */]: toPlayer.getCardIds(1 /* EquipArea */),
            [0 /* HandArea */]: toPlayer.getCardIds(0 /* HandArea */).length,
        };
        const chooseCardEvent = {
            fromId: from,
            toId: to,
            options,
            triggeredBySkills: [this.Name],
        };
        const response = await room.askForChoosingPlayerCard(chooseCardEvent, chooseCardEvent.fromId, false, true);
        if (!response) {
            return false;
        }
        await room.moveCards({
            movingCards: [{ card: response.selectedCard, fromArea: response.fromArea }],
            fromId: chooseCardEvent.toId,
            toId: chooseCardEvent.fromId,
            moveReason: 1 /* ActivePrey */,
            toArea: 0 /* HandArea */,
            proposer: chooseCardEvent.fromId,
        });
    }
};
QiZhengXiangShengSkill = tslib_1.__decorate([
    skill_1.AI(qizhengxiangsheng_1.QiZhengXiangShengSkillTrigger),
    skill_1.CommonSkill({ name: 'qizhengxiangsheng', description: 'qizhengxiangsheng_description' })
], QiZhengXiangShengSkill);
exports.QiZhengXiangShengSkill = QiZhengXiangShengSkill;
