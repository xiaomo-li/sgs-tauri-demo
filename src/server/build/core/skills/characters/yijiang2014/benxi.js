"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BenXiCharge = exports.BenXiShadow = exports.BenXi = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const target_group_1 = require("core/shares/libs/utils/target_group");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let BenXi = class BenXi extends skill_1.TriggerSkill {
    constructor() {
        super(...arguments);
        this.BenXiStage = 'benxi_stage';
    }
    isTriggerable(event, stage) {
        return stage === "CardUsing" /* CardUsing */ || stage === "AfterCardTargetDeclared" /* AfterCardTargetDeclared */;
    }
    canUse(room, owner, content, stage) {
        if (owner.getFlag(this.BenXiStage)) {
            owner.removeFlag(this.BenXiStage);
        }
        if (content.fromId !== owner.Id || room.CurrentPlayer !== owner || !stage) {
            return false;
        }
        let canUse = true;
        if (stage === "AfterCardTargetDeclared" /* AfterCardTargetDeclared */) {
            canUse =
                target_group_1.TargetGroupUtil.getRealTargets(content.targetGroup).length === 1 &&
                    (engine_1.Sanguosha.getCardById(content.cardId).GeneralName === 'slash' ||
                        (engine_1.Sanguosha.getCardById(content.cardId).is(7 /* Trick */) &&
                            !engine_1.Sanguosha.getCardById(content.cardId).is(8 /* DelayedTrick */))) &&
                    room.getOtherPlayers(owner.Id).find(player => room.distanceBetween(owner, player) > 1) === undefined;
        }
        if (canUse) {
            owner.setFlag(this.BenXiStage, stage);
        }
        return canUse;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const stage = room.getPlayerById(fromId).getFlag(this.BenXiStage);
        if (stage === "CardUsing" /* CardUsing */) {
            const originalNum = room.getFlag(fromId, this.Name) || 0;
            room.setFlag(fromId, this.Name, originalNum + 1, translation_json_tool_1.TranslationPack.translationJsonPatcher('benxi times: {0}', originalNum + 1).toString());
        }
        else {
            const cardUseEvent = event.triggeredOnEvent;
            const options = ['benxi:unoffsetable', 'benxi:ignoreArmor', 'benxi:draw'];
            const availableTargets = room
                .getAlivePlayersFrom()
                .map(player => player.Id)
                .filter(playerId => !target_group_1.TargetGroupUtil.getRealTargets(cardUseEvent.targetGroup).includes(playerId) &&
                room.isAvailableTarget(cardUseEvent.cardId, fromId, playerId) &&
                engine_1.Sanguosha.getCardById(cardUseEvent.cardId).Skill.isCardAvailableTarget(fromId, room, playerId, [], [], cardUseEvent.cardId));
            availableTargets.length > 0 && options.unshift('benxi:addTarget');
            const selectedList = [];
            for (let i = 0; i < 2; i++) {
                const resp = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
                    options,
                    conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose benxi options: {1}', this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(cardUseEvent.cardId)).extract(),
                    toId: fromId,
                    triggeredBySkills: [this.Name],
                }, fromId);
                if (resp.selectedOption) {
                    selectedList.push(resp.selectedOption);
                    const index = options.findIndex(selected => selected === resp.selectedOption);
                    options.splice(index, 1);
                }
                else {
                    break;
                }
            }
            if (selectedList.length > 0) {
                for (const selected of selectedList) {
                    if (selected === 'benxi:addTarget') {
                        const response = await room.doAskForCommonly(174 /* AskForChoosingCardAvailableTargetEvent */, {
                            user: fromId,
                            cardId: cardUseEvent.cardId,
                            exclude: target_group_1.TargetGroupUtil.getRealTargets(cardUseEvent.targetGroup),
                            conversation: 'benxi: please select a player to append to card targets',
                            triggeredBySkills: [this.Name],
                        }, fromId, true);
                        response.selectedPlayers = response.selectedPlayers || [
                            availableTargets[Math.floor(Math.random() * availableTargets.length)],
                        ];
                        target_group_1.TargetGroupUtil.pushTargets(cardUseEvent.targetGroup, response.selectedPlayers[0]);
                    }
                    else if (selected === 'benxi:unoffsetable') {
                        event_packer_1.EventPacker.setUnoffsetableEvent(cardUseEvent);
                    }
                    else if (selected === 'benxi:ignoreArmor') {
                        cardUseEvent.triggeredBySkills = cardUseEvent.triggeredBySkills
                            ? [...cardUseEvent.triggeredBySkills, this.Name]
                            : [this.Name];
                    }
                    else if (selected === 'benxi:draw') {
                        cardUseEvent.triggeredBySkills = cardUseEvent.triggeredBySkills
                            ? [...cardUseEvent.triggeredBySkills, BenXiShadow.Name]
                            : [BenXiShadow.Name];
                    }
                }
            }
        }
        return true;
    }
};
BenXi = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'benxi', description: 'benxi_description' })
], BenXi);
exports.BenXi = BenXi;
let BenXiShadow = class BenXiShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 0 /* PhaseBegin */ && stage === "AfterPhaseChanged" /* AfterPhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterPhaseChanged" /* AfterPhaseChanged */ || stage === "DamageEffect" /* DamageEffect */;
    }
    canUse(room, owner, event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = event;
            return (owner.Id === phaseChangeEvent.fromPlayer &&
                phaseChangeEvent.from === 7 /* PhaseFinish */ &&
                owner.getFlag(this.GeneralName) !== undefined);
        }
        else if (identifier === 137 /* DamageEvent */) {
            const damageEvent = event;
            return room.CurrentPlayer === owner && damageEvent.triggeredBySkills.includes(this.Name);
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const identifier = event_packer_1.EventPacker.getIdentifier(event.triggeredOnEvent);
        if (identifier === 137 /* DamageEvent */) {
            await room.drawCards(1, fromId, 'top', fromId, this.GeneralName);
        }
        else {
            room.removeFlag(fromId, this.GeneralName);
        }
        return true;
    }
};
BenXiShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CompulsorySkill({ name: BenXi.Name, description: BenXi.Description })
], BenXiShadow);
exports.BenXiShadow = BenXiShadow;
let BenXiCharge = class BenXiCharge extends skill_1.RulesBreakerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    breakOffenseDistance(room, owner) {
        return owner.getFlag(this.GeneralName) || 0;
    }
};
BenXiCharge = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CompulsorySkill({ name: BenXiShadow.Name, description: BenXiShadow.Description })
], BenXiCharge);
exports.BenXiCharge = BenXiCharge;
