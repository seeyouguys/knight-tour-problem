import React from 'react'
import Cell from './Cell'

const Row = (props) => (
    <div className="board__row">
        {
            props.row.map((cell, cellIndex) => 
                <Cell 
                    cellValue={cell}
                    x={props.x}
                    y={cellIndex}
                    setKnight={props.setKnight}
                    key={cellIndex}
                    isGameStarted={props.isGameStarted} />
            )
        }
    </div>
)

export default Row