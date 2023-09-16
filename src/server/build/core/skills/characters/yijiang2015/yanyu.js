"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YanYuShadow = exports.YanYu = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let YanYu = class YanYu extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return owner.getCardIds(0 /* HandArea */).length > 0;
    }
    numberOfTargets() {
        return 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableTarget() {
        return false;
    }
    isAvailableCard(owner, room, cardId) {
        return engine_1.Sanguosha.getCardById(cardId).GeneralName === 'slash';
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, cardIds } = event;
        if (!cardIds) {
            return false;
        }
        await room.reforge(cardIds[0], room.getPlayerById(fromId));
        return true;
    }
};
YanYu = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'yanyu', description: 'yanyu_description' })
], YanYu);
exports.YanYu = YanYu;
let YanYuShadow = class YanYuShadow extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, event) {
        return (event.playerId === owner.Id &&
            event.toStage === 15 /* PlayCardStageEnd */ &&
            room.getAlivePlayersFrom().find(player => player.Gender === 0 /* Male */) !== undefined &&
            room.Analytics.getRecordEvents(event => event_packer_1.EventPacker.getIdentifier(event) === 128 /* MoveCardEvent */ &&
                event.infos.find(info => info.fromId === owner.Id &&
                    info.moveReason === 10 /* Reforge */ &&
                    info.movingCards.find(card => engine_1.Sanguosha.getCardById(card.card).GeneralName === 'slash')) !== undefined, owner.Id, 'phase', undefined, 1).length > 0);
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return room.getPlayerById(target).Gender === 0 /* Male */;
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose a male character to draw card(s)?', this.GeneralName).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        const drawNum = room.Analytics.getRecordEvents(moveCardEvent => event_packer_1.EventPacker.getIdentifier(moveCardEvent) === 128 /* MoveCardEvent */ &&
            moveCardEvent.infos.find(info => info.fromId === event.fromId &&
                info.moveReason === 10 /* Reforge */ &&
                info.movingCards.find(card => engine_1.Sanguosha.getCardById(card.card).GeneralName === 'slash')) !== undefined, event.fromId, 'phase').reduce((sum, moveCardEvent) => {
            if (moveCardEvent.infos.length === 1) {
                sum += moveCardEvent.infos[0].movingCards.filter(card => engine_1.Sanguosha.getCardById(card.card).GeneralName === 'slash').length;
            }
            else if (moveCardEvent.infos.length > 1) {
                const infos = moveCardEvent.infos.filter(info => info.fromId === event.fromId &&
                    info.moveReason === 10 /* Reforge */ &&
                    info.movingCards.find(card => engine_1.Sanguosha.getCardById(card.card).GeneralName === 'slash'));
                for (const info of infos) {
                    sum += info.movingCards.filter(card => engine_1.Sanguosha.getCardById(card.card).GeneralName === 'slash').length;
                }
            }
            return sum;
        }, 0);
        await room.drawCards(Math.min(drawNum, 3), event.toIds[0], 'top', event.fromId, this.GeneralName);
        return true;
    }
};
YanYuShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: YanYu.Name, description: YanYu.Description })
], YanYuShadow);
exports.YanYuShadow = YanYuShadow;
