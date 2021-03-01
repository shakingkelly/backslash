import React from 'react';
import { ReactSortable } from "react-sortablejs";
import VideoThumbnail from './Thumbnail';

/* STYLE 
   VideoThumbnail: width/height, list/grid view
*/

const Playlist = (props) => {

    return (
        <div id="finite-list" style={{background: 'white'}}>
            <ReactSortable 
                className={props.view === 'list' ? 'list' : 'grid'} 
                list={props.data} 
                setList={props.updated}
            >
                {props.data.map((item, index) => {
                    let isActive = props.selectedIndex.includes(index);

                    return (

                        props.view === 'list' ?

                        // LIST VIEW: 
                        <div className="list-item" key={item.id}>
                            {isActive ?
                                <div className="preview-cell active" onClick={props.clicked(item.id)}>
                                    {item.type === 'img' && <img className="preview-img-list" src={item.url} alt={item.url} />}
                                    {item.type === 'av' && <VideoThumbnail videoUrl={item.url} width={90} height={40} view='list' />}
                                </div>
                                : <div className="preview-cell" onClick={props.clicked(item.id)}>
                                    {item.type === 'img' && <img className="preview-img-list" src={item.url} alt={item.url} />}
                                    {item.type === 'av' && <VideoThumbnail videoUrl={item.url} width={90} height={40} view='list' />}
                                </div>
                            }
                            {isActive ?
                                <div className="filename-cell active" onClick={props.clicked(item.id)}>{item.name}</div>
                                : <div className="filename-cell" onClick={props.clicked(item.id)}>{item.name}</div>
                            }
                            {isActive ?
                                <div className="delete-button active" onClick={props.clickDeleted(item.id)}>x</div>
                                : <div className="delete-button" onClick={props.clickDeleted(item.id)}>x</div>
                            }
                        </div>

                        :

                        // GRID VIEW: only when inactive have the overlay
                        <div className="grid-item">  
                            {isActive ?
                                <div className="grid-view-active">
                                    {
                                        item.type === 'img' &&
                                        <div className="preview-cell-grid active" onClick={props.clicked(item.id)}>
                                            <img className="preview-img-grid" src={item.url} alt={item.url} />
                                        </div>
                                    }
                                    {
                                        item.type === 'av' &&
                                        <div className="preview-cell-grid active" onClick={props.clicked(item.id)}>
                                            <VideoThumbnail videoUrl={item.url} width={150} height={80} view='grid' />
                                        </div>
                                    }
                                    {
                                        item.type === 'md' &&
                                        <div className="filename-cell-grid active" onClick={props.clicked(item.id)}>{item.name}</div>
                                    }
                                    {
                                        !item.type &&
                                        <div className="filename-cell-grid active">??</div>
                                    }
                                </div>
                                :
                                <div className="grid-view-inactive">
                                    {
                                        item.type === 'img' &&
                                        <div className="preview-cell-grid" onClick={props.clicked(item.id)}>
                                            <div className="overlay">{item.name}</div>
                                            <img className="preview-img-grid" src={item.url} alt={item.url} />
                                        </div>
                                    }
                                    {
                                        item.type === 'av' &&
                                        <div className="preview-cell-grid" onClick={props.clicked(item.id)}>
                                            <div className="overlay">{item.name}</div>
                                            <VideoThumbnail videoUrl={item.url} width={150} height={80} view='grid' />
                                        </div>
                                    }
                                    {
                                        item.type === 'md' &&
                                        <div className="filename-cell-grid" onClick={props.clicked(item.id)}>{item.name}</div>
                                    }
                                    {
                                        !item.type &&
                                        <div className="filename-cell-grid">??</div>
                                    }
                                </div>
                            }
                        </div>
                    )
                })}
            </ReactSortable>
        </div>
    )
}

export default Playlist;
