"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HuaShen = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let HuaShen = class HuaShen extends skill_1.TriggerSkill {
    async whenDead(room, owner) {
        const playerPropertiesChangeEvent = {
            changedProperties: [
                {
                    toId: owner.Id,
                    nationality: owner.Character.Nationality,
                    gender: owner.Character.Gender,
                },
            ],
        };
        room.changePlayerProperties(playerPropertiesChangeEvent);
        const huashenInfo = owner.getHuaShenInfo();
        if (huashenInfo !== undefined) {
            await room.loseSkill(owner.Id, huashenInfo.skillName);
        }
    }
    async whenLosingSkill(room, owner) {
        const playerPropertiesChangeEvent = {
            changedProperties: [
                {
                    toId: owner.Id,
                    nationality: owner.Character.Nationality,
                    gender: owner.Character.Gender,
                },
            ],
        };
        room.changePlayerProperties(playerPropertiesChangeEvent);
        const huashenInfo = owner.getHuaShenInfo();
        if (huashenInfo !== undefined) {
            await room.loseSkill(owner.Id, huashenInfo.skillName);
        }
    }
    isAutoTrigger(room, owner, event) {
        if (event_packer_1.EventPacker.getIdentifier(event) === 143 /* GameBeginEvent */) {
            return true;
        }
        return false;
    }
    isTriggerable(event, stage) {
        return (stage === "AfterPhaseChanged" /* AfterPhaseChanged */ ||
            stage === "PhaseChanged" /* PhaseChanged */ ||
            stage === "AfterGameBegan" /* AfterGameBegan */);
    }
    canUse(room, owner, event, stage) {
        if (stage === "AfterGameBegan" /* AfterGameBegan */) {
            return true;
        }
        const content = event;
        const canUse = (content.toPlayer === owner.Id &&
            content.to === 0 /* PhaseBegin */ &&
            stage === "AfterPhaseChanged" /* AfterPhaseChanged */ &&
            owner.getCardIds(3 /* OutsideArea */, this.Name).length > 0) ||
            (content.fromPlayer === owner.Id &&
                content.from === 7 /* PhaseFinish */ &&
                stage === "PhaseChanged" /* PhaseChanged */ &&
                owner.getCardIds(3 /* OutsideArea */, this.Name).length > 0);
        return canUse;
    }
    async onTrigger() {
        return true;
    }
    getPriority(room, owner) {
        if (room.CurrentPlayerPhase === 0 /* PhaseBegin */) {
            return 0 /* High */;
        }
        else if (room.CurrentPlayerPhase === 7 /* PhaseFinish */) {
            return 2 /* Low */;
        }
        else {
            return 1 /* Medium */;
        }
    }
    async askForChoosingCharacter(room, who, amount, except) {
        let characterIds = who.getCardIds(3 /* OutsideArea */, this.GeneralName);
        if (except !== undefined) {
            characterIds = characterIds.filter(characterId => characterId !== except);
        }
        const askForChoosingCharacterEvent = {
            characterIds,
            toId: who.Id,
            amount,
            byHuaShen: true,
            triggeredBySkills: [this.Name],
        };
        room.notify(169 /* AskForChoosingCharacterEvent */, askForChoosingCharacterEvent, who.Id);
        const { chosenCharacterIds } = await room.onReceivingAsyncResponseFrom(169 /* AskForChoosingCharacterEvent */, who.Id);
        return chosenCharacterIds;
    }
    async disguise(room, who) {
        const player = room.getPlayerById(who);
        const chosenCharacterIds = await this.askForChoosingCharacter(room, player, 1);
        const character = engine_1.Sanguosha.getCharacterById(chosenCharacterIds[0]);
        const playerPropertiesChangeEvent = {
            changedProperties: [{ toId: who, nationality: character.Nationality, gender: character.Gender }],
        };
        room.changePlayerProperties(playerPropertiesChangeEvent);
        const options = character.Skills.filter(skill => !(skill.isShadowSkill() ||
            skill.isLordSkill() ||
            skill.SkillType === 3 /* Limit */ ||
            skill.SkillType === 2 /* Awaken */ ||
            skill.SkillType === 4 /* Quest */)).map(skill => skill.GeneralName);
        const askForChoosingOptionsEvent = {
            options,
            toId: who,
            conversation: 'huashen: please announce a skill to obtain',
            triggeredBySkills: [this.Name],
        };
        room.notify(168 /* AskForChoosingOptionsEvent */, event_packer_1.EventPacker.createUncancellableEvent(askForChoosingOptionsEvent), who);
        const { selectedOption } = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, who);
        const huashenInfo = player.getHuaShenInfo();
        if (huashenInfo !== undefined) {
            await room.loseSkill(who, huashenInfo.skillName);
        }
        player.setHuaShenInfo({ skillName: selectedOption, characterId: character.Id });
        room.broadcast(109 /* HuaShenCardUpdatedEvent */, {
            toId: player.Id,
            latestHuaShen: character.Id,
            latestHuaShenSkillName: selectedOption,
        });
        await room.obtainSkill(who, selectedOption, true);
    }
    async onEffect(room, skillEffectEvent) {
        const player = room.getPlayerById(skillEffectEvent.fromId);
        if (room.Circle === 1 && !player.getFlag(this.GeneralName)) {
            player.setFlag(this.GeneralName, true);
            const huashen = room.getRandomCharactersFromLoadedPackage(3);
            room.setCharacterOutsideAreaCards(skillEffectEvent.fromId, this.GeneralName, huashen, translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} obtained character cards {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(player), translation_json_tool_1.TranslationPack.wrapArrayParams(...huashen.map(characterId => engine_1.Sanguosha.getCharacterById(characterId).Name))).extract(), translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} swapped {1} character cards', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(player), huashen.length).extract());
            await this.disguise(room, skillEffectEvent.fromId);
        }
        else {
            const askForChoosingOptionsEvent = {
                options: ['option-one', 'option-two'],
                toId: skillEffectEvent.fromId,
                conversation: 'please choose: 1. show a character from huashen area and announce a skill to obtain. 2. remove no more than two unshown characters of huashen and get equal number of that.',
                triggeredBySkills: [this.Name],
            };
            room.notify(168 /* AskForChoosingOptionsEvent */, event_packer_1.EventPacker.createUncancellableEvent(askForChoosingOptionsEvent), skillEffectEvent.fromId);
            const { selectedOption } = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, skillEffectEvent.fromId);
            if (selectedOption === 'option-one') {
                await this.disguise(room, skillEffectEvent.fromId);
            }
            else {
                const huashenInfo = precondition_1.Precondition.exists(player.getHuaShenInfo(), 'unknown huashen info');
                const selectedCharacterIds = await this.askForChoosingCharacter(room, player, 2, huashenInfo.characterId);
                const huashenCards = player.getCardIds(3 /* OutsideArea */, this.GeneralName);
                const huashen = room.getRandomCharactersFromLoadedPackage(selectedCharacterIds.length, huashenCards);
                const newHuashenCards = huashenCards
                    .filter(characterId => !selectedCharacterIds.includes(characterId))
                    .concat(huashen);
                room.setCharacterOutsideAreaCards(player.Id, this.GeneralName, newHuashenCards, translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} obtained character cards {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(player), translation_json_tool_1.TranslationPack.wrapArrayParams(...huashen.map(characterId => engine_1.Sanguosha.getCharacterById(characterId).Name))).extract(), translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} swapped {1} character cards', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(player), huashen.length).extract());
            }
        }
        return true;
    }
};
HuaShen = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'huashen', description: 'huashen_description' })
], HuaShen);
exports.HuaShen = HuaShen;
