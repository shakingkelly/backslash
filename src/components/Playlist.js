import React from 'react';
import { ReactSortable } from "react-sortablejs";
import styled from 'styled-components';

const StyledTD = styled.td`
    margin: 16px; 
    padding: 16px;
    text-align: center;
    border: 10px outset white;
    background-color: black;
    color: white;  
    &:hover {
        background-color: red;
    }
`;

const Playlist = (props) => {

    const style = {
        width: '50%',
        maxWidth: '500px',
        margin: '16px',
        padding: '16px',
        textAlign: 'center',
        border: '10px outset white',
        backgroundColor: 'black',
        color: 'white'
    }

    const activeStyle = {
        width: '50%',
        maxWidth: '500px',
        margin: '16px',
        border: '10px inset white',
        padding: '16px',
        textAlign: 'center',
        backgroundColor: 'white',
        color: 'black',
        fontFamily: 'Courier',
        fontWeight: 'bold'
    }


    return (
        <table>
            <tbody>
                <ReactSortable
                    list={props.data}
                    setList={props.updated}
                >
                    {props.data.map((item, index) => {
                        let isActive = props.selectedId.includes(index)
                        return (
                            <tr>
                                <td style={isActive ? activeStyle : style} key={item.id} onClick={props.clicked(index)}>{[item.name, item.id, index]}</td>
                                <td style={isActive ? activeStyle : style} onClick={props.clickDeleted(index)}>x</td>
                            </tr>
                            // <tr key={item.id} >
                            //     <StyledTD onClick={props.clicked(index)}>
                            //         {[item.name, item.id, index]}
                            //     </StyledTD>
                            // </tr>

                        )

                    })}
                </ReactSortable>
            </tbody>
        </table>
    )
}

export default Playlist;
