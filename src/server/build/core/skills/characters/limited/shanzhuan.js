"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShanZhuan = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ShanZhuan = class ShanZhuan extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */ || stage === "AfterDamageEffect" /* AfterDamageEffect */;
    }
    canUse(room, owner, event, stage) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 137 /* DamageEvent */) {
            const damageEvent = event;
            const victim = room.getPlayerById(damageEvent.toId);
            return (damageEvent.fromId === owner.Id &&
                damageEvent.toId !== damageEvent.fromId &&
                !victim.Dead &&
                victim.getCardIds(2 /* JudgeArea */).length === 0 &&
                victim.getPlayerCards().length > 0 &&
                !victim.judgeAreaDisabled());
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = event;
            return (phaseChangeEvent.fromPlayer === owner.Id &&
                phaseChangeEvent.from === 7 /* PhaseFinish */ &&
                room.Analytics.getDamageRecord(owner.Id, 'round', undefined, 1).length === 0);
        }
        return false;
    }
    getSkillLog(room, owner, event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        return identifier === 137 /* DamageEvent */
            ? translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to put a card from {1} into his judge area?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.toId))).extract()
            : translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to draw a card?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const unknownEvent = event.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 137 /* DamageEvent */) {
            const victim = unknownEvent.toId;
            const options = {
                [1 /* EquipArea */]: room.getPlayerById(victim).getCardIds(1 /* EquipArea */),
                [0 /* HandArea */]: room.getPlayerById(victim).getCardIds(0 /* HandArea */).length,
            };
            const resposne = await room.askForChoosingPlayerCard({
                fromId,
                toId: victim,
                options,
                triggeredBySkills: [this.Name],
            }, fromId, false, true);
            if (!resposne) {
                return false;
            }
            const realCard = engine_1.Sanguosha.getCardById(card_1.VirtualCard.getActualCards([resposne.selectedCard])[0]);
            const toMove = realCard.is(8 /* DelayedTrick */)
                ? realCard.Id
                : realCard.isBlack()
                    ? card_1.VirtualCard.create({ cardName: 'bingliangcunduan', bySkill: this.Name }, [realCard.Id]).Id
                    : card_1.VirtualCard.create({ cardName: 'lebusishu', bySkill: this.Name }, [realCard.Id]).Id;
            await room.moveCards({
                movingCards: [{ card: toMove, fromArea: resposne.fromArea }],
                fromId: victim,
                toId: victim,
                toArea: 2 /* JudgeArea */,
                moveReason: 3 /* PassiveMove */,
                proposer: fromId,
                triggeredBySkills: [this.Name],
            });
        }
        else {
            await room.drawCards(1, fromId, 'top', fromId, this.Name);
        }
        return true;
    }
};
ShanZhuan = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'shanzhuan', description: 'shanzhuan_description' })
], ShanZhuan);
exports.ShanZhuan = ShanZhuan;
