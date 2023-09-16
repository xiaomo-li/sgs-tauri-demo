"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZuoXingSide = exports.ZuoXingShadow = exports.ZuoXing = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZuoXing = class ZuoXing extends skill_1.ViewAsSkill {
    async whenLosingSkill(room, player) {
        if (player.getFlag(this.Name)) {
            room.installSideEffectSkill(4 /* ZuoXing */, this.Name, player.Id);
        }
    }
    canViewAs(room, owner, selectedCards, cardMatcher) {
        return cardMatcher
            ? []
            : engine_1.Sanguosha.getCardNameByType(types => types.includes(7 /* Trick */) && !types.includes(8 /* DelayedTrick */));
    }
    isRefreshAt(room, owner, phase) {
        return phase === 4 /* PlayCardStage */;
    }
    canUse(room, owner) {
        return (room.CurrentPlayerPhase === 4 /* PlayCardStage */ &&
            owner.getFlag(this.Name) &&
            !owner.hasUsedSkill(this.Name) &&
            owner.canUseCard(room, new card_matcher_1.CardMatcher({
                name: engine_1.Sanguosha.getCardNameByType(types => types.includes(7 /* Trick */) && !types.includes(8 /* DelayedTrick */)),
            })));
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableCard(room, owner, pendingCardId) {
        return false;
    }
    viewAs(selectedCards, owner, viewAs) {
        precondition_1.Precondition.assert(!!viewAs, 'Unknown zuoxing card');
        return card_1.VirtualCard.create({
            cardName: viewAs,
            bySkill: this.Name,
        });
    }
};
ZuoXing = tslib_1.__decorate([
    skill_1.PersistentSkill(),
    skill_1.CommonSkill({ name: 'zuoxing', description: 'zuoxing_description' })
], ZuoXing);
exports.ZuoXing = ZuoXing;
let ZuoXingShadow = class ZuoXingShadow extends skill_1.TriggerSkill {
    whenRefresh(room, owner) {
        room.removeFlag(owner.Id, this.GeneralName);
        if (room.getSideEffectSkills(owner).includes(ZuoXingSide.Name)) {
            room.uninstallSideEffectSkill(4 /* ZuoXing */);
        }
    }
    isRefreshAt(room, owner, stage) {
        return stage === 7 /* PhaseFinish */;
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ && event.toStage === 3 /* PrepareStageStart */;
    }
    canUse(room, owner, content) {
        return (owner.Id === content.playerId &&
            room.getAlivePlayersFrom().find(player => player.Character.Name === 'god_guojia' && player.MaxHp > 1) !==
                undefined);
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to let God Guo Jia loses 1 max hp? Then you can use virtual trick this turn', this.GeneralName).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const godGuoJias = room
            .getAlivePlayersFrom()
            .filter(player => player.Character.Name === 'god_guojia' && player.MaxHp > 1)
            .map(player => player.Id);
        let godGuoJia = godGuoJias[0];
        if (godGuoJias.length > 1) {
            const resp = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
                players: godGuoJias,
                toId: fromId,
                requiredAmount: 1,
                conversation: 'zuoxing: please choose a God Guo Jia to lose 1 max hp',
                triggeredBySkills: [this.Name],
            }, fromId, true);
            resp.selectedPlayers = resp.selectedPlayers || [godGuoJias[Math.floor(Math.random() * godGuoJias.length)]];
            godGuoJia = resp.selectedPlayers[0];
        }
        await room.changeMaxHp(godGuoJia, -1);
        room.setFlag(fromId, this.GeneralName, true);
        return true;
    }
};
ZuoXingShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: ZuoXing.Name, description: ZuoXing.Description })
], ZuoXingShadow);
exports.ZuoXingShadow = ZuoXingShadow;
let ZuoXingSide = class ZuoXingSide extends ZuoXing {
    canUse(room, owner) {
        return (room.CurrentPlayerPhase === 4 /* PlayCardStage */ &&
            owner.getFlag(ZuoXing.Name) &&
            !(owner.hasUsedSkill(ZuoXing.Name) || owner.hasUsedSkill(this.Name)));
    }
    viewAs(selectedCards, owner, viewAs) {
        precondition_1.Precondition.assert(!!viewAs, 'Unknown zuoxing card');
        return card_1.VirtualCard.create({
            cardName: viewAs,
            bySkill: ZuoXing.Name,
        });
    }
};
ZuoXingSide = tslib_1.__decorate([
    skill_1.SideEffectSkill,
    skill_1.PersistentSkill(),
    skill_1.CommonSkill({ name: 'side_zuoxing_s', description: 'side_zuoxing_s_description' })
], ZuoXingSide);
exports.ZuoXingSide = ZuoXingSide;
