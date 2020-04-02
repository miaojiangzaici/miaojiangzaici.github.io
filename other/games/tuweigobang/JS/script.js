var me = true;
var chessBoard = [];
var Warn=[];
var over = false;
//赢法数组
var wins = [];
//赢法统计数组 
var myWin = [];
var computerWin = [];
var img_b = new Image();
img_b.src = "images/b.png";//白棋图片
var img_w = new Image();
img_w.src = "images/w.png";//黑棋图片
var bgimg = new Image();
bgimg.src = "images/gg.png";
//统计要下子的坐标
for(var i=0;i<16;i++){
	chessBoard[i] = [];
	for(var j=0;j<16;j++){
		chessBoard[i][j]=0;
	}
}

//初始化赢法数组
for( var i=0;i<16;i++){
   wins[i] = [];
   for(var j=0;j<16;j++){
   		wins[i][j] = [];
   }
}

var count  = 0;
//横线赢法
for(var i=0;i<16;i++){
	for(var  j=0;j<12;j++){
		for(var k=0;k<5;k++){
			wins[i][j+k][count] = true;
		}
		count++;
	}
}
//竖线赢法
for(var i=0;i<16;i++){
	for(var  j=0;j<12;j++){
		for(var k=0;k<5;k++){
			wins[j+k][i][count] = true;
		}
		count++;
	}
}

//斜线赢法
for(var i=0;i<12;i++){
	for(var  j=0;j<12;j++){
		for(var k=0;k<5;k++){
			wins[i+k][j+k][count] = true;
		} 
		count++;
	}
}

//反斜线赢算法
for(var i=0;i<12;i++){
	for(var  j=15;j>3;j--){
		for(var k=0;k<5;k++){
			wins[i+k][j-k][count] = true;
		} 
		count++;
	}
}

console.log(count);

for(var i=0;i<count;i++){
	myWin[i] =0;
	computerWin[i] =0;
}

var chess = document.getElementById('chess');//设置变量chess,获得画布的id chess
var context = chess.getContext('2d');//设置变量context,返回一个用于在画布上绘图的环境

context.strokeStyle = "#000000";
/*context.moveTo(0,0);//调用moveTo();方法并设定初值
context.lineTo(450,450);//调用loneTo方法并设定初值
context.stroke();//调用stroke();方法来画线	*/

//设置背景
var logo = new Image();
logo.src = "images/67.jpg";
logo.onload = function(){
	context.drawImage(logo,0,0,560,560);
	drawChessBoard();

}
context.drawImage(logo,0,0,560,560);


var drawChessBoard = function(){
//用for循环画出纵横线
	for(var i=0; i<17; i++){
		context.moveTo(17 + i*35, 17);
		context.lineTo(17 + i*35, 543);
		context.stroke();
		
		context.moveTo(17,17 + i*35);
		context.lineTo(543,17 + i*35);
		context.stroke();
	}
}

var oneStep = function(i,j,me){

    if (me) {
        context.drawImage(img_w, i * 35 , j * 35 );
    }
    else{

        context.drawImage(img_b, i * 35 , j * 35 );
        
    }
}

//实现可以下棋子的动作
chess.onclick = function(e){
	if(over){
		return;
	}
	if(!me){
		return;
	}
	var x = e.offsetX;
	var y = e.offsetY;
	var i = Math.floor(x / 35);
	var j = Math.floor(y / 35);
	if(chessBoard[i][j]==0){
		oneStep(i, j, me);
		chessBoard[i][j] = 1;

		for(var k=0;k<count;k++){
			if(wins[i][j][k]){
				myWin[k]++;
				computerWin[k]=6;
				if(myWin[k]==5){
					openNew(img,6);
					over = true;
					
				}
			}
			
		}

		if(!over){
			me=!me;
			computerAI();
		}
	}
	Warn=5;
}

