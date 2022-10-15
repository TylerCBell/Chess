import React from 'react';
import ReactDOM from 'react-dom/client';
import { StyledSquare, BoardRow, GameInfo, StyledGame } from './chess'
import '@fortawesome/fontawesome-free/css/all.css';
import OnePieces from './chessPieces';

/*function clickMe() {
    alert('clicked!');
}*/

function Square(props) {
    return (
        <StyledSquare position={props.position} onClick={props.onClick}>
            { PlacePiece(props.value.fa, props.value.player) }
        </StyledSquare>
    );
}

class Board extends React.Component {
    renderSquare(position, squares) {
        return (
            <Square 
                position={position}
                value={squares[position]}
                onClick={() => this.props.onClick(position)}
                player={1}
            />
        );
    }

    render() {
        return (
            <BoardRow>
                { this.props.squares.map((value, number) => (
                    this.renderSquare(number, this.props.squares)
                ))}
            </BoardRow>
        )
    }
}


class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(64).fill(OnePieces.none),
            }],
            oneIsNext: true,
            move: 0,
            pieceMoving: false,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.move + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        alert('clicked!' + {i});
        /*if (calculateWinner(squares) || squares[i].player === this.state.oneIsNext ? 1 : 2) {
            return;
        }*/
        squares[i] = OnePieces.WhiteBishop;
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            move: history.length,
            oneIsNext: !this.state.oneIsNext,
            pieceMoving: !this.state.pieceMoving,
        });
        
    }

    jump(step) {
        this.setState({
            move: step,
            oneIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.move];
        const winner = calculateWinner();

        if (this.state.move === 0) {
            current.squares[0] = OnePieces.WhiteRook;
            current.squares[1] = OnePieces.WhiteKnight;
            current.squares[2] = OnePieces.WhiteBishop;
            current.squares[3] = OnePieces.WhiteQueen;
            current.squares[4] = OnePieces.WhiteKing;
            current.squares[5] = OnePieces.WhiteBishop;
            current.squares[6] = OnePieces.WhiteKnight;
            current.squares[7] = OnePieces.WhiteRook;
            for (let i = 0; i < 8; i++) {
                current.squares[8 + i] = OnePieces.WhitePawn;
            }
            for (let i = 0; i < 8; i++) {
                current.squares[48 + i] = OnePieces.BlackPawn;
            }
            current.squares[56] = OnePieces.BlackRook;
            current.squares[57] = OnePieces.BlackKnight;
            current.squares[58] = OnePieces.BlackBishop;
            current.squares[59] = OnePieces.BlackQueen;
            current.squares[60] = OnePieces.BlackKing;
            current.squares[61] = OnePieces.BlackBishop;
            current.squares[62] = OnePieces.BlackKnight;
            current.squares[63] = OnePieces.BlackRook;
        }

        let status;
        if (winner === 'win') {
            status = 'Winner: ' + winner;
        } else if (winner === 'tie') {
            status = 'Stalemate';
        } else {
            status = 'Next player: ' + (this.state.oneIsNext ? '1' : '2');
        }

        return (
            <StyledGame>
                <Board 
                    squares = {current.squares}
                    oneIsNext = {this.state.oneIsNext}
                    onClick = {(i) => this.handleClick(i)}
                />
                <GameInfo>
                    <div>{status}</div>
                </GameInfo>
            </StyledGame>
        );
    }
}


function PlacePiece(name, player) {
    return (
        <i
            className={name}
            style={{ color: player % 2 === 0 ? '#000000' : '#FFFFFF' }}
        />
    )
}


function calculateWinner() {
    return null;
}


function squareBackground(position, possible) {
    if (possible) {
        return '#5CF80C';
    }
}


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);