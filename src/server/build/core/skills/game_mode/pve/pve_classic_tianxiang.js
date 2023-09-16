"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PveClassicTianXiang = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let PveClassicTianXiang = class PveClassicTianXiang extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "DamageFinishedEffect" /* DamageFinishedEffect */;
    }
    canUse(room, owner, content) {
        return content.toId === owner.Id && owner.isInjured();
    }
    cardFilter(room, owner, cards) {
        return cards.length === owner.MaxHp - owner.Hp;
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: you can drop {1}', this.Name, owner.MaxHp - owner.Hp).extract();
    }
    async onTrigger(room, skillUseEvent) {
        skillUseEvent.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} triggered skill {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(skillUseEvent.fromId)), this.Name).extract();
        return true;
    }
    async onEffect(room, event) {
        const owner = room.getPlayerById(event.fromId);
        if (!event.cardIds) {
            return false;
        }
        await room.dropCards(4 /* SelfDrop */, event.cardIds, owner.Id, owner.Id, this.Name);
        const blackCardNumber = event.cardIds.filter(cardId => engine_1.Sanguosha.getCardById(cardId).Color === 1 /* Black */).length;
        if (blackCardNumber === 0) {
            const fromId = event.triggeredOnEvent.fromId;
            const damageFrom = fromId && room.getPlayerById(fromId);
            if (damageFrom && !damageFrom.Dead) {
                await room.damage({
                    fromId: owner.Id,
                    damage: 1,
                    damageType: "normal_property" /* Normal */,
                    toId: damageFrom.Id,
                    triggeredBySkills: [this.Name],
                });
            }
        }
        else {
            await room.drawCards(blackCardNumber * 2, owner.Id);
        }
        return true;
    }
};
PveClassicTianXiang = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'pve_classic_tianxiang', description: 'pve_classic_tianxiang_description' })
], PveClassicTianXiang);
exports.PveClassicTianXiang = PveClassicTianXiang;
