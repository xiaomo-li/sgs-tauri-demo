"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PveLongshenGameProcessor = void 0;
const event_packer_1 = require("core/event/event_packer");
const algorithm_1 = require("core/shares/libs/algorithm");
const pve_longshen_skills_1 = require("core/skills/game_mode/pve/pve_longshen_skills");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const game_processor_pve_classic_1 = require("./game_processor.pve_classic");
const engine_1 = require("../engine");
class PveLongshenGameProcessor extends game_processor_pve_classic_1.PveClassicGameProcessor {
    constructor() {
        super(...arguments);
        this.proposalCharacters = [];
    }
    getWinners(players) {
        const alivePlayers = players.filter(player => !player.Dead);
        if (alivePlayers.every(player => player.isSmartAI()) ||
            (alivePlayers.every(player => !player.isSmartAI()) && this.level === 7)) {
            return alivePlayers;
        }
    }
    async nextLevel() {
        this.level++;
        const boss = this.room.Players.find(player => player.isSmartAI());
        const originSkills = engine_1.Sanguosha.getCharacterByCharaterName('pve_longshen').Skills.map(skill => skill.Name);
        this.room.loseSkill(boss.Id, boss
            .getPlayerSkills()
            .filter(skill => !originSkills.includes(skill.Name))
            .map(skill => skill.Name));
        this.room.activate({
            changedProperties: [{ toId: boss.Id, maxHp: boss.MaxHp + 1, hp: boss.MaxHp + 1, activate: true }],
        });
        const candSkills = pve_longshen_skills_1.pveLongShenSkills.slice();
        algorithm_1.Algorithm.shuffle(candSkills);
        let weights = 0;
        const exceptWeights = this.level * this.room.Players.filter(player => !player.isSmartAI()).length;
        while (weights < exceptWeights) {
            const item = candSkills.shift();
            if (item === undefined) {
                break;
            }
            if (item.weights + weights > exceptWeights) {
                continue;
            }
            weights += item.weights;
            this.room.obtainSkill(boss.Id, item.name);
        }
        if (this.level > 1) {
            this.drawGameBeginsCards(boss.getPlayerInfo());
        }
        const levelBeginEvent = {};
        levelBeginEvent.messages = [translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} level start', this.level).toString()];
        await this.onHandleIncomingEvent(145 /* LevelBeginEvent */, event_packer_1.EventPacker.createIdentifierEvent(145 /* LevelBeginEvent */, levelBeginEvent));
    }
    async beforeGameStartPreparation() {
        await this.nextLevel();
    }
    async chooseCharacters(playersInfo, selectableCharacters) {
        // link to  assignRoles
        const bossPropertiesChangeEvent = {
            changedProperties: [
                {
                    toId: playersInfo.find(info => info.Role === 3 /* Rebel */).Id,
                    characterId: engine_1.Sanguosha.getCharacterByCharaterName('pve_longshen').Id,
                },
            ],
        };
        this.room.changePlayerProperties(bossPropertiesChangeEvent);
        const otherPlayersInfo = playersInfo.filter(info => !this.room.getPlayerById(info.Id).isSmartAI());
        await this.sequentialChooseCharacters(otherPlayersInfo, selectableCharacters, []);
    }
}
exports.PveLongshenGameProcessor = PveLongshenGameProcessor;
