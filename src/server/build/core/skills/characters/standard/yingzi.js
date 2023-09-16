"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YingZiShadow = exports.YingZi = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
let YingZi = class YingZi extends skill_1.TriggerSkill {
    get RelatedCharacters() {
        return ['sunce', 'gexuan', 'heqi', 'sunyi'];
    }
    audioIndex(characterName) {
        return characterName && this.RelatedCharacters.slice(1, this.RelatedCharacters.length).includes(characterName)
            ? 1
            : 2;
    }
    isTriggerable(event, stage) {
        return stage === "CardDrawing" /* CardDrawing */;
    }
    canUse(room, owner, content) {
        return (owner.Id === content.fromId &&
            room.CurrentPlayerPhase === 3 /* DrawCardStage */ &&
            content.bySpecialReason === 0 /* GameStage */);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent } = skillUseEvent;
        const drawCardEvent = triggeredOnEvent;
        drawCardEvent.drawAmount += 1;
        return true;
    }
};
YingZi = tslib_1.__decorate([
    skill_1.CompulsorySkill({ name: 'yingzi', description: 'yingzi_description' })
], YingZi);
exports.YingZi = YingZi;
let YingZiShadow = class YingZiShadow extends skill_1.RulesBreakerSkill {
    breakBaseCardHoldNumber(room, owner) {
        return owner.MaxHp;
    }
};
YingZiShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CompulsorySkill({ name: YingZi.GeneralName, description: YingZi.Description })
], YingZiShadow);
exports.YingZiShadow = YingZiShadow;
