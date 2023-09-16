"use strict";
var KuiZhu_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KuiZhuDamage = exports.KuiZhuDraw = exports.KuiZhu = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let KuiZhu = KuiZhu_1 = class KuiZhu extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        let canUse = content.playerId === owner.Id && content.toStage === 18 /* DropCardStageEnd */;
        if (canUse) {
            const droppedCardsNum = room.Analytics.getCardLostRecord(owner.Id, 'phase').reduce((sum, event) => {
                if (event.infos.length === 1) {
                    const info = event.infos[0];
                    return (sum +
                        (info.moveReason === 4 /* SelfDrop */
                            ? info.movingCards.filter(card => (!engine_1.Sanguosha.isVirtualCardId(card.card) && card.fromArea === 0 /* HandArea */) ||
                                card.fromArea === 1 /* EquipArea */).length
                            : 0));
                }
                else {
                    const infos = event.infos.filter(info => info.moveReason === 4 /* SelfDrop */);
                    for (const info of infos) {
                        sum +=
                            info.moveReason === 4 /* SelfDrop */
                                ? info.movingCards.filter(card => (!engine_1.Sanguosha.isVirtualCardId(card.card) && card.fromArea === 0 /* HandArea */) ||
                                    card.fromArea === 1 /* EquipArea */).length
                                : 0;
                    }
                    return sum;
                }
            }, 0);
            if (droppedCardsNum > 0) {
                owner.setFlag(this.Name, droppedCardsNum);
            }
            else {
                canUse = false;
            }
        }
        return canUse;
    }
    async beforeUse(room, event) {
        const { fromId } = event;
        const droppedCardsNum = room.getFlag(fromId, this.Name);
        const options = ['kuizhu:draw', 'kuizhu:damage'];
        room.notify(168 /* AskForChoosingOptionsEvent */, {
            options,
            toId: fromId,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose kuizhu options: {1}', this.Name).extract(),
        }, fromId);
        const { selectedOption } = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, fromId);
        if (selectedOption) {
            room.setFlag(fromId, KuiZhu_1.KuiZhuDroppedNum, droppedCardsNum);
            room.notify(171 /* AskForSkillUseEvent */, {
                invokeSkillNames: selectedOption === options[0] ? [KuiZhuDraw.Name] : [KuiZhuDamage.Name],
                toId: fromId,
                conversation: selectedOption === options[0]
                    ? translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose at most {1} targets to draw a card each?', this.Name, droppedCardsNum).extract()
                    : translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose a targets with {1} hp to deal 1 damage to each target?', this.Name, droppedCardsNum).extract(),
            }, fromId);
            const response = await room.onReceivingAsyncResponseFrom(171 /* AskForSkillUseEvent */, fromId);
            if (response.toIds) {
                event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: selectedOption }, event);
                event.toIds = response.toIds;
                return true;
            }
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        if (!toIds) {
            return false;
        }
        const selectedOption = event_packer_1.EventPacker.getMiddleware(this.Name, event);
        if (selectedOption === 'kuizhu:draw') {
            for (const to of toIds) {
                await room.drawCards(1, to, 'top', fromId, this.Name);
            }
        }
        else {
            for (const to of toIds) {
                await room.damage({
                    fromId,
                    toId: to,
                    damage: 1,
                    damageType: "normal_property" /* Normal */,
                    triggeredBySkills: [this.Name],
                });
            }
            toIds.length > 1 && (await room.loseHp(fromId, 1));
        }
        return true;
    }
};
KuiZhu.KuiZhuDroppedNum = 'kuizhu_dropped_num';
KuiZhu = KuiZhu_1 = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'kuizhu', description: 'kuizhu_description' })
], KuiZhu);
exports.KuiZhu = KuiZhu;
let KuiZhuDraw = class KuiZhuDraw extends skill_1.TriggerSkill {
    isTriggerable() {
        return false;
    }
    canUse() {
        return false;
    }
    targetFilter(room, owner, targets) {
        return targets.length > 0 && targets.length <= owner.getFlag(KuiZhu.KuiZhuDroppedNum);
    }
    isAvailableTarget() {
        return true;
    }
    async onTrigger() {
        return true;
    }
    async onEffect() {
        return true;
    }
};
KuiZhuDraw = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: 'draw_kuizhu', description: 'draw_kuizhu_description' })
], KuiZhuDraw);
exports.KuiZhuDraw = KuiZhuDraw;
let KuiZhuDamage = class KuiZhuDamage extends skill_1.TriggerSkill {
    isTriggerable() {
        return false;
    }
    canUse() {
        return false;
    }
    targetFilter(room, owner, targets) {
        return (targets.reduce((sum, target) => sum + room.getPlayerById(target).Hp, 0) ===
            owner.getFlag(KuiZhu.KuiZhuDroppedNum));
    }
    isAvailableTarget(owner, room, target, selectedCards, selectedTargets) {
        return (selectedTargets.reduce((sum, target) => sum + room.getPlayerById(target).Hp, 0) +
            room.getPlayerById(target).Hp <=
            room.getPlayerById(owner).getFlag(KuiZhu.KuiZhuDroppedNum));
    }
    async onTrigger() {
        return true;
    }
    async onEffect() {
        return true;
    }
};
KuiZhuDamage = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: 'damage_kuizhu', description: 'damage_kuizhu_description' })
], KuiZhuDamage);
exports.KuiZhuDamage = KuiZhuDamage;
