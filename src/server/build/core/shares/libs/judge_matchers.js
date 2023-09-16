"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JudgeMatcher = void 0;
const precondition_1 = require("./precondition/precondition");
class JudgeMatcher {
    static onJudge(matcherEnum, card) {
        switch (matcherEnum) {
            case 1 /* LeBuSiShu */:
                return this.LeBuSiShu(card);
            case 2 /* BingLiangCunDuan */:
                return this.BingLiangCunDuan(card);
            case 3 /* BaGuaZhen */:
                return this.BaGuaZhen(card);
            case 4 /* Lightning */:
                return this.Lightning(card);
            case 5 /* BaoNve */:
                return this.BaoNve(card);
            case 6 /* WuHun */:
                return this.WuHun(card);
            case 7 /* LuoShen */:
                return this.LuoShen(card);
            case 8 /* SiShu */:
                return this.SiShu(card);
            case 9 /* TunTian */:
                return this.TunTian(card);
            case 10 /* HuJi */:
                return this.HuJi(card);
            case 11 /* DuLie */:
                return this.DuLie(card);
            case 12 /* QingXi */:
                return this.QingXi(card);
            case 13 /* ZhuiLie */:
                return this.ZhuiLie(card);
            case 14 /* BingHuo */:
                return this.BingHuo(card);
            case 15 /* XinChiJie */:
                return this.XinChiJie(card);
            default:
                throw precondition_1.Precondition.UnreachableError(matcherEnum);
        }
    }
    static LeBuSiShu(card) {
        return card.Suit !== 2 /* Heart */;
    }
    static SiShu(card) {
        return card.Suit === 2 /* Heart */;
    }
    static TunTian(card) {
        return card.Suit !== 2 /* Heart */;
    }
    static BingLiangCunDuan(card) {
        return card.Suit !== 3 /* Club */;
    }
    static BaGuaZhen(card) {
        return card.isRed();
    }
    static Lightning(card) {
        return card.Suit === 1 /* Spade */ && card.CardNumber >= 2 && card.CardNumber <= 9;
    }
    static BaoNve(card) {
        return card.Suit === 1 /* Spade */;
    }
    static WuHun(card) {
        return card.Name !== 'peach' && card.Name !== 'taoyuanjieyi';
    }
    static LuoShen(card) {
        return card.isBlack();
    }
    static HuJi(card) {
        return card.isRed();
    }
    static DuLie(card) {
        return card.Suit === 2 /* Heart */;
    }
    static QingXi(card) {
        return card.isRed();
    }
    static ZhuiLie(card) {
        return card.is(2 /* Weapon */) || card.is(5 /* DefenseRide */) || card.is(4 /* OffenseRide */);
    }
    static BingHuo(card) {
        return card.isBlack();
    }
    static XinChiJie(card) {
        return card.CardNumber > 6;
    }
}
exports.JudgeMatcher = JudgeMatcher;
