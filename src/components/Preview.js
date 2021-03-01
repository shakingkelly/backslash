import React from 'react';
import IAVMedia from './IAVMedia';
import Editor from './Editor';

const Preview = (props) => {

    return (
        <div id="preview-pos">
            {
                props.selectedIndex.map((selected, index) => {
                    return (
                        props.data[selected].type === 'md' ?
                            <Editor 
                                key={selected} 
                                item={props.data[selected]} 
                                order={index} 
                                changeEditorFilenameFN={props.changeEditorFilenameFN} 
                                savePositionFN={props.savePositionFN} 
                                // changeOrderFN={props.changeOrderFN}
                            />
                            :
                            <IAVMedia 
                                key={selected} 
                                item={props.data[selected]} 
                                order={index} 
                                saveCanvasFN={props.saveCanvasFN} 
                                savePositionFN={props.savePositionFN} 
                                // changeOrderFN={props.changeOrderFN}
                            />
                    )
                })
            }
        </div>
    )
}

export default Preview;

