"use strict";
var PingJian_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PingJianLoseSkill = exports.PingJianShadow = exports.PingJian = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let PingJian = PingJian_1 = class PingJian extends skill_1.ActiveSkill {
    canUse(room, owner) {
        const skillsUsed = owner.getFlag(this.Name) || [];
        skillsUsed[0] = skillsUsed[0] || [];
        return !owner.hasUsedSkill(this.Name) && skillsUsed[0].length < PingJian_1.PingJianSkillPool[0].length;
    }
    numberOfTargets() {
        return 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableTarget() {
        return false;
    }
    isAvailableCard() {
        return false;
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        let newSkillPool = PingJian_1.PingJianSkillPool[0].slice();
        const from = room.getPlayerById(fromId);
        const skillsUsed = from.getFlag(this.Name) || [];
        skillsUsed[0] = skillsUsed[0] || [];
        if (skillsUsed.length > 0) {
            newSkillPool = newSkillPool.filter(skill => !skillsUsed[0].includes(skill));
        }
        const options = [];
        const n = newSkillPool.length;
        for (let i = 0; i < Math.min(n, 3); i++) {
            const chosenSkill = newSkillPool[Math.floor(Math.random() * newSkillPool.length)];
            options.push(chosenSkill);
            const index = newSkillPool.findIndex(skill => skill === chosenSkill);
            newSkillPool.splice(index, 1);
        }
        const askForChooseEvent = event_packer_1.EventPacker.createUncancellableEvent({
            options,
            optionPrompt: options.map(option => ({ option, sideTip: engine_1.Sanguosha.getSkillBySkillName(option).Description })),
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose pingjian options', this.Name).extract(),
            toId: fromId,
        });
        const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, askForChooseEvent, fromId);
        response.selectedOption = response.selectedOption || options[0];
        if (!from.hasSkill(response.selectedOption)) {
            await room.obtainSkill(fromId, response.selectedOption, true);
            skillsUsed[0].push(response.selectedOption);
            room.setFlag(fromId, this.Name, skillsUsed);
            from.setFlag("flag:skills_using" /* SkillsUsing */, [
                ...(from.getFlag("flag:skills_using" /* SkillsUsing */) || []),
                response.selectedOption,
            ]);
        }
        return true;
    }
};
PingJian.PingJianSkillPool = [
    [
        'rende',
        'yijue',
        'zhiheng',
        'qixi',
        'fanjian',
        'guose',
        'jieyin',
        'qingnang',
        'lijian',
        'qiangxi',
        'quhu',
        'tianyi',
        'luanji',
        'dimeng',
        'jiuchi',
        'zhijian',
        'sanyao',
        'jianyan',
        'ganlu',
        'mingce',
        'xianzhen',
        'anxu',
        'gongqi',
        'qice',
        'mieji',
        'shenxing',
        'jijie',
        'gongxin',
        'feijun',
        'tiansuan',
        'shoufu',
        'guolun',
        'duanfa',
        'limu',
        'kannan',
        'mouli',
        'chuhai',
        'mingce',
        'zhanjue',
        'wurong',
        'anguo',
        'huaiyi',
        'duliang',
        'kuangbi',
        'quji',
        'xuehen',
        'ziyuan',
        'fuman',
        'mizhao',
        'cuijian',
        'weimeng',
        'songshu',
        'boyan',
        'kuangfu',
        'fenglve',
        'yijiao',
        'songci',
        'daoshu',
        'minsi',
        'xuezhao',
        'jinglve',
        'hongyi',
        'wuyuan',
        'zhi_qiai',
        'shameng',
        'tanbei',
        'lveming',
        'mansi',
    ],
    [
        'jianxiong',
        'fankui',
        'ganglie',
        'jieming',
        'fangzhu',
        'enyuan',
        '#jiushi',
        'zhichi',
        'zhiyu',
        'chengxiang',
        'yuce',
        'wangxi',
        'guixin',
        'huji',
        'weilu',
        'huituo',
        'yaoming',
        'qingxian',
        'jilei',
        'chouce',
        'wanggui',
        'jijing',
        'rangjie',
    ],
    [
        'bifa',
        'biyue',
        'jushou',
        'piaoling',
        'miji',
        'zhiyan',
        'juece',
        'bingyi',
        'jujian',
        'zhengu',
        'zuilun',
        'youdi',
        'guixiu',
        'tianyin',
        'mou_jieyue',
        'mozhi',
    ],
];
PingJian.PingJianSkillMap = {
    zhijian: ['#zhijian'],
    mansi: ['#mansi'],
};
PingJian = PingJian_1 = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'pingjian', description: 'pingjian_description' })
], PingJian);
exports.PingJian = PingJian;
let PingJianShadow = class PingJianShadow extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */ || stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        const skillsUsed = owner.getFlag(this.GeneralName) || [];
        if (event_packer_1.EventPacker.getIdentifier(content) === 137 /* DamageEvent */) {
            const damageEvent = content;
            skillsUsed[1] = skillsUsed[1] || [];
            return damageEvent.toId === owner.Id && skillsUsed[1].length < PingJian.PingJianSkillPool[1].length;
        }
        else if (event_packer_1.EventPacker.getIdentifier(content) === 105 /* PhaseStageChangeEvent */) {
            const phaseStageChangeEvent = content;
            skillsUsed[2] = skillsUsed[2] || [];
            return (phaseStageChangeEvent.playerId === owner.Id &&
                phaseStageChangeEvent.toStage === 19 /* FinishStageStart */ &&
                skillsUsed[2].length < PingJian.PingJianSkillPool[2].length);
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const unknownEvent = triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        let realEvent = unknownEvent;
        if (identifier === 105 /* PhaseStageChangeEvent */) {
            realEvent = unknownEvent;
        }
        const index = identifier === 137 /* DamageEvent */ ? 1 : 2;
        let newSkillPool = PingJian.PingJianSkillPool[index].slice();
        const from = room.getPlayerById(fromId);
        const skillsUsed = from.getFlag(this.GeneralName) || [];
        skillsUsed[index] = skillsUsed[index] || [];
        if (skillsUsed.length > 0) {
            newSkillPool = newSkillPool.filter(skill => !skillsUsed[index].includes(skill));
        }
        const options = [];
        const poolLength = newSkillPool.length;
        for (let i = 0; i < Math.min(poolLength, 3); i++) {
            const chosenSkill = newSkillPool[Math.floor(Math.random() * newSkillPool.length)];
            options.push(chosenSkill);
            const pindex = newSkillPool.findIndex(skill => skill === chosenSkill);
            newSkillPool.splice(pindex, 1);
        }
        const askForChooseEvent = event_packer_1.EventPacker.createUncancellableEvent({
            options,
            optionPrompt: options.map(option => ({ option, sideTip: engine_1.Sanguosha.getSkillBySkillName(option).Description })),
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose pingjian options', this.GeneralName).extract(),
            toId: fromId,
        });
        const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, askForChooseEvent, fromId);
        response.selectedOption = response.selectedOption || options[0];
        const realSkill = engine_1.Sanguosha.getSkillBySkillName(response.selectedOption);
        if (!(realSkill instanceof skill_1.TriggerSkill)) {
            return false;
        }
        const currentStage = identifier === 137 /* DamageEvent */
            ? "AfterDamagedEffect" /* AfterDamagedEffect */
            : "StageChanged" /* StageChanged */;
        if (!from.hasSkill(response.selectedOption) &&
            realSkill.isTriggerable(realEvent, currentStage) &&
            realSkill.canUse(room, from, realEvent, currentStage)) {
            await room.obtainSkill(fromId, response.selectedOption, true);
            skillsUsed[index].push(response.selectedOption);
            room.setFlag(fromId, this.GeneralName, skillsUsed);
            from.setFlag("flag:skills_using" /* SkillsUsing */, [
                ...(from.getFlag("flag:skills_using" /* SkillsUsing */) || []),
                response.selectedOption,
            ]);
        }
        return true;
    }
};
PingJianShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: PingJian.Name, description: PingJian.Description })
], PingJianShadow);
exports.PingJianShadow = PingJianShadow;
let PingJianLoseSkill = class PingJianLoseSkill extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 0 /* PhaseBegin */ && stage === "AfterPhaseChanged" /* AfterPhaseChanged */;
    }
    get Muted() {
        return true;
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ || stage === "BeforeSkillEffect" /* BeforeSkillEffect */;
    }
    isFlaggedSkill(room, event, stage) {
        return true;
    }
    canUse(room, owner, content) {
        const skillsUsing = owner.getFlag("flag:skills_using" /* SkillsUsing */);
        if (!skillsUsing) {
            return false;
        }
        if (event_packer_1.EventPacker.getIdentifier(content) === 105 /* PhaseStageChangeEvent */) {
            const phaseStageChangeEvent = content;
            return (phaseStageChangeEvent.playerId === owner.Id &&
                phaseStageChangeEvent.toStage === 15 /* PlayCardStageEnd */);
        }
        else if (event_packer_1.EventPacker.getIdentifier(content) === 133 /* SkillEffectEvent */) {
            const skillEffectEvent = content;
            return (skillEffectEvent.fromId === owner.Id &&
                skillsUsing.find(skill => skill === skillEffectEvent.skillName ||
                    (PingJian.PingJianSkillMap[skill] && PingJian.PingJianSkillMap[skill].includes(skillEffectEvent.skillName))) !== undefined);
        }
        return false;
    }
    async onTrigger(room, content) {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const from = room.getPlayerById(fromId);
        const unknownEvent = triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 105 /* PhaseStageChangeEvent */) {
            const skillsUsing = from.getFlag("flag:skills_using" /* SkillsUsing */);
            from.removeFlag("flag:skills_using" /* SkillsUsing */);
            for (const skill of skillsUsing) {
                if (from.hasSkill(skill)) {
                    await room.loseSkill(fromId, skill, true);
                }
            }
        }
        else if (identifier === 133 /* SkillEffectEvent */) {
            const skillEffectEvent = unknownEvent;
            if (from.hasSkill(skillEffectEvent.skillName)) {
                const skillsUsing = from.getFlag("flag:skills_using" /* SkillsUsing */);
                const index = skillsUsing.findIndex(skill => skill === skillEffectEvent.skillName ||
                    (PingJian.PingJianSkillMap[skill] && PingJian.PingJianSkillMap[skill].includes(skillEffectEvent.skillName)));
                const skillName = skillsUsing.splice(index, 1)[0];
                from.setFlag("flag:skills_using" /* SkillsUsing */, skillsUsing);
                await room.loseSkill(fromId, skillName, true);
            }
        }
        return true;
    }
};
PingJianLoseSkill = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CommonSkill({ name: PingJianShadow.Name, description: PingJianShadow.Description })
], PingJianLoseSkill);
exports.PingJianLoseSkill = PingJianLoseSkill;
