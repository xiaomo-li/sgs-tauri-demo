"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QiCaiBlock = exports.QiCai = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const game_props_1 = require("core/game/game_props");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let QiCai = class QiCai extends skill_1.RulesBreakerSkill {
    audioIndex() {
        return 0;
    }
    breakCardUsableDistance(cardId) {
        let match = false;
        if (cardId instanceof card_matcher_1.CardMatcher) {
            match = cardId.match(new card_matcher_1.CardMatcher({ type: [7 /* Trick */] }));
        }
        else {
            const card = engine_1.Sanguosha.getCardById(cardId);
            match = card.is(7 /* Trick */);
        }
        if (match) {
            return game_props_1.INFINITE_DISTANCE;
        }
        else {
            return 0;
        }
    }
};
QiCai = tslib_1.__decorate([
    skill_1.CompulsorySkill({ name: 'qicai', description: 'qicai_description' })
], QiCai);
exports.QiCai = QiCai;
let QiCaiBlock = class QiCaiBlock extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "BeforeCardMoving" /* BeforeCardMoving */;
    }
    canUse(room, owner, content) {
        return (content.infos.find(info => info.fromId === owner.Id &&
            info.moveReason === 5 /* PassiveDrop */ &&
            info.proposer !== owner.Id &&
            info.movingCards.find(cardInfo => cardInfo.fromArea === 1 /* EquipArea */ &&
                (engine_1.Sanguosha.getCardById(cardInfo.card).is(3 /* Shield */) ||
                    engine_1.Sanguosha.getCardById(cardInfo.card).is(6 /* Precious */))) !== undefined) !== undefined);
    }
    async onTrigger(room, event) {
        event.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} triggered skill {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId)), this.Name).extract();
        return true;
    }
    async onEffect(room, event) {
        const moveCardEvent = event.triggeredOnEvent;
        for (const info of moveCardEvent.infos) {
            info.movingCards = info.movingCards.filter(cardInfo => !(cardInfo.fromArea === 1 /* EquipArea */ &&
                (engine_1.Sanguosha.getCardById(cardInfo.card).is(3 /* Shield */) ||
                    engine_1.Sanguosha.getCardById(cardInfo.card).is(6 /* Precious */))));
        }
        moveCardEvent.infos = moveCardEvent.infos.filter(info => info.movingCards.length > 0);
        moveCardEvent.infos.length === 0 && event_packer_1.EventPacker.terminate(moveCardEvent);
        return true;
    }
};
QiCaiBlock = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CompulsorySkill({ name: QiCai.Name, description: QiCai.Description })
], QiCaiBlock);
exports.QiCaiBlock = QiCaiBlock;
