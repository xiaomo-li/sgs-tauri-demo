"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LvLiEX = exports.LvLiII = exports.LvLiI = exports.LvLi = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let LvLi = class LvLi extends skill_1.TriggerSkill {
    constructor() {
        super(...arguments);
        this.LvLiNames = ['lvli', 'lvli_I', 'lvli_II', 'lvli_EX'];
    }
    isRefreshAt(room, owner, stage) {
        return stage === 0 /* PhaseBegin */;
    }
    isTriggerable(event, stage) {
        return stage === "AfterDamageEffect" /* AfterDamageEffect */;
    }
    canUse(room, owner, content) {
        return (content.fromId === owner.Id &&
            !this.LvLiNames.find(name => owner.hasUsedSkill(name)) &&
            (owner.getCardIds(0 /* HandArea */).length < owner.Hp ||
                (owner.getCardIds(0 /* HandArea */).length > owner.Hp && owner.LostHp > 0)));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const diff = room.getPlayerById(event.fromId).getCardIds(0 /* HandArea */).length -
            room.getPlayerById(event.fromId).Hp;
        if (diff > 0) {
            await room.recover({
                toId: event.fromId,
                recoveredHp: diff,
                recoverBy: event.fromId,
                triggeredBySkills: [this.Name],
            });
        }
        else {
            await room.drawCards(-diff, event.fromId, 'top', event.fromId, this.Name);
        }
        return true;
    }
};
LvLi = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'lvli', description: 'lvli_description' })
], LvLi);
exports.LvLi = LvLi;
let LvLiI = class LvLiI extends LvLi {
    get GeneralName() {
        return LvLi.Name;
    }
    canUse(room, owner, content) {
        return (content.fromId === owner.Id &&
            (room.CurrentPlayer === owner
                ? this.LvLiNames.reduce((sum, name) => sum + owner.hasUsedSkillTimes(name), 0) < 2
                : !this.LvLiNames.find(name => owner.hasUsedSkill(name))) &&
            (owner.getCardIds(0 /* HandArea */).length < owner.Hp ||
                (owner.getCardIds(0 /* HandArea */).length > owner.Hp && owner.LostHp > 0)));
    }
};
LvLiI = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'lvli_I', description: 'lvli_I_description' })
], LvLiI);
exports.LvLiI = LvLiI;
let LvLiII = class LvLiII extends LvLi {
    get GeneralName() {
        return LvLi.Name;
    }
    isTriggerable(event, stage) {
        return stage === "AfterDamageEffect" /* AfterDamageEffect */ || stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    canUse(room, owner, content, stage) {
        return (((stage === "AfterDamageEffect" /* AfterDamageEffect */ && content.fromId === owner.Id) ||
            (stage === "AfterDamagedEffect" /* AfterDamagedEffect */ && content.toId === owner.Id)) &&
            !this.LvLiNames.find(name => owner.hasUsedSkill(name)) &&
            (owner.getCardIds(0 /* HandArea */).length < owner.Hp ||
                (owner.getCardIds(0 /* HandArea */).length > owner.Hp && owner.LostHp > 0)));
    }
};
LvLiII = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'lvli_II', description: 'lvli_II_description' })
], LvLiII);
exports.LvLiII = LvLiII;
let LvLiEX = class LvLiEX extends LvLi {
    get GeneralName() {
        return LvLi.Name;
    }
    isTriggerable(event, stage) {
        return stage === "AfterDamageEffect" /* AfterDamageEffect */ || stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    canUse(room, owner, content, stage) {
        return (((stage === "AfterDamageEffect" /* AfterDamageEffect */ && content.fromId === owner.Id) ||
            (stage === "AfterDamagedEffect" /* AfterDamagedEffect */ && content.toId === owner.Id)) &&
            (room.CurrentPlayer === owner
                ? this.LvLiNames.reduce((sum, name) => sum + owner.hasUsedSkillTimes(name), 0) < 2
                : !this.LvLiNames.find(name => owner.hasUsedSkill(name))) &&
            (owner.getCardIds(0 /* HandArea */).length < owner.Hp ||
                (owner.getCardIds(0 /* HandArea */).length > owner.Hp && owner.LostHp > 0)));
    }
};
LvLiEX = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'lvli_EX', description: 'lvli_EX_description' })
], LvLiEX);
exports.LvLiEX = LvLiEX;
