import styled from 'styled-components'

const BoardSize = '600px'

export const StyledSquare = styled.button`
    border: 1px solid #000000;
    background-color: ${({position}) => ((Math.floor(position / 8) + position) % 2) === 0 ? '#9a5f02' : '#fdce84' };
    width: 12.5%;
    height: 12.5%;
    transition: opacity 0.3s;
    opacity: ${({selected}) => selected ? 0.5 : 1};
    
    &:hover {
        opacity: 0.5;
    }
`

export const BoardRow = styled.div`
    width: ${BoardSize};
    height: ${BoardSize};
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

