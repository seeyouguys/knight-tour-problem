import React from 'react'

const Cell = (props) => {

    let cellClass = "board__row__cell"
    let cellContainsKnight

    switch (props.cellValue) {
        case -2:
            cellContainsKnight = true
            cellClass += " board__row__cell--knight"
        case -1:
            cellClass += " board__row__cell--passed"
    }
    
    if ((props.x + props.y) % 2)
        cellClass += " board__row__cell--dark"

    return (
        <div
            className={cellClass}
            // conditionally set onClick listener if there is no knight on the board
            onClick={(!props.isGameStarted) ? () => {props.setKnight(props.x, props.y)} : undefined}
        >
            {cellContainsKnight ? "🐴" : props.cellValue}
        </div>
    )
}

export default Cell
