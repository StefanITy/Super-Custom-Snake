let canvasSize;
let blockSize;
const body=document.querySelector("body");
body.addEventListener("click", ()=>{if(gameOver)Restart();})
const canvas = document.querySelector("canvas");
canvas.addEventListener("click", Pause);

const context = canvas.getContext("2d");
const scoreBoard=document.getElementById("scoreBoard");
const foodBoard=document.getElementById("foodBoard");
const scoreBar=document.getElementById("scoreBar");
const scoreBarContainer=document.getElementById("scoreBarContainer");
const settings=document.getElementById('settings');
const foodPickSound=document.getElementById('foodPickSound');
const gameOverSound=document.getElementById('gameOverSound');
const infoPanel=document.getElementById('infoPanel');

let horizontal=0;
let vertical=0;
let gameOver=false;
let pauseGame=false;
let canChangeDir=true;
let foodSizeShrink=1;

let superFood=false;
let score=0;
let highScore=0;


const scoreBarColors=['#00FF00','#FFFF00','	#FFA500','#FF0000'];
//style settings
//DARK
backgroundColorDark='#1A1A1A';
snakeColorDark='#00CC00';
colorDark='#D3D3D3';
gridColorDark='#121212';
foodColorDark='#FFD700';
superFoodColorDark='#00FFFF';
utilityBackgroundColorDark='#F5F5DC';
settingsBorderColorDark='#2a2a2a';
settingsBackgroundColorDark='#3a3a3a';
settingsColorDark='#B0B0B0';
okSettingsBackgroundColorDark='#006666';
okSettingsColorDark='#B0B0B0';
okSettingsBorderColorDark='#00CC00';
//light
backgroundColorLight='#FAF3E0';
snakeColorLight='#006400';
colorLight='#1A1A1A';
gridColorLight='#E0E0E0';
foodColorLight='#228B22';
superFoodColorLight='#8A2BE2';
utilityBackgroundColorLight='#7A7A7A';
settingsBorderColorLight='#E8DCBF';
settingsBackgroundColorLight='#F2E7D2';
settingsColorLight='#4B3828';
okSettingsBackgroundColorLight='#A0522D';
okSettingsColorLight='#F2E7D2';
okSettingsBorderColorLight='#4B3828';

//canvas
let blockPercent=0.05;
let blocksNumber=Math.floor(100/(blockPercent*100));
let gridedCanvas=true;
//snake
let snakeSizeShrink=1.2
let snakeSpeed = 10;
//game
let boxMode=false;
let darkMode=true;
//food
let growSpeed=1;

