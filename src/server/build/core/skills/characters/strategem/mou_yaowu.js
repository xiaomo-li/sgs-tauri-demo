"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MouYaoWu = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let MouYaoWu = class MouYaoWu extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "DamagedEffect" /* DamagedEffect */;
    }
    canUse(room, owner, content) {
        const { fromId, toId, cardIds } = content;
        if (cardIds === undefined || engine_1.Sanguosha.getCardById(cardIds[0]).GeneralName !== 'slash') {
            return false;
        }
        const card = engine_1.Sanguosha.getCardById(cardIds[0]);
        if (card.isRed() && (!fromId || room.getPlayerById(fromId).Dead)) {
            return false;
        }
        return owner.Id === toId;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const damageEvent = event.triggeredOnEvent;
        if (engine_1.Sanguosha.getCardById(damageEvent.cardIds[0]).isRed()) {
            const source = damageEvent.fromId;
            let selectedOption = 'mou_yaowu:draw';
            if (room.getPlayerById(source).LostHp > 0) {
                const options = [selectedOption, 'mou_yaowu:recover'];
                const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
                    options,
                    conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose mou_yaowu options', this.Name).extract(),
                    toId: source,
                    triggeredBySkills: [this.Name],
                }, source, true);
                selectedOption = response.selectedOption || options[0];
            }
            if (selectedOption === 'mou_yaowu:recover') {
                await room.recover({
                    toId: source,
                    recoveredHp: 1,
                    recoverBy: event.fromId,
                });
            }
            else {
                await room.drawCards(1, source, 'top', source, this.Name);
            }
        }
        else {
            await room.drawCards(1, event.fromId, 'top', event.fromId, this.Name);
        }
        return true;
    }
};
MouYaoWu = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'mou_yaowu', description: 'mou_yaowu_description' })
], MouYaoWu);
exports.MouYaoWu = MouYaoWu;
