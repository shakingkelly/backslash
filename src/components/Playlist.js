import React from 'react';
import { ReactSortable } from "react-sortablejs";
import VideoThumbnail from './Thumbnail';


const Playlist = (props) => {

    return (
        <div id="finite-list">
            <ReactSortable
                className="grid"
                list={props.data}
                setList={props.updated}
            >
                {props.data.map((item, index) => {
                    let isActive = props.selectedIndex.includes(index);

                    return (
                        // GRID VIEW: only when inactive have the overlay
                        <div className="1">
                            {isActive ?
                                <div className="grid-view-active">
                                    {
                                        item.type === 'img' &&
                                        <div className="preview-cell-active-grid" onClick={props.clicked(item.id)}>
                                            <img className="preview-img-grid" src={item.url} alt={item.url} />
                                        </div>
                                    }
                                    {
                                        item.type === 'av' &&
                                        <div className="preview-cell-active-grid" onClick={props.clicked(item.id)}>
                                            <VideoThumbnail lassName="preview-img-grid" videoUrl={item.url} width={150} height={80} />
                                        </div>
                                    }
                                    {
                                        item.type === 'md' &&
                                        <div className="filename-cell-active-grid" onClick={props.clicked(item.id)}>{item.name}</div>
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
                                            <VideoThumbnail videoUrl={item.url} width={150} height={80} />
                                        </div>
                                    }
                                    {
                                        item.type === 'md' &&
                                        <div className="filename-cell-grid" onClick={props.clicked(item.id)}>{item.name}</div>
                                    }
                                </div>
                            }

                        </div>


                        // <div className="list-item" key={item.id} >
                        //     {isActive ?
                        //         <div className="preview-cell-active" onClick={props.clicked(item.id)}>
                        //             {item.type === 'img' && <img width='100px' height='50px' src={item.url} alt={item.url} />}
                        //             {item.type === 'av' && <VideoThumbnail videoUrl={item.url} width={100} height={50} />}
                        //         </div>
                        //         : <div className="preview-cell" onClick={props.clicked(item.id)}>
                        //             {item.type === 'img' && <img width='100px' height='50px' src={item.url} alt={item.url} />}
                        //             {item.type === 'av' && <VideoThumbnail videoUrl={item.url} width={100} height={50} />}
                        //         </div>
                        //     }
                        //     {isActive ?
                        //         <div className="filename-cell-active" onClick={props.clicked(item.id)}>{item.name}</div>
                        //         : <div className="filename-cell" onClick={props.clicked(item.id)}>{item.name}</div>
                        //     }
                        //     {isActive ?
                        //         <div className="delete-button-active" onClick={props.clickDeleted(item.id)}>x</div>
                        //         : <div className="delete-button" onClick={props.clickDeleted(item.id)}>x</div>
                        //     }
                        // </div>


                    )
                })}
            </ReactSortable>
        </div>
    )
}

export default Playlist;
