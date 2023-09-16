"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomEventStacker = void 0;
const shrink_string_1 = require("core/shares/libs/utils/shrink_string");
class RoomEventStacker {
    constructor() {
        this.eventStack = [];
    }
    push(content) {
        this.eventStack.push(content);
    }
    async toString() {
        return await shrink_string_1.compress(JSON.stringify(this.eventStack));
    }
    static async toString(eventStack) {
        return await shrink_string_1.compress(JSON.stringify(eventStack));
    }
    static async toStack(eventsString) {
        return JSON.parse(await shrink_string_1.decompress(eventsString));
    }
}
exports.RoomEventStacker = RoomEventStacker;
