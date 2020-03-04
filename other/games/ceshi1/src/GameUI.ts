class GameUI extends eui.Component{
	private lb_score:eui.Label;
	private lb_time:eui.Label;
	private group_over:eui.Group;
	private lb_overscore:eui.Label;
	private lb_bestscore:eui.Label;
	private btn_replay:eui.Button;
	private group_effect:eui.Group;
	private btn_home:eui.Button;

	public constructor() {
		super();
		this.skinName = "src/GameUISkin.exml";
		//console.log(this.lb_score.text);
		this.btn_replay.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onclick_replay,this);
		this.btn_home.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onclick_home,this);
		//this.onclick_replay();
		this.Time = 15000;
	}

	public onclick_home() {
		Game.getInstance().parent.addChild(new StartUI());
		Game.getInstance().parent.removeChild(Game.getInstance());
	}

	public onclick_replay() {
		this.group_over.visible = false;
		this.Score = 0;
		this.Time = 15000;
	}

	public set Score(value:number) {
		this.lb_score.text = value.toString();
	}

	public get Score():number {
		return parseInt(this.lb_score.text); 
	}

	private _time:number;
	public set Time(value:number) {
		this._time = value;
		if (this._time <= 0) {
			this._time = 0;
			this.GameOver();
		}
		var s = Math.floor(this._time / 1000);
		var m = this._time % 1000;
		this.lb_time.text = s + "." + m;
	}

	public get Time():number {
		return this._time; 
	}

	private GameOver() {
		this.group_over.visible = true;
		this.lb_overscore.text = this.Score.toString();

			if (this.getBestScore() > 9999)
			{
				this.setBestScore(this.Score);
			}
			else 
			{
				if (this.Score > this.getBestScore()) {
					this.setBestScore(this.Score);
				}
			}

			this.lb_bestscore.text = this.getBestScore().toString();
	}

	public getBestScore():number 
	{
		var str = egret.localStorage.getItem("KZ_BESTSCORE");
		if (str == null) {
			return 0;
		}else {
			return parseInt(str);
		}
	}

	public setBestScore(value:number) {
		egret.localStorage.setItem("KZ_BESTSCORE",value.toString());
	}

	public addScoreEffect(x:number, y:number,score:number) {
		var eff = new eui.Label();
		eff.text = score.toString();
		eff.x = x;
		eff.y = y;
		eff.stroke = 3;
		this.group_effect.addChild(eff);
		var tx = this.lb_score.x + this.lb_score.width/2;
		var ty = this.lb_score.y;
		console.log("x: ",this.lb_score.x);
		console.log("y: ",this.lb_score.y);
		egret.Tween.get(eff)
			.to({x:tx,y:ty},500,egret.Ease.circInOut)
			.call(this.addScore,this,[score])
			.call(this.removeEffectFromGroup,this,[eff]);
	}

	private addScore(score:number) {
		this.Score += score;
	}

	private removeEffectFromGroup(eff:egret.DisplayObject) {
		this.group_effect.removeChild(eff);
	}

	private myFactory:egret.MovieClipDataFactory = null;
	public addHurtEffect(x:number,y:number) {
		if (this.myFactory == null) {
			this.myFactory = new egret.MovieClipDataFactory(RES.getRes("hurteffect_json"),RES.getRes("hurteffect_png"));
		}
		var mc = new egret.MovieClip(this.myFactory.generateMovieClipData("eff_hurt_0"))
		mc.x = x;
		mc.y = y;
		mc.gotoAndPlay("play",1);
		this.group_effect.addChild(mc);
		egret.Tween.get(this).wait(200).call(this.removeEffectFromGroup,this,[mc]);

	}
}