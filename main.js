'use strict'
const nocpu = document.getElementById("no-cpu");
const cpuWeek = document.getElementById("cpu-week");
const cpuStrong = document.getElementById("cpu-strong");

const boardElement = document.getElementById('board')
const boardCellElements = boardElement.querySelectorAll('.board-cell')
const playerTurnElement = document.getElementById('player-turn')
const finishElement = document.getElementById('finish')//finish
const finishTextElement = document.getElementById('finish-text')
const cells = document.querySelectorAll(".board-cell");

const restartButton = document.getElementById('restart');

const gameObject = {
  gameMode: "no-cpu",//no-cpu, cpu-week,cpu-strongの三つのモードがある
  oTurn: true,
  turnCount: 0,
  isPlayerSenkou: false,//cpu対戦で使う
  oClickedState: [],
  xClickedState: [],
  WinningConditions: [
    // 列
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // 行
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // 斜め
    [0, 4, 8],
    [2, 4, 6],
  ],
}


//ゲームの初期化をする関数
function startGame(gameMode){
    gameObject.turnCount = 0;
    gameObject.oState = [];
    gameObject.xState = [];
    gameObject.oTurn = true;

    document.querySelector('.finish').classList.remove('visible');
    document.querySelector('.mode-select').classList.remove('visible');
        
        cells.forEach((cell) => {
            //初期化
            cell.classList.remove("clicked");
            if(cell.classList.contains("o")){
                cell.classList.remove("o");
            }
            else if(cell.classList.contains("x")){
                cell.classList.remove("x");
            }    
        });

    if(gameMode == "no-cpu"){
        //kannsuu
    }
    else if(gameMode == "cpu-week"){
        gameObject.isPlayerSenkou = mkplayOrDraw();
        //function
    }
    else if(gameMode == "cpu-strong"){
        gameObject.isPlayerSenkou = mkplayOrDraw();
        //function
    }
}


//ロード時に最初のプレイヤー名を表示
window.addEventListener('DOMContentLoaded', () => {
  playerTurnElement.textContent = 'O turn'
  if(gameObject.gameMode != "no-cpu"){
    if(gameObject.isPlayerSenkou) playerTurnElement.textContent = 'Your turn';
    else playerTurnElement.textContent = 'Cpu is calculationg ......'
  }
})

/*
 * 指定したセルを更新する
 */
const selectCell = (target, i) => {
  gameObject.oTurn
    ? gameObject.oClickedState.push(parseInt(i))
    : gameObject.xClickedState.push(parseInt(i))

  target.classList.add('clicked', gameObject.oTurn ? 'o' : 'x')
}

/*
 * ターンとプレイヤー名の切り替え
 */
const changeTurn = () => {
    if(gameObject.gameMode){
        gameObject.oTurn = !gameObject.oTurn
        playerTurnElement.textContent =
            gameObject.turnCount % 2 === 0 ? 'X turn' : 'O turn'
        gameObject.turnCount++
    }
    else{//cpu対戦の時
        gameObject.oTurn = !gameObject.oTurn
        if(gameObject.isPlayerSenkou){
            playerTurnElement.textContent =
                gameObject.turnCount % 2 === 0 ? 'Cpu is calculationg ......' : 'Your turn'
        }
        else{
            playerTurnElement.textContent =
                gameObject.turnCount % 2 === 0 ? 'Your turn' : 'Cpu is calculationg ......'
        }
        gameObject.turnCount++

    }    
}



/*
 * 勝敗・引き分け判定及び結果の表示
 */
const judge = () => {
  // 全ての目が埋まった場合、引き分けと表示する
  if (!boardElement.querySelectorAll('.board-cell:not(.clicked)').length) {
    finishElement.classList.add('visible')
    finishTextElement.textContent = '引き分け'
  }
  // 勝敗判定
  gameObject.WinningConditions.forEach((WinningConditions) => {
    // everyメソッドは、列内のすべての要素が指定された関数で
    // 実装されたテストに合格するかどうかを確認する
    const isWinO = WinningConditions.every((state) =>
      gameObject.oClickedState.includes(state)
    )
    const isWinX = WinningConditions.every((state) =>
      gameObject.xClickedState.includes(state)
    )

    if(gameObject.gameMode == "no-cpu") displayWinMessage(isWinO, isWinX);
    else if(gameObject.gameMode == "cpu-week" || gameObject.gameMode == "cpu-strong")  displayWinMessageCpu(isWinO, isWinX)
  })
}

