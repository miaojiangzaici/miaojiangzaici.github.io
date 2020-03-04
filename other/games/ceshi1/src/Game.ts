// TypeScript file

class Game extends egret.DisplayObjectContainer {
    private static _instance:Game;
    public static getInstance():Game  {
        if(this._instance == null) {
            this._instance = new Game();
        }
        return this._instance;
    }

    private _gun:egret.Bitmap;
    private _actor_layer:egret.Sprite;
    private _bullets_layer:egret.Sprite;
    private _gameui:GameUI;
    public constructor() {
        super();
        var bg = new egret.Bitmap();
        bg.texture = RES.getRes("bg_png");
        this.addChild(bg);
        this._gun = new egret.Bitmap(RES.getRes("gun_gatling_1_png"));
        this._gun.x = 640/2;
        this._gun.y = 960;
        this._gun.anchorOffsetX = 45;
        this._gun.anchorOffsetY = 90;
        //this._gun.rotation = 45;  // 旋转角度
        this.addChild(this._gun);
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.ontouch_begin,this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.ontouch_move,this);
        this.addEventListener(egret.TouchEvent.TOUCH_END,this.ontouch_end,this);

     
        this._actor_layer = new egret.Sprite();
        this.addChild(this._actor_layer );
        this._bullets_layer = new egret.Sprite();
        this.addChild(this._bullets_layer);

        var bgm:egret.Sound = RES.getRes("music_gaming_mp3");
        var bgmchannel = bgm.play(0,0);
        bgmchannel.volume = 0.3;
        this._gunsound = RES.getRes("machine_gun_mp3");

        this.addChild(this._gameui = new GameUI());
        if (this._gameui != null) {
            egret.startTick(this.onUpdate,this);
        }
    }

// bbs.egret.com/forum.php
    private _lasttimestamp:number = 0;
    private _brithTimer:number = 0; // 怪物出现时间戳
    private _shot_vector:egret.Point = null;
    private _guncd:number = 0;
    private _gunsound:egret.Sound;

    private onUpdate(timestamp:number):boolean {
        //console.log("onUpdate");
        var span = timestamp - this._lasttimestamp;
        this._lasttimestamp = timestamp;

        if (this._gameui.Time <= 0) {
            return ;
        }

        this._gameui.Time -= span;
        this._brithTimer += span;
        if (this._brithTimer >= 1000) {
            // console.log("onUpdate  111");
            this._brithTimer = 0;
            var zombie:Zombie;
            if(Math.random() < 0.3) {
                zombie = new Zombie1();
            } else {
                zombie = new Zombie();
            }

            zombie.x = 80 + Math.random()*480;
            zombie.y = -100;
            this._actor_layer.addChild(zombie);
        
        }

        for(var i = this._actor_layer.numChildren - 1; i>=0; i--) {
            var actor = <Zombie>this._actor_layer.getChildAt(i); // 获取小僵尸
            actor.onUpdate(span);

            // 僵尸跑掉,惩罚减少1秒钟
            if (actor.parent == null) {
                this._gameui.Time -= 1000;
            }
        }
        

        if (this._gameui.Time <= 0)
        {
            this._actor_layer.removeChildren();
            this._bullets_layer.removeChildren();
        }

         if (this._shot_vector != null)
         {
            this._guncd += span;
            if (this._guncd > 100) 
            {
                this._guncd  = 0;
                this.addBullt();
            }

  
         }

        for(var i = this._bullets_layer.numChildren - 1; i>=0; i--) {
            var bullet = <Bullet>this._bullets_layer.getChildAt(i); // 获取子弹
            bullet.onUpdate(span);
            if (bullet.parent == null) {
                continue;
            }
            var point = new egret.Point(bullet.x,bullet.y);

            for (var j = 0; j < this._actor_layer.numChildren; j++) {
                 var actor = <Zombie>this._actor_layer.getChildAt(j); // 获取小僵尸

                 if (actor._zombiestatus == ZombieStatus.Dead){
                     continue;
                 }   

                 if (actor.getBlock().containsPoint(point)) {
                    // this._actor_layer.removeChild(actor);
                    actor.HP -= 1;
                    if (actor.HP <= 0) {
                        actor.Dead();
                        this._gameui.addScoreEffect(actor.x,actor.y,actor.Score);
                    }
              
                    this._bullets_layer.removeChild(bullet);
                    this._gameui.addHurtEffect(actor.x,actor.y);
                     break;
                 }
            }
        }
  
        return false;
    }

    private ontouch_begin(e:egret.TouchEvent) {
        console.log("stageX " +e.$stageX);
        console.log("stageY " +e.$stageY);

        /* 角度计算公式
         *  angle = arctan((y2 - y1) / (x2 - x1))
         */
        var vx = e.stageX - this._gun.x;
        var vy = e.stageY - this._gun.y;
        this._gun.rotation = Math.atan2(vy,vx)*180/Math.PI + 90;
        this._shot_vector = new egret.Point(vx,vy);
        this._shot_vector.normalize(1);
        //console.log("localX " +e.localX);
       // console.log("localY " +e.localY);
    }

    private ontouch_move(e:egret.TouchEvent) {
        /* 角度计算公式
         *  angle = arctan((y2 - y1) / (x2 - x1))
         */
        var vx = e.stageX - this._gun.x;
        var vy = e.stageY - this._gun.y;
        this._gun.rotation = Math.atan2(vy,vx)*180/Math.PI + 90;
        this._shot_vector = new egret.Point(vx,vy);
        this._shot_vector.normalize(1);
    }

    private ontouch_end(e:egret.TouchEvent) {
        this._shot_vector = null;
    }

    private addBullt() {
        this._gunsound.play(0,1);
        var _bullt = new Bullet();
        _bullt.span_vector = this._shot_vector;
        _bullt.rotation = Math.atan2(this._shot_vector.y,this._shot_vector.x)*180/Math.PI + 90;
        _bullt.x = this._gun.x - 10;
        _bullt.y = this._gun.y;
        this._bullets_layer.addChild(_bullt);
    }


    public BeginGame() {
        this._gameui.onclick_replay();
    }
}