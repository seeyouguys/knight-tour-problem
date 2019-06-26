import React from 'react'
import ReactDOM from 'react-dom'

import Chessboard from './components/Chessboard'

class KnightRouteApp extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="container">
                <Chessboard boardSize="8"/>
            </div>
        )
    }
}


ReactDOM.render(
    <KnightRouteApp />,
    document.getElementById('app')
)