function DarkModeChgange(){
    if(darkMode){
        canvas.style.border=`1rem solid ${gridColorLight}`;
        if(!boxMode)
            canvas.style.borderStyle="dashed";
        body.style.backgroundColor=backgroundColorDark;
        canvas.style.backgroundColor=backgroundColorDark;
        scoreBoard.style.color = colorDark;
        foodBoard.style.color = colorDark;
        scoreBarContainer.style.borderColor=backgroundColorLight;
        scoreBarContainer.style.backgroundColor=backgroundColorDark;
        utility.style.backgroundColor=utilityBackgroundColorDark;
        utility.children[0].src='./Src/SettingsDark.png'
        utility.children[1].src='./Src/FullScreenDark.png'
        utility.children[2].src='./Src/InfoDark.png'
        utility.children[3].src='./Src/OpenUtilityDark.png'

        settings.style.borderColor=settingsBackgroundColorDark;
        settings.style.backgroundColor=settingsBackgroundColorDark;
        settings.style.color=settingsColorDark;
        okSettings.style.backgroundColor=okSettingsBackgroundColorDark;
        okSettings.style.color=okSettingsColorDark;
        okSettings.style.borderColor=okSettingsBorderColorDark;

        resetHS.style.backgroundColor=okSettingsBackgroundColorDark;
        resetHS.style.color=okSettingsColorDark;
        resetHS.style.borderColor=okSettingsBorderColorDark;


        infoPanel.style.borderColor=settingsBackgroundColorDark;
        infoPanel.style.backgroundColor=settingsBackgroundColorDark;
        infoPanel.style.color=settingsColorDark;
        okInfo.style.backgroundColor=okSettingsBackgroundColorDark;
        okInfo.style.color=okSettingsColorDark;
        okInfo.style.borderColor=okSettingsBorderColorDark;

    }else{
        canvas.style.border=`1rem solid ${gridColorDark}`;
        if(!boxMode)
            canvas.style.borderStyle="dashed";
        body.style.backgroundColor=backgroundColorLight;
        canvas.style.backgroundColor=backgroundColorLight;
        scoreBoard.style.color = colorLight;
        foodBoard.style.color = colorLight;
        scoreBarContainer.style.borderColor=backgroundColorDark;
        scoreBarContainer.style.backgroundColor=backgroundColorLight;
        utility.style.backgroundColor=utilityBackgroundColorLight;
        utility.children[0].src='./Src/SettingsLight.png'
        utility.children[1].src='./Src/FullScreenLight.png'
        utility.children[2].src='./Src/InfoLight.png'
        utility.children[3].src='./Src/OpenUtilityLight.png'
        settings.style.borderColor=settingsBackgroundColorLight;
        settings.style.backgroundColor=settingsBackgroundColorLight;
        settings.style.color=settingsColorLight;
        okSettings.style.backgroundColor=okSettingsBackgroundColorLight;
        okSettings.style.color=okSettingsColorLight;
        okSettings.style.borderColor=okSettingsBorderColorLight;

        resetHS.style.backgroundColor=okSettingsBackgroundColorLight;
        resetHS.style.color=okSettingsColorLight;
        resetHS.style.borderColor=okSettingsBorderColorLight;

        infoPanel.style.borderColor=settingsBackgroundColorLight;
        infoPanel.style.backgroundColor=settingsBackgroundColorLight;
        infoPanel.style.color=settingsColorLight;
        okInfo.style.backgroundColor=okSettingsBackgroundColorLight;
        okInfo.style.color=okSettingsColorLight;
        okInfo.style.borderColor=okSettingsBorderColorLight;
    }
}
//Basic Functions
function setup() {
    
    DarkModeChgange();

    scoreBoard.children[0].style.display='none';
    scoreBoard.children[2].style.display="none";
    scoreBoard.style.justifyContent="center";

    foodBoard.children[2].style.display="none";

    scoreBoard.children[0].innerText=`S: ${score}`;
    scoreBoard.children[2].innerText=`HS: ${highScore}`;
    WindowChange();
    addSnakePart(Math.floor(blocksNumber/2),Math.floor(blocksNumber/2));
    Food.Move();
    update();
}

function update() {
    if(!pauseGame){
        
        move(horizontal,vertical);
        draw();
    }
}


function drawSnake(){
    context.fillStyle=snakeColorDark;
    for(let i = 0; i < snake.length; i++) {
        let partX=snake[i].x*blockSize+((blockSize-(blockSize/snakeSizeShrink))/2);
        let partY=snake[i].y*blockSize+((blockSize-(blockSize/snakeSizeShrink))/2);
        context.fillRect(partX,partY,blockSize/snakeSizeShrink,blockSize/snakeSizeShrink);
    }
}

function drawFood(){
    if(darkMode){
        if(superFood)
            context.fillStyle = superFoodColorDark;
        else context.fillStyle=foodColorDark;
    }else{
        if(superFood)
            context.fillStyle = superFoodColorLight;
        else context.fillStyle=foodColorLight;
    }

    // Calculate the center of the food's position
    let centerX = Food.x * blockSize + blockSize / 2;
    let centerY = Food.y * blockSize + blockSize / 2;
    
    // Draw a circle with the same radius as half the blockSize
    context.beginPath();
    context.arc(centerX, centerY, blockSize / 2/foodSizeShrink, 0, 2 * Math.PI);
    context.fill();
}

function drawGrid(){
    for (let x = 0; x <= canvas.width; x += blockSize) {
        for (let y = 0; y <= canvas.height; y += blockSize) {
            if(darkMode)
                context.strokeStyle = gridColorDark; 
            else context.strokeStyle=gridColorLight 
            context.strokeRect(x, y, blockSize, blockSize);
        }
    }
}

