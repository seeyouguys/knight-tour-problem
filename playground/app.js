class KnightRouteApp extends React.Component {
    constructor(props) {
        super(props)

        // possible turns of a knight
        this.shifts = [
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
        this.boardSize = 8

        this.calcAT = this.calcAT.bind(this)
        this.moveKnight = this.moveKnight.bind(this)
        this.setEqualCellsAT = this.setEqualCellsAT.bind(this)
        this.getInitialBoardState = this.getInitialBoardState.bind(this)
        
        this.state = {
            cells: this.getInitialBoardState(),
            knightPos: {x: undefined, y: undefined}
        }
    }

    // board initializing
    getInitialBoardState() {
        const n = this.boardSize
        // construct the structure of the board state
        // cells = [ [{...}, {...}, {...}, ...],
        //           [{...}, {...}, {...}, ...],
        //           [{...}, {...}, {...}, ...] ]
        let cells = Array.from(Array(n), () =>
            Array.from(Array(n), () => ({turnsAvailable: undefined, isPassed: false})))

        
        // find and set amount of available turns for every cell    
        for (let x = 0; x < Math.ceil(this.boardSize / 2); x++) {
            let y = 0,
                pre = null, turnsAvailable = null, // previous and current number of av. turns
                amount // amount of equal cells
            
            do {
                if (pre < 8) {
                    pre = turnsAvailable
                    amount = (x === y) ? 4 : 8 // amount of equal cells
                    turnsAvailable = this.calcAT(x, y)
                }
                cells = this.setEqualCellsAT(cells, x, y, turnsAvailable, amount)
                y++
            } while (pre < turnsAvailable)

            for (y; y < Math.ceil(this.boardSize / 2); y++) {
                turnsAvailable = (pre < 8) ? this.calcAT(x, y) : 8
                cells = this.setEqualCellsAT(cells, x, y, turnsAvailable, 8)
            }
        }

        return cells
    }

    // calc amount of available turns for a passed cell
    calcAT(x, y) {
        if (typeof x === "object") ({x, y} = x)
        let legitTurns = 0
        this.shifts.forEach(shift => {
            const turn = {x: x + shift.x, y: y + shift.y}
            if (this.isLegit(turn)) legitTurns++
        })
        
        return legitTurns
    }

    // returns false if cell is out of board
    // overloaded, x could be {x, y} obj or integer, y is optional
    isLegit(x, y) {
        const n = this.boardSize
        if (typeof x === "object") ({x, y} = x)

        return (x >= 0) && (x < n) && (y >= 0) && (y < n)
    }

    // sets value of the "turnsAvailable" property to all symmetricaly lying cells
    // diagonal-belonging cells have 4 equals, other have 8
    setEqualCellsAT(cells, x, y, value, amount) {
        const n = this.boardSize
        const equalCells = [
            {x: x, y: y},
            {x: x, y: n-1-y},
            {x: n-1-x, y: y},
            {x: n-1-y, y: n-1-x}
        ]
        
        equalCells.forEach(c => {
            cells[c.x][c.y].turnsAvailable = value
        })

        if (amount === 8)
            equalCells.forEach(c => {
                cells[c.y, c.x].turnsAvailable = value
            })
        
        return cells
    }



    // change knight's position and mark cell as passed
    moveKnight(x, y) {
        if (typeof x === 'object') ({x, y} = x)
        if (this.state.knightPos.x === x && this.state.knightPos.y === y) return
        
        // create cells array copy
        let cells = [...this.state.cells]

        // decrease the number of available turns for all related cells
        this.shifts.forEach(shift => {
            const turn = { x: x + shift.x, y: y + shift.y }
            if (this.isLegit(turn)) cells[turn.x][turn.y].turnsAvailable--
        })

        this.setState(() => ({
            knightPos: {x, y},
            cells: cells
        }))
    }
    
    render() {
        return (
            <div className="container">
                <Chessboard
                    boardSize={this.boardSize}
                    cells={this.state.cells}
                    knightPos={this.state.knightPos}
                    moveKnight={this.moveKnight} />
            </div>
        )
    }
}

const Chessboard = (props) => {
    return (
        <div className="board">
            {
                props.cells.map((row, rowIndex) =>
                    <Row
                        row={row}
                        key={rowIndex}
                        x={rowIndex}
                        knightPos={props.knightPos}
                        moveKnight={props.moveKnight}/>
                        
                )
            }
    </div>)
}

const Row = (props) => (
    <div className="board__row">
        {
            props.row.map((cell, cellIndex) => 
                <Cell 
                    x={props.x}
                    y={cellIndex}
                    key={cellIndex} 
                    turnsAvailable={cell.turnsAvailable}
                    moveKnight={props.moveKnight}
                    knightPos={props.knightPos}/>
            )
        }
    </div>
)

const Cell = (props) => {
    const cellContainsKnight = props.knightPos.x===props.x && props.knightPos.y===props.y
    let cellClass = "board__row__cell"
    if ( (props.x + props.y) % 2 )
        cellClass += " board__row__cell--dark"
    if (cellContainsKnight)
        cellClass += " board__row__cell--knight"

    return <div className={cellClass} onClick={()=>{props.moveKnight(props.x, props.y)}}>{
        cellContainsKnight ? "🐴" : props.turnsAvailable
    }</div>
}


ReactDOM.render(
    <KnightRouteApp />,
    document.getElementById('app')
)