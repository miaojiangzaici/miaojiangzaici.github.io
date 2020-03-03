        var x1=null,
            y1=null;
        var x2=null,
            y2=null;       
        var canvas;
        var context;
        var allChess=null;
        var count1 = null;
        var isWhite = true;//设置是否该轮到白棋
        var isWell = false;//设置该局棋盘是否赢了，如果赢了就不能再走了
        var img_b = new Image();
        img_b.src = "images/b.png";//白棋图片
        var img_w = new Image();
        img_w.src = "images/w.png";//黑棋图片
        var bgimg = new Image();
        bgimg.src = "images/gg.png";

        var chessData = new Array(16);//这个为棋盘的二维数组用来保存棋盘信息，
        for (var x = 0; x < 16; x++) { //初始化0为没有走过的，1为白棋走的，2为黑棋走的
            chessData[x] = new Array(16);
            for (var y = 0; y < 16; y++) {
                chessData[x][y] = 0;
            }
        }

window.onload= function(){
    drawRect();
}
        function drawRect() {//页面加载完毕调用函数，初始化棋盘
            canvas = document.getElementById("canvas");
            context = canvas.getContext("2d");
            var logo = new Image();
            logo.src = "images/67.jpg";
            logo.onload = function(){
            context.drawImage(logo,0,0,560,560);
            drawChessBoard();
            }
        
            var drawChessBoard = function(){
                for (var i = 17; i <= 560; i += 35) {//绘制棋盘的线
                    context.beginPath();
                    context.moveTo(17, i);
                    context.lineTo(542, i);
                    context.closePath();
                    context.stroke();
     
                    context.beginPath();
                    context.moveTo(i, 17);
                    context.lineTo(i, 542);
                    context.closePath();
                    context.stroke();
                }
            }
        }

        function drawRect1() {//页面加载完毕调用函数，初始化棋盘
            canvas = document.getElementById("canvas1");
            context = canvas.getContext("2d");
            var logo = new Image();
            logo.src = "images/67.jpg";
            logo.onload = function(){
            context.drawImage(logo,0,0,560,560);
            drawChessBoard();
            }
        
 

            var drawChessBoard = function(){
                for (var i = 17; i <= 560; i += 35) {//绘制棋盘的线
                    context.beginPath();
                    context.moveTo(17, i);
                    context.lineTo(542, i);
                    context.closePath();
                    context.stroke();
     
                    context.beginPath();
                    context.moveTo(i, 17);
                    context.lineTo(i, 542);
                    context.closePath();
                    context.stroke();
                }
            }
        }


        function play(e) {//鼠标点击时发生
       
            var x = Math.floor(e.offsetX / 35);
            var y = Math.floor(e.offsetY / 35);
 
            if (chessData[x][y] != 0) {//判断该位置是否被下过了
                openNew(img,4);
                return;
            }
 
            if (isWhite) {
                isWhite = false;
                drawChess(1, x, y);
            }
            else {
                isWhite = true;
                drawChess(2, x, y);
            }
 
        }


    function drawChess(chess, x, y){
        //参数为，棋（1为白棋，2为黑棋），数组位置
            if (isWell == true) {
                openNew(img,3);
                return;
            }
            if (x >= 0 && x < 16 && y >= 0 && y < 16) {
                if (chess == 1) {
                    context.drawImage(img_w, x * 35 , y * 35 );
                    chessData[x][y] = 1;//绘制白棋
                    x1=x;
                    y1=y;
                    allChess =1
                }
                else if(chess==2){

                    context.drawImage(img_b, x * 35 , y * 35 );
                    chessData[x][y] = 2;//绘制黑棋
                    x2=x;
                    y2=y;
                    allChess =2;
                    
                }
                judge(x, y, chess);
            }
        }


         //获 取悔棋的节点

       var obj2 = document.getElementById("huiqi");
       if(obj2.addEventListener){
           obj2.addEventListener('click',huiqi,false);
       }else{
           obj2.attachEvent('onclick',huiqi);
       }

        //悔棋的方法
        function huiqi(evment){
           //兼容ie
           evment= evment || window.evment;
           Back(); 

       }

       function Back(){
            
            if (allChess == 1 ) {
                chessData[x1][y1] = 0;
                context.drawImage(bgimg, x1 * 35 , y1 * 35 );
            }
            else{
                chessData[x2][y2] = 0;
               context.drawImage(bgimg, x2 * 35 , y2 * 35 );       
            }
            
       }

        function judge(x, y, chess){//判断该局棋盘是否赢了
                count1 = 0;
            var count2 = 0;
            var count3 = 0;
            var count4 = 0;
 
            //左右判断
            for (var i = x; i >= 0; i--) {
                if (chessData[i][y] != chess) {
                    break;
                }
                count1++;
            }
 
            for (var i = x + 1; i < 16; i++) {
                if (chessData[i][y] != chess) {
                    break;
                }
                count1++;
            }
            
            //上下判断

            for (var i = y; i >= 0; i--) {
                if (chessData[x][i] != chess) {
                    break;
                }
                 count2++;
            }

            for (var i = y + 1; i < 16; i++) {
                if (chessData[x][i] != chess) {
                    break;
                }
                count2++;
            }

            //左上右下判断
            for (var i = x, j = y; i >= 0, j >= 0; i--, j--) {
                if (chessData[i][j] != chess) {
                    break;
                }
                count3++;
            }
            for (var i = x + 1, j = y + 1; i < 16, j < 16; i++, j++) {
                if (chessData[i][j] != chess) {
                    break;
                }
                count3++;
            }
        
            //右上左下判断
            for (var i = x, j = y; i >= 0, j < 16; i--, j++) {
                if (chessData[i][j] != chess) {
                    break;
                }
                count4++;
            }
            for (var i = x + 1, j = y - 1; i < 16, j >= 0; i++, j--) {
                if (chessData[i][j] != chess) {
                    break;
                }
                count4++;
            }
 
            if (count1 >= 5 || count2 >= 5 || count3 >= 5 || count4 >= 5) {
                if (chess == 1) {
                    openNew(img,6);
                }
                else {
                    openNew(img,5);
                }
                isWell = true;//设置该局棋盘已经赢了，不可以再走了
            }
        }

        function show(){
            if(count1==null){
                openNew(img,1);
            }else if(count1<5&&count1>0){
                openNew(img,2);
                isWell=true;
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


    

    
       