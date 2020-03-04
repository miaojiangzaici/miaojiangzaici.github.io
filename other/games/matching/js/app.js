/*
 * 创建一个包含所有卡片的数组
*/
// 移除整个ul里的所有元素
const cards = document.getElementById('deck');
cards.innerHTML = "";

// 卡片图标数组
const cardIcon = [
    'fa-diamond',
    'fa-paper-plane-o',
    'fa-anchor',
    'fa-bolt',
    'fa-cube',
    'fa-anchor',
    'fa-leaf',
    'fa-bicycle',
    'fa-diamond',
    'fa-bomb',
    'fa-leaf',
    'fa-bomb',
    'fa-bolt',
    'fa-bicycle',
    'fa-paper-plane-o',
    'fa-cube'
];

let openCards = []; // 状态为 'open' 的卡片的数组
let matchCards = []; // 如果它的长度等于8，说明匹配完全
let num; // num = matchCards.length
const count = document.querySelector('.moves');// 查找 moves 的元素
count.textContent = 0; // 初始化 moves
let moves = Number(count.textContent); // 强制转换 moves 为数字类型
const stars = document.querySelector('.stars'); // 查找 stars 的元素
const times = document.getElementById('time'); // 匹配成功显示页面里的总时间
let isFirstClick = true; //定义全局变量作为计时器标志

// --Success modal windows-- 
const step = document.getElementById('step'); // 匹配成功显示页面里的总步数
let time = document.querySelector('.timer'); // 查找 timer 元素
let star = document.getElementById('star'); // 查找 star 的元素

// h1 每个首字母大写
let title = document.querySelector('h1').textContent;
function titleCase(str) {
    return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
}
const t = titleCase(title);
document.querySelector('h1').textContent = t;

/*
 * 显示页面上的卡片
 *   - 使用下面提供的 "shuffle" 方法对数组中的卡片进行洗牌
 *   - 循环遍历每张卡片，创建其 HTML
 *   - 将每张卡的 HTML 添加到页面
*/

// 洗牌函数来自于 http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// 循环遍历 cardIcon 数组，将其 html 加到页面中
function createHtml(arr){
    shuffle(arr);
    let text = "";
    for(let i = 0 ;i < arr.length; i++){
        text += `<li class="card"><i class="fa ${arr[i]}"></i></li>\n`;
    }
    cards.insertAdjacentHTML('afterbegin', text);
}
createHtml(cardIcon);

/*
 * 设置一张卡片的事件监听器。 如果该卡片被点击：
 *  - 显示卡片的符号
 *  - 将卡片添加到状态为 “open” 的 *数组* 中
 *  - 如果数组中已有另一张卡，请检查两张卡片是否匹配
 *    + 如果卡片匹配，将卡片锁定为 "open" 状态
 *    + 如果卡片不匹配，请将卡片从数组中移除并隐藏卡片的符号
 *    + 增加移动计数器并将其显示在页面上
 *    + 如果所有卡都匹配，则显示带有最终分数的消息
*/

// 重置,恢复参数默认值
function reset(){
    location.reload();
}

// 显示卡片并匹配
function openCard(event){
    // 点击的元素有可能不是卡片，而有可能是卡片里面的图标；判断点击的是不是卡片，
    // 避免 TypeError:Cannot read property 'classList' of null
    if(!event.target.classList.contains('card')){
        return;
    }

    // 多于两张打开的卡片后，就不再显示卡片和匹配检查，避免第三张卡片的尴尬
    if (openCards.length >= 2) {
        return;
    }

    //判断被点击的卡片是否已经被点开 
    // 如果快速点击同一张卡片两次，就会很容易让程序有 Bug 了。这是因为没有防止连续点击同一张卡片的措施导致的。
    if (event.target.classList.contains('show') || event.target.classList.contains('match')) {
        console.log('show or match')
        //如果已经打开或者匹配了, 就中止后续的操作
        return;
    }

    event.target.classList.add('open', 'show');
    // 查找显示的卡片的图标，将它添加到 open 数组中，以备后续比较卡片所用
    const name = event.target.querySelector('i').classList[1];
    openCards.push(name);


    // 判断 openCards 里面的两张卡片是否匹配
    let el = document.querySelectorAll('.open'); // 返回 NodeList
    let cardStatu = Array.from(el); // 将 NodeList 装换为数组

    if (cardStatu.length === 2) {
        if (openCards[0] === openCards[1]) {
            // 如果卡片相同，则删除'open','show', 添加'match' 状态
            setTimeout(function() {
               cardStatu[0].classList.remove('open', 'show');
               cardStatu[1].classList.remove('open', 'show');
               cardStatu[0].classList.add('match');
               cardStatu[1].classList.add('match');
            }, 500);

            // 将openCards中已经匹配的卡片放进 新数组-匹配数组 中
            // 将匹配的两张卡片，放到匹配卡片数组中
            matchCards.push(openCards);
            num = matchCards.length;

            // 删除 openCards 中打开的卡片, openCards 为 0
            openCards.splice(0, 2);

        } else {
            // 如果两张open 状态的卡片不相同,则恢复默认状态
            setTimeout(function() {
                cardStatu[0].classList.remove('open', 'show');
                cardStatu[1].classList.remove('open', 'show');
                openCards.splice(0, 2);
            },500);
        }

        // 每点击两张卡片 move 加 1 , 并显示在页面上
        moves = moves + 1;
        count.textContent = moves;

        // 步数 跟 star 的变化
        if (moves === 15 && num < 8) {
            stars.removeChild(stars.firstElementChild);
        } else if (moves === 25 && num < 8) {
            stars.removeChild(stars.firstElementChild);
        } else if (moves === 35 && num < 8) {
            stars.removeChild(stars.firstElementChild);
        } else if (num === 8) {
            // 显示遮罩层并带有最终分数的消息
            showDiv();
        };      
    }
}

// 遮罩层
function showDiv() {
    document.getElementById("modal-bg").style.display = "block";
    document.getElementById("modal-window").style.display = "block";
    const contents = '一共移动了 ';
    const html = contents + moves + ' moves';
    step.insertAdjacentHTML('afterbegin',html);
    const long = document.querySelector('.timer').innerHTML;
    times.insertAdjacentHTML('afterbegin', long);
    star.insertAdjacentHTML('afterbegin', stars.innerHTML);
}

function hideDiv() {
    document.getElementById("modal-bg").style.display = 'none';
    document.getElementById("modal-window").style.display = 'none';
    createHtml(cardIcon);
}

// 给playAgain按钮设置点击事件
const again = document.getElementById('play-again');
again.addEventListener('click', function () {
    // 隐藏遮罩层
    hideDiv()
    // 刷新页面,重新洗牌
    reset();
});

let timer;
//  给卡片的父元素设置点击事件
cards.addEventListener('click',function(event){
    if (isFirstClick === true){
        //设置第一次的标记变量为 false
        isFirstClick = false;
        // 启动计时器
       timer = setInterval(function() {
            timeType = Number(time.innerHTML) + 1;
            document.querySelector('.timer').innerHTML = String(timeType);
        },1000);
    };
    
    // 卡片已经匹配完成，结束计时器
    if(num === 8){
        clearInterval(timer);
    };

    // 显示卡片并匹配
    openCard(event);
});

// 给刷新按钮设置点击事件
const restart = document.getElementById('restart');
restart.addEventListener('click', function () {
    // 刷新页面,重新洗牌
    reset();
});
