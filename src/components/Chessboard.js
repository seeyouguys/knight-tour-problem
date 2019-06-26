import React from 'react'
import Row from './Row'

export default class Chessboard extends React.Component {
    constructor(props) {
        super(props)

        // possible turns of a knight
        this.SHIFTS = [
            {x:+1, y: +2},
            {x:+2, y: +1},
            {x:+2, y: -1},
            {x:+1, y: -2},
            {x:-1, y: -2},
            {x:-2, y: -1},
            {x:-2, y: +1},
            {x:-1, y: +2}
        ]
        
        // board have n*n size
        this.SIZE = +props.boardSize

        this.setKnight = this.setKnight.bind(this)
        
        this.state = {
            cells: this.getInitialBoardState(),
            knightPos: {x: undefined, y: undefined}
        }
    }

    // board initializing
    getInitialBoardState() {
        const n = this.SIZE

        // cells is an array of arrays
        let cells = Array.from(Array(n), () => new Array(n))

        // find and set amount of available turns for every cell    
        for (let x = 0; x < Math.ceil(n / 2); x++) {
            let y = 0, pre = null, turnsAvailable = null // previous and current number of av. turns
            
            do {
                if (pre < 8) {
                    pre = turnsAvailable
                    turnsAvailable = this.calcLegitTurns(x, y)
                }
                this.setEqualCellsVal(cells, x, y, turnsAvailable)

                y++
            } while (pre < turnsAvailable)

            for (y; y < Math.ceil(n / 2); y++) {
                turnsAvailable = (pre < 8) ? this.calcLegitTurns(x, y) : 8
                this.setEqualCellsVal(cells, x, y, turnsAvailable) // если будет баг с нечетными размерами поля - тут его причина
            }
        }
        return cells
    }

    // calc amount of available turns for a passed cell
    calcLegitTurns(x, y) {
        let legitTurns = 0
        this.SHIFTS.forEach(shift => {
            const turn = {x: x + shift.x, y: y + shift.y}
            if (this.isLegit(turn)) legitTurns++
        })
        
        return legitTurns
    }

    // returns false if cell is out of board
    isLegit(x, y) {
        const n = this.SIZE
        if (typeof x === "object") ({x, y} = x)

        return (x >= 0) && (x < n) && (y >= 0) && (y < n)
    }

    // sets amount of available turns for all symmetricaly lying cells
    // diagonal-belonging cells have 4 equals, other have 8
    setEqualCellsVal(cells, x, y, value) {
        const n = this.SIZE

        const equalCells = [
            {x: x, y: y},
            {x: x, y: n-1-y},
            {x: n-1-x, y: y},
            {x: n-1-x, y: n-1-y}
        ]
        
        equalCells.forEach(c => {

            cells[c.x][c.y] = value
        })

        if (x !== y) {
            equalCells.forEach(c => {
                cells[c.y][c.x] = value
            })
        }
    }

    // change knight's position and mark cell as passed
    moveKnight(x, y) {
        if (typeof x === 'object') ({x, y} = x)
        
        // create cells array copy
        let cells = [...this.state.cells]

        // decrease the number of available turns for all related cells
        // (if the cell is already passed, leave it with the -1)
        this.SHIFTS.forEach(shift => {
            const turn = { x: x + shift.x, y: y + shift.y }
            if (this.isLegit(turn) && cells[turn.x][turn.y] > -1)
                cells[turn.x][turn.y]-- 

        })

        // "-1" means that cell is passed and unavailable
        // "-2" means that knight is in this cell
        cells[x][y] = -2
        if (this.state.knightPos.x > -1 && this.state.knightPos.y > -1) // if it's not the initial move
            cells[this.state.knightPos.x][this.state.knightPos.y] = -1

        this.setState(() => ({
            knightPos: {x, y},
            cells: cells
        }))
    }

    // sets the piece in the selected cell and starts the algorithm
    setKnight(x, y) {
        this.moveKnight(x, y)

        const timerID = setInterval(() => {
            const turn = this.findProfitableTurn(this.state.knightPos)

            if (turn === -1) {
                console.log('больше некуда ходить')
                clearInterval(timerID)
            } else {
                this.moveKnight(turn)
            }
        }, 400)
    }

    // Finds the best option for the next turn
    // according to the Warnsdorff's Rule
    findProfitableTurn(x, y) {
        if (typeof x === 'object') ({x, y} = x)

        let bestTurn, minVal = 8
        this.SHIFTS.forEach(shift => {
            const turn = { x: x + shift.x, y: y + shift.y }
            const checkingVal = this.isLegit(turn) ? this.state.cells[turn.x][turn.y] : NaN

            if (checkingVal >= 0 && checkingVal < minVal) {
                bestTurn = turn
                minVal = checkingVal
            }
        })
        return bestTurn || -1
    }


    render() {
        return (
            <div className="board">
                {
                    this.state.cells.map((row, rowIndex) =>
                        <Row
                            row={row}
                            x={rowIndex}
                            setKnight={this.setKnight}
                            isGameStarted={this.state.knightPos.x !== undefined} // true when knight have a position
                            key={rowIndex}
                        />
                    )
                }
            </div>
        )
    }
}