"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YaoHuDebuff = exports.YaoHuShadow = exports.YaoHu = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const card_props_1 = require("core/cards/libs/card_props");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const functional_1 = require("core/shares/libs/functional");
const aim_group_1 = require("core/shares/libs/utils/aim_group");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const jutu_1 = require("./jutu");
let YaoHu = class YaoHu extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterPhaseChanged" /* AfterPhaseChanged */;
    }
    canUse(room, owner, event) {
        return event.toPlayer === owner.Id && event.to === 0 /* PhaseBegin */ && !owner.hasUsedSkill(this.Name);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const nationalities = room.AlivePlayers.reduce((nas, player) => {
            nas.includes(player.Nationality) || nas.push(player.Nationality);
            return nas;
        }, []);
        const options = nationalities.map(nationality => functional_1.Functional.getPlayerNationalityText(nationality));
        const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
            options,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose a nationality as ‘Yao Hu’', this.Name).extract(),
            toId: event.fromId,
            triggeredBySkills: [this.Name],
        }, event.fromId, true);
        response.selectedOption = response.selectedOption || options[Math.floor(Math.random() * options.length)];
        const index = options.findIndex(nationalityText => nationalityText === response.selectedOption);
        room.setFlag(event.fromId, this.Name, nationalities[index], translation_json_tool_1.TranslationPack.translationJsonPatcher('yaohu: {0}', response.selectedOption).toString());
        return true;
    }
};
YaoHu = tslib_1.__decorate([
    skill_wrappers_1.CircleSkill,
    skill_wrappers_1.CommonSkill({ name: 'yaohu', description: 'yaohu_description' })
], YaoHu);
exports.YaoHu = YaoHu;
let YaoHuShadow = class YaoHuShadow extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, event) {
        return (event.toStage === 13 /* PlayCardStageStart */ &&
            event.playerId !== owner.Id &&
            room.getPlayerById(event.playerId).Nationality === owner.getFlag(this.GeneralName) &&
            owner.getCardIds(3 /* OutsideArea */, jutu_1.JuTu.Name).length > 0);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const toId = event.triggeredOnEvent.playerId;
        const shengs = room.getPlayerById(event.fromId).getCardIds(3 /* OutsideArea */, jutu_1.JuTu.Name);
        const response = await room.doAskForCommonly(165 /* AskForChoosingCardEvent */, {
            toId,
            cardIds: shengs,
            amount: 1,
            triggeredBySkills: [this.GeneralName],
        }, toId, true);
        response.selectedCards = response.selectedCards || [shengs[Math.floor(Math.random() * shengs.length)]];
        await room.moveCards({
            movingCards: [{ card: response.selectedCards[0], fromArea: 3 /* OutsideArea */ }],
            fromId: event.fromId,
            toId,
            toArea: 0 /* HandArea */,
            moveReason: 1 /* ActivePrey */,
            proposer: toId,
            triggeredBySkills: [this.GeneralName],
        });
        const slashTargets = room
            .getOtherPlayers(toId)
            .filter(player => room.withinAttackDistance(room.getPlayerById(toId), player) && player.Id !== event.fromId)
            .map(player => player.Id);
        if (slashTargets.length > 0) {
            const resp = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
                players: slashTargets,
                toId: event.fromId,
                requiredAmount: 1,
                conversation: 'yaohu: please choose a target to be the target of the slash',
                triggeredBySkills: [this.GeneralName],
            }, event.fromId, true);
            resp.selectedPlayers = resp.selectedPlayers || [slashTargets[Math.floor(Math.random() * slashTargets.length)]];
            const slashResponse = await room.askForCardUse({
                toId,
                cardUserId: toId,
                scopedTargets: resp.selectedPlayers,
                cardMatcher: new card_matcher_1.CardMatcher({ generalName: ['slash'] }).toSocketPassenger(),
                extraUse: true,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please use a slash to {1}', this.GeneralName, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(resp.selectedPlayers[0]))).extract(),
                triggeredBySkills: [this.GeneralName],
            }, toId);
            if (slashResponse.cardId !== undefined) {
                const slashUseEvent = {
                    fromId: slashResponse.fromId,
                    targetGroup: slashResponse.toIds && [slashResponse.toIds],
                    cardId: slashResponse.cardId,
                    triggeredBySkills: [this.GeneralName],
                };
                await room.useCard(slashUseEvent, true);
                return true;
            }
        }
        const originalTargets = room.getFlag(toId, this.Name) || [];
        if (!originalTargets.includes(event.fromId)) {
            originalTargets.push(event.fromId);
            room.setFlag(toId, this.Name, originalTargets, this.GeneralName);
        }
        room.getPlayerById(toId).hasShadowSkill(YaoHuDebuff.Name) || (await room.obtainSkill(toId, YaoHuDebuff.Name));
        return true;
    }
};
YaoHuShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: YaoHu.Name, description: YaoHu.Description })
], YaoHuShadow);
exports.YaoHuShadow = YaoHuShadow;
let YaoHuDebuff = class YaoHuDebuff extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 4 /* PlayCardStage */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    async whenDead(room, player) {
        room.removeFlag(player.Id, YaoHuShadow.Name);
        await room.loseSkill(player.Id, this.Name);
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill(room, event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    isTriggerable(event, stage) {
        return stage === "OnAim" /* OnAim */ || stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 131 /* AimEvent */) {
            const aimEvent = event;
            return (aimEvent.fromId === owner.Id &&
                (owner.getFlag(YaoHuShadow.Name) || []).includes(aimEvent.toId) &&
                Object.values(card_props_1.DamageCardEnum).includes(engine_1.Sanguosha.getCardById(aimEvent.byCardId).GeneralName));
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = event;
            return phaseChangeEvent.fromPlayer === owner.Id && phaseChangeEvent.from === 4 /* PlayCardStage */;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        if (event_packer_1.EventPacker.getIdentifier(unknownEvent) === 131 /* AimEvent */) {
            const aimEvent = unknownEvent;
            if (room.getPlayerById(event.fromId).getPlayerCards().length >= 2) {
                const response = await room.doAskForCommonly(163 /* AskForCardEvent */, {
                    cardAmount: 2,
                    toId: event.fromId,
                    reason: YaoHu.Name,
                    conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: you need to give 2 cards to {1}, or he/she will be removed from the targets of {2}', YaoHu.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(aimEvent.toId)), translation_json_tool_1.TranslationPack.patchCardInTranslation(aimEvent.byCardId)).extract(),
                    fromArea: [0 /* HandArea */, 1 /* EquipArea */],
                    triggeredBySkills: [YaoHu.Name],
                }, event.fromId);
                if (response.selectedCards.length === 2) {
                    await room.moveCards({
                        movingCards: response.selectedCards.map(card => ({
                            card,
                            fromArea: room.getPlayerById(event.fromId).cardFrom(card),
                        })),
                        fromId: event.fromId,
                        toId: aimEvent.toId,
                        toArea: 0 /* HandArea */,
                        moveReason: 2 /* ActiveMove */,
                        proposer: event.fromId,
                        triggeredBySkills: [YaoHu.Name],
                    });
                    return true;
                }
            }
            aim_group_1.AimGroupUtil.cancelTarget(aimEvent, aimEvent.toId);
        }
        else {
            room.removeFlag(event.fromId, YaoHuShadow.Name);
            await room.loseSkill(event.fromId, this.Name);
        }
        return true;
    }
};
YaoHuDebuff = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_yaohu_debuff', description: 's_yaohu_debuff_description' })
], YaoHuDebuff);
exports.YaoHuDebuff = YaoHuDebuff;
