"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XiaoJi = void 0;
const tslib_1 = require("tslib");
const xiaoji_1 = require("core/ai/skills/characters/standard/xiaoji");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
let XiaoJi = class XiaoJi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, content) {
        return (content.infos.find(info => owner.Id === info.fromId &&
            info.movingCards.filter(card => card.fromArea === 1 /* EquipArea */).length > 0) !== undefined);
    }
    triggerableTimes(event) {
        return event.infos.reduce((sum, info) => sum +
            info.movingCards.filter(card => !engine_1.Sanguosha.isVirtualCardId(card.card) &&
                engine_1.Sanguosha.getCardById(card.card).is(1 /* Equip */) &&
                card.fromArea === 1 /* EquipArea */).length, 0);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        await room.drawCards(2, skillUseEvent.fromId, 'top', undefined, this.Name);
        return true;
    }
};
XiaoJi = tslib_1.__decorate([
    skill_1.AI(xiaoji_1.XiaoJiSkillTrigger),
    skill_1.CommonSkill({ name: 'xiaoji', description: 'xiaoji_description' })
], XiaoJi);
exports.XiaoJi = XiaoJi;
