"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TargetGroupUtil = void 0;
class TargetGroupUtil {
    static getAllTargets(targetGroup) {
        if (!targetGroup) {
            return undefined;
        }
        return targetGroup.slice();
    }
    static getRealTargets(targetGroup) {
        return (targetGroup === null || targetGroup === void 0 ? void 0 : targetGroup.map(ids => ids[0])) || [];
    }
    static includeRealTarget(targetGroup, playerId) {
        return !!(targetGroup === null || targetGroup === void 0 ? void 0 : targetGroup.find(ids => ids[0] === playerId));
    }
    static filterTargets(targetGroup, playerIds) {
        return targetGroup.filter((ids) => !playerIds.includes(ids[0]));
    }
    static removeTarget(targetGroup, playerId) {
        const idx = targetGroup.findIndex(ids => ids[0] === playerId);
        idx !== -1 && targetGroup.splice(idx, 1);
    }
    static pushTargets(targetGroup, playerIds) {
        if (playerIds instanceof Array) {
            targetGroup.push(playerIds);
        }
        else {
            targetGroup.push([playerIds]);
        }
    }
}
exports.TargetGroupUtil = TargetGroupUtil;
