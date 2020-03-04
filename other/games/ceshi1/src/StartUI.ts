class StartUI extends eui.Component{
	private btn_start:eui.Button;
	public constructor() {
		super();
		this.skinName =  "src/StartUISkin.exml";
		this.btn_start.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onclick_start,this);

	}

	private onclick_start() {
		this.parent.addChild(Game.getInstance());
		Game.getInstance().BeginGame();
		this.parent.removeChild(this);
	}
}