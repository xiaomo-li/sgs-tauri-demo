"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShenShiShadow = exports.ShenShiYin = exports.ShenShi = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ShenShi = class ShenShi extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name) && owner.getSwitchSkillState(this.Name, true) === 0 /* Yang */;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return (owner !== target &&
            room
                .getOtherPlayers(owner)
                .find(player => player.getCardIds(0 /* HandArea */).length >
                room.getPlayerById(target).getCardIds(0 /* HandArea */).length) === undefined);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId, selectedCards) {
        return true;
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds, cardIds } = event;
        if (!toIds || !cardIds) {
            return false;
        }
        await room.moveCards({
            movingCards: [{ card: cardIds[0], fromArea: room.getPlayerById(fromId).cardFrom(cardIds[0]) }],
            fromId,
            toId: toIds[0],
            toArea: 0 /* HandArea */,
            moveReason: 2 /* ActiveMove */,
            triggeredBySkills: [this.Name],
        });
        await room.damage({
            fromId,
            toId: toIds[0],
            damage: 1,
            damageType: "normal_property" /* Normal */,
            triggeredBySkills: [this.Name],
        });
        if (room.getPlayerById(toIds[0]).Dead) {
            const targets = room
                .getAlivePlayersFrom()
                .filter(player => player.getCardIds(0 /* HandArea */).length < 4)
                .map(player => player.Id);
            const resp = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
                players: targets,
                toId: fromId,
                requiredAmount: 1,
                conversation: 'shenshi: do you want to choose a target to draw cards?',
                triggeredBySkills: [this.Name],
            }, fromId);
            if (resp.selectedPlayers && resp.selectedPlayers.length > 0) {
                const targetId = resp.selectedPlayers[0];
                await room.drawCards(4 - room.getPlayerById(targetId).getCardIds(0 /* HandArea */).length, targetId, 'top', fromId, this.Name);
            }
        }
        return true;
    }
};
ShenShi = tslib_1.__decorate([
    skill_wrappers_1.SwitchSkill(),
    skill_1.CommonSkill({ name: 'shenshi', description: 'shenshi_description' })
], ShenShi);
exports.ShenShi = ShenShi;
let ShenShiYin = class ShenShiYin extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    canUse(room, owner, content) {
        return (content.toId === owner.Id &&
            owner.getSwitchSkillState(this.GeneralName, true) === 1 /* Yin */ &&
            content.fromId !== undefined &&
            content.fromId !== owner.Id &&
            !room.getPlayerById(content.fromId).Dead &&
            room.getPlayerById(content.fromId).getCardIds(0 /* HandArea */).length > 0);
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to view {1}’s hand cards?', this.GeneralName, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId))).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const from = room.getPlayerById(fromId);
        const source = triggeredOnEvent.fromId;
        room.displayCards(source, room.getPlayerById(source).getCardIds(0 /* HandArea */), [fromId]);
        if (from.getCardIds(0 /* HandArea */).length > 0) {
            const response = await room.doAskForCommonly(163 /* AskForCardEvent */, event_packer_1.EventPacker.createUncancellableEvent({
                cardAmount: 1,
                toId: fromId,
                reason: this.GeneralName,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: you need to give a handcard to {1}', this.GeneralName, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(source))).extract(),
                fromArea: [0 /* HandArea */],
                triggeredBySkills: [this.GeneralName],
            }), fromId);
            response.selectedCards = response.selectedCards || from.getCardIds(0 /* HandArea */)[0];
            await room.moveCards({
                movingCards: [{ card: response.selectedCards[0], fromArea: 0 /* HandArea */ }],
                fromId,
                toId: source,
                toArea: 0 /* HandArea */,
                moveReason: 2 /* ActiveMove */,
                triggeredBySkills: [this.GeneralName],
            });
            const originalIds = from.getFlag(this.GeneralName) || [];
            originalIds.push(response.selectedCards[0]);
            from.setFlag(this.GeneralName, originalIds);
        }
        return true;
    }
};
ShenShiYin = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.SwitchSkill(),
    skill_1.CommonSkill({ name: ShenShi.Name, description: ShenShi.Description })
], ShenShiYin);
exports.ShenShiYin = ShenShiYin;
let ShenShiShadow = class ShenShiShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 4 /* PlayCardStage */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, content) {
        const shenshiIds = owner.getFlag(this.GeneralName);
        return (content.fromPlayer !== undefined &&
            content.fromPlayer !== owner.Id &&
            content.from === 7 /* PhaseFinish */ &&
            shenshiIds !== undefined &&
            room
                .getPlayerById(content.fromPlayer)
                .getPlayerCards()
                .find(id => shenshiIds.includes(id)) !== undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const from = room.getPlayerById(event.fromId);
        from.removeFlag(this.GeneralName);
        const n = 4 - from.getCardIds(0 /* HandArea */).length;
        if (n > 0) {
            await room.drawCards(n, event.fromId, 'top', event.fromId, this.GeneralName);
        }
        return true;
    }
};
ShenShiShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_1.CommonSkill({ name: ShenShiYin.Name, description: ShenShiYin.Description })
], ShenShiShadow);
exports.ShenShiShadow = ShenShiShadow;
