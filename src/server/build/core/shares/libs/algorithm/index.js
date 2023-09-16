"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Algorithm = void 0;
var Algorithm;
(function (Algorithm) {
    function shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
    Algorithm.shuffle = shuffle;
    function randomPick(pick, arr) {
        const copy = arr.slice();
        const picked = [];
        const reverse = pick > arr.length / 2;
        pick = reverse ? arr.length - pick : pick;
        while (pick > 0) {
            const index = Math.floor(Math.random() * copy.length);
            picked.push(...copy.splice(index, 1));
            pick--;
        }
        return reverse ? copy : picked;
    }
    Algorithm.randomPick = randomPick;
    function randomInt(from, to) {
        return Math.round(Math.random() * (to - from)) + from;
    }
    Algorithm.randomInt = randomInt;
    function intersection(source, scope) {
        return source.filter(element => scope.includes(element));
    }
    Algorithm.intersection = intersection;
    function unique(source, scope) {
        return source.filter(element => !scope.includes(element));
    }
    Algorithm.unique = unique;
    function isSubsetOf(source, target) {
        return target.filter(element => !source.includes(element)).length === 0;
    }
    Algorithm.isSubsetOf = isSubsetOf;
    function equals(source, target) {
        return target.length === source.length && target.filter(e => !source.includes(e)).length === 0;
    }
    Algorithm.equals = equals;
    function singleton(source) {
        return Array.from(new Set(source));
    }
    Algorithm.singleton = singleton;
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
    Algorithm.generateUUID = generateUUID;
})(Algorithm = exports.Algorithm || (exports.Algorithm = {}));
