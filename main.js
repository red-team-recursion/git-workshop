"use strict"

const boardElement = document.getElementById("board")
const boardCellElements = boardElement.querySelectorAll(".board-cell")
const playerTurnElement = document.getElementById("player-turn")
const finishElement = document.getElementById("finish")
const finishTextElement = document.getElementById("finish-text")

const gameObject = {
  oTurn: true,
  turnCount: 0,
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

/*
 * ロード時に最初のプレイヤー名を表示
 */
window.addEventListener("DOMContentLoaded", () => {
  playerTurnElement.textContent = "O turn"
})

/*
 * 指定したセルを更新する
 */
const selectCell = (target, i) => {
  gameObject.oTurn
    ? gameObject.oClickedState.push(parseInt(i))
    : gameObject.xClickedState.push(parseInt(i))

  target.classList.add("clicked", gameObject.oTurn ? "o" : "x")
}

/*
 * ターンとプレイヤー名の切り替え
 */
const changeTurn = () => {
  gameObject.oTurn = !gameObject.oTurn
  playerTurnElement.textContent =
    gameObject.turnCount % 2 === 0 ? "X turn" : "O turn"
  gameObject.turnCount++
}

/*
 * 勝敗・引き分け判定及び結果の表示
 */
const judge = () => {
  // 全ての目が埋まった場合、引き分けと表示する
  if (!boardElement.querySelectorAll(".board-cell:not(.clicked)").length) {
    finishElement.classList.add("visible")
    finishTextElement.textContent = "引き分け"
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
    if (isWinO || isWinX) {
      boardCellElements.forEach((boardCell) =>
        boardCell.classList.add("clicked")
      )
      finishElement.classList.add("visible")
      finishTextElement.textContent = isWinO ? "Oの勝利" : "Xの勝利"
    }
  })
}

/*
 * セルクリック時のイベント処理
 */
boardCellElements.forEach((cell) => {
  const index = cell.getAttribute("data-index")
  const clickedCells = [
    ...gameObject.oClickedState,
    ...gameObject.xClickedState,
  ]
  const clicked = clickedCells.includes(parseInt(index))
  // cell.addEventListener("mouseover", () => {
  //   cell.classList.add(gameObject.oTurn ? "o" : "x")
  // })
  // cell.addEventListener("mouseleave", () => {
  //   cell.classList.remove(gameObject.oTurn ? "o" : "x")
  // })
  cell.addEventListener("click", (e) => {
    const target = e.target
    const isClick = target.classList.contains("clicked")
    const boardCellIndex = target.dataset.index
    console.log(index, clicked)

    if (!isClick) {
      selectCell(target, boardCellIndex)
      changeTurn()
      judge()
    }
  })
})
