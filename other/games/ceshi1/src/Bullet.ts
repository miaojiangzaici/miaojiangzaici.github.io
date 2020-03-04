class Bullet extends egret.Sprite{
	public span_vector:egret.Point = null;
	private _speed:number = 1500;

	public constructor() {
		super();
		var _bullet = new egret.Bitmap(RES.getRes("bullet_95m_png"));
		this.addChild(_bullet);
		this.anchorOffsetX = 33;
	}


	public onUpdate(span:number) {
		if (this.span_vector != null) {
			this.x += this._speed * (span/1000) * this.span_vector.x;
			this.y += this._speed * (span/1000) * this.span_vector.y;

			// 飞出屏幕移除子弹对象
			if (this.y < 0) {
				this.parent.removeChild(this);
			}
		}
	}
}