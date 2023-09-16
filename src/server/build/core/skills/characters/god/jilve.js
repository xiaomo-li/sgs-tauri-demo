"use strict";
var JiLve_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiLveFangZhu = exports.JiLveJiZhi = exports.JiLveGuiCai = exports.JiLveShadow = exports.JiLve = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const fangzhu_1 = require("../forest/fangzhu");
const wansha_1 = require("../forest/wansha");
const guicai_1 = require("../standard/guicai");
const jizhi_1 = require("../standard/jizhi");
const zhiheng_1 = require("../standard/zhiheng");
let JiLve = JiLve_1 = class JiLve extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return ((!owner.getFlag(JiLve_1.ZhihengUsed) || !owner.getFlag(JiLve_1.WanshaUsed)) &&
            owner.getMark("ren" /* Ren */) > 0);
    }
    numberOfTargets() {
        return 0;
    }
    cardFilter() {
        return true;
    }
    isAvailableTarget() {
        return false;
    }
    isAvailableCard() {
        return false;
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const options = [];
        const from = room.getPlayerById(skillUseEvent.fromId);
        if (!from.getFlag(JiLve_1.ZhihengUsed)) {
            options.push(zhiheng_1.ZhiHeng.Name);
        }
        if (!from.getFlag(JiLve_1.WanshaUsed)) {
            options.push(wansha_1.WanSha.Name);
        }
        if (options.length === 0) {
            return false;
        }
        const askForOptions = {
            options,
            conversation: 'please choose a skill',
            toId: skillUseEvent.fromId,
            triggeredBySkills: [this.Name],
        };
        room.notify(168 /* AskForChoosingOptionsEvent */, askForOptions, skillUseEvent.fromId);
        const { selectedOption } = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, skillUseEvent.fromId);
        if (selectedOption === undefined) {
            return false;
        }
        if (selectedOption === zhiheng_1.ZhiHeng.Name) {
            const askForCard = {
                cardAmountRange: [1, from.getPlayerCards().length],
                toId: from.Id,
                reason: this.Name,
                conversation: 'please choose your zhiheng cards',
                fromArea: [0 /* HandArea */, 1 /* EquipArea */],
                triggeredBySkills: [this.Name],
            };
            room.notify(163 /* AskForCardEvent */, event_packer_1.EventPacker.createUncancellableEvent(askForCard), from.Id);
            const { selectedCards } = await room.onReceivingAsyncResponseFrom(163 /* AskForCardEvent */, from.Id);
            const handCards = from.getCardIds(0 /* HandArea */);
            let additionalCardDraw = 0;
            if (selectedCards.filter(zhihengCard => handCards.includes(zhihengCard)).length === handCards.length &&
                handCards.length > 0) {
                additionalCardDraw++;
            }
            room.broadcast(103 /* CustomGameDialog */, {
                translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used skill {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from), 'jilve-zhiheng').extract(),
            });
            await room.dropCards(4 /* SelfDrop */, selectedCards, skillUseEvent.fromId, skillUseEvent.fromId, zhiheng_1.ZhiHeng.Name);
            await room.drawCards(selectedCards.length + additionalCardDraw, skillUseEvent.fromId, undefined, skillUseEvent.fromId, this.Name);
            room.setFlag(from.Id, JiLve_1.ZhihengUsed, true);
            room.addMark(skillUseEvent.fromId, "ren" /* Ren */, -1);
        }
        else {
            await room.obtainSkill(skillUseEvent.fromId, wansha_1.WanSha.Name, true);
            room.setFlag(skillUseEvent.fromId, JiLve_1.WanshaUsed, true);
            room.addMark(skillUseEvent.fromId, "ren" /* Ren */, -1);
        }
        return true;
    }
};
JiLve.ZhihengUsed = 'zhihengUsed';
JiLve.WanshaUsed = 'wanshaUsed';
JiLve = JiLve_1 = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'jilve', description: 'jilve_description' })
], JiLve);
exports.JiLve = JiLve;
let JiLveShadow = class JiLveShadow extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */ && event.from === 7 /* PhaseFinish */;
    }
    isFlaggedSkill() {
        return true;
    }
    canUse() {
        return true;
    }
    async onTrigger(room, event) {
        event.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used skill {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId)), this.Name).extract();
        return true;
    }
    async onEffect(room, event) {
        const from = room.getPlayerById(event.fromId);
        if (from.getFlag(JiLve.WanshaUsed)) {
            room.removeFlag(from.Id, JiLve.WanshaUsed);
            await room.loseSkill(from.Id, wansha_1.WanSha.Name);
        }
        if (from.getFlag(JiLve.ZhihengUsed)) {
            room.removeFlag(from.Id, JiLve.ZhihengUsed);
        }
        return true;
    }
};
JiLveShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: JiLve.Name, description: JiLve.Description })
], JiLveShadow);
exports.JiLveShadow = JiLveShadow;
let JiLveGuiCai = class JiLveGuiCai extends guicai_1.GuiCai {
    canUse(room, owner) {
        return owner.getMark("ren" /* Ren */) > 0 && super.canUse(room, owner);
    }
    async onUse(room, event) {
        event.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used skill {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId)), this.Name).extract();
        room.addMark(event.fromId, "ren" /* Ren */, -1);
        return super.onUse(room, event);
    }
};
JiLveGuiCai = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: JiLveShadow.Name, description: JiLveShadow.Description })
], JiLveGuiCai);
exports.JiLveGuiCai = JiLveGuiCai;
let JiLveJiZhi = class JiLveJiZhi extends jizhi_1.JiZhi {
    canUse(room, owner, content) {
        return owner.getMark("ren" /* Ren */) > 0 && super.canUse(room, owner, content);
    }
    async onUse(room, event) {
        event.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used skill {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId)), this.Name).extract();
        room.addMark(event.fromId, "ren" /* Ren */, -1);
        return super.onUse(room, event);
    }
};
JiLveJiZhi = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: JiLveGuiCai.Name, description: JiLveGuiCai.Description })
], JiLveJiZhi);
exports.JiLveJiZhi = JiLveJiZhi;
let JiLveFangZhu = class JiLveFangZhu extends fangzhu_1.FangZhu {
    canUse(room, owner, content) {
        return owner.getMark("ren" /* Ren */) > 0 && super.canUse(room, owner, content);
    }
    async onUse(room, event) {
        room.addMark(event.fromId, "ren" /* Ren */, -1);
        return super.onUse(room, event);
    }
};
JiLveFangZhu = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: JiLveJiZhi.Name, description: JiLveJiZhi.Description })
], JiLveFangZhu);
exports.JiLveFangZhu = JiLveFangZhu;
