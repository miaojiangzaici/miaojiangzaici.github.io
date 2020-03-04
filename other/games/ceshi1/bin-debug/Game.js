// TypeScript file
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
var Game = (function (_super) {
    __extends(Game, _super);
    function Game() {
        var _this = _super.call(this) || this;
        // bbs.egret.com/forum.php
        _this._lasttimestamp = 0;
        _this._brithTimer = 0; // 怪物出现时间戳
        _this._shot_vector = null;
        _this._guncd = 0;
        var bg = new egret.Bitmap();
        bg.texture = RES.getRes("bg_png");
        _this.addChild(bg);
        _this._gun = new egret.Bitmap(RES.getRes("gun_gatling_1_png"));
        _this._gun.x = 640 / 2;
        _this._gun.y = 960;
        _this._gun.anchorOffsetX = 45;
        _this._gun.anchorOffsetY = 90;
        //this._gun.rotation = 45;  // 旋转角度
        _this.addChild(_this._gun);
        _this.touchEnabled = true;
        _this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this.ontouch_begin, _this);
        _this.addEventListener(egret.TouchEvent.TOUCH_MOVE, _this.ontouch_move, _this);
        _this.addEventListener(egret.TouchEvent.TOUCH_END, _this.ontouch_end, _this);
        _this._actor_layer = new egret.Sprite();
        _this.addChild(_this._actor_layer);
        _this._bullets_layer = new egret.Sprite();
        _this.addChild(_this._bullets_layer);
        var bgm = RES.getRes("music_gaming_mp3");
        var bgmchannel = bgm.play(0, 0);
        bgmchannel.volume = 0.3;
        _this._gunsound = RES.getRes("machine_gun_mp3");
        _this.addChild(_this._gameui = new GameUI());
        if (_this._gameui != null) {
            egret.startTick(_this.onUpdate, _this);
        }
        return _this;
    }
    Game.getInstance = function () {
        if (this._instance == null) {
            this._instance = new Game();
        }
        return this._instance;
    };
    Game.prototype.onUpdate = function (timestamp) {
        //console.log("onUpdate");
        var span = timestamp - this._lasttimestamp;
        this._lasttimestamp = timestamp;
        if (this._gameui.Time <= 0) {
            return;
        }
        this._gameui.Time -= span;
        this._brithTimer += span;
        if (this._brithTimer >= 1000) {
            // console.log("onUpdate  111");
            this._brithTimer = 0;
            var zombie;
            if (Math.random() < 0.3) {
                zombie = new Zombie1();
            }
            else {
                zombie = new Zombie();
            }
            zombie.x = 80 + Math.random() * 480;
            zombie.y = -100;
            this._actor_layer.addChild(zombie);
        }
        for (var i = this._actor_layer.numChildren - 1; i >= 0; i--) {
            var actor = this._actor_layer.getChildAt(i); // 获取小僵尸
            actor.onUpdate(span);
            // 僵尸跑掉,惩罚减少1秒钟
            if (actor.parent == null) {
                this._gameui.Time -= 1000;
            }
        }
        if (this._gameui.Time <= 0) {
            this._actor_layer.removeChildren();
            this._bullets_layer.removeChildren();
        }
        if (this._shot_vector != null) {
            this._guncd += span;
            if (this._guncd > 100) {
                this._guncd = 0;
                this.addBullt();
            }
        }
        for (var i = this._bullets_layer.numChildren - 1; i >= 0; i--) {
            var bullet = this._bullets_layer.getChildAt(i); // 获取子弹
            bullet.onUpdate(span);
            if (bullet.parent == null) {
                continue;
            }
            var point = new egret.Point(bullet.x, bullet.y);
            for (var j = 0; j < this._actor_layer.numChildren; j++) {
                var actor = this._actor_layer.getChildAt(j); // 获取小僵尸
                if (actor._zombiestatus == ZombieStatus.Dead) {
                    continue;
                }
                if (actor.getBlock().containsPoint(point)) {
                    // this._actor_layer.removeChild(actor);
                    actor.HP -= 1;
                    if (actor.HP <= 0) {
                        actor.Dead();
                        this._gameui.addScoreEffect(actor.x, actor.y, actor.Score);
                    }
                    this._bullets_layer.removeChild(bullet);
                    this._gameui.addHurtEffect(actor.x, actor.y);
                    break;
                }
            }
        }
        return false;
    };
    Game.prototype.ontouch_begin = function (e) {
        console.log("stageX " + e.$stageX);
        console.log("stageY " + e.$stageY);
        /* 角度计算公式
         *  angle = arctan((y2 - y1) / (x2 - x1))
         */
        var vx = e.stageX - this._gun.x;
        var vy = e.stageY - this._gun.y;
        this._gun.rotation = Math.atan2(vy, vx) * 180 / Math.PI + 90;
        this._shot_vector = new egret.Point(vx, vy);
        this._shot_vector.normalize(1);
        //console.log("localX " +e.localX);
        // console.log("localY " +e.localY);
    };
    Game.prototype.ontouch_move = function (e) {
        /* 角度计算公式
         *  angle = arctan((y2 - y1) / (x2 - x1))
         */
        var vx = e.stageX - this._gun.x;
        var vy = e.stageY - this._gun.y;
        this._gun.rotation = Math.atan2(vy, vx) * 180 / Math.PI + 90;
        this._shot_vector = new egret.Point(vx, vy);
        this._shot_vector.normalize(1);
    };
    Game.prototype.ontouch_end = function (e) {
        this._shot_vector = null;
    };
    Game.prototype.addBullt = function () {
        this._gunsound.play(0, 1);
        var _bullt = new Bullet();
        _bullt.span_vector = this._shot_vector;
        _bullt.rotation = Math.atan2(this._shot_vector.y, this._shot_vector.x) * 180 / Math.PI + 90;
        _bullt.x = this._gun.x - 10;
        _bullt.y = this._gun.y;
        this._bullets_layer.addChild(_bullt);
    };
    Game.prototype.BeginGame = function () {
        this._gameui.onclick_replay();
    };
    return Game;
}(egret.DisplayObjectContainer));
__reflect(Game.prototype, "Game");
//# sourceMappingURL=Game.js.map