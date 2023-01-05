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
                square: i,
                name: '',
                type: '',
                fa: '',
                player: '',
                selected: false,
                possibleMove: false, 
            }
        }
        Pieces.forEach(piece => startingBoard[piece.square] = piece);

        this.state = {
            history: [{ 
                squares: startingBoard, 
            }],
            possibleMoves: [],
            whiteIsNext: true,
            move: 0,
            moving: false,
            selectedSquare: 1,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.move + 1);
        const current = history[history.length - 1];
        const player = this.state.whiteIsNext ? 'white' : 'black';
        var squares = current.squares.slice();
        var moving = this.state.moving;
        var selectedSquare = this.state.selectedSquare;
        var possibleMoves = this.state.possibleMoves;
        var moved = false;
        var status = false;

        const kingCoords = squares.find( element => element.type === 'king' && element.player === player ).square;
        var coveredSquares = [];
        squares.forEach(element => {
            if (element.player !== player && element.name !== '') coveredSquares = coveredSquares.concat(this.findPossibleMoves(element.type, element.square, element.player, squares, [], true, kingCoords));
        });
        status = coveredSquares.includes(kingCoords);
        //alert(`${coveredSquares}`);

        if ( squares[i].player === player ) {
            moving = true;
            squares[selectedSquare].selected = false;
            squares[i].selected = true;
            if (i !== selectedSquare) {
                squares[selectedSquare].selected = false;
                selectedSquare = i;
            }
            possibleMoves.forEach(element => squares[element].possibleMove = false);
            possibleMoves = this.findPossibleMoves(squares[selectedSquare].type, selectedSquare, player, squares, coveredSquares, false, kingCoords);
            possibleMoves.forEach(element => squares[element].possibleMove = true);
        } else if ( squares[i].possibleMove === true ) {
            moving = false;
            squares[i].name = squares[selectedSquare].name;
            squares[i].type = squares[selectedSquare].type;
            squares[i].fa = squares[selectedSquare].fa;
            squares[i].player = squares[selectedSquare].player;
            squares[i].possibleMove = false;
            squares[selectedSquare].name = '';
            squares[selectedSquare].type = '';
            squares[selectedSquare].fa = '';
            squares[selectedSquare].player = '';
            squares[selectedSquare].selected = false;
            possibleMoves.forEach(element => squares[element].possibleMove = false);
            moved = true;
        } else {
            moving = false;
            squares[selectedSquare].selected = false;
            possibleMoves.forEach(element => squares[element].possibleMove = false);
        }

        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            possibleMoves: possibleMoves,
            whiteIsNext: moved ? !this.state.whiteIsNext : this.state.whiteIsNext,
            move: history.length,
            moving: moving,
            selectedSquare: selectedSquare,
        });
    }

    findPossibleMoves(piece, location, player, squares, coveredSquares, capture, kingCoords) {
        var possibleCoordsMoves = [];
        var availableMoves = [];
        const pieceCoords = this.getCoords(location);

        // if (!capture && piece !== 'king') {
        //     squares[location].type = '';
        //     squares[location].player = '';
        //     var checkSquares = [];
        //     squares.forEach(element => {
        //         if (element.player !== player && element.name !== '') checkSquares = checkSquares.concat(this.findPossibleMoves(element.type, element.square, element.player, squares, [], true, kingCoords));
        //     });
        //     squares[location].type = piece;
        //     squares[location].player = player;
        //     if (checkSquares.includes(kingCoords)) return possibleCoordsMoves;
        // }

        switch (piece) {
            case 'pawn':
                if (player === 'white') {
                    if (squares[location+8].type === '' && pieceCoords[1]+1 < 8 && !capture) possibleCoordsMoves.push([pieceCoords[0],pieceCoords[1]+1]);
                    if (pieceCoords[1] === 1 && !capture) possibleCoordsMoves.push([pieceCoords[0],pieceCoords[1]+2]);
                    if ((squares[location+7].player === 'black' || capture) && pieceCoords[0]-1 > -1) possibleCoordsMoves.push([pieceCoords[0]-1,pieceCoords[1]+1])
                    if ((squares[location+9].player === 'black' || capture) && pieceCoords[0]+1 < 8) possibleCoordsMoves.push([pieceCoords[0]+1,pieceCoords[1]+1])
                } else {
                    if (squares[location-8].type === '' && pieceCoords[1]-1 > -1 && !capture)possibleCoordsMoves.push([pieceCoords[0],pieceCoords[1]-1]);
                    if (pieceCoords[1] === 6 && !capture) possibleCoordsMoves.push([pieceCoords[0],pieceCoords[1]-2]);
                    if ((squares[location-7].player === 'white' || capture) && pieceCoords[0]+1 < 8) possibleCoordsMoves.push([pieceCoords[0]+1,pieceCoords[1]-1])
                    if ((squares[location-9].player === 'white' || capture) && pieceCoords[0]-1 > -1) possibleCoordsMoves.push([pieceCoords[0]-1,pieceCoords[1]-1])
                }
                break;
            
            case 'rook':
                const rookMoves = [[0,1,8,1,1,0],[1,1,8,8,0,1],[0,-1,-1,-1,-1,0],[1,-1,-1,-8,0,-1]];
                rookMoves.forEach(element => {
                    var i = 1;
                    while (pieceCoords[element[0]]+i*element[1] !== element[2] && squares[location+i*element[3]].player !== player) {
                        possibleCoordsMoves.push([pieceCoords[0]+i*element[4],pieceCoords[1]+i*element[5]]);
                        if (squares[location+i*element[3]].type !== '') break;
                        i++;
                    }
                });
                break;

            case 'bishop':
                const bishopMoves = [[1,1,8,8,9],[-1,1,-1,8,7],[-1,-1,-1,-1,-9],[1,-1,8,-1,-7]];
                bishopMoves.forEach(element => {
                    var j = 1;
                    while (pieceCoords[0]+j*element[0] !== element[2] && pieceCoords[1]+j*element[1] !== element[3] && squares[location+j*element[4]].player !== player) {
                        possibleCoordsMoves.push([pieceCoords[0]+j*element[0],pieceCoords[1]+j*element[1]]);
                        if (squares[location+j*element[4]].type !== '') break;
                        j++;
                    }
                });
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
                    if (pieceCoords[0]+element[0] < 8 && pieceCoords[0]+element[0] > -1 && pieceCoords[1]+element[1] < 8 && pieceCoords[1]+element[1] > -1 && squares[location+element[0]+element[1]*8].player !== player && !coveredSquares.includes(location+element[0]+element[1]*8)) possibleCoordsMoves.push([pieceCoords[0]+element[0],pieceCoords[1]+element[1]]);
                });
                break;

            case 'queen':
                const queenMovesH = [[0,1,8,1,1,0],[1,1,8,8,0,1],[0,-1,-1,-1,-1,0],[1,-1,-1,-8,0,-1]];
                queenMovesH.forEach(element => {
                    var i = 1;
                    while (pieceCoords[element[0]]+i*element[1] !== element[2] && squares[location+i*element[3]].player !== player) {
                        possibleCoordsMoves.push([pieceCoords[0]+i*element[4],pieceCoords[1]+i*element[5]]);
                        if (squares[location+i*element[3]].type !== '') break;
                        i++;
                    }
                });

                const queenMovesD = [[1,1,8,8,9],[-1,1,-1,8,7],[-1,-1,-1,-1,-9],[1,-1,8,-1,-7]];
                queenMovesD.forEach(element => {
                    var j = 1;
                    while (pieceCoords[0]+j*element[0] !== element[2] && pieceCoords[1]+j*element[1] !== element[3] && squares[location+j*element[4]].player !== player) {
                        possibleCoordsMoves.push([pieceCoords[0]+j*element[0],pieceCoords[1]+j*element[1]]);
                        if (squares[location+j*element[4]].type !== '') break;
                        j++;
                    }
                });
                break;

            default:
                break;
        }

        const possibleIndexMoves = possibleCoordsMoves.map(coord => this.getIndex(coord));

        if (!capture && piece !== 'king') {
            squares[location].type = '';
            squares[location].player = '';
            

            possibleIndexMoves.forEach(move => {
                const squarePiece = squares[move].type;
                const squarePlayer = squares[move].player;
                squares[move].type = piece;
                squares[move].player = player;

                var checkSquares = [];
                squares.forEach(element => {
                    if (element.player !== player && element.name !== '') checkSquares = checkSquares.concat(this.findPossibleMoves(element.type, element.square, element.player, squares, [], true, kingCoords));
                });
                alert('squares: ' + `${checkSquares}`);
                if (!checkSquares.includes(kingCoords)) {
                    alert(`${move}`);
                    availableMoves = availableMoves.concat(move);
                }

                squares[move].type = squarePiece;
                squares[move].player = squarePlayer;
            });

            squares[location].type = piece;
            squares[location].player = player;
            alert(`${availableMoves}`);
            return availableMoves;
            //if (checkSquares.includes(kingCoords)) return possibleCoordsMoves;
        }

        // if (!capture && piece !== 'king') {
        //     squares[location].type = '';
        //     squares[location].player = '';

        //     possibleIndexMoves.forEach(move => {
        //         // const squarePiece = squares[move].type;
        //         // const squarePlayer = squares[move].player;
        //         // squares[move].type = piece;
        //         // squares[move].player = player;
        //         var checkSquares = [];
        //         squares.forEach(element => {
        //             if (element.player !== player && element.name !== '') {
        //                 checkSquares = checkSquares.concat(this.findPossibleMoves(element.type, element.square, element.player, squares, [], true, kingCoords));
        //                 alert(`${element.name}`);
        //             }
        //         });
        //         alert(`${checkSquares}`);
        //         // if (!checkSquares.includes(kingCoords)) moves = moves.concat(move);
        //         // squares[move].type = squarePiece;
        //         // squares[move].player = squarePlayer;
        //     });

        //     squares[location].type = piece;
        //     squares[location].player = player;
        // }

        // return moves;

        return possibleIndexMoves;
    }

    getCoords(location) {
        return [location % 8, Math.floor(location / 8)];
    }

    getIndex(location) {
        return location[1] * 8 + location[0];
    }

    jump(step) {
        this.setState({
            move: step,
            whiteIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.move];
        const winner = 0;

        let status;
        if (winner === 'win') {
            status = 'Winner: ' + winner;
        } else if (winner === 'tie') {
            status = 'Stalemate';
        } else {
            status = 'Next player: ' + (this.state.whiteIsNext ? 'white' : 'black');
        }

        return (
            <StyledGame>
                <Board
                    squares = {current.squares}
                    whiteIsNext = {this.state.whiteIsNext}
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

// 600,-450

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);