var computerAI = function(){
	var myScore = [];
	var computerScore = [];
	var max = 0;
	var u = 0,v = 0;
	for(var i=0;i<16;i++){
		myScore[i] = [];
		computerScore[i] = [];
		for(var j=0;j<16;j++){
			myScore[i][j] = 0;

		}
	}

	for(var i=0;i<16;i++){
		for(var j=0;j<16;j++){
			if(chessBoard[i][j]==0){
				for(var k=0;k<count;k++){
					if(wins[i][j][k]){
						if(myWin[k]==1){
							myScore[i][j]+=200;
						}else if(myWin[k]==2){
							myScore[i][j]+=400;
						}else if(myWin[k]==3){
							myScore[i][j]+=2000;
						}else if(myWin[k]==4){
							myScore[i][j]+=10000;
						}
						if(computerWin[k]==1){
							computerScore[i][j]+=220;
						}else if(computerWin[k]==2){
							computerScore[i][j]+=420;
						}else if(computerWin[k]==3){
							computerScore[i][j]+=2100;
						}else if(computerWin[k]==4){
							computerScore[i][j]+=20000;
						}
					}
				}
				if(myScore[i][j]>max){
					max=myScore[i][j];
					u=i;
					v=j;
				}else if(myScore[i][j]==max){
					if(computerScore[i][j]>computerScore[u][v]){
						u=i;
						v=j;
					}
				}
				if(computerScore[i][j]>max){
					max=computerScore[i][j];
					u=i;
					v=j;
				}else if(computerScore[i][j]==max){
					if(myScore[i][j]>myScore[u][v]){
						u=i;
						v=j;
					}
				}
			}
		}
	}
	oneStep(u,v,false);
	chessBoard[u][v]=2;
	for(var k=0;k<count;k++){
			if(wins[u][v][k]){
				computerWin[k]++;
				myWin[k]=6;
				if(computerWin[k]==5){
					openNew(img,5);
					over = true;
				}
			}
		}

		if(!over){
		me=!me;
	}
	Warn =5;
}

function show(){
	
    if(Warn==0){
        openNew(img,1);
    }else {
        over = true;
         openNew(img,2);
    }
}

var img=null;
    function openNew(img,A){
            //获取页面的高度和宽度
            var sWidth=document.body.scrollWidth;
            var sHeight=document.body.scrollHeight;
            
            //获取页面的可视区域高度和宽度
            var wHeight=document.documentElement.clientHeight;
            
            var oMask=document.createElement("div");//创建遮套层
                oMask.id="mask";
                oMask.style.height=sHeight+"px"; 
                oMask.style.width=sWidth+"px";
                document.body.appendChild(oMask);// 页面追加
            var oLogin=document.createElement("div");
                oLogin.id="login";
                /*oLogin.Content.style.margin="15 15 15 15 " */
                if(A==0){
                    oLogin.style.background="url(images/loginBg.png) #2A2C2E center center no-repeat";
                }else if(A==1){
                    oLogin.style.background="url(images/loginBg1.png) #2A2C2E center center no-repeat";
                }
                else if(A==2){
                    oLogin.style.background="url(images/loginBg2.png) #2A2C2E center center no-repeat";
                }
                else if(A==3){
                    oLogin.style.background="url(images/loginBg3.png) #2A2C2E center center no-repeat";
                }
                else if(A==4){
                    oLogin.style.background="url(images/loginBg4.png) #2A2C2E center center no-repeat";
                }
                else if(A==5){
                    oLogin.style.background="url(images/loginBg5.png) #2A2C2E center center no-repeat";
                }
                else if(A==6){
                    oLogin.style.background="url(images/loginBg6.png) #2A2C2E center center no-repeat";
                }

                oLogin.innerHTML="<div class='loginCon'><div id='close'>点击关闭</div></div>";
                document.body.appendChild(oLogin);
            
            //获取登陆框的宽和高
            var dHeight=oLogin.offsetHeight;
            var dWidth=oLogin.offsetWidth;
                //设置登陆框的left和top
                oLogin.style.left=sWidth/2-dWidth/2+"px";
                oLogin.style.top=wHeight/2-dHeight/2+"px";
            //点击关闭按钮
            var oClose=document.getElementById("close");
            
                //点击登陆框以外的区域也可以关闭登陆框
                oClose.onclick=oMask.onclick=function(){
                document.body.removeChild(oLogin);
                document.body.removeChild(oMask);
            };
    };
