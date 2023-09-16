"use strict";
var AnJian_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnJianPeach = exports.AnJian = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const target_group_1 = require("core/shares/libs/utils/target_group");
const qinggang_1 = require("core/skills/cards/standard/qinggang");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let AnJian = AnJian_1 = class AnJian extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        const unknownEvent = event_packer_1.EventPacker.getIdentifier(event);
        if (unknownEvent === 131 /* AimEvent */) {
            return stage === "AfterAim" /* AfterAim */;
        }
        else if (unknownEvent === 137 /* DamageEvent */) {
            return stage === "DamageEffect" /* DamageEffect */;
        }
        else if (unknownEvent === 124 /* CardUseEvent */) {
            return stage === "CardUseFinishedEffect" /* CardUseFinishedEffect */;
        }
        else if (unknownEvent === 152 /* PlayerDyingEvent */) {
            return stage === "PlayerDying" /* PlayerDying */ || stage === "AfterPlayerDying" /* AfterPlayerDying */;
        }
        return false;
    }
    canUse(room, owner, content, stage) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 131 /* AimEvent */) {
            content = content;
            return (owner.Id === content.fromId &&
                content.byCardId !== undefined &&
                engine_1.Sanguosha.getCardById(content.byCardId).GeneralName === 'slash' &&
                !room.withinAttackDistance(room.getPlayerById(content.toId), owner));
        }
        else if (identifier === 137 /* DamageEvent */) {
            content = content;
            return (owner.Id === content.fromId &&
                room.getPlayerById(content.toId).getFlag(this.GeneralName) &&
                content.cardIds !== undefined &&
                engine_1.Sanguosha.getCardById(content.cardIds[0]).GeneralName === 'slash');
        }
        else if (identifier === 152 /* PlayerDyingEvent */) {
            content = content;
            const dying = room.getPlayerById(content.dying);
            if (dying.getFlag(this.GeneralName) &&
                content.killedByCards &&
                engine_1.Sanguosha.getCardById(content.killedByCards[0]).GeneralName === 'slash') {
                dying.setFlag(AnJian_1.AnJianDying, stage);
                return true;
            }
        }
        else if (identifier === 124 /* CardUseEvent */) {
            content = content;
            return engine_1.Sanguosha.getCardById(content.cardId).GeneralName === 'slash';
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent } = skillUseEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(triggeredOnEvent);
        if (identifier === 131 /* AimEvent */) {
            const { toId } = triggeredOnEvent;
            const aimEvent = triggeredOnEvent;
            aimEvent.triggeredBySkills = aimEvent.triggeredBySkills
                ? [...aimEvent.triggeredBySkills, qinggang_1.QingGangSkill.GeneralName]
                : [qinggang_1.QingGangSkill.GeneralName];
            room.setFlag(toId, this.GeneralName, true, this.GeneralName);
        }
        else if (identifier === 137 /* DamageEvent */) {
            const { fromId } = triggeredOnEvent;
            const damageEvent = triggeredOnEvent;
            damageEvent.damage++;
            damageEvent.messages = damageEvent.messages || [];
            damageEvent.messages.push(translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used skill {1}, damage increases to {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId)), this.Name, damageEvent.damage).toString());
        }
        else if (identifier === 152 /* PlayerDyingEvent */) {
            const dyingEvent = triggeredOnEvent;
            const stage = room.getFlag(dyingEvent.dying, AnJian_1.AnJianDying);
            if (stage === "PlayerDying" /* PlayerDying */) {
                await room.obtainSkill(dyingEvent.dying, AnJianPeach.Name);
            }
            else if (stage === "AfterPlayerDying" /* AfterPlayerDying */) {
                await room.loseSkill(dyingEvent.dying, AnJianPeach.Name);
            }
            room.getPlayerById(dyingEvent.dying).removeFlag(AnJian_1.AnJianDying);
        }
        else if (identifier === 124 /* CardUseEvent */) {
            const cardEvent = triggeredOnEvent;
            const toIds = target_group_1.TargetGroupUtil.getRealTargets(cardEvent.targetGroup);
            room.removeFlag(toIds[0], this.GeneralName);
        }
        return true;
    }
};
AnJian.AnJianDying = 'anjian_dying';
AnJian = AnJian_1 = tslib_1.__decorate([
    skill_1.CompulsorySkill({ name: 'anjian', description: 'anjian_description' })
], AnJian);
exports.AnJian = AnJian;
let AnJianPeach = class AnJianPeach extends skill_1.FilterSkill {
    canUseCard(cardId, room, owner, onResponse, isCardResponse) {
        const isPeachCard = cardId instanceof card_matcher_1.CardMatcher
            ? new card_matcher_1.CardMatcher({ name: ['peach'] }).match(cardId)
            : engine_1.Sanguosha.getCardById(cardId).GeneralName === 'peach';
        if (!isCardResponse && isPeachCard && room.getPlayerById(owner).hasCard(room, cardId, 0 /* HandArea */)) {
            return false;
        }
        return true;
    }
};
AnJianPeach = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CompulsorySkill({ name: 'shadow_anjianPeach', description: 'shadow_anjianPeach_description' })
], AnJianPeach);
exports.AnJianPeach = AnJianPeach;
