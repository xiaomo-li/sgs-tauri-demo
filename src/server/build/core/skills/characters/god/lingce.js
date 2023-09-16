"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LingCe = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const dinghan_1 = require("./dinghan");
let LingCe = class LingCe extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "CardUsing" /* CardUsing */;
    }
    canUse(room, owner, content) {
        const card = engine_1.Sanguosha.getCardById(content.cardId);
        return (!card.isVirtualCard() &&
            (card.isWisdomCard() ||
                card.Name === 'qizhengxiangsheng' ||
                (owner.getFlag(dinghan_1.DingHan.Name) && owner.getFlag(dinghan_1.DingHan.Name).includes(card.Name))));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.drawCards(1, event.fromId, 'top', event.fromId, this.Name);
        return true;
    }
};
LingCe = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'lingce', description: 'lingce_description' })
], LingCe);
exports.LingCe = LingCe;
