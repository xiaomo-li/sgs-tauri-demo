"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Character = exports.Armor = exports.Lord = exports.getGenderRawText = exports.getNationalityRawText = void 0;
const game_props_1 = require("core/game/game_props");
function getNationalityRawText(nationality) {
    const rawNationalityText = ['wei', 'shu', 'wu', 'qun', 'god'];
    return rawNationalityText[nationality];
}
exports.getNationalityRawText = getNationalityRawText;
function getGenderRawText(gender) {
    const rawGenderText = ['male', 'female', 'unknoun'];
    return rawGenderText[gender];
}
exports.getGenderRawText = getGenderRawText;
function Lord(constructor) {
    return class extends constructor {
        constructor() {
            super(...arguments);
            this.lord = true;
        }
    };
}
exports.Lord = Lord;
function Armor(amount) {
    return function (constructor) {
        return class extends constructor {
            constructor() {
                super(...arguments);
                this.armor = Math.max(Math.min(amount, game_props_1.UPPER_LIMIT_OF_ARMOR), 0);
            }
        };
    };
}
exports.Armor = Armor;
class Character {
    constructor(id, name, gender, nationality, maxHp, hp, fromPackage, skills) {
        this.id = id;
        this.name = name;
        this.gender = gender;
        this.nationality = nationality;
        this.maxHp = maxHp;
        this.hp = hp;
        this.fromPackage = fromPackage;
        this.skills = skills;
        this.turnedOver = false;
        this.linked = false;
        this.lord = false;
        this.armor = 0;
    }
    getSkillsDescrption() {
        return this.skills.map(skill => skill.Description);
    }
    isLord() {
        return this.lord;
    }
    get Id() {
        return this.id;
    }
    get MaxHp() {
        return this.maxHp;
    }
    get Hp() {
        return this.hp;
    }
    get Armor() {
        return this.armor;
    }
    get Nationality() {
        return this.nationality;
    }
    get Skills() {
        return this.skills;
    }
    get Name() {
        return this.name;
    }
    get Package() {
        return this.fromPackage;
    }
    get Gender() {
        return this.gender;
    }
    turnOver() {
        this.turnedOver = !this.turnedOver;
    }
    isTurnOver() {
        return this.turnedOver;
    }
    link() {
        this.linked = true;
    }
    unlink() {
        this.linked = false;
    }
    isLinked() {
        return this.linked;
    }
}
exports.Character = Character;
