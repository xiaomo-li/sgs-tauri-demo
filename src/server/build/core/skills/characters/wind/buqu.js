"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuQuShadow = exports.BuQu = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let BuQu = class BuQu extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "RequestRescue" /* RequestRescue */;
    }
    canUse(room, owner, content) {
        return content.dying === owner.Id && content.rescuer === owner.Id;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillEffectEvent) {
        const from = room.getPlayerById(skillEffectEvent.fromId);
        const chuang = room.getCards(1, 'top');
        room.broadcast(103 /* CustomGameDialog */, {
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} displayed cards {1} from top of draw stack', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from), translation_json_tool_1.TranslationPack.patchCardInTranslation(...chuang)).extract(),
        });
        const overload = from
            .getCardIds(3 /* OutsideArea */, this.Name)
            .map(id => engine_1.Sanguosha.getCardById(id).CardNumber)
            .includes(engine_1.Sanguosha.getCardById(chuang[0]).CardNumber);
        await room.moveCards({
            movingCards: chuang.map(card => ({ card, fromArea: 6 /* ProcessingArea */ })),
            toId: overload ? undefined : skillEffectEvent.fromId,
            toArea: overload ? 4 /* DropStack */ : 3 /* OutsideArea */,
            moveReason: overload ? 6 /* PlaceToDropStack */ : 2 /* ActiveMove */,
            toOutsideArea: this.Name,
            isOutsideAreaInPublic: true,
            proposer: skillEffectEvent.fromId,
            movedByReason: this.Name,
        });
        if (!overload) {
            await room.recover({
                recoveredHp: 1 - from.Hp,
                recoverBy: skillEffectEvent.fromId,
                toId: skillEffectEvent.fromId,
            });
        }
        return true;
    }
};
BuQu = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'buqu', description: 'buqu_description' })
], BuQu);
exports.BuQu = BuQu;
let BuQuShadow = class BuQuShadow extends skill_1.RulesBreakerSkill {
    breakBaseCardHoldNumber(room, owner) {
        return owner.getCardIds(3 /* OutsideArea */, this.GeneralName).length === 0
            ? -1
            : owner.getCardIds(3 /* OutsideArea */, this.GeneralName).length;
    }
};
BuQuShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_wrappers_1.CompulsorySkill({ name: BuQu.Name, description: BuQu.Description })
], BuQuShadow);
exports.BuQuShadow = BuQuShadow;
