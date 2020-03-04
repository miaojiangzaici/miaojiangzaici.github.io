var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var ZombieStatus;
(function (ZombieStatus) {
    ZombieStatus[ZombieStatus["Run"] = 0] = "Run";
    ZombieStatus[ZombieStatus["Dead"] = 1] = "Dead";
})(ZombieStatus || (ZombieStatus = {}));
var Zombie = (function (_super) {
    __extends(Zombie, _super);
    function Zombie() {
        var _this = _super.call(this) || this;
        _this._framesindex = 0;
        _this._framesspeed = 0;
        _this._frmaes = [];
        _this._deadframe = [];
        _this._zombiestatus = ZombieStatus.Run;
        _this.HP = 1; // 僵尸血量
        _this.Score = 100; // 僵尸分数
        _this._speed = 220;
        _this._body = new egret.Bitmap(RES.getRes("enemy_05_walk_front_00_png"));
        _this.addChild(_this._body);
        _this.initZombie();
        for (var i = 0; i < 6; i++) {
            _this._deadframe.push(RES.getRes("enemy_dead_00_0" + i + "_png"));
        }
        return _this;
    }
    Zombie.prototype.initZombie = function () {
        for (var i = 0; i < 7; i++) {
            this._frmaes.push(RES.getRes("enemy_05_walk_front_0" + i + "_png"));
        }
    };
    Zombie.prototype.onUpdate = function (span) {
        if (this._zombiestatus == ZombieStatus.Run) {
            this.y += this._speed * (span / 1000);
        }
        if (this.y >= 900) {
            this.parent.removeChild(this);
        }
        this._framesspeed += span;
        if (this._framesspeed > 60) {
            this._framesspeed = 0;
            if (this._zombiestatus == ZombieStatus.Run) {
                if (this._framesindex > this._frmaes.length) {
                    this._framesindex = 0;
                }
                this._body.texture = this._frmaes[this._framesindex++];
            }
            else if (this._zombiestatus == ZombieStatus.Dead) {
                console.log("dead");
                if (this._framesindex < this._deadframe.length) {
                    this._body.texture = this._deadframe[this._framesindex++];
                }
                this.alpha -= 0.01;
                if (this.alpha <= 0) {
                    this.parent.removeChild(this);
                }
            }
        }
    };
    Zombie.prototype.Dead = function () {
        this._zombiestatus = ZombieStatus.Dead;
        this._framesindex = 0;
    };
    Zombie.prototype.getBlock = function () {
        return new egret.Rectangle(this.x + 10, this.y, 58 - 10, 60 - 10);
    };
    return Zombie;
}(egret.Sprite));
__reflect(Zombie.prototype, "Zombie");
var Zombie1 = (function (_super) {
    __extends(Zombie1, _super);
    function Zombie1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Zombie1.prototype.initZombie = function () {
        this.HP = 3;
        this.Score = 300;
        for (var i = 0; i < 7; i++) {
            this._frmaes.push(RES.getRes("enemy_08_walk_front_0" + i + "_png"));
        }
    };
    return Zombie1;
}(Zombie));
__reflect(Zombie1.prototype, "Zombie1");
//# sourceMappingURL=Zombie.js.map