'use strict'

const playerTurnText = document.getElementById('player-turn')
const oPlayer = (playerTurnText.textContent = 'O turn')

const gameObject = {
  oTurn: true,
  turnCount: 0,
  oState: [],
  xState: [],
  WINNING_CONDITION: [
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

// 引数(下記では'turnCount'を使用)の剰余によって、
// player表示を切り替える
function switchPlayer(e) {
  e % 2 === 0
    ? (document.querySelector('#player-turn').textContent = 'X turn')
    : (document.querySelector('#player-turn').textContent = 'O turn')
}

// 真偽値により、playerturnを判定する
function switchTurn() {
  gameObject.oTurn = !gameObject.oTurn
}

function displayWinMessage(oInfo, xInfo) {
  if (oInfo || xInfo) {
    document
      .querySelectorAll('.board-cell')
      .forEach((boardCell) => boardCell.classList.add('clicked'))
    document.querySelector('.finish').classList.add('visible')
    document.querySelector('.finish-text').textContent = oInfo
      ? 'Oの勝利'
      : 'Xの勝利'
  }
}

// クリック時のイベント処理
document.addEventListener('click', (e) => {
  const target = e.target
  // ↓はHTMLのboard-cellクラス名の有無を確認
  // クリック時にクラスが有れば'true'、無ければ'false'を返す
  const boardCell = target.classList.contains('board-cell')
  const click = target.classList.contains('clicked')
  const boardCellIndex = target.dataset.index
  const addClicked = target.classList.add('clicked')
  const addState = target.classList.add(gameObject.oTurn ? 'o' : 'x')

  if (boardCell && !click) {
    //両playerへの配列格納時に、HTMLのindexnumberを数値に変換する
    gameObject.oTurn
      ? gameObject.oState.push(Number(boardCellIndex))
      : gameObject.xState.push(Number(boardCellIndex))

    addState
    addClicked
    switchTurn()
    switchPlayer(gameObject.turnCount)
    // クリックしたらカウントを1ずつ増加
    gameObject.turnCount++

    // 全ての目が埋まった場合、引き分けと表示する処理
    if (!document.querySelectorAll('.board-cell:not(.clicked)').length) {
      document.querySelector('.finish').classList.add('visible')
      document.querySelector('.finish-text').textContent = '引き分け'
    }

    // 勝利判定の処理
    gameObject.WINNING_CONDITION.forEach((WINNING_CONDITION) => {
      // everyメソッドは、列内のすべての要素が指定された関数で
      // 実装されたテストに合格するかどうかを確認する
      const winSenkou = WINNING_CONDITION.every((state) =>
        gameObject.oState.includes(state)
      )
      const winKoukou = WINNING_CONDITION.every((state) =>
        gameObject.xState.includes(state)
      )

      // どちらかの勝利が判定された時点で、全てのboardcellをクリック済にし
      // 勝利時のテキストを真偽値を用いて表示する
      displayWinMessage(winSenkou, winKoukou)
    })
  }
})
