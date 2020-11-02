import React from 'react';
import { ReactSortable } from "react-sortablejs";
import styled from 'styled-components';

const StyledListDiv = styled.div`
    flex-grow: 4;
    height: 500x;
    padding: 16px;
    text-align: center;
    border: 10px outset white;
    background-color: black;
    color: white;  
    font-family: Syne Mono;
    border-radius: 10px;
    margin-bottom:10px;
    &:hover {
        background-color: #2a9d8f;
    }
`;

const StyledDeleteButton = styled.div`
    flex-grow: 1;
    height: 500x;
    padding: 16px;
    text-align: center;
    border: 10px outset white;
    background-color: black;
    color: white;  
    font-family: Syne Mono;
    border-radius: 10px;
    margin-bottom:10px;
    &:hover {
        background-color: #2a9d8f;
    }
`;

const StyledActiveListDiv = styled.div`
    flex-grow: 4;
    height: 500x;
    padding: 16px;
    text-align: center;
    border: 10px inset white;
    background-color: white;
    color: black;  
    font-family: Syne Mono;
    font-weight: bold;
    border-radius: 10px;
    margin-bottom:10px;
    &:hover {
        background-color: #e76f51;
    }
`;

const StyledActiveDeleteButton = styled.div`
    flex-grow: 1;
    height: 500x;
    padding: 16px;
    text-align: center;
    border: 10px inset white;
    background-color: white;
    color: black;  
    font-family: Syne Mono;
    font-weight: bold;
    border-radius: 10px;
    margin-bottom:10px;
    &:hover {
        background-color: #e76f51;
    }
`;

const Playlist = (props) => {

    return (
        <ReactSortable
            list={props.data}
            setList={props.updated}
        >
            {props.data.map((item, index) => {
                let isActive = props.selectedIndex.includes(index)
                return (
                    <div key={item.id} style={{ display: 'flex', flexDirection: 'row', maxWidth: '800px' }}>
                        {isActive ?
                            <StyledActiveListDiv onClick={props.clicked(item.id)}>{[item.name, item.id, index]}</StyledActiveListDiv>
                            : <StyledListDiv onClick={props.clicked(item.id)}>{[item.name, item.id, index]}</StyledListDiv>
                        }
                        {isActive ?
                            <StyledActiveDeleteButton onClick={props.clickDeleted(item.id)}>x</StyledActiveDeleteButton>
                            : <StyledDeleteButton onClick={props.clickDeleted(item.id)}>x</StyledDeleteButton>
                        }
                    </div>
                    // <tr>
                    //     <td style={isActive ? activeStyle : style} key={item.id} onClick={props.clicked(index)}>{[item.name, item.id, index]}</td>
                    //     <td style={isActive ? activeStyle : style} onClick={props.clickDeleted(index)}>x</td>
                    // </tr>
                )
            })}
        </ReactSortable>
    )
}

export default Playlist;
