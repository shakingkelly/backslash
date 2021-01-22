import React from 'react';
import { ReactSortable } from "react-sortablejs";
import styled from 'styled-components';
import VideoThumbnail from './Thumbnail';


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
                        <div className="list-item" key={item.id} >
                            {isActive ?
                                <div className="preview-cell-active" onClick={props.clicked(item.id)}>
                                    {item.type === 'img' && <img width='100px' height='50px' src={item.url} alt={item.url} />}
                                    {item.type === 'av' && <VideoThumbnail videoUrl={item.url} width={100} height={50} />}
                                </div>
                                : <div className="preview-cell" onClick={props.clicked(item.id)}>
                                    {item.type === 'img' && <img width='100px' height='50px' src={item.url} alt={item.url} />}
                                    {item.type === 'av' && <VideoThumbnail videoUrl={item.url} width={100} height={50} />}
                                </div>
                            }
                            {isActive ?
                                <div className="filename-cell-active" onClick={props.clicked(item.id)}>{item.name}</div>
                                : <div className="filename-cell" onClick={props.clicked(item.id)}>{item.name}</div>
                            }
                            {isActive ?
                                <div className="delete-button-active" onClick={props.clickDeleted(item.id)}>x</div>
                                : <div className="delete-button" onClick={props.clickDeleted(item.id)}>x</div>
                            }
                        </div>
                    )
                })}
            </ReactSortable>
        </div>
    )
}

export default Playlist;