//二人でプレイする時の結果メッセージ
function displayWinMessage(oInfo, xInfo) {
    if (oInfo || xInfo) {
      document
        .querySelectorAll('.board-cell')
        .forEach((boardCell) => boardCell.classList.add('clicked'));
      document.querySelector('.finish').classList.add('visible');
      document.querySelector('.finish-text').textContent = oInfo
        ? 'Oの勝利'
        : 'Xの勝利';
    }
}

//cpu対戦での結果メッセージ
function displayWinMessageCpu(oInfo, xInfo, playOrDraw){//先行か後攻の情報が必要->先行ならtrue
    if (oInfo || xInfo) {
      document
        .querySelectorAll('.board-cell')
        .forEach((boardCell) => boardCell.classList.add('clicked'));
  
      let oPlayer = "";//セリフを埋め込む
      let xPlayer ="";
  
      if(playOrDraw){
        oPlayer = "あなたの勝ち";
        xPlayer = "あなたの負け（ねえ、今どんな気持ち？）";
      } 
      else{
        oPlayer = "あなたの負け（ねえ、今どんな気持ち？）";
        xPlayer = "あなたの勝ち";
      }
  
      document.querySelector('.finish').classList.add('visible');
      document.querySelector('.finish-text').textContent = oInfo
        ? oPlayer
        : xPlayer;
    }
}



//それぞれのゲームモードを始める　　　時間があったら変えますとりあえず、前のやつから引っ張ってきました
document.addEventListener('click', (e) => {
    const target = e.target
    
    if(target.classList.contains('no-cpu')){
      gameObject.gameMode = "no-cpu";
      console.log("ゲームスタート")
      startGame(gameObject.gameMode);
      return;
    }
  
    if(target.classList.contains('cpu-week')){
      gameObject.gameMode = "cpu-week";
      console.log("ゲームスタート")
      startGame(gameObject.gameMode);
      return;
    }
  
    if(target.classList.contains('cpu-strong')){
      gameObject.gameMode = "cpu-strong";
      console.log("ゲームスタート")
      startGame(gameObject.gameMode);
      return;}
})


restartButton.addEventListener('click', (e) => {
    document.querySelector('.finish').classList.remove('visible');
    document.querySelector('.mode-select').classList.add('visible');
    return;
})

/*
 * セルクリック時のイベント処理
 */
boardCellElements.forEach((cell) => {
  cell.addEventListener('click', (e) => {
    const target = e.target
    const isClick = target.classList.contains('clicked')
    const boardCellIndex = target.dataset.index

    if (!isClick) {
      selectCell(target, boardCellIndex)
      changeTurn()
      judge()
    }


    //これを置くことで、クリックしたらすぐにcpuが動くようになる
    if(gameObject.gameMode != "no-cpu"){
        let indexOftarget = indexCpuMove();
        console.log(String(indexOftarget));
        selectCell(document.getElementById(String(indexOftarget)), indexOftarget)
        changeTurn()
        judge()  
    }
  })
})



//先行が人である場合にtrueを返す
function mkplayOrDraw(){
    if(Math.floor(Math.random()*100) % 2 == 0){
      return true;
    }
    else return false;
}


function indexCpuMove(){
    console.log("idxCpuMove");
    console.log(gameObject.gameMode);
    if(gameObject.gameMode == "cpu-week"){
        console.log("week move");
        return weekMove();
    }    
    else return strongMove();
}


//クリックされていない配列の中からランダムにクリックするインデックスを生成
function weekMove(){
    let unClickedArr = [0,1,2,3,4,5,6,7,8];
    for(let i = 0; i < gameObject.oClickedState.length; i++){
        unClickedArr.splice(gameObject.oClickedState[i], 0);
    }
    for(let i=0; i < gameObject.xClickedState.length; i++){
        unClickedArr.splice(gameObject.xClickedState[i], 0);
    }

    let index = Math.floor(Math.random()*unClickedArr.length)//0~len(arr)-1からランダムな整数を出力
    console.log(index);
    console.log(unClickedArr[index]);
    return unClickedArr[index];
}

function strongMove(){

}
