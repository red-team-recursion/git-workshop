"use strict"
//menu
const noCpu = document.getElementById("no-cpu")
const cpuWeek = document.getElementById("cpu-week")
const cpuStrong = document.getElementById("cpu-strong")
const showLogs = document.getElementById("show-logs")
//board
const boardElement = document.getElementById("board")
const boardCellElements = boardElement.querySelectorAll(".board-cell")
const playerTurnElement = document.getElementById("player-turn")

const finishElement = document.getElementById("finish") //finish
const finishTextElement = document.getElementById("finish-text")

const logSelectElement = document.getElementById("select-log")
const logSelectTextElement = document.getElementById("select-log-text")
const backTopElement = document.getElementById("back-top")

const restartButton = document.getElementById("restart")

const gameObject = {
    gameMode: "no-cpu", //no-cpu, cpu-week,cpu-strongの三つのモードがある
    oTurn: true,
    turnCount: 0,
    isOvergame: false,
    isPlayerSenkou: false, //cpu対戦で使う
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
let gameLogs = new Array()

//ゲームの初期化をする関数
function startGame(gameMode) {
    gameObject.isOvergame = false
    gameObject.turnCount = 0
    gameObject.oClickedState = []
    gameObject.xClickedState = []
    gameObject.oTurn = true
    playerTurnElement.textContent = ""

    console.log(gameObject)

    finishElement.classList.remove("visible")
    document.querySelector(".mode-select").classList.remove("visible")
    document.querySelector(".menu").classList.remove("visible")

    boardCellElements.forEach((cell) => {
        //初期化
        cell.classList.remove("clicked")
        if (cell.classList.contains("o")) {
            cell.classList.remove("o")
        } else if (cell.classList.contains("x")) {
            cell.classList.remove("x")
        }

        cell.addEventListener("click", (e) => {
            if (gameObject.gameMode === "show-logs") {
                cell.classList.add("clicked")
                return
            }
            if (cell.classList.contains("Disable")) {
                return //何もさせない
            }
            clickCellEvent(e)
        })
    })
    switch (gameMode) {
        case "no-cpu":
            playerTurnElement.textContent = "O turn"
            break
        case "cpu-week":
        case "cpu-strong":
            gameObject.isPlayerSenkou = mkplayOrDraw()
            //cpuが先行ならばまずcpuを動かす
            if (!gameObject.isPlayerSenkou) {
                playerTurnElement.textContent = "Cpu is calculating ......"
                cpuMove()
            } else {
                playerTurnElement.textContent = "Your turn"
            }
            break
        case "show-logs":
            getAllLogs()
            break
    }
    //先行が人である場合にtrueを返す
    function mkplayOrDraw() {
        if (Math.floor(Math.random() * 100) % 2 == 0) {
            return true
        } else return false
    }
}
/*
 * セルクリック時のイベント処理
 */
function clickCellEvent(e) {
    const target = e.target
    const isClick = target.classList.contains("clicked")
    const boardCellIndex = target.dataset.index

    if (!isClick) {
        selectCell(target, boardCellIndex)
        changeTurn()
        judge()
    }
    // console.log("isGameOver : " + gameObject.isOvergame)
    //これを置くことで、クリックしたらすぐにcpuが動くようになる
    if (!gameObject.isOvergame) {
        cpuMove()
    }
}
/*
 * 指定したセルを更新する
 */
function selectCell(target, i) {
    gameObject.oTurn
        ? gameObject.oClickedState.push(parseInt(i))
        : gameObject.xClickedState.push(parseInt(i))

    target.classList.add("clicked", gameObject.oTurn ? "o" : "x")
}
/*
 * ターンとプレイヤー名の切り替え
 */
function changeTurn() {
    if (gameObject.gameMode == "no-cpu") {
        gameObject.oTurn = !gameObject.oTurn
        playerTurnElement.textContent =
            gameObject.turnCount % 2 === 0 ? "X turn" : "O turn"
    } else {
        //cpu対戦の時
        gameObject.oTurn = !gameObject.oTurn
        if (gameObject.isPlayerSenkou) {
            playerTurnElement.textContent =
                gameObject.turnCount % 2 === 0
                    ? "Cpu is calculationg ......"
                    : "Your turn"
        } else {
            playerTurnElement.textContent =
                gameObject.turnCount % 2 === 0
                    ? "Your turn"
                    : "Cpu is calculationg ......"
        }
    }
    gameObject.turnCount++
    console.log("turnCount : " + gameObject.turnCount)
}
/*
 * 勝敗・引き分け判定及び結果の表示
 */
function judge() {
    let result = "引き分け"
    // 勝敗判定
    gameObject.WinningConditions.forEach((WinningConditions) => {
        if (gameObject.isOvergame) return
        // everyメソッドは、列内のすべての要素が指定された関数で
        // 実装されたテストに合格するかどうかを確認する
        const isWinO = WinningConditions.every((state) =>
            gameObject.oClickedState.includes(state)
        )
        const isWinX = WinningConditions.every((state) =>
            gameObject.xClickedState.includes(state)
        )
        if (isWinO || isWinX) {
            //O or X 勝敗が決まる
            gameObject.isOvergame = true
            const isCpu = gameObject.gameMode !== "no-cpu" ? true : false
            result = setResultMessage(isCpu, isWinO, isWinX)
            console.log(result)
            saveResult(result)
            displayWinMessage(result)
            return
        }
    })
    if (gameObject.turnCount === boardCellElements.length) {
        if (gameObject.isOvergame) return
        //引き分け
        gameObject.isOvergame = true
        saveResult(result)
        displayWinMessage(result)
        return
    }

    console.log("continue..")
}
function setResultMessage(isCpu, isWinO, isWinX) {
    let result = isWinO ? "O の勝ち" : "X の勝ち"
    if (!isCpu) return result
    if (
        (isWinO && gameObject.isPlayerSenkou) ||
        (isWinX && !gameObject.isPlayerSenkou)
    ) {
        result = "あなたの勝ち"
    } else {
        result = "あなたの負け"
    }
    return result
}
function displayWinMessage(result) {
    boardCellElements.forEach((cell) => {
        cell.classList.add("clicked")
    })
    finishElement.classList.add("visible")
    finishTextElement.textContent = result
    return
}

/**
 * CPU
 */
function cellsDisable() {
    for (let i = 0; i < 9; i++) {
        document.getElementById(String(i)).classList.add("Disable")
    }
}
function cellsAble() {
    for (let i = 0; i < 9; i++) {
        document.getElementById(String(i)).classList.remove("Disable")
    }
}
function cpuMove() {
    if (gameObject.gameMode != "no-cpu") {
        let indexOftarget = indexCpuMove()
        console.log(String(indexOftarget))
        cellsDisable()
        setTimeout(() => {
            selectCell(
                document.getElementById(String(indexOftarget)),
                indexOftarget
            )
            changeTurn()
            judge()
            cellsAble()
        }, 2000)
    }
}
//クリックされていない配列の中からランダムにクリックするインデックスを生成
function indexCpuMove() {
    // console.log("idxCpuMove")
    // console.log(gameObject.gameMode)
    if (gameObject.gameMode === "cpu-week") {
        console.log("week move")
        return weekMove()
    } else {
        return strongMove()
    }
}
function weekMove() {
    let unClickedArr = []
    searchUnclickedCell(unClickedArr)
    let index = Math.floor(Math.random() * unClickedArr.length) //0~len(arr)-1からランダムな整数を出力
    // console.log(unClickedArr)
    // console.log(unClickedArr[index])
    return unClickedArr[index]
}
function strongMove() {
    let unClickedArr = []
    let maxWeightIndex = 0

    let cpuWeights = {
        0: 1,
        1: 1,
        2: 1,
        3: 1,
        4: 1,
        5: 1,
        6: 1,
        7: 1,
        8: 1,
    }
    searchUnclickedCell(unClickedArr)

    if (gameObject.isPlayerSenkou) {
        for (let i = 0; i < gameObject.oClickedState.length; i++) {
            let value = gameObject.oClickedState[i]
            for (let row = 0; row < 8; row++) {
                let stateArr = gameObject.WinningConditions[row]
                addCpuWeight(value, stateArr)
            }
        }
    } else {
        for (let i = 0; i < gameObject.xClickedState.length; i++) {
            let value = gameObject.xClickedState[i]
            for (let row = 0; row < 8; row++) {
                let stateArr = gameObject.WinningConditions[row]
                addCpuWeight(value, stateArr)
            }
        }
    }
    //ここまでで重さはもとまった
    // console.log(cpuWeights)
    // console.log("unClicked")
    // console.log(unClickedArr)

    maxWeightIndex = unClickedArr[0]
    //まだクリックしていないセルの中で最も重みの大きいインデックスを出力する
    for (let i = 0; i < unClickedArr.length; i++) {
        // console.log("unClickedArr.length" + unClickedArr.length)
        // console.log("maxIndex : " + maxWeightIndex)
        if (cpuWeights[unClickedArr[i]] >= cpuWeights[maxWeightIndex]) {
            maxWeightIndex = unClickedArr[i]
        }
    }
    return maxWeightIndex
    //stateの中に入っているのかを見る
    function addCpuWeight(value, stateArr) {
        for (let i = 0; i < 3; i++) {
            if (stateArr[i] == value) {
                cpuWeights[stateArr[0]] += 1
                cpuWeights[stateArr[1]] += 1
                cpuWeights[stateArr[2]] += 1
            }
        }
    }
}
//arr -> arr
function searchUnclickedCell(arr) {
    let unClickedDic = {
        0: true,
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: true,
        7: true,
        8: true,
    }

    for (let i = 0; i < gameObject.oClickedState.length; i++) {
        key = gameObject.oClickedState[i]
        unClickedDic[key] = false
    }
    for (let i = 0; i < gameObject.xClickedState.length; i++) {
        key = gameObject.xClickedState[i]
        unClickedDic[key] = false
    }
    for (var key in unClickedDic) {
        if (unClickedDic[key]) arr.push(key)
    }
}

/**
 * log
 */
class Log {
    oState = gameObject.oClickedState
    xState = gameObject.xClickedState
    gameMode = gameObject.gameMode
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

function saveResult(result) {
    gameLogs.unshift(new Log(result))
    if (gameLogs.length > 5) {
        gameLogs.pop()
    }
    console.log(gameLogs)
    localStorage.setItem("logs", JSON.stringify(gameLogs))
    return
}
// log情報を表示
function setBoard(index) {
    playerTurnElement.textContent = `${gameLogs[index].result}`
    boardCellElements.forEach((cell) => {
        cell.classList.remove("o", "x")
        cell.classList.add("clicked")

        const cellIndex = Number(cell.getAttribute("data-index"))
        if (gameLogs[index].oState.includes(cellIndex)) {
            cell.classList.add("o")
        }
        if (gameLogs[index].xState.includes(cellIndex)) {
            cell.classList.add("x")
        }
    })
    logSelectTextElement.innerHTML = `${setModeName(
        gameLogs[index].gameMode
    )}<br>${gameLogs[index].time}`
    function setModeName(gameMode) {
        let str = "【 "
        switch (gameMode) {
            case "cpu-week":
                str += "CPU弱と対戦"
                break
            case "cpu-strong":
                str += "CPU強と対戦"
                break
            default:
                str += "ふたりで対戦"
                break
        }
        str += " 】"
        return str
    }
}
function viewLogs() {
    //初期表示
    let index = 0
    setBoard(index)

    const prev = document.createElement("button")
    const next = document.createElement("button")
    prev.innerHTML = "◀"
    next.innerHTML = "▶"
    const page = document.createElement("span")
    logSelectElement.append(prev, page, next)
    setButtonMenu(index)

    prev.addEventListener("click", () => {
        if (index === 0) return
        index -= 1
        setButtonMenu(index)
        return setBoard(index)
    })
    next.addEventListener("click", () => {
        if (index === gameLogs.length - 1) return
        index += 1
        setButtonMenu(index)
        return setBoard(index)
    })

    function setButtonMenu(index) {
        page.innerHTML = `${index + 1} / ${gameLogs.length}`
        prev.classList.remove("disabled")
        next.classList.remove("disabled")
        if (index === 0) prev.classList.add("disabled")
        if (index === gameLogs.length - 1) next.classList.add("disabled")
    }
}
function getAllLogs() {
    gameLogs = new Array()
    // localStorage.removeItem("logs")
    const logs = JSON.parse(localStorage.getItem("logs"))
    if (!logs) {
        // 戦績なしのひょうじ
        logSelectTextElement.innerHTML = "戦績がないよ"
        return
    }
    gameLogs.unshift(...logs)
    console.log("getAll::", gameLogs)
    viewLogs()
}

/**
 * EventListener
 */
function mainListener() {
    function start(gameMode) {
        gameObject.gameMode = gameMode
        console.log("ゲームスタート")
        startGame(gameObject.gameMode)
    }
    noCpu.addEventListener("click", (e) => start(e.target.id))
    cpuWeek.addEventListener("click", (e) => start(e.target.id))
    cpuStrong.addEventListener("click", (e) => start(e.target.id))
    showLogs.addEventListener("click", (e) => start(e.target.id))
    //restart
    restartButton.addEventListener("click", () => {
        finishElement.classList.remove("visible")
        document.querySelector(".mode-select").classList.add("visible")
        return
    })
    // ゲームに戻る
    backTopElement.addEventListener("click", () => {
        document.querySelector(".mode-select").classList.add("visible")
        logSelectElement.innerHTML = ""
        logSelectTextElement.innerHTML = ""
    })
}
mainListener()