function draw() {
    context.clearRect(0,0,canvas.width,canvas.width);
    drawSnake();
    drawFood();
    if(gridedCanvas)
        drawGrid();
}

//Game 
//snake
let snake=[];

function addSnakePart(x,y){
    let snakePart={
        x:x,
        y:y,
    };
    snake.push(snakePart);
}

let positionX=[];
let positionY=[];
function move(h,v){

    positionX=[];
    positionY=[];
    snake.forEach(part=>{
        positionX.push(part.x);
        positionY.push(part.y);
    });
    let out=(snake[0].x+h<0 || snake[0].x+h>blocksNumber-1) || (snake[0].y+v<0 || snake[0].y+v>blocksNumber-1);
    if(boxMode){
        if(out){
            GameOver();
            clearInterval(updateInverval);
        }
    }else{
        if(out){
            if(snake[0].x+h<0)
                snake[0].x=blocksNumber;
            else if(snake[0].x+h>blocksNumber-1)
                snake[0].x=-1;
            else if(snake[0].y+v<0)
                snake[0].y=blocksNumber;
            else if(snake[0].y+v>blocksNumber-1)
                snake[0].y=-1;
            for(let i=1;i<snake.length;i++){
                snake[i].x=positionX[i-1];
                snake[i].y=positionY[i-1];
            }
        }
    }
    if(!gameOver){
        for(let i=1;i<snake.length;i++){
            if(snake[0].x+h===snake[i].x && snake[0].y+v===snake[i].y){
                GameOver();
                clearInterval(updateInverval);
            }
        }
    }

    if(!gameOver){
        snake[0].x+=h;
        snake[0].y+=v;
        for(let i=1;i<snake.length;i++){
            snake[i].x=positionX[i-1];
            snake[i].y=positionY[i-1];
        }
        FoodUpdate();
    }
    canChangeDir=true;
}
//food
let snakeArray=[];
let gameArray=[];
function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}
let Food={
    x:0,
    y:0,
    Move:()=>{
        snakeArray=[];
        gameArray=[];
        snake.forEach(part=>{
            snakeArray.push([part.x,part.y]);
        });
        for(let i=0;i<blocksNumber;i++){
            for(let j=0;j<blocksNumber;j++){
                gameArray.push([i,j])
            }
        }
        const avabileSpaces = gameArray.filter(item => !snakeArray.some(snakeItem => arraysEqual(snakeItem, item)));
        let randomIndex = Math.floor(Math.random() * avabileSpaces.length);
        if(Math.floor(Math.random()*100)<50)
            superFood=true;
        else superFood=false;
        Food.x=avabileSpaces[randomIndex][0];
        Food.y=avabileSpaces[randomIndex][1];
        foodSizeShrink=1;

    }
}
function FoodUpdate(){
    if(snake[0].x===Food.x && snake[0].y===Food.y){
        foodPickSound.currentTime = 0;
        foodPickSound.play();

        for(let i=0;i<growSpeed;i++)
            addSnakePart(positionX[positionX.length-1],positionY[positionY.length-1]);
        if(!superFood)
            score+=(1/foodSizeShrink)*growSpeed;
        else score+=(2/foodSizeShrink)*growSpeed;
        score=parseFloat(score.toFixed(2));
        
        if(highScore<score)
            highScore=score;
        scoreBoard.children[0].innerText=`S: ${score}`;
        scoreBoard.children[2].innerText=`HS: ${highScore}`;
        
        Food.Move();

    }
    else if(foodSizeShrink<2 && (horizontal!=0 || vertical!=0)){
        foodSizeShrink+=0.02;
    }
    if(foodSizeShrink>2){
        foodSizeShrink=2;
    }
    //console.log(scoreBarContainer.children[1])
    if(!superFood){
        let percent = (2 - foodSizeShrink) * 100;
        scoreBar.style.width=`${percent}%`;
        if(percent>75)
            scoreBar.style.backgroundColor=scoreBarColors[0];
        else if(percent>50 && percent<=75)
            scoreBar.style.backgroundColor=scoreBarColors[1];
        else if(percent>25 && percent<=50)
            scoreBar.style.backgroundColor=scoreBarColors[2];
        else if(percent<=25)
            scoreBar.style.backgroundColor=scoreBarColors[3];
    }else{

        let percent = (2 - foodSizeShrink) * 100;
        scoreBar.style.width=`${percent}%`;
        if(percent>75)
            scoreBar.style.backgroundColor=scoreBarColors[0];
        else if(percent>50 && percent<=75)
            scoreBar.style.backgroundColor=scoreBarColors[1];
        else if(percent>25 && percent<=50)
            scoreBar.style.backgroundColor=scoreBarColors[2];
        else if(percent<=25)
            scoreBar.style.backgroundColor=scoreBarColors[3];
        
    }
}

