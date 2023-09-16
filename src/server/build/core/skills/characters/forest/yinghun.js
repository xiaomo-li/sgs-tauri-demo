"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YingHun = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let YingHun = class YingHun extends skill_1.TriggerSkill {
    get RelatedCharacters() {
        return ['sunce', 'sunyi'];
    }
    audioIndex(characterName) {
        return characterName && this.RelatedCharacters.slice(1, this.RelatedCharacters.length).includes(characterName)
            ? 1
            : 2;
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ && event.toStage === 3 /* PrepareStageStart */;
    }
    canUse(room, owner, content) {
        return content.playerId === owner.Id && owner.Hp < owner.MaxHp;
    }
    targetFilter(room, owner, targets) {
        return targets.length === 1;
    }
    isAvailableTarget(owner, room, target) {
        return owner !== target;
    }
    async onTrigger(room, skillUseEvent) {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        const options = ['yinghun:option-one', 'yinghun:option-two'];
        let selected;
        const from = room.getPlayerById(fromId);
        const toId = toIds[0];
        const x = from.LostHp;
        if (x > 1) {
            const askForChooseEvent = event_packer_1.EventPacker.createUncancellableEvent({
                options,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('please choose yinghun options:{0}:{1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(toId)), x).extract(),
                toId: fromId,
                triggeredBySkills: [this.Name],
            });
            room.notify(168 /* AskForChoosingOptionsEvent */, askForChooseEvent, fromId);
            const response = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, fromId);
            selected = response.selectedOption || 'yinghun:option-one';
        }
        if (!selected || selected === 'yinghun:option-one') {
            await room.drawCards(1, toId, 'top', fromId, this.Name);
            const response = await room.askForCardDrop(toId, x, [0 /* HandArea */, 1 /* EquipArea */], true, undefined, this.Name);
            response.droppedCards.length > 0 && (await room.dropCards(4 /* SelfDrop */, response.droppedCards, toId));
        }
        else {
            await room.drawCards(x, toId, 'top', fromId, this.Name);
            const response = await room.askForCardDrop(toId, 1, [0 /* HandArea */, 1 /* EquipArea */], true, undefined, this.Name);
            response.droppedCards.length > 0 && (await room.dropCards(4 /* SelfDrop */, response.droppedCards, toId));
        }
        return true;
    }
};
YingHun = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'yinghun', description: 'yinghun_description' })
], YingHun);
exports.YingHun = YingHun;
