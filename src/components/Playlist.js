import React from 'react';
import { ReactSortable } from "react-sortablejs";
import styled from 'styled-components';
import VideoThumbnail from './Thumbnail';

const PreviewCell = styled.div`
    // flex-grow: 4;
    flex: 0 0 100px;
    height: 50px;
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

const ActivePreviewCell = styled.div`
    // flex-grow: 4;
    flex: 0 0 100px;
    height: 50px;
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

const FilenameCell = styled.div`
    // flex-grow: 4;
    flex: 0 0 150px;
    height: 50px;
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

const ActiveFilenameCell = styled.div`
    // flex-grow: 4;
    flex: 0 0 150px;
    height: 50px;
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

const DeleteButton = styled.div`
    // flex-grow: 1;
    flex: 0 0 20px;
    height: 50px;
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

const ActiveDeleteButton = styled.div`
    // flex-grow: 1;
    flex: 0 0 20px;
    height: 50px;
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
                                <ActivePreviewCell onClick={props.clicked(item.id)}>
                                    {item.type === 'img' && <img width='100px' height='50px' src={item.url} alt={item.url} />}
                                    {item.type === 'av' && <VideoThumbnail videoUrl={item.url} width={100} height={50} />}
                                </ActivePreviewCell>
                                : <PreviewCell onClick={props.clicked(item.id)}>
                                    {item.type === 'img' && <img width='100px' height='50px' src={item.url} alt={item.url} />}
                                    {item.type === 'av' && <VideoThumbnail videoUrl={item.url} width={100} height={50} />}
                                </PreviewCell>
                            }
                            {isActive ?
                                <ActiveFilenameCell onClick={props.clicked(item.id)}>{item.name}</ActiveFilenameCell>
                                : <FilenameCell onClick={props.clicked(item.id)}>{item.name}</FilenameCell>
                            }
                            {isActive ?
                                <ActiveDeleteButton onClick={props.clickDeleted(item.id)}>x</ActiveDeleteButton>
                                : <DeleteButton onClick={props.clickDeleted(item.id)}>x</DeleteButton>
                            }
                        </div>
                    )
                })}
            </ReactSortable>
        </div>
    )
}

export default Playlist;
