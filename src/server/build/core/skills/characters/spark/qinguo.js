"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QinGuoRecorder = exports.QinGuoRecover = exports.QinGuo = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let QinGuo = class QinGuo extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "CardUseFinishedEffect" /* CardUseFinishedEffect */;
    }
    canUse(room, owner, content) {
        return (content.fromId === owner.Id &&
            room.CurrentPlayer === owner &&
            engine_1.Sanguosha.getCardById(content.cardId).is(1 /* Equip */));
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, targetId) {
        return room.canAttack(room.getPlayerById(owner), room.getPlayerById(targetId));
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to use a virtual slash?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        if (!toIds) {
            return false;
        }
        await room.useCard({
            fromId,
            targetGroup: [toIds],
            cardId: card_1.VirtualCard.create({ cardName: 'slash', bySkill: this.Name }).Id,
            extraUse: true,
        });
        return true;
    }
};
QinGuo = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'qinguo', description: 'qinguo_description' })
], QinGuo);
exports.QinGuo = QinGuo;
let QinGuoRecover = class QinGuoRecover extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, content) {
        return (content.infos.find(info => (info.toId === owner.Id && info.toArea === 1 /* EquipArea */) ||
            (info.fromId === owner.Id &&
                info.movingCards.find(card => card.fromArea === 1 /* EquipArea */) !== undefined)) !== undefined &&
            owner.Hp === owner.getCardIds(1 /* EquipArea */).length &&
            event_packer_1.EventPacker.getMiddleware(this.GeneralName, content) !== undefined &&
            event_packer_1.EventPacker.getMiddleware(this.GeneralName, content) !==
                owner.getCardIds(1 /* EquipArea */).length);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.recover({
            toId: event.fromId,
            recoveredHp: 1,
            recoverBy: event.fromId,
        });
        return true;
    }
};
QinGuoRecover = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: QinGuo.Name, description: QinGuo.Description })
], QinGuoRecover);
exports.QinGuoRecover = QinGuoRecover;
let QinGuoRecorder = class QinGuoRecorder extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "BeforeCardMoving" /* BeforeCardMoving */;
    }
    canUse(room, owner, content) {
        return (content.infos.find(info => (info.toId === owner.Id && info.toArea === 1 /* EquipArea */) ||
            (info.fromId === owner.Id &&
                info.movingCards.find(card => card.fromArea === 1 /* EquipArea */) !== undefined)) !== undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const moveCardEvent = event.triggeredOnEvent;
        event_packer_1.EventPacker.addMiddleware({ tag: this.GeneralName, data: room.getPlayerById(event.fromId).getCardIds(1 /* EquipArea */).length }, moveCardEvent);
        return true;
    }
};
QinGuoRecorder = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CommonSkill({ name: QinGuoRecover.Name, description: QinGuoRecover.Description })
], QinGuoRecorder);
exports.QinGuoRecorder = QinGuoRecorder;
