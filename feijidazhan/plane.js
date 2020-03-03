		var Pic=function(config){
			new Image();
			this.src=config.img;
		}
		//Pic.prototype=Image.prototype;
		function $(id){return document.getElementById(id);}

	var plane={
		canvas:null,
		cts:null,
		WIDTH:0,
		HEIGHT:0,
		gameState:0,
		score:0,
		life:0,
		GAMESTATE:{
			STARTING:0,//欢迎阶段
			START:1,//过度阶段
			RUNNING:2,//游戏运行阶段
			PAUSED:3,//游戏暂停阶段
			GAMEOVER:4//游戏结束阶段
		},
		IMAGE:{
			background:null,//背景
			logo:null,//欢迎阶段LOGO
			loading:null,
			life:null,
			firebonus:null,
			myPlane:{
				state:1,
			},
			esPlane:{
			},//敌方小飞机
			emPlane:{
			},//敌方中飞机
			ebPlane:{
			},//敌方大飞机
			bullet:{},//我方子弹
			pause:null,//暂停图标
		},
		BG:{
			width:480,
			height:852,
			img:"images/background.png"
		},
		LOADING:{
			L1:{
				width:186,
				height:38,
				img:"images/game_loading1.png"
			},
			L2:{
				img:"images/game_loading2.png"
			},
			L3:{
				img:"images/game_loading3.png"
			},
			L4:{
				img:"images/game_loading4.png"
			},
		},
		HERO:{
			H1:{
				width:99,
				height:124,
				img:"images/hero1.png",
			},
			H2:{img:"images/hero2.png",},
			HB1:{img:"images/hero_blowup_n1.png"},
			HB2:{img:"images/hero_blowup_n2.png"},
			HB3:{img:"images/hero_blowup_n3.png"},
			HB4:{img:"images/hero_blowup_n4.png"},
		},
		BULLET:{
			B1:{
				width:9,
				height:21,
				img:"images/bullet1.png",
				speed:3,
			},	
			B2:{
				width:9,
				height:21,
				img:"images/bullet_red.png",
				speed:3,
			},	
		},
		PAUSE:{
			img:"images/game_pause_nor.png",
			width:60,
			height:45,
		},
		ENEMIES:[
			{
			ES:{
				width:57,
				height:51,
				img:"images/enemy1.png",
				speed:2,
				life:2,
			},
			ESD1:{img:"images/enemy1_down1.png"},
			ESD2:{img:"images/enemy1_down2.png"},
			ESD3:{img:"images/enemy1_down3.png"},
			ESD4:{img:"images/enemy1_down4.png"},
			},
			{
				EM:{
					width:69,
					height:95,
					img:"images/enemy2.png",
					speed:1.2,
					life:10,
				},
				EMD1:{img:"images/enemy2_down1.png"},
				EMD2:{img:"images/enemy2_down2.png"},
				EMD3:{img:"images/enemy2_down3.png"},
				EMD4:{img:"images/enemy2_down4.png"},
			},
			{
				EB_n1:{
					width:165,
					height:261,
					img:"images/enemy3_n1.png",
					speed:0.8,
					life:20,
				},
				EB_n2:{
						img:"images/enemy3_n2.png",
						speed:0.8},
				EB_hit:{
						img:"images/enemy3_hit.png",
						speed:0.8},
				EBD1:{img:"images/enemy3_down1.png"},
				EBD2:{img:"images/enemy3_down2.png"},
				EBD3:{img:"images/enemy3_down3.png"},
				EBD4:{img:"images/enemy3_down4.png"},
				EBD5:{img:"images/enemy3_down5.png"},
			},
		],
		LIFE:{
			img:"images/life.png",
			speed:4,
			width:40,
			height:40,
			bonus:1,
		},
		FIREBONUS:{
			img:"images/fireAward.png",
			speed:4,
			width:30,
			height:30,
			bonus:1,
		},
		bullets:[],
		enemies:[],
		bulletCount:0,
		enemyBulletCount:0,
		frequence:0,//子弹计数频率：每隔5*20毫秒记录一颗子弹的初始位置
		fireNum:1,//火炮数量，1为单排火炮，2为双排火炮，3为1竖炮2斜炮，4为两竖炮两斜炮
		rotateDistance:0,
		bgCount:0,
		loadingCount:0,
		heroCount:0,
		enemyCount:0,
		heartCount:0,
		nextBonus:0,
		direction:0.05,
		bgTimer:null,
		level:1,
		mouseX:0,
		mouseY:0,
		musicStamp:null,
		loadImage:function(img,config){
			for (var key in config)
			{
				img[key]=new Image()
				img[key].src=config[key].img;
				if (config[key].width)
				{
					img[key].speed=config[key].speed;
					img[key].width=config[key].width;
					img[key].height=config[key].height;
					img[key].life=config[key].life;
				}
			}
		},
		init:function(){
			this.score=0;
			this.life=3;
			this.enemies=[];
			this.bullets=[];
			this.heartCount=
				this.nextBonus=
					this.enemyBulletCount=
						this.bulletCount=
							this.heroCount=
								this.bgCount=
									this.loadingCount=
										this.heroCount=
											this.enemyCount=0,
			this.IMAGE.myPlane.state=1;
			this.level=1;
			clearInterval(this.bgTimer);
			this.bgTimer=null;
			this.frequence=this.BULLET.B1.speed*3;
			this.rotateDistance=this.BULLET.B1.speed;
			this.canvas=document.getElementById("canvas");
			this.cts=this.canvas.getContext("2d");
			this.WIDTH=this.canvas.width;
			this.HEIGHT=this.canvas.height;
			this.gameState=this.GAMESTATE.STARTING;
			this.canvas.addEventListener('click',function(e){
				if (e.offsetY<this.HEIGHT&&e.offsetY>this.HEIGHT-50)
				{
					if (this.gameState==this.GAMESTATE.STARTING)
					{
						this.gameState=this.GAMESTATE.START;
					}else if (this.gameState==this.GAMESTATE.GAMEOVER)
					{
						this.init();
					}
				}
			}.bind(this));
			this.canvas.addEventListener('mouseout',function(){
				if (this.gameState==this.GAMESTATE.RUNNING)
				{
					this.gameState=this.GAMESTATE.PAUSED;
					
				}
			}.bind(this))
			this.canvas.addEventListener('mouseover',function(){
				if (this.gameState==this.GAMESTATE.PAUSED)
				{
					this.gameState=this.GAMESTATE.RUNNING;
				}
			}.bind(this))
			for (var key in this.IMAGE)
			{
				if (this.IMAGE[key]===null)
				{
					this.IMAGE[key]=new Image();
				}
			}
			this.IMAGE.background.src=this.BG.img;
			this.IMAGE.logo.src="images/start.png";
			this.IMAGE.life.src=this.LIFE.img;
			this.IMAGE.firebonus.src=this.FIREBONUS.img;
			this.IMAGE.life.bonus=1;
			//this.IMAGE.myPlane.src="images/start.png";
			//this.IMAGE.bullet.src=this.BULLET.B1.img;
			this.IMAGE.pause.src=this.PAUSE.img;
			/*for (var key in this.HERO)
			{
				this.IMAGE.myPlane[key]=new Image()
				this.IMAGE.myPlane[key].src=this.HERO[key].img;
				//this.IMAGE.myPlane[key]=new Pic(this.HERO[key])
			}*/
			this.loadImage(this.IMAGE.myPlane,this.HERO);
			this.loadImage(this.IMAGE.bullet,this.BULLET);
			this.loadImage(this.IMAGE.esPlane,this.ENEMIES[0]);
			this.loadImage(this.IMAGE.emPlane,this.ENEMIES[1]);
			this.loadImage(this.IMAGE.ebPlane,this.ENEMIES[2]);
			this.backgroundMusic(this.gameState);
			this.bgTimer=setInterval(
					function(){
						this.bgPaint();
						switch (this.gameState)
						{
						case 0:
							this.cts.drawImage(this.IMAGE.logo,40,0);
							this.beginButtonPaint();
							//this.backgroundMusic(this.gameState);
							break;
						case 1:
							this.readyPaint();
							break;
						case 2:
							this.countRotateDistance();
							this.heroPaint(this.IMAGE.myPlane,this.HERO);
							//console.log(this.IMAGE.myPlane)
							this.countBullet(this.fireNum);
							this.bulletPaint();
							this.hitJudge(this.IMAGE.myPlane,this.bullets);
							this.enemyPaint();
							this.scorePaint(this.score);
							this.lifePaint(this.life);
							this.isGameOver(this.life);
							this.createLifeBonus();
							this.lifeBonusPaint();
							this.fireBonusPaint();
							this.levelUpdate();
							if (this.musicStamp!="danger")
							{this.backgroundMusic(this.gameState);
							} 
							break;
						case 3:
							this.heroPaint(this.IMAGE.myPlane,this.HERO);
							this.bulletPaint();
							this.enemyPaint();
							this.pausePaint();
							this.lifeBonusPaint();
							this.fireBonusPaint();
							this.scorePaint(this.score);
							this.lifePaint(this.life);
							break;
						case 4:
							this.canvas.onmousemove=null;
							this.heroPaint(this.IMAGE.myPlane,this.HERO);
							this.bulletPaint();
							this.enemyPaint();
							this.pausePaint();
							this.scorePaint(this.score);
							this.lifePaint(this.life);
							this.overPaint();
							this.beginButtonPaint();
						}
					}.bind(this)
			,20)
			this.canvas.onmousemove=function(){
					this.mouseX=event.offsetX;
					this.mouseY=event.offsetY;
			}.bind(this)
		},
		bgPaint:function(){
				this.bgCount++;
				this.bgCount%=this.BG.height
					//console.log(this.bgCount)
				this.cts.clearRect(0,0,this.WIDTH,this.HEIGHT)
				this.cts.drawImage(this.IMAGE.background,0,0+this.bgCount);
				this.cts.drawImage(this.IMAGE.background,0,-this.BG.height+this.bgCount);
					//his.cts.drawImage(this.IMAGE.logo,40,0);
					//this.IMAGE.logo.onload=function(){
				//this.cts.drawImage(this.IMAGE.logo,40,0);		
		},
		readyPaint:function(){
			this.loadingCount++;
			var num=Math.ceil(this.loadingCount/20)
			if (num<=4)
			{
				var ready=new Image();
				ready.src=this.LOADING['L'+num].img;
				this.cts.drawImage(ready,0,this.HEIGHT-this.LOADING.L1.height)
				//console.log(this.BG.height-2*this.LOADING.L1.height)
			}else{
				this.gameState=this.GAMESTATE.RUNNING;	
			}
		},
		heroPaint:function(myPlane,HERO){
			++this.heroCount;
			this.heroCount%=100;
			if (myPlane.state>0)
			{
				var code=Math.floor(this.heroCount%20/10)+1;
			}else if (this.life>0)
			{
				var code="B1";
				if (this.heroCount==0)
				{
					myPlane.state=1;
				}
			}else {
				var code="B"+(-myPlane.state);
				if (this.heroCount%10==0&&myPlane.state>-4)
				{
					myPlane.state--;
				}
			}
			myPlane.x=this.mouseX-HERO.H1.width/2;
			myPlane.y=this.mouseY-HERO.H1.height/2;
			myPlane.width=HERO.H1.width;
			myPlane.height=HERO.H1.height;
			this.cts.drawImage(myPlane["H"+code],myPlane.x,myPlane.y);
			
		},
		countBullet:function(fire){
			switch (fire)
			{
			case 1:
				if ((++this.bulletCount%this.frequence)==0)
				{
					var x=this.mouseX-this.BULLET.B1.width/2;
					var y=this.mouseY-(this.HERO.H1.height+this.BULLET.B1.height)/2+10;
					this.pushBullet(x,y,"hero",0)
				}
				break;
			case 2:
				if ((++this.bulletCount%this.frequence)==0)
				{
					var x=this.mouseX-this.BULLET.B1.width/2-10;
					var y=this.mouseY-(this.HERO.H1.height+this.BULLET.B1.height)/2+10;
					this.pushBullet(x,y,"hero",0)
					x=this.mouseX+this.BULLET.B1.width/2+10,
					this.pushBullet(x,y,"hero",0)
				}
				break;
			case 3:
				if ((++this.bulletCount%this.frequence)==0)
				{
					var x=this.mouseX-this.BULLET.B1.width/2;
					var y=this.mouseY-(this.HERO.H1.height+this.BULLET.B1.height)/2+10;
					this.pushBullet(x,y,"hero",0)
					var x=this.mouseX-35;
					var y=this.mouseY-25;
					this.pushBullet(x,y,"hero",-1,this.rotateDistance)
					var x=this.mouseX+27;
					var y=this.mouseY-25;
					this.pushBullet(x,y,"hero",1,this.rotateDistance)
				}
				break;
			case 4:
				if ((++this.bulletCount%this.frequence)==0)
				{
					var x=this.mouseX-this.BULLET.B1.width/2-10;
					var y=this.mouseY-(this.HERO.H1.height+this.BULLET.B1.height)/2+10;
					this.pushBullet(x,y,"hero",0)
					x=this.mouseX+this.BULLET.B1.width/2+10,
					this.pushBullet(x,y,"hero",0)
					var x=this.mouseX-35;
					var y=this.mouseY-25;
					this.pushBullet(x,y,"hero",-1,this.rotateDistance)
					var x=this.mouseX+27;
					var y=this.mouseY-25;
					this.pushBullet(x,y,"hero",1,this.rotateDistance)
				}
				break;
			}
			if ((++this.enemyBulletCount%(this.frequence*10))==0)
			{
				for (var i in this.enemies )
				{
					if (this.enemies[i].size==1)
					{
						var x=this.enemies[i].x+this.IMAGE.emPlane.EM.width/2;
						var y=this.enemies[i].y+this.IMAGE.emPlane.EM.height;
						this.pushBullet(x,y,"em");
					}
				}
			}
		},
		pushBullet:function(x,y,owner,type,rotate){
			this.bullets.push({
						'x':x,
						'y':y,
						'width':this.BULLET.B1.width,
						'height':this.BULLET.B1.height,
						'owner':owner,
						"type":type,
						"rotate":rotate,
					})
		},
		bulletPaint:function(){
			for (var i=0;i<this.bullets.length;i++)
			{
				if (this.bullets[i].owner=="hero")
				{
					this.cts.drawImage(this.IMAGE.bullet.B1,this.bullets[i].x,this.bullets[i].y);
				}else{
					this.cts.drawImage(this.IMAGE.bullet.B2,this.bullets[i].x,this.bullets[i].y);
				}
				if (this.gameState==this.GAMESTATE.RUNNING)
				{
					if (this.bullets[i].owner=="hero")
					{
					this.bullets[i].y-=this.BULLET.B1.speed;
					if (this.bullets[i].type!=0)
					{
						this.bullets[i].x+=this.bullets[i].rotate*this.bullets[i].type;
					}
						if (this.bullets[i].y<-this.BULLET.B1.height)
					{
						this.bullets.splice(i,1);
						//console.log(this.bullets)
						i--;
					}
					}else{
						this.bullets[i].y+=this.BULLET.B1.speed*0.8
						if (this.bullets[i].y>this.HEIGHT)
					{
						this.bullets.splice(i,1);
						i--;
					}
					}
				}
				
			}
		},
		enemyPaint:function(){
			for (var i=0;i<this.enemies.length ;i++ )
			{	if (this.gameState==this.GAMESTATE.RUNNING&&this.enemies[i].life>0)
				{
					this.enemies[i].y+=this.enemies[i].speed;
				}
				if (this.enemies[i].state==1)
				{
					var imgs=(this.enemies[i].size==0?this.IMAGE.esPlane.ES:
								this.enemies[i].size==1?this.IMAGE.emPlane.EM:
													this.IMAGE.ebPlane.EB_n1);
					if (this.enemies[i].size==2)
					{
						//console.log(this.enemies[i].y)
						(++this.enemies[i].count)%10==0&&(this.enemies[i].state=2)
					}
					//this.enemies[i].size==2&&(this.enemies[i].state=2);
					this.cts.drawImage(imgs,this.enemies[i].x,this.enemies[i].y);
				}else if (this.enemies[i].state==2)
				{
					//console.log(this.enemies[i])
					(++this.enemies[i].count)%10==0&&(this.enemies[i].state=1)
					var imgs=this.IMAGE.ebPlane.EB_n2
					this.cts.drawImage(imgs,this.enemies[i].x,this.enemies[i].y);
				}else if (this.enemies[i].state==3)
				{
					//console.log(this.enemies[i])
					//(++this.enemies[i].count)%10==0&&(this.enemies[i].state=1)
					var imgs=this.IMAGE.ebPlane.EB_hit
					this.cts.drawImage(imgs,this.enemies[i].x,this.enemies[i].y);
					//console.log(this.enemies[i].y)
				}else if (this.enemies[i].state<0)
				{
					var num=-this.enemies[i].state;
					var imgs=(this.enemies[i].size==0?this.IMAGE.esPlane["ESD"+num]:
							this.enemies[i].size==1?this.IMAGE.emPlane["EMD"+num]:
													this.IMAGE.ebPlane["EBD"+num]);
					if (imgs===undefined)
					{
						if (this.enemies[i].size==2)//如果击落的是最大型的飞机，则产生火力升级奖章
						{
							this.createFireBonus(this.enemies[i].x+this.enemies[i].width/2,this.enemies[i].y+this.enemies[i].height/2);
						}
						this.enemies.splice(i,1);
						i--;
						continue;
					}
					this.cts.drawImage(imgs,this.enemies[i].x,this.enemies[i].y);
					if ((++this.enemies[i].count)%10==0)
					{
						this.enemies[i].state--
					}
				}
				if (this.enemies[i].y>this.HEIGHT)
					{
						this.enemies.splice(i,1);
						i--;
						continue;
					}
			}
			if ((++this.enemyCount%50)==0&&this.gameState==this.GAMESTATE.RUNNING)
			{
				this.randomEnemy()
				//console.log(this.enemies)
			}
		},
		randomEnemy:function(){
			var num=Math.random();
			var size=0;
			var width=0;
			var height=0;
			if (num>0.97)
			{
				size=2;
				height=this.IMAGE.ebPlane.EB_n1.height;
				width=this.IMAGE.ebPlane.EB_n1.width;
				life=this.IMAGE.ebPlane.EB_n1.life;
				speed=this.IMAGE.ebPlane.EB_n1.speed;
			}else if (num>0.7)
			{
				size=1;
				height=this.IMAGE.emPlane.EM.height;
				width=this.IMAGE.emPlane.EM.width;
				life=this.IMAGE.emPlane.EM.life;
				speed=this.IMAGE.emPlane.EM.speed;
			}else{
				size=0;
				height=this.IMAGE.esPlane.ES.height;
				width=this.IMAGE.esPlane.ES.width;
				life=this.IMAGE.esPlane.ES.life;
				speed=this.IMAGE.esPlane.ES.speed;
			}
			var x=Math.random()*(this.WIDTH-width)
			this.enemies.push({'x':x,'y':-height,'size':size,"state":1,"count":0,"width":width,'height':height,"life":life,"speed":speed})
		},
		/*hitJudge:function(){
			for (var b=0;b<this.bullets.length ;b++ )
			{
				for (var ep=0;ep<this.enemies.length ;ep++ )
				{
					var bX=this.bullets[b].x;
					var epX=this.enemies[ep].x;
					var epW=this.enemies[ep].width;
					var epY=this.enemies[ep].y
					var epWall=this.enemies[ep].y+this.enemies[ep].height-10;
					var planeX=this.mouseX-10;
					var planeWidth=planeX+20;
					var planeY=this.mouseY-this.IMAGE.myPlane.H1.height/2;
					var planeHeight=planeY+100;
					if ((planeY>epY&&planeY<epWall)||(planeHeight>epY&&planeHeight<epWall))//y值重叠
					{
						if ((planeX>epX&&planeX<epX+epW)||(planeWidth>epX&&planeWidth<epX+epW))
						{
							//console.log(planeX+","+planeY+","+planeWidth+","+planeHeight)
							if (this.IMAGE.myPlane.state>0&&this.enemies[ep].life>0)
							{
								this.crash(ep);
							}
						}
					}
					if (bX<=epX||bX>=epX+epW)
					{
						continue;
					}else{
						var bY=this.bullets[b].y;
						if (bY<epWall&&bY>epY&&this.bullets[b].owner=="hero")
						{
							//console.log(this.enemies[ep]+","+this.enemies[ep].y)//+this.enemies[ep].life+","+this.enemies[ep].state)
							this.enemies[ep].life--;
							if (this.enemies[ep].size==2&&this.enemies[ep].life>0&&this.enemies[ep].life<5)
							{
								this.enemies[ep].state=3;
							}
							if (this.enemies[ep].life<=0&&this.enemies[ep].state>0)
							{
								this.enemies[ep].state=-1;
								this.score+=Math.pow(5,this.enemies[ep].size);
								this.boomMusic();
							}
							this.bullets.splice(b,1)
							b--
							break;
						}
					}	
				}
			}
		},*/
		hitJudge:function(hero,bullets){
			//console.log(hero)
			for (var ep=0;ep<this.enemies.length ;ep++ )
			{
				//console.log(this.checkHit(hero,this.enemies[ep]))
				if (this.checkHit(hero,this.enemies[ep]))
				{
					if (hero.state>0&&this.enemies[ep].life>0)
					{
						//console.log("aa")
						this.crash(this.enemies[ep]);
					}
				}
				for (var i=0;i<bullets.length ;i++ )
				{
					if (bullets[i].owner=="hero")
					{
						//console.log(bullets[i])
						if (this.checkHit(bullets[i],this.enemies[ep]))
						{
							this.enemies[ep].life--;
							this.bullets.splice(i,1)
							i--
						}
					}else{
						if (this.checkHit(hero,bullets[i])){
							this.crash(bullets[i]);
							this.bullets.splice(i,1)
							i--
						}
					}
				}
				this.enemyAliveCheck(this.enemies[ep])
			}
			if (this.checkHit(hero,this.LIFE)){
				if (this.LIFE.canDown==1)
				{this.crash(this.LIFE)
				}
			}
			if (this.checkHit(hero,this.FIREBONUS)){
				if (this.FIREBONUS.canDown==1)
				{this.crash(this.FIREBONUS)
				}
			}
		},
		enemyAliveCheck:function(ep){
				if (ep.size==2&&ep.life>0&&ep.life<5)
				{
					ep.state=3;
				}
				if (ep.life<=0&&ep.state>0)
				{
					ep.state=-1;
					this.score+=Math.pow(5,ep.size);
					this.boomMusic();
				}
		},
		checkHit:function(compont,ep){
			//console.log(ep.width)
			return compont.x>ep.x-compont.width&&
						compont.x<ep.x+ep.width&&
						compont.y>ep.y-compont.height&&
						compont.y<ep.y+ep.height;
		},
		crash:function(ep){
			if (!ep.bonus)
			{
				this.life--;
				this.IMAGE.myPlane.state=-1;
				if (this.life==1)
				{
					this.backgroundMusic("danger");
				}
				if (ep.life)
				{
					ep.life=-1;
					ep.state=-1;
				}
			}else{
				//console.log(ep.bonus)
				if (ep==this.LIFE)
				{
					if (this.life<5)
					{this.life+=ep.bonus;
						this.backgroundMusic(this.GAMESTATE.RUNNING);
					}
				}else if (ep==this.FIREBONUS)
				{
					if (this.fireNum<4)
					{this.fireNum+=ep.bonus;
					}
				}
				ep.canDown=0;
			}
		},
		isGameOver:function(life){
			if (life==0)
			{
				this.gameState=this.GAMESTATE.GAMEOVER;
			}
		},
		pausePaint:function(){
			this.cts.drawImage(this.IMAGE.pause,0,0);
		},
		scorePaint:function(score){
			this.cts.font="bold 30px Axure Handwriting"
			//console.log(str)
			this.cts.fillStyle="#323232"
			this.cts.textAlign="left"
			//this.cts.textBaseline='bottom';
			this.cts.fillText("Score "+score,this.IMAGE.pause.width,35);
		},
		lifePaint:function(life){
			this.cts.textAlign="right"
			this.cts.fillText("Life "+life,this.WIDTH-10,35);
		},
		overPaint:function(){
			this.cts.textAlign="center"
			this.cts.fillStyle="rgba(0,0,0,0.2)";
			this.cts.fillRect(0,0,this.WIDTH,this.HEIGHT)
			this.cts.fillStyle="#323232"
			this.cts.font="bold 60px Axure Handwriting"
			this.cts.fillText("Game Over ",this.WIDTH/2,this.HEIGHT/2);
		},
		beginButtonPaint:function(){
			var ready=new Image();
			ready.src=this.LOADING.L1.img;
			this.cts.drawImage(ready,0,this.HEIGHT-this.LOADING.L1.height);
			this.cts.textAlign="center";
			this.cts.fillStyle="#323232";
			this.cts.font="bold 30px Axure Handwriting";
			if (this.gameState==this.GAMESTATE.GAMEOVER)
			{
				this.cts.fillText("Click Here to Restart ! ",this.WIDTH/2,this.HEIGHT-10);
			}else{
				this.cts.fillText("Click Here to Start ! ",this.WIDTH/2,this.HEIGHT-10);
			}
		},
		backgroundMusic:function(state){
			if (this.musicStamp!=state)
			{
				switch (state)
				{
				case 0:
					this.audioSwitch($("music"),"audio/Violent_Acts.mp3");
					$("music").loop=true;
					break;
				case 2:
					this.audioSwitch($("music"),"audio/Battle.mp3");
					break;
				case "danger":
					this.audioSwitch($("music"),"audio/monster.mp3");
					break;
				}
				this.musicStamp=state;
			}
		},
		audioSwitch:function(elem,musicFile){
			var state=0;
			var timer=setInterval(function(){
				//console.log(state)
				if (state==0)
				{
					elem.volume-=0.01;
					if (elem.volume<=0.01)
					{
							elem.load();
							elem.src=musicFile;
							elem.play();
							state=1;	
					}
				}else{
					elem.volume+=0.01;
					if (elem.volume>=0.7)
					{	clearInterval(timer);
						timer=null;
						state=0;
					}
				}
			},10)
		},
		boomMusic:function(){
			$("boom").currentTime=0;
			$("boom").play();
		},
		createLifeBonus:function(){
			if (this.score>50*(this.nextBonus+1))
			{
				this.LIFE.x=Math.random()*(this.WIDTH-this.LIFE.width);
				this.LIFE.y=-this.LIFE.height;
				this.LIFE.canDown=1;
				this.nextBonus++
			}
		},
		createFireBonus:function(x,y){
				this.FIREBONUS.x=x;
				this.FIREBONUS.y=y;
				this.FIREBONUS.canDown=1;
		},
		lifeBonusPaint:function(){
			//this.heartCount++;
			if (this.LIFE.canDown==1)
			{
				if (this.gameState==this.GAMESTATE.RUNNING)
				{
					this.LIFE.y+=this.LIFE.speed;
				}
				this.cts.drawImage(this.IMAGE.life,this.LIFE.x,this.LIFE.y);
			}
		},
		fireBonusPaint:function(){
			//this.heartCount++;
			if (this.FIREBONUS.canDown==1)
			{
				if (this.gameState==this.GAMESTATE.RUNNING)
				{
					this.FIREBONUS.y+=this.FIREBONUS.speed;
				}
				this.cts.drawImage(this.IMAGE.firebonus,this.FIREBONUS.x,this.FIREBONUS.y);
			}
		},
		countRotateDistance:function(){
			this.rotateDistance==this.BULLET.B1.speed&&(this.direction=0.05);
			this.rotateDistance<0&&(this.direction=-0.05);
			this.rotateDistance-=this.direction;
		},
		addSpeed:function(eplane){
				for (var key in eplane)
				{
					if (eplane[key].speed)
					{
						eplane[key].speed+=1
					}
				}
		},
		levelUpdate:function(){
			if (this.score>100*this.level)
			{
				console.log(this.level)
				this.addSpeed(this.IMAGE.esPlane);
				this.addSpeed(this.IMAGE.emPlane);
				this.addSpeed(this.IMAGE.ebPlane);
				this.addSpeed(this.IMAGE.bullet);
				this.level++;
			}
		}
}