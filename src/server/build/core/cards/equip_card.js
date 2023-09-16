"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OffenseRideCard = exports.DefenseRideCard = exports.RideCard = exports.PreciousCard = exports.ArmorCard = exports.WeaponCard = exports.EquipCard = void 0;
const card_1 = require("./card");
class EquipCard extends card_1.Card {
    constructor(subType) {
        super();
        this.cardType = [1 /* Equip */];
        this.effectUseDistance = 0;
        this.cardType.push(subType);
    }
    get BaseType() {
        return 1 /* Equip */;
    }
    get EquipType() {
        return this.cardType[1];
    }
}
exports.EquipCard = EquipCard;
class WeaponCard extends EquipCard {
    constructor(id, cardNumber, suit, name, description, fromPackage, skill, attackDistance, generalName, shadowSkills = []) {
        super(2 /* Weapon */);
        this.id = id;
        this.cardNumber = cardNumber;
        this.suit = suit;
        this.name = name;
        this.description = description;
        this.fromPackage = fromPackage;
        this.skill = skill;
        this.attackDistance = attackDistance;
        this.shadowSkills = shadowSkills;
        this.generalName = generalName || this.name;
    }
    get AttackDistance() {
        return this.attackDistance;
    }
}
exports.WeaponCard = WeaponCard;
class ArmorCard extends EquipCard {
    constructor(id, cardNumber, suit, name, description, fromPackage, skill, generalName, shadowSkills = []) {
        super(3 /* Shield */);
        this.id = id;
        this.cardNumber = cardNumber;
        this.suit = suit;
        this.name = name;
        this.description = description;
        this.fromPackage = fromPackage;
        this.skill = skill;
        this.shadowSkills = shadowSkills;
        this.generalName = generalName || this.name;
    }
}
exports.ArmorCard = ArmorCard;
class PreciousCard extends EquipCard {
    constructor(id, cardNumber, suit, name, description, fromPackage, skill, generalName, shadowSkills = []) {
        super(6 /* Precious */);
        this.id = id;
        this.cardNumber = cardNumber;
        this.suit = suit;
        this.name = name;
        this.description = description;
        this.fromPackage = fromPackage;
        this.skill = skill;
        this.shadowSkills = shadowSkills;
        this.generalName = generalName || this.name;
    }
}
exports.PreciousCard = PreciousCard;
class RideCard extends EquipCard {
    get Skill() {
        return this.skill;
    }
}
exports.RideCard = RideCard;
class DefenseRideCard extends RideCard {
    constructor(id, cardNumber, suit, name, description, fromPackage, skill, generalName, shadowSkills = []) {
        super(5 /* DefenseRide */);
        this.id = id;
        this.cardNumber = cardNumber;
        this.suit = suit;
        this.name = name;
        this.description = description;
        this.fromPackage = fromPackage;
        this.skill = skill;
        this.shadowSkills = shadowSkills;
        this.generalName = generalName || this.name;
    }
}
exports.DefenseRideCard = DefenseRideCard;
class OffenseRideCard extends RideCard {
    constructor(id, cardNumber, suit, name, description, fromPackage, skill, generalName, shadowSkills = []) {
        super(4 /* OffenseRide */);
        this.id = id;
        this.cardNumber = cardNumber;
        this.suit = suit;
        this.name = name;
        this.description = description;
        this.fromPackage = fromPackage;
        this.skill = skill;
        this.shadowSkills = shadowSkills;
        this.generalName = generalName || this.name;
    }
}
exports.OffenseRideCard = OffenseRideCard;
