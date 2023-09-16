"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AI = exports.SwitchSkill = exports.CircleSkill = exports.SideEffectSkill = exports.UniqueSkill = exports.PersistentSkill = exports.ShadowSkill = exports.SelfTargetSkill = exports.LordSkill = exports.QuestSkill = exports.CompulsorySkill = exports.LimitSkill = exports.AwakeningSkill = exports.CommonSkill = void 0;
function onCalculatingSkillUsageWrapper(skillType, name, description, constructor) {
    return class WrappedSkillConstructor extends constructor {
        constructor() {
            super();
            this.skillType = skillType;
            this.description = description;
            this.skillName = name;
            if (this.skillType === 2 /* Awaken */ || this.skillType === 3 /* Limit */) {
                this.isRefreshAt = () => false;
                this.canUse = (room, owner, content) => !owner.hasUsedSkill(this.Name) && super.canUse(room, owner, content);
            }
        }
        static get Description() {
            return description;
        }
        static get GeneralName() {
            return name.replace(/#+/, '');
        }
        static get Name() {
            return name;
        }
    };
}
function skillPropertyWrapper(options, constructor) {
    return class WrappedSkillConstructor extends constructor {
        constructor() {
            super();
            if (options.lordSkill !== undefined) {
                this.lordSkill = options.lordSkill;
            }
            if (options.shadowSkill !== undefined) {
                this.shadowSkill = options.shadowSkill;
                this.skillName = '#' + this.skillName;
            }
            if (options.uniqueSkill !== undefined) {
                this.uniqueSkill = options.uniqueSkill;
            }
            if (options.selfTargetSkill !== undefined) {
                this.selfTargetSkill = options.selfTargetSkill;
            }
            if (options.sideEffectSkill !== undefined) {
                this.sideEffectSkill = options.sideEffectSkill;
                this.skillName = '~' + this.skillName;
            }
            if (options.persistentSkill !== undefined) {
                this.persistentSkill = options.persistentSkill;
            }
            if (options.stubbornSkill !== undefined) {
                this.stubbornSkill = options.stubbornSkill;
            }
            if (options.circleSkill !== undefined) {
                this.circleSkill = options.circleSkill;
            }
            if (options.switchSkill !== undefined) {
                this.switchSkill = options.switchSkill;
            }
            if (options.switchable !== undefined) {
                this.switchable = options.switchable;
            }
            if (options.ai) {
                this.ai = new options.ai();
            }
        }
    };
}
const CommonSkill = (skill) => (constructorFunction) => onCalculatingSkillUsageWrapper(0 /* Common */, skill.name, skill.description, constructorFunction);
exports.CommonSkill = CommonSkill;
const AwakeningSkill = (skill) => (constructorFunction) => onCalculatingSkillUsageWrapper(2 /* Awaken */, skill.name, skill.description, constructorFunction);
exports.AwakeningSkill = AwakeningSkill;
const LimitSkill = (skill) => (constructorFunction) => onCalculatingSkillUsageWrapper(3 /* Limit */, skill.name, skill.description, constructorFunction);
exports.LimitSkill = LimitSkill;
const CompulsorySkill = (skill) => (constructorFunction) => onCalculatingSkillUsageWrapper(1 /* Compulsory */, skill.name, skill.description, constructorFunction);
exports.CompulsorySkill = CompulsorySkill;
const QuestSkill = (skill) => (constructorFunction) => onCalculatingSkillUsageWrapper(4 /* Quest */, skill.name, skill.description, constructorFunction);
exports.QuestSkill = QuestSkill;
function LordSkill(constructorFunction) {
    return skillPropertyWrapper({
        lordSkill: true,
    }, constructorFunction);
}
exports.LordSkill = LordSkill;
function SelfTargetSkill(constructorFunction) {
    return skillPropertyWrapper({
        selfTargetSkill: true,
    }, constructorFunction);
}
exports.SelfTargetSkill = SelfTargetSkill;
const ShadowSkill = (constructorFunction) => {
    const WrappedConstructor = skillPropertyWrapper({
        shadowSkill: true,
    }, constructorFunction);
    return class extends WrappedConstructor {
        static get Name() {
            return '#' + super.Name;
        }
    };
};
exports.ShadowSkill = ShadowSkill;
const PersistentSkill = (option) => (constructorFunction) => skillPropertyWrapper({
    persistentSkill: true,
    stubbornSkill: option === null || option === void 0 ? void 0 : option.stubbornSkill,
}, constructorFunction);
exports.PersistentSkill = PersistentSkill;
function UniqueSkill(constructorFunction) {
    return skillPropertyWrapper({
        uniqueSkill: true,
    }, constructorFunction);
}
exports.UniqueSkill = UniqueSkill;
function SideEffectSkill(constructorFunction) {
    const WrappedConstructor = skillPropertyWrapper({
        sideEffectSkill: true,
    }, constructorFunction);
    return class extends WrappedConstructor {
        static get Name() {
            return '~' + super.Name;
        }
    };
}
exports.SideEffectSkill = SideEffectSkill;
function CircleSkill(constructorFunction) {
    return skillPropertyWrapper({
        circleSkill: true,
    }, constructorFunction);
}
exports.CircleSkill = CircleSkill;
const SwitchSkill = (switchable = true) => (constructorFunction) => skillPropertyWrapper({
    switchSkill: true,
    switchable,
}, constructorFunction);
exports.SwitchSkill = SwitchSkill;
const AI = (instance) => (constructorFunction) => skillPropertyWrapper({
    ai: instance,
}, constructorFunction);
exports.AI = AI;
