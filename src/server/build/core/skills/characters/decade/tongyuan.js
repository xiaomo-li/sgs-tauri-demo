"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TongYuanBuff = exports.TongYuan = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const target_group_1 = require("core/shares/libs/utils/target_group");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const cuijian_1 = require("./cuijian");
let TongYuan = class TongYuan extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "CardUseFinishedEffect" /* CardUseFinishedEffect */ || stage === "AfterCardResponseEffect" /* AfterCardResponseEffect */;
    }
    canUse(room, owner, content) {
        return (content.fromId === owner.Id &&
            !owner.hasSkill(cuijian_1.CuiJianEX.Name) &&
            (owner.getFlag(this.Name) || []).length < 2 &&
            engine_1.Sanguosha.getCardById(content.cardId).isRed() &&
            ((event_packer_1.EventPacker.getIdentifier(content) === 124 /* CardUseEvent */ &&
                engine_1.Sanguosha.getCardById(content.cardId).is(7 /* Trick */) &&
                !owner.hasSkill(cuijian_1.CuiJianI.Name)) ||
                (engine_1.Sanguosha.getCardById(content.cardId).is(0 /* Basic */) && !owner.hasSkill(cuijian_1.CuiJianII.Name))));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const cardUsed = engine_1.Sanguosha.getCardById(event.triggeredOnEvent.cardId);
        const from = room.getPlayerById(event.fromId);
        from.hasSkill(cuijian_1.CuiJianI.Name) && (await room.updateSkill(event.fromId, cuijian_1.CuiJianI.Name, cuijian_1.CuiJianEX.Name));
        from.hasSkill(cuijian_1.CuiJianII.Name) && (await room.updateSkill(event.fromId, cuijian_1.CuiJianII.Name, cuijian_1.CuiJianEX.Name));
        from.hasSkill(cuijian_1.CuiJian.Name) &&
            (await room.updateSkill(event.fromId, cuijian_1.CuiJian.Name, cardUsed.is(0 /* Basic */) ? cuijian_1.CuiJianII.Name : cuijian_1.CuiJianI.Name));
        const flagNumber = cardUsed.is(0 /* Basic */) ? 2 : 1;
        const flags = from.getFlag(this.Name) || [];
        flags.includes(flagNumber) || flags.push(flagNumber);
        from.setFlag(this.Name, flags);
        if (flags.length > 1 && !from.hasShadowSkill(TongYuanBuff.Name)) {
            await room.obtainSkill(event.fromId, TongYuanBuff.Name);
        }
        return true;
    }
};
TongYuan = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'tongyuan', description: 'tongyuan_description' })
], TongYuan);
exports.TongYuan = TongYuan;
let TongYuanBuff = class TongYuanBuff extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "BeforeCardUseEffect" /* BeforeCardUseEffect */ || stage === "AfterCardTargetDeclared" /* AfterCardTargetDeclared */;
    }
    canUse(room, owner, content, stage) {
        const cardUsed = engine_1.Sanguosha.getCardById(content.cardId);
        return (content.fromId === owner.Id &&
            cardUsed.isRed() &&
            (stage === "BeforeCardUseEffect" /* BeforeCardUseEffect */
                ? cardUsed.isCommonTrick()
                : cardUsed.is(0 /* Basic */) && target_group_1.TargetGroupUtil.getRealTargets(content.targetGroup).length > 0));
    }
    async beforeUse(room, event) {
        const cardUseEvent = event.triggeredOnEvent;
        if (engine_1.Sanguosha.getCardById(cardUseEvent.cardId).is(0 /* Basic */)) {
            const availableTarget = room
                .getAlivePlayersFrom()
                .map(player => player.Id)
                .find(playerId => !target_group_1.TargetGroupUtil.getRealTargets(cardUseEvent.targetGroup).includes(playerId) &&
                room.isAvailableTarget(cardUseEvent.cardId, event.fromId, playerId) &&
                engine_1.Sanguosha.getCardById(cardUseEvent.cardId).Skill.isCardAvailableTarget(event.fromId, room, playerId, [], [], cardUseEvent.cardId));
            if (availableTarget) {
                const exclude = target_group_1.TargetGroupUtil.getRealTargets(cardUseEvent.targetGroup);
                if (engine_1.Sanguosha.getCardById(cardUseEvent.cardId).GeneralName === 'slash') {
                    exclude.push(...room
                        .getOtherPlayers(event.fromId)
                        .filter(player => !room.canAttack(room.getPlayerById(event.fromId), player))
                        .map(player => player.Id));
                }
                const { selectedPlayers } = await room.doAskForCommonly(174 /* AskForChoosingCardAvailableTargetEvent */, {
                    user: event.fromId,
                    cardId: cardUseEvent.cardId,
                    exclude,
                    conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please select a player to append to {1} targets', this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(cardUseEvent.cardId)).extract(),
                    triggeredBySkills: [this.Name],
                }, event.fromId);
                if (selectedPlayers && selectedPlayers.length > 0) {
                    event.toIds = selectedPlayers;
                    return true;
                }
            }
        }
        else {
            return true;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const cardUseEvent = event.triggeredOnEvent;
        if (engine_1.Sanguosha.getCardById(cardUseEvent.cardId).is(0 /* Basic */) && event.toIds) {
            target_group_1.TargetGroupUtil.pushTargets(cardUseEvent.targetGroup, event.toIds);
        }
        else {
            event_packer_1.EventPacker.setDisresponsiveEvent(cardUseEvent);
        }
        return true;
    }
};
TongYuanBuff = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill({ stubbornSkill: true }),
    skill_wrappers_1.CommonSkill({ name: 's_tongyuan_buff', description: 's_tongyuan_buff_description' })
], TongYuanBuff);
exports.TongYuanBuff = TongYuanBuff;
