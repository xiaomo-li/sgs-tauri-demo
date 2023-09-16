"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventPacker = void 0;
const tslib_1 = require("tslib");
class EventPacker {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() { }
    static wrapGameRunningInfo(event, info) {
        return Object.assign(Object.assign({}, event), info);
    }
    static getGameRunningInfo(event) {
        const { numberOfDrawStack, numberOfDropStack, circle, currentPlayerId } = event;
        return {
            numberOfDrawStack,
            numberOfDropStack,
            circle,
            currentPlayerId,
        };
    }
    static terminate(event) {
        event.terminate = true;
        return event;
    }
    static recall(event) {
        event.terminate = false;
        return event;
    }
    static isTerminated(event) {
        return !!event.terminate;
    }
    static copyPropertiesTo(fromEvent, toEvent, configuration = {}) {
        const { copyTerminate = false, copyUncancellable = true, copyMiddlewares = true, copyDisresponsive = true, copyUnoffsetable = true, } = configuration;
        if (copyTerminate && fromEvent.terminate !== undefined) {
            toEvent.terminate = fromEvent.terminate;
        }
        if (copyUncancellable && fromEvent.uncancellable !== undefined) {
            toEvent.uncancellable = fromEvent.uncancellable;
        }
        if (copyMiddlewares && fromEvent.middlewares !== undefined) {
            toEvent.middlewares = Object.assign(Object.assign({}, toEvent.middlewares), fromEvent.middlewares);
        }
        if (copyDisresponsive && fromEvent.disresponsive !== undefined) {
            toEvent.disresponsive = fromEvent.disresponsive;
        }
        if (copyUnoffsetable && fromEvent.unoffsetable !== undefined) {
            toEvent.unoffsetable = fromEvent.unoffsetable;
        }
    }
    static setDamageSignatureInCardUse(content, sign = true) {
        EventPacker.addMiddleware({ tag: "DamageSignatureInCardUse" /* DamageSignatureInCardUse */, data: sign }, content);
    }
    static getDamageSignatureInCardUse(content) {
        return !!EventPacker.getMiddleware("DamageSignatureInCardUse" /* DamageSignatureInCardUse */, content);
    }
    static setLosingAllArmorTag(content, data) {
        EventPacker.addMiddleware({ tag: "LosingAllArmorTag" /* LosingAllArmorTag */, data }, content);
    }
    static getLosingAllArmorTag(content) {
        return EventPacker.getMiddleware("LosingAllArmorTag" /* LosingAllArmorTag */, content);
    }
}
exports.EventPacker = EventPacker;
EventPacker.minifyPayload = (event) => {
    const _a = event, { middlewares } = _a, paylod = tslib_1.__rest(_a, ["middlewares"]);
    return paylod;
};
EventPacker.setTimestamp = (event) => {
    event.timestamp = Date.now();
};
EventPacker.getTimestamp = (event) => event.timestamp;
EventPacker.isDisresponsiveEvent = (event, includeUnoffsetable) => event.disresponsive || (includeUnoffsetable && event.unoffsetable);
EventPacker.setDisresponsiveEvent = (event) => {
    event.disresponsive = true;
    return event;
};
EventPacker.setUnoffsetableEvent = (event) => {
    event.unoffsetable = true;
    return event;
};
EventPacker.addMiddleware = (middleware, event) => {
    event.middlewares = event.middlewares || {};
    event.middlewares[middleware.tag] = middleware.data;
    return event;
};
EventPacker.getMiddleware = (tag, event) => event.middlewares && event.middlewares[tag];
EventPacker.removeMiddleware = (tag, event) => {
    if (event.middlewares && event.middlewares[tag]) {
        delete event.middlewares[tag];
    }
    return event;
};
EventPacker.createUncancellableEvent = (event) => {
    event.uncancellable = true;
    return event;
};
EventPacker.createIdentifierEvent = (identifier, event) => {
    event.identifier = identifier;
    return event;
};
EventPacker.hasIdentifier = (identifier, event) => event.identifier === identifier;
EventPacker.getIdentifier = (event) => event.identifier;
EventPacker.isUncancellableEvent = (event) => !!event.uncancellable;
