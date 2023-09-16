"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QiZhou = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const qixi_1 = require("../standard/qixi");
const yingzi_1 = require("../standard/yingzi");
const std_xuanfeng_1 = require("../yijiang2011/std_xuanfeng");
let QiZhou = class QiZhou extends skill_1.TriggerSkill {
    get RelatedSkills() {
        return [yingzi_1.YingZi.Name, qixi_1.QiXi.Name, std_xuanfeng_1.StdXuanFeng.Name];
    }
    audioIndex() {
        return 0;
    }
    getPriority() {
        return 0 /* High */;
    }
    async whenLosingSkill(room, player) {
        if (!player.getFlag(this.Name)) {
            return;
        }
        for (const skillName of this.RelatedSkills) {
            player.getFlag(this.Name).includes(skillName) && (await room.loseSkill(player.Id, skillName));
        }
        player.removeFlag(this.Name);
    }
    async whenNullifying(room, player) {
        if (!player.getFlag(this.Name)) {
            return;
        }
        for (const skillName of this.RelatedSkills) {
            player.getFlag(this.Name).includes(skillName) && (await room.loseSkill(player.Id, skillName));
        }
        player.removeFlag(this.Name);
    }
    async handleQiZhouSkills(room, player) {
        const suitsNum = player.getCardIds(1 /* EquipArea */).reduce((suits, cardId) => {
            const suit = engine_1.Sanguosha.getCardById(cardId).Suit;
            suits.includes(suit) || suits.push(suit);
            return suits;
        }, []).length;
        const flagValue = Math.min(3, suitsNum);
        const originalSkillNames = player.getFlag(this.Name) || [];
        for (let i = 0; i < this.RelatedSkills.length; i++) {
            const skillName = this.RelatedSkills[i];
            if (i < flagValue && !player.hasSkill(skillName)) {
                await room.obtainSkill(player.Id, skillName, true);
                originalSkillNames.push(skillName);
            }
            else if (i >= flagValue && originalSkillNames.includes(skillName)) {
                await room.loseSkill(player.Id, skillName, true);
                const index = originalSkillNames.findIndex(name => name === skillName);
                originalSkillNames.splice(index, 1);
            }
        }
        if (originalSkillNames.length > 0) {
            player.setFlag(this.Name, originalSkillNames);
        }
        else {
            player.removeFlag(this.Name);
        }
    }
    async whenObtainingSkill(room, player) {
        await this.handleQiZhouSkills(room, player);
    }
    async whenEffecting(room, player) {
        await this.handleQiZhouSkills(room, player);
    }
    isTriggerable(event, stage) {
        return stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, content) {
        if (!content.infos.find(info => (info.fromId === owner.Id &&
            info.movingCards.find(cardInfo => cardInfo.fromArea === 1 /* EquipArea */)) ||
            (info.toId === owner.Id && info.toArea === 1 /* EquipArea */))) {
            return false;
        }
        const suitsNum = owner.getCardIds(1 /* EquipArea */).reduce((suits, cardId) => {
            const suit = engine_1.Sanguosha.getCardById(cardId).Suit;
            suits.includes(suit) || suits.push(suit);
            return suits;
        }, []).length;
        const currentSkillNames = suitsNum > 0 ? this.RelatedSkills.slice(0, Math.min(suitsNum, 3)) : [];
        return !!this.RelatedSkills.find(skillName => {
            var _a;
            return (currentSkillNames.includes(skillName) && !owner.hasSkill(skillName)) ||
                (owner.hasSkill(skillName) &&
                    ((_a = owner.getFlag(this.Name)) === null || _a === void 0 ? void 0 : _a.includes(skillName)) &&
                    !currentSkillNames.includes(skillName));
        });
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await this.handleQiZhouSkills(room, room.getPlayerById(event.fromId));
        return true;
    }
};
QiZhou = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'qizhou', description: 'qizhou_description' })
], QiZhou);
exports.QiZhou = QiZhou;
