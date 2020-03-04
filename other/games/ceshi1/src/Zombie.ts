enum ZombieStatus {
	Run,Dead
}

class Zombie  extends egret.Sprite{
	private _body:egret.Bitmap;
	private _framesindex:number = 0;
	private _framesspeed:number = 0;
	protected _frmaes:egret.Texture[] = [];
	private _deadframe:egret.Texture[] = [];
	public _zombiestatus:ZombieStatus = ZombieStatus.Run;

	public HP:number = 1; // 僵尸血量
	public Score:number = 100;  // 僵尸分数

	public constructor() {
		super();
		this._body = new egret.Bitmap(RES.getRes("enemy_05_walk_front_00_png"));
		this.addChild(this._body);
		this.initZombie();
		for(var i = 0; i<6;i++) {
			this._deadframe.push(RES.getRes("enemy_dead_00_0"+i+"_png"));
		}
	
	}

	protected initZombie() {
		for(var i = 0; i<7; i++){
			this._frmaes.push(RES.getRes("enemy_05_walk_front_0"+i+"_png"));
		}
	}

	private _speed:number = 220;
	public onUpdate(span:number) {
		if (this._zombiestatus == ZombieStatus.Run) {
			this.y += this._speed*(span/1000);
		}

		if (this.y  >= 900) {
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
	}

	public Dead() {
		this._zombiestatus = ZombieStatus.Dead;
		this._framesindex = 0;
	}

	public getBlock():egret.Rectangle {
		return new egret.Rectangle(this.x+10,this.y,58-10,60-10);
	}
}

class Zombie1 extends Zombie {
	protected initZombie() {
		this.HP = 3;
		this.Score = 300;
		for(var i = 0; i<7; i++){
			this._frmaes.push(RES.getRes("enemy_08_walk_front_0"+i+"_png"));
		}
	}
}