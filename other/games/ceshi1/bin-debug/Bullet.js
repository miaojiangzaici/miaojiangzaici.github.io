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
var Bullet = (function (_super) {
    __extends(Bullet, _super);
    function Bullet() {
        var _this = _super.call(this) || this;
        _this.span_vector = null;
        _this._speed = 1500;
        var _bullet = new egret.Bitmap(RES.getRes("bullet_95m_png"));
        _this.addChild(_bullet);
        _this.anchorOffsetX = 33;
        return _this;
    }
    Bullet.prototype.onUpdate = function (span) {
        if (this.span_vector != null) {
            this.x += this._speed * (span / 1000) * this.span_vector.x;
            this.y += this._speed * (span / 1000) * this.span_vector.y;
            // 飞出屏幕移除子弹对象
            if (this.y < 0) {
                this.parent.removeChild(this);
            }
        }
    };
    return Bullet;
}(egret.Sprite));
__reflect(Bullet.prototype, "Bullet");
//# sourceMappingURL=Bullet.js.map