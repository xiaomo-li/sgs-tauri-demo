"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Precondition = void 0;
class Precondition {
    static alarm(arg, errorMsg) {
        if (arg === null || arg === undefined) {
            // tslint:disable-next-line:no-console
            console.warn(errorMsg);
        }
        return arg;
    }
    static exists(arg, errorMsg) {
        if (arg === null || arg === undefined) {
            throw new Error(errorMsg);
        }
        return arg;
    }
    static assert(success, errorMsg) {
        if (!success) {
            throw new Error('Assertion failed: ' + errorMsg);
        }
    }
    static UnreachableError(arg) {
        return new Error(`Unreachable error in switch case of argument ${arg}`);
    }
    static debugBlock(flavor, debugExec) {
        if (flavor === "dev" /* Dev */) {
            debugExec();
        }
    }
}
exports.Precondition = Precondition;
