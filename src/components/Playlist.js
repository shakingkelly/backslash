import React from 'react';
import { ReactSortable } from "react-sortablejs";
import styled from 'styled-components';
// import VideoThumbnail from 'react-video-thumbnail';
import VideoThumbnail from './Thumbnail';

const StyledListDiv = styled.div`
    // flex-grow: 4;
    flex: 0 0 100px;
    height: 80px;
    padding: 5px;
    text-align: center;
    border: 1px outset white;
    background-color: var(--list-background);
    color: var(--list-foreground);  
    font-family: Space Grotesk;
    border-radius: var(--list-roundedness);
    // margin-bottom:10px;
    &:hover {
        background-color: var(--primary-green);
    }
`;

const StyledDeleteButton = styled.div`
    // flex-grow: 1;
    flex: 0 0 20px;
    height: 80px;
    padding: 5px;
    text-align: center;
    border: 1px outset white;
    background-color: var(--list-background);
    color: var(--list-foreground);  
    font-family: Space Grotesk;
    border-radius: var(--list-roundedness);
    // margin-bottom:10px;
    &:hover {
        background-color: var(--primary-green);
    }
`;

const StyledActiveListDiv = styled.div`
    // flex-grow: 4;
    flex: 0 0 100px;
    height: 80px;
    padding: 5px;
    text-align: center;
    border: 1px inset white;
    background-color: var(--list-foreground);
    color: var(--list-background);  
    font-family: Space Grotesk;
    font-weight: bold;
    border-radius: var(--list-roundedness);
    // margin-bottom:10px;
    &:hover {
        background-color: var(--primary-red);
    }
`;

const StyledActiveDeleteButton = styled.div`
    // flex-grow: 1;
    flex: 0 0 20px;
    height: 80px;
    padding: 5px;
    text-align: center;
    border: 1px inset white;
    background-color: var(--list-foreground);
    color: var(--list-background);  
    font-family: Space Grotesk;
    font-weight: bold;
    border-radius: var(--list-roundedness);
    // margin-bottom:10px;
    &:hover {
        background-color: var(--primary-red);
    }
`;

const Playlist = (props) => {

    return (
        <div id="finite-list">
            <ReactSortable
                list={props.data}
                setList={props.updated}
            >
                {props.data.map((item, index) => {
                    let isActive = props.selectedIndex.includes(index)
                    return (
                        <div key={item.id} style={{ display: 'flex', flexDirection: 'row', maxWidth: '800px', width: '500px' }}>
                            {isActive ?
                                <StyledActiveListDiv onClick={props.clicked(item.id)}>
                                    {item.type === 'img' && <img height='10px' src={item.url} alt={item.url} />}
                                    {item.type === 'av' && <VideoThumbnail videoUrl={item.url} width={60} height={30} />}
                                </StyledActiveListDiv>
                                : <StyledListDiv onClick={props.clicked(item.id)}>
                                    {item.type === 'img' && <img height='10px' src={item.url} alt={item.url} />}
                                    {item.type === 'av' && <VideoThumbnail videoUrl={item.url} width={60} height={30} />}
                                </StyledListDiv>
                            }
                            {isActive ?
                                <StyledActiveListDiv onClick={props.clicked(item.id)}>
                                    {item.name}
                                </StyledActiveListDiv>
                                : <StyledListDiv onClick={props.clicked(item.id)}>
                                    {item.name}
                                </StyledListDiv>
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
        </div>
    )
}

export default Playlist;
