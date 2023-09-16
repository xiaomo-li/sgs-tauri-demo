"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AimGroupUtil = void 0;
const target_group_1 = require("./target_group");
class AimGroupUtil {
    static initAimGroup(playerIds) {
        return { [0 /* Undone */]: playerIds, [1 /* Done */]: [], [2 /* Cancelled */]: [] };
    }
    static getAllTargets(aimGroup) {
        return [...aimGroup[0 /* Undone */], ...aimGroup[1 /* Done */]].reduce((targets, target) => {
            targets.includes(target) || targets.push(target);
            return targets;
        }, []);
    }
    static getUndoneOrDoneTargets(aimGroup, done) {
        return done ? aimGroup[1 /* Done */] : aimGroup[0 /* Undone */];
    }
    static setTargetDone(aimGroup, playerId) {
        const index = aimGroup[0 /* Undone */].findIndex(id => id === playerId);
        if (index !== -1) {
            aimGroup[0 /* Undone */].splice(index, 1);
            aimGroup[1 /* Done */].push(playerId);
        }
    }
    static addTargets(room, aimEvent, playerIds) {
        const playerId = playerIds instanceof Array ? playerIds[0] : playerIds;
        aimEvent.allTargets[0 /* Undone */].push(playerId);
        room.sortPlayersByPosition(aimEvent.allTargets[0 /* Undone */]);
        aimEvent.targetGroup && target_group_1.TargetGroupUtil.pushTargets(aimEvent.targetGroup, playerIds);
    }
    static cancelTarget(aimEvent, playerId) {
        for (const key of Object.keys(aimEvent.allTargets)) {
            aimEvent.allTargets[key] = aimEvent.allTargets[key].filter(id => id !== playerId);
        }
        aimEvent.allTargets[2 /* Cancelled */].push(playerId);
        aimEvent.targetGroup && target_group_1.TargetGroupUtil.removeTarget(aimEvent.targetGroup, playerId);
    }
    static removeDeadTargets(room, aimEvent) {
        aimEvent.allTargets[0 /* Undone */] = room.deadPlayerFilters(aimEvent.allTargets[0 /* Undone */]);
        aimEvent.allTargets[1 /* Done */] = room.deadPlayerFilters(aimEvent.allTargets[1 /* Done */]);
        if (aimEvent.targetGroup) {
            const targets = target_group_1.TargetGroupUtil.getRealTargets(aimEvent.targetGroup);
            for (const target of targets) {
                if (room.getPlayerById(target).Dead) {
                    target_group_1.TargetGroupUtil.removeTarget(aimEvent.targetGroup, target);
                }
            }
        }
    }
    static getCancelledTargets(aimGroup) {
        return aimGroup[2 /* Cancelled */];
    }
}
exports.AimGroupUtil = AimGroupUtil;
