"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiJunShadow = exports.JiJun = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const aim_group_1 = require("core/shares/libs/utils/aim_group");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let JiJun = class JiJun extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterAimmed" /* AfterAimmed */;
    }
    canUse(room, owner, content) {
        const card = engine_1.Sanguosha.getCardById(content.byCardId);
        return (content.isFirstTarget &&
            content.fromId === owner.Id &&
            (card.is(2 /* Weapon */) || !card.is(1 /* Equip */)) &&
            aim_group_1.AimGroupUtil.getAllTargets(content.allTargets).includes(owner.Id));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        await room.judge(fromId, undefined, this.Name);
        return true;
    }
};
JiJun = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'jijun', description: 'jijun_description' })
], JiJun);
exports.JiJun = JiJun;
let JiJunShadow = class JiJunShadow extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, content) {
        return (content.infos.find(info => {
            var _a;
            return info.proposer === owner.Id &&
                info.movedByReason === "JudgeProcess" /* JudgeProcess */ &&
                info.toArea === 4 /* DropStack */ &&
                ((_a = info.triggeredBySkills) === null || _a === void 0 ? void 0 : _a.includes(this.GeneralName)) &&
                info.movingCards.find(card => room.isCardInDropStack(card.card));
        }) !== undefined);
    }
    getSkillLog(room, owner, event) {
        var _a;
        const judgeCardIds = [];
        for (const info of event.infos) {
            if (info.proposer === owner.Id &&
                info.movedByReason === "JudgeProcess" /* JudgeProcess */ &&
                info.toArea === 4 /* DropStack */ &&
                ((_a = info.triggeredBySkills) === null || _a === void 0 ? void 0 : _a.includes(this.GeneralName))) {
                judgeCardIds.push(...info.movingCards.filter(card => room.isCardInDropStack(card.card)).map(card => card.card));
            }
        }
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to put {1} on your general as ‘Jun’?', this.GeneralName, translation_json_tool_1.TranslationPack.patchCardInTranslation(...judgeCardIds)).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        var _a;
        const { fromId } = event;
        const judgeCardIds = [];
        for (const info of event.triggeredOnEvent.infos) {
            if (info.proposer === fromId &&
                info.movedByReason === "JudgeProcess" /* JudgeProcess */ &&
                info.toArea === 4 /* DropStack */ &&
                ((_a = info.triggeredBySkills) === null || _a === void 0 ? void 0 : _a.includes(this.GeneralName))) {
                judgeCardIds.push(...info.movingCards.filter(card => room.isCardInDropStack(card.card)).map(card => card.card));
            }
        }
        await room.moveCards({
            movingCards: judgeCardIds.map(card => ({ card, fromArea: 4 /* DropStack */ })),
            toId: fromId,
            toArea: 3 /* OutsideArea */,
            moveReason: 2 /* ActiveMove */,
            toOutsideArea: this.GeneralName,
            isOutsideAreaInPublic: true,
            proposer: fromId,
            movedByReason: this.GeneralName,
        });
        return true;
    }
};
JiJunShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: JiJun.Name, description: JiJun.Description })
], JiJunShadow);
exports.JiJunShadow = JiJunShadow;
