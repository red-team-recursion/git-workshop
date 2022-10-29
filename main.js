"use strict"

const boardElement = document.getElementById("board")
const boardCellElements = boardElement.querySelectorAll(".board-cell")
const playerTurnElement = document.getElementById("player-turn")
const finishElement = document.getElementById("finish")
const finishTextElement = document.getElementById("finish-text")
const logsElement = document.getElementById("logs")

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

const gameLogs = new Array()

/*
 * ロード時に最初のプレイヤー名を表示
 */
window.addEventListener("DOMContentLoaded", () => {
  playerTurnElement.textContent = "O turn"
  getAllLogs()
})

/**
 * log
 */
class Log {
  oState = gameObject.oClickedState
  xState = gameObject.xClickedState
  time = this.time()
  result
  constructor(result) {
    this.result = result
  }
  time() {
    const dt = new Date()
    return `${dt.getFullYear()}.${
      dt.getMonth() + 1
    }.${dt.getDate()} ${dt.getHours()}:${dt.getMinutes()}:${dt.getSeconds()}`
  }
}

const saveResult = (result) => {
  gameLogs.unshift(new Log(result))
  if (gameLogs.length > 5) {
    gameLogs.pop()
  }
  console.log(gameLogs)
  localStorage.setItem("logs", JSON.stringify(gameLogs))
}
const setBoard = (index) => {
  playerTurnElement.textContent = `${gameLogs[index].result}`
  boardCellElements.forEach((boardCell) => {
    boardCell.classList.remove("o", "x")
    boardCell.classList.add("clicked")

    const boardCellIndex = Number(boardCell.getAttribute("data-index"))
    if (gameLogs[index].oState.includes(boardCellIndex)) {
      boardCell.classList.add("o")
    }
    if (gameLogs[index].xState.includes(boardCellIndex)) {
      boardCell.classList.add("x")
    }
  })
}
const viewLogs = () => {
  gameLogs.forEach((_log, i) => {
    const logButton = document.createElement("button")
    logButton.innerHTML = i + 1
    logButton.addEventListener("click", () => setBoard(i))
    logsElement.append(logButton)
  })
}
const getAllLogs = () => {
  // localStorage.removeItem("logs")
  const logs = JSON.parse(localStorage.getItem("logs"))
  if (!logs) return
  gameLogs.unshift(...logs)
  viewLogs()
}

/*
 * 指定したセルを更新する
 */
const selectCell = (target, i) => {
  gameObject.oTurn
    ? gameObject.oClickedState.push(parseInt(i))
    : gameObject.xClickedState.push(parseInt(i))

  target.classList.add("clicked", gameObject.oTurn ? "o" : "x")
}

//hoverの処理は一旦おいておく..
const turn = () => {
  return gameObject.oTurn ? "o" : "x"
}
const hoverCell = (cell, clicked) => {
  function add() {
    cell.classList.add(turn())
  }
  function remove() {
    cell.classList.remove(turn())
  }
  //ちょっとうまくいってない
  if (!clicked) {
    cell.addEventListener("mouseover", add)
    cell.addEventListener("mouseleave", remove)
  } else {
    cell.removeEventListener("mouseover")
    cell.removeEventListener("mouseleave")
  }
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
  let result = "Draw"
  if (!boardElement.querySelectorAll(".board-cell:not(.clicked)").length) {
    finishElement.classList.add("visible")
    finishTextElement.textContent = "引き分け"
    saveResult(result)
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
      result = isWinO ? "O's Win!" : "X's Win!"
      saveResult(result)
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
  // hoverCell(cell, false)

  cell.addEventListener("click", (e) => {
    const target = e.target
    const isClick = target.classList.contains("clicked")
    const boardCellIndex = target.dataset.index

    if (!isClick) {
      // hoverCell(cell, true)
      selectCell(target, boardCellIndex)
      changeTurn()
      judge()
    }
  })
})
