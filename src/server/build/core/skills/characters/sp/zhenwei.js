"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhenWeiClear = exports.ZhenWei = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const aim_group_1 = require("core/shares/libs/utils/aim_group");
const target_group_1 = require("core/shares/libs/utils/target_group");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZhenWei = class ZhenWei extends skill_1.TriggerSkill {
    constructor() {
        super(...arguments);
        this.ZhenWeiOptions = ['zhenwei:transfer', 'zhenwei:cancel'];
    }
    isTriggerable(event, stage) {
        return stage === "OnAimmed" /* OnAimmed */;
    }
    canUse(room, owner, content) {
        return (content.fromId !== owner.Id &&
            room.getPlayerById(content.toId).Hp < owner.Hp &&
            (engine_1.Sanguosha.getCardById(content.byCardId).GeneralName === 'slash' ||
                (engine_1.Sanguosha.getCardById(content.byCardId).is(7 /* Trick */) &&
                    engine_1.Sanguosha.getCardById(content.byCardId).isBlack())) &&
            aim_group_1.AimGroupUtil.getAllTargets(content.allTargets).length === 1 &&
            owner.getPlayerCards().length > 0);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    async beforeUse(room, event) {
        if (!event.cardIds) {
            return false;
        }
        const options = this.ZhenWeiOptions.slice();
        const aimEvent = event.triggeredOnEvent;
        if (!(!aim_group_1.AimGroupUtil.getAllTargets(aimEvent.allTargets).includes(event.fromId) &&
            room.isAvailableTarget(aimEvent.byCardId, aimEvent.fromId, event.fromId) &&
            engine_1.Sanguosha.getCardById(aimEvent.byCardId).Skill.isCardAvailableTarget(aimEvent.fromId, room, event.fromId, [], [], aimEvent.byCardId))) {
            options.shift();
        }
        const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
            options,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose zhenwei options: {1} {2}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(aimEvent.toId)), translation_json_tool_1.TranslationPack.patchCardInTranslation(aimEvent.byCardId)).extract(),
            toId: event.fromId,
            triggeredBySkills: [this.Name],
        }, event.fromId, true);
        response.selectedOption = response.selectedOption || options[options.length - 1];
        event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: response.selectedOption }, event);
        return true;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.dropCards(4 /* SelfDrop */, event.cardIds, event.fromId, event.fromId, this.Name);
        const chosen = event_packer_1.EventPacker.getMiddleware(this.Name, event);
        const aimEvent = event.triggeredOnEvent;
        if (chosen === this.ZhenWeiOptions[0]) {
            await room.drawCards(1, event.fromId, 'top', event.fromId, this.Name);
            const originalTargets = target_group_1.TargetGroupUtil.getAllTargets(aimEvent.targetGroup)[0];
            aim_group_1.AimGroupUtil.cancelTarget(aimEvent, aimEvent.toId);
            originalTargets[0] = event.fromId;
            aim_group_1.AimGroupUtil.addTargets(room, aimEvent, originalTargets);
        }
        else {
            const allCards = card_1.VirtualCard.getActualCards([aimEvent.byCardId]);
            if (room.isCardOnProcessing(aimEvent.byCardId) &&
                allCards.length > 0 &&
                !room.getPlayerById(aimEvent.fromId).Dead) {
                await room.moveCards({
                    movingCards: allCards.map(card => ({ card, fromArea: 6 /* ProcessingArea */ })),
                    toId: aimEvent.fromId,
                    toArea: 3 /* OutsideArea */,
                    moveReason: 3 /* PassiveMove */,
                    proposer: event.fromId,
                    isOutsideAreaInPublic: true,
                    toOutsideArea: this.Name,
                    triggeredBySkills: [this.Name],
                });
                aim_group_1.AimGroupUtil.cancelTarget(aimEvent, aimEvent.toId);
                room.getPlayerById(aimEvent.fromId).hasShadowSkill(ZhenWeiClear.Name) ||
                    (await room.obtainSkill(aimEvent.fromId, ZhenWeiClear.Name));
            }
        }
        return true;
    }
};
ZhenWei = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'zhenwei', description: 'zhenwei_description' })
], ZhenWei);
exports.ZhenWei = ZhenWei;
let ZhenWeiClear = class ZhenWeiClear extends skill_1.TriggerSkill {
    async whenDead(room, owner) {
        await room.loseSkill(owner.Id, this.Name);
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    canUse(room, owner, event) {
        return event.from === 7 /* PhaseFinish */;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const zheng = room.getPlayerById(event.fromId).getCardIds(3 /* OutsideArea */, ZhenWei.Name);
        zheng.length > 0 &&
            (await room.moveCards({
                movingCards: zheng.map(id => ({ card: id, fromArea: 3 /* OutsideArea */ })),
                fromId: event.fromId,
                toId: event.fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                proposer: event.fromId,
                movedByReason: ZhenWei.Name,
            }));
        await room.loseSkill(event.fromId, this.Name);
        return true;
    }
};
ZhenWeiClear = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_zhenwei_clear', description: 's_zhenwei_clear_description' })
], ZhenWeiClear);
exports.ZhenWeiClear = ZhenWeiClear;
