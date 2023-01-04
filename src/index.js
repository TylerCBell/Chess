import React from 'react';
import ReactDOM from 'react-dom/client';
import { StyledSquare, BoardRow, GameInfo, StyledGame, StyledCircle } from './chess'
import '@fortawesome/fontawesome-free/css/all.css';
import Pieces from './chessPieces';

//alert('here' + `${i}`);

function Square(props) {
    return (
        <StyledSquare position={props.position} selected={props.value.selected} onClick={props.onClick}>
            <StyledCircle possibleMove={props.value.possibleMove}>
                { PlacePiece(props.value.fa, props.value.player) }
            </StyledCircle>
        </StyledSquare>
    );
}
//{ PlacePiece(props.value.fa, props.value.player) }

class Board extends React.Component {
    renderSquare(position, squares) {
        return (
            <Square 
                position={position}
                value={squares[position]}
                onClick={() => this.props.onClick(position)}
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

        const startingBoard = Array(64);
        for ( let i = 0; i < startingBoard.length; i++ ) {
            startingBoard[i] = { 
                square: {i},
                name: '',
                type: '',
                fa: '',
                player: '',
                selected: false,
                possibleMove: false, 
            }
        }
        Pieces.map(piece => startingBoard[piece.startingPosition] = piece);

        this.state = {
            history: [{ squares: startingBoard, }],
            possibleMoves: [],
            oneIsNext: true,
            move: 0,
            moving: false,
            selectedSquare: 0,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.move + 1);
        const current = history[history.length - 1];
        var squares = current.squares.slice();
        var moving = this.state.moving;
        var selectedSquare = this.state.selectedSquare;
        var possibleMoves = this.state.possibleMoves;
        /*if (calculateWinner(squares) || squares[i].player === this.state.oneIsNext ? 1 : 2) {
            return;
        }*/

        if ( moving === false && squares[i].name !== '' ) {
            moving = true;
            squares[i].selected = true;
            if (i !== selectedSquare) {
                squares[selectedSquare].selected = false;
                selectedSquare = i;
            }
            possibleMoves = this.findPossibleMoves(squares[selectedSquare].type, selectedSquare, squares[selectedSquare].player, squares);
            possibleMoves.forEach(element => squares[element].possibleMove = true);
        } else if ( moving === true ) {
            // possibleMoves.map((value) => (
            //     this.movePiece(value, i)
            // ))
            moving = false;
            squares[selectedSquare].selected = false;
            alert('clicked! ' + {moving} + ' ' + {selectedSquare} );
        } else {

        }

        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            move: history.length,
            oneIsNext: !this.state.oneIsNext,
            moving: moving,
            selectedSquare: selectedSquare,
        });
        
    }

    findPossibleMoves(piece, location, player, squares) {
        var possibleCoordsMoves = [];
        const pieceCoords = this.getCoords(location);

        switch (piece) {
            case 'pawn':
                if (player === 'white') {
                    possibleCoordsMoves.push([pieceCoords[0],pieceCoords[1]+1]);
                    if (pieceCoords[1] === 1) possibleCoordsMoves.push([pieceCoords[0],pieceCoords[1]+2]);
                    if (squares[location+7].player === 'black' && pieceCoords[0]-1 > -1) possibleCoordsMoves.push([pieceCoords[0]-1,pieceCoords[1]+1])
                    if (squares[location+9].player === 'black' && pieceCoords[0]+1 < 8) possibleCoordsMoves.push([pieceCoords[0]+1,pieceCoords[1]+1])
                } else {
                    possibleCoordsMoves.push([pieceCoords[0],pieceCoords[1]-1]);
                    if (pieceCoords[1] === 6) possibleCoordsMoves.push([pieceCoords[0],pieceCoords[1]-2]);
                    if (squares[location-7].player === 'white' && pieceCoords[0]+1 < 8) possibleCoordsMoves.push([pieceCoords[0]+1,pieceCoords[1]-1])
                    if (squares[location-9].player === 'white' && pieceCoords[0]-1 > -1) possibleCoordsMoves.push([pieceCoords[0]-1,pieceCoords[1]-1])
                }
                break;
            
            case 'rook':
                const rookMoves = [[1,8,1,1,0],[1,8,8,0,1],[-1,-1,-1,-1,0],[-1,-1,-8,0,-1]];
                rookMoves.forEach(element => {
                    var i = 1;
                    while (pieceCoords[0]+i*element[0] !== element[1] && squares[location+i*element[2]].player !== player) {
                        possibleCoordsMoves.push([pieceCoords[0]+i*element[3],pieceCoords[1]+i*element[4]]);
                        if (squares[location+i*element[2]].name !== '') break;
                        i++;
                    }
                });
                // var i = 1;
                // while (pieceCoords[0]+i < 8 && squares[location+i].player !== player) {
                //     possibleCoordsMoves.push([pieceCoords[0]+i,pieceCoords[1]]);
                //     if (squares[location+i].name !== '') break;
                //     i++;
                // }
                // i = 1;
                // while (pieceCoords[1]+i < 8 && squares[location+i*8].player !== player) {
                //     possibleCoordsMoves.push([pieceCoords[0],pieceCoords[1]+i]);
                //     if (squares[location+i*8].name !== '') break;
                //     i++;
                // }
                // i = 1;
                // while (pieceCoords[0]-i > -1 && squares[location-i].player !== player) {
                //     possibleCoordsMoves.push([pieceCoords[0]-i,pieceCoords[1]]);
                //     if (squares[location-i].name !== '') break;
                //     i++;
                // }
                // i = 1;
                // while (pieceCoords[1]-i > -1 && squares[location-i*8].player !== player) {
                //     possibleCoordsMoves.push([pieceCoords[0],pieceCoords[1]-i]);
                //     if (squares[location-i*8].name !== '') break;
                //     i++;
                // }
                break;

            case 'bishop':
                const bishopMoves = [[1,1,8,8,9],[-1,1,-1,8,7],[-1,-1,-1,-1,-9],[1,-1,8,-1,-7]];
                bishopMoves.forEach(element => {
                    var j = 1;
                    while (pieceCoords[0]+j*element[0] !== element[2] && pieceCoords[1]+j*element[1] !== element[3] && squares[location+j*element[4]].player !== player) {
                        possibleCoordsMoves.push([pieceCoords[0]+j*element[0],pieceCoords[1]+j*element[1]]);
                        if (squares[location+j*element[4]].name !== '') break;
                        j++;
                    }
                });
                // var j = 1;
                // while (pieceCoords[0]+j < 8 && pieceCoords[1]+j < 8 && squares[location+j*9].player !== player) {
                //     possibleCoordsMoves.push([pieceCoords[0]+j,pieceCoords[1]+j]);
                //     if (squares[location+j*9].name !== '') break;
                //     j++;
                // }
                // j = 1;
                // while (pieceCoords[0]-j > -1 && pieceCoords[1]+j < 8 && squares[location+j*7].player !== player) {
                //     possibleCoordsMoves.push([pieceCoords[0]-j,pieceCoords[1]+j]);
                //     if (squares[location+j*7].name !== '') break;
                //     j++;
                // }
                // j = 1;
                // while (pieceCoords[0]-j > -1 && pieceCoords[1]-j > -1 && squares[location-j*9].player !== player) {
                //     possibleCoordsMoves.push([pieceCoords[0]-j,pieceCoords[1]-j]);
                //     if (squares[location-j*9].name !== '') break;
                //     j++;
                // }
                // j = 1;
                // while (pieceCoords[0]+j < 8 && pieceCoords[1]-j > -1 && squares[location-j*7].player !== player) {
                //     possibleCoordsMoves.push([pieceCoords[0]+j,pieceCoords[1]-j]);
                //     if (squares[location-j*7].name !== '') break;
                //     j++;
                // }
                break;

            case 'knight':
                const knightMoves = [[-1,-2],[1,-2],[2,-1],[2,1],[1,2],[-1,2],[-2,1],[-2,-1]];
                knightMoves.forEach(element => {
                    if (pieceCoords[0]+element[0] < 8 && pieceCoords[0]+element[0] > -1 && pieceCoords[1]+element[1] < 8 && pieceCoords[1]+element[1] > -1 && squares[location+element[0]+element[1]*8].player !== player) possibleCoordsMoves.push([pieceCoords[0]+element[0],pieceCoords[1]+element[1]]);
                });
                break;

            case 'king':
                const kingMoves = [[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]];
                kingMoves.forEach(element => {
                    if (pieceCoords[0]+element[0] < 8 && pieceCoords[0]+element[0] > -1 && pieceCoords[1]+element[1] < 8 && pieceCoords[1]+element[1] > -1 && squares[location+element[0]+element[1]*8].player !== player) possibleCoordsMoves.push([pieceCoords[0]+element[0],pieceCoords[1]+element[1]]);
                });
                break;

            case 'queen':
                const queenMovesH = [[1,8,1,1,0],[1,8,8,0,1],[-1,-1,-1,-1,0],[-1,-1,-8,0,-1]];
                queenMovesH.forEach(element => {
                    var i = 1;
                    while (pieceCoords[0]+i*element[0] !== element[1] && squares[location+i*element[2]].player !== player) {
                        possibleCoordsMoves.push([pieceCoords[0]+i*element[3],pieceCoords[1]+i*element[4]]);
                        if (squares[location+i*element[2]].name !== '') break;
                        i++;
                    }
                });

                const queenMovesD = [[1,1,8,8,9],[-1,1,-1,8,7],[-1,-1,-1,-1,-9],[1,-1,8,-1,-7]];
                queenMovesD.forEach(element => {
                    var j = 1;
                    while (pieceCoords[0]+j*element[0] !== element[2] && pieceCoords[1]+j*element[1] !== element[3] && squares[location+j*element[4]].player !== player) {
                        possibleCoordsMoves.push([pieceCoords[0]+j*element[0],pieceCoords[1]+j*element[1]]);
                        if (squares[location+j*element[4]].name !== '') break;
                        j++;
                    }
                });
                break;

            default:
                break;
        }

        return possibleCoordsMoves.map(coord => this.getIndex(coord));
    }

    getCoords(location) {
        return [location % 8, Math.floor(location / 8) ];
    }

    getIndex(location) {
        return location[1] * 8 + location[0];
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
            style={{ color: player, display: 'flex', 'justify-content': 'center', 'align-items': 'center' }}
        />
    )
}


function calculateWinner() {
    return null;
}

// '#5CF80C';
// 600,-450

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);