import styled from 'styled-components'

const BoardSize = 600;
const CircleSize = BoardSize/32;

export const StyledSquare = styled.button`
    border: 1px solid #000000;
    background-color: ${({position, selected}) => selected === true ? '#00FF00' : ((Math.floor(position / 8) + position) % 2) === 0 ? '#fdce84' : '#9a5f02' };
    width: 12.5%;
    height: 12.5%;
    transition: opacity 0.3s;
    opacity: ${({selected}) => selected ? 0.5 : 1};
    display: flex;
    justify-content: center;
    align-items: center;
    
    &:hover {
        opacity: 0.5;
    }
`

export const BoardRow = styled.div`
    width: ${BoardSize}px;
    height: ${BoardSize}px;
    display: flex;
    flex-wrap: wrap;
`

export const GameInfo = styled.div`
    margin-left: 20px;
`

export const StyledGame = styled.div`
    display: flex;
    flex-direction: row;
`

export const StyledCircle = styled.div`
    background-color: ${({possibleMove}) => possibleMove === true ? '#00FF00' : null };
    width: ${CircleSize}px;
    height: ${CircleSize}px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
`