//game over
function GameOver(){
    gameOverSound.currentTime=0;
    gameOverSound.play();
    gameOver=true;
    scoreBoard.children[1].style.display="block";
    scoreBoard.children[1].innerText='GAME OVER';

    foodBoard.children[0].style.display="none";
    foodBoard.children[1].style.display="none";
    foodBoard.children[2].style.display="block";

    

    clearInterval(updateInverval);
    updateInverval = null;
}

function Restart(){
    setActiveSettings.style.opacity='1';
    setActiveSettings.style.cursor='pointer'

    setActiveInfo.style.opacity='1';
    setActiveInfo.style.cursor='pointer'

    gameOver=false;
    score=0;
    scoreBoard.children[0].innerText=`S: ${score}`;

    scoreBoard.children[0].style.display='none';
    scoreBoard.children[1].style.display='block';
    scoreBoard.children[1].innerText='PLEASE MOVE TO START!';
    scoreBoard.children[2].style.display="none";
    scoreBoard.style.justifyContent="center";

    foodBoard.children[0].style.display="block";
    foodBoard.children[1].style.display="block";
    foodBoard.children[2].style.display="none";
    scoreBar.style.width='100%';
    scoreBar.style.backgroundColor=scoreBarColors[0];


    snake=[];
    addSnakePart(Math.floor(blocksNumber/2),Math.floor(blocksNumber/2));
    Food.Move();
    canChangeDir=true;
    once=true;
    draw();
}

//window Resize
const canavsSizePercent=0.8;
let dominantSize;
function WindowChange() {
    if (window.innerWidth > window.innerHeight) {
        // landscape
        canvasSize = Math.floor(canavsSizePercent*window.innerHeight);
        dominantSize=window.innerHeight;
    } else {
        // portrait
        canvasSize = Math.floor(canavsSizePercent*window.innerWidth);
        dominantSize=window.innerWidth;
    }
    blockSize = Math.floor(blockPercent * canvasSize);
    canvas.width = blockSize*blocksNumber;
    canvas.height = blockSize*blocksNumber;
    scoreBoard.style.width=getComputedStyle(canvas).width;
    foodBoard.style.width=getComputedStyle(canvas).width;
    draw();
}

function Pause(){
    if(!gameOver && updateInverval){
        if(pauseGame){
            pauseGame=false;
            scoreBoard.children[1].style.display='none';
            scoreBoard.children[1].innerText='PAUSED!';
        }
        else {
            pauseGame=true;
            scoreBoard.children[1].style.display='block';
            scoreBoard.children[1].innerText='PAUSED!';
        }
    }
}


// Events
window.onload =()=>{
    setup();
    OkSettings();
} 
window.addEventListener('resize', WindowChange);
let updateInverval;
let once=true;
window.addEventListener("keydown", (event)=>{
    if(!gameOver){
        if((event.code==='KeyE' || event.code==="KeyP" || event.code==='ControlRight')){
            Pause();
        }
    }
    if(canChangeDir && !pauseGame && !gameOver){
        if((event.code==='KeyW' || event.code==='ArrowUp') && (vertical===0 || snake.length===1)){
            horizontal=0;
            vertical=-1;
            canChangeDir=false;
        }else if((event.code==='KeyS' || event.code==='ArrowDown') && (vertical===0 || snake.length===1)){
            horizontal=0;
            vertical=1;
            canChangeDir=false;
        }else if((event.code==='KeyA' || event.code==='ArrowLeft') && (horizontal===0 || snake.length===1)){
            horizontal=-1;
            vertical=0;
            canChangeDir=false;
        }else if((event.code==='KeyD' || event.code==='ArrowRight') && (horizontal===0 || snake.length===1)){
            horizontal=1;
            vertical=0;
            canChangeDir=false;
        }
    }
    if(once && !canChangeDir && !changeSettings && !changeInfo){
        updateInverval=setInterval(update, 1000/snakeSpeed);
        once=false;
        scoreBoard.children[0].style.display='block';
        scoreBoard.children[1].style.display="none";
        scoreBoard.children[2].style.display="block";
        scoreBoard.style.justifyContent="space-between";

        setActiveSettings.style.opacity='0.2';
        setActiveSettings.style.cursor='default'
        setActiveInfo.style.opacity='0.2';
        setActiveInfo.style.cursor='default'
    }
});
//swipe
function detectSwipe(el, callback) {
    let startX, startY;
    const threshold = 10; // Minimum movement in pixels required to be considered a swipe

    el.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });

    el.addEventListener('touchend', function (e) {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;

        const dx = endX - startX;
        const dy = endY - startY;

        if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) { // Check if movement is bigger than the threshold
            if (Math.abs(dx) > Math.abs(dy)) {
                // Horizontal swipe
                if (dx > 0) {
                    callback('right');
                } else {
                    callback('left');
                }
            } else {
                // Vertical swipe
                if (dy > 0) {
                    callback('down');
                } else {
                    callback('up');
                }
            }
        }
    });
}
detectSwipe(document.body, function (direction) {
    if(canChangeDir && !pauseGame && !gameOver){
        if(direction === 'up' && (vertical===0 || snake.length===1)){
            horizontal=0;
            vertical=-1;
            canChangeDir=false;
        }else if(direction === 'down' && (vertical===0 || snake.length===1)){
            horizontal=0;
            vertical=1;
            canChangeDir=false;
        }else if(direction === 'left' && (horizontal===0 || snake.length===1)){
            horizontal=-1;
            vertical=0;
            canChangeDir=false;
        }else if(direction === 'right' && (horizontal===0 || snake.length===1)){
            horizontal=1;
            vertical=0;
            canChangeDir=false;
        }
        if(direction && once && !canChangeDir){
            updateInverval=setInterval(update, 1000/snakeSpeed);
            once=false;
            scoreBoard.children[0].style.display='block';
            scoreBoard.children[1].style.display="none";
            scoreBoard.children[2].style.display="block";
            scoreBoard.style.justifyContent="space-between";
    
            setActiveSettings.style.opacity='0.2';
            setActiveSettings.style.cursor='default'
        }
    }



});

//full screen
const fullScreenButton=document.getElementById("FullScreenButton");
fullScreenButton.addEventListener("click", SwitchFullScreen);
function SwitchFullScreen(){
    if (!document.fullscreenElement) { // Check if we are not in fullscreen
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) { /* Firefox */
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) { /* IE/Edge */
            document.documentElement.msRequestFullscreen();
        }
        if(darkMode)
            fullScreenButton.src="./Src/WindowScreenDark.png";
        else fullScreenButton.src="./Src/WindowScreenLight.png";
    } else { // We are in fullscreen, let's exit
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { /* Firefox */
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE/Edge */
            document.msExitFullscreen();
        }
        if(darkMode)
            fullScreenButton.src="./Src/FullScreenDark.png";
        else fullScreenButton.src="./Src/FullScreenLight.png";
    }
}
//setActiveUtility
const utility=document.getElementById("utility");
let utilityActive=true;
const setActiveUtility=document.getElementById("setActiveUtility");
setActiveUtility.addEventListener("click", SwitchActive);
function SwitchActive(){
    if(utilityActive){
        utility.children[0].style.display="none";
        utility.children[1].style.display="none";
        utility.children[2].style.display="none";
        utility.children[3].style.transform='rotate(0)';
        utility.classList.add("setActiveUtilityFalse");
        setTimeout(function(){
            utility.style.width='10rem';
            utilityActive=false;
            utility.classList.remove("setActiveUtilityFalse");
        },200);
        
    }else{
        utility.children[0].style.display="block";
        utility.children[1].style.display="block";
        utility.children[2].style.display="block";
        utility.children[3].style.transform='rotate(180deg)';
        utility.classList.add("setActiveUtilityTrue");
        setTimeout(function(){
            utility.style.width='40rem';
            utilityActive=true;
            utility.classList.remove("setActiveUtilityTrue");
        },200);
        
    }
}
//setings
function validateInput(input,round=true) {
    if(input.value){
        let min = parseInt(input.min);
        let max = parseInt(input.max);
        let value = parseInt(input.value);
        
        if(round)
            input.value=value;
        if (value > max) {
            input.value = max;
        } else if (value < min) {
            input.value = min;
        }
    }
}

const setActiveSettings=document.getElementById('setActiveSettings');
const okSettings=document.getElementById('okSettings');
let changeSettings=false;
setActiveSettings.addEventListener('click',SetActiveSettings);
okSettings.addEventListener('click',OkSettings);

function SetActiveSettings(){
    if(!changeInfo && once){
        document.getElementById('settings').style.display='flex'
        changeSettings=true;
        setActiveSettings.style.opacity='0.2';
        setActiveSettings.style.cursor='default'

        setActiveInfo.style.opacity='0.2';
        setActiveInfo.style.cursor='default'
        if(highScore===0){
            resetHS.disabled=true;
            resetHS.style.opacity='0.5';
            resetHS.style.cursor='default';
        }else{
            resetHS.disabled=false;
            resetHS.style.opacity='1';
            resetHS.style.cursor='pointer';
        } 
    }
}

function OkSettings(){
    document.getElementById('settings').style.display='none' 
    changeSettings=false;
    setActiveSettings.style.opacity='1';
    setActiveSettings.style.cursor='pointer'
    let blockSizeSetValue=document.getElementById('blockSizeSet').value;
    let snakeSpeedSetValue=document.getElementById('snakeSpeedSet').value;
    let snakeGrowSpeedSetValue=document.getElementById('snakeGrowSpeedSet').value;
    let snakeSizeSetValue=document.getElementById('snakeSizeSet').value;
    let boxModeValue=document.getElementById('boxMode').checked;
    let gridValue=document.getElementById('grid').checked;
    let darkModeValue=document.getElementById('darkMode').checked;

    //canvas
    blockPercent=blockSizeSetValue/100;
    blocksNumber=Math.floor(100/(blockPercent*100));
    gridedCanvas=gridValue;
    //snake
    snakeSizeShrink=parseFloat(snakeSizeSetValue)+1;
    snakeSpeed = snakeSpeedSetValue;
    //game
    boxMode=boxModeValue;
    darkMode=darkModeValue;
    //food
    growSpeed=snakeGrowSpeedSetValue;

    snake=[]
    setup();

    setActiveInfo.style.opacity='1';
    setActiveInfo.style.cursor='pointer'
}
//reset hs
const resetHS=document.getElementById('resetHS');
resetHS.addEventListener('click',ResetHS);
function ResetHS(){
    highScore=0;
    scoreBoard.children[2].innerText=`HS: ${highScore}`;
    resetHS.disabled=true;
    resetHS.style.opacity='0.5';
    resetHS.style.cursor='default';
}
//ok info
const okInfo=document.getElementById('okInfo');
const setActiveInfo=document.getElementById('setActiveInfo');
setActiveInfo.addEventListener('click',SetActiveInfo);
okInfo.addEventListener('click',OkInfo)
changeInfo=false;

function SetActiveInfo(){
    if(!changeSettings && once){
        document.getElementById('infoPanel').style.display='flex'
        changeInfo=true;
        setActiveInfo.style.opacity='0.2';
        setActiveInfo.style.cursor='default'
        
        setActiveSettings.style.opacity='0.2';
        setActiveSettings.style.cursor='default'
    }
}

function OkInfo(){
    document.getElementById('infoPanel').style.display='none' 
    changeInfo=false;
    setActiveInfo.style.opacity='1';
    setActiveInfo.style.cursor='pointer'

    setActiveSettings.style.opacity='1';
    setActiveSettings.style.cursor='pointer'
}
