"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FangZhu = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let FangZhu = class FangZhu extends skill_1.TriggerSkill {
    get RelatedCharacters() {
        return ['god_simayi'];
    }
    audioIndex(characterName) {
        return characterName && this.RelatedCharacters.includes(characterName) ? 1 : 2;
    }
    isTriggerable(event, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    canUse(room, owner, event) {
        return owner.Id === event.toId;
    }
    targetFilter(room, owner, targets) {
        return targets.length === 1;
    }
    isAvailableTarget(owner, room, target) {
        return owner !== target;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { toIds, fromId } = skillUseEvent;
        const to = room.getPlayerById(toIds[0]);
        const from = room.getPlayerById(fromId);
        if (to.getPlayerCards().filter(id => room.canDropCard(to.Id, id)).length < from.LostHp) {
            await room.turnOver(toIds[0]);
            await room.drawCards(from.LostHp, toIds[0], undefined, fromId, this.Name);
        }
        else {
            const askForOptionsEvent = {
                options: ['option-one', 'option-two'],
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('please choose fangzhu options:{0}', from.LostHp).extract(),
                toId: toIds[0],
                askedBy: fromId,
                triggeredBySkills: [this.Name],
            };
            room.notify(168 /* AskForChoosingOptionsEvent */, event_packer_1.EventPacker.createUncancellableEvent(askForOptionsEvent), toIds[0]);
            const response = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, toIds[0]);
            response.selectedOption = response.selectedOption || 'option-one';
            if (response.selectedOption === 'option-one') {
                await room.turnOver(toIds[0]);
                await room.drawCards(from.LostHp, toIds[0], undefined, fromId, this.Name);
            }
            else {
                const response = await room.askForCardDrop(toIds[0], from.LostHp, [0 /* HandArea */, 1 /* EquipArea */], true, undefined, this.Name);
                if (response.droppedCards.length > 0) {
                    await room.dropCards(4 /* SelfDrop */, response.droppedCards, toIds[0]);
                    await room.loseHp(toIds[0], 1);
                }
                else {
                    await room.turnOver(toIds[0]);
                    await room.drawCards(from.LostHp, toIds[0], undefined, fromId, this.Name);
                }
            }
        }
        return true;
    }
};
FangZhu = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'fangzhu', description: 'fangzhu_description' })
], FangZhu);
exports.FangZhu = FangZhu;
