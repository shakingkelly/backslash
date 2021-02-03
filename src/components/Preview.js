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
                            <Editor key={selected} item={props.data[selected]} order={index} changeEditorFilenameFn={props.changeEditorFilenameFn} />
                            :
                            <IAVMedia key={selected} item={props.data[selected]} order={index} saveCanvasFN={props.saveCanvasFN} />
                    )
                })
            }
        </div>

    )
}

export default Preview;

