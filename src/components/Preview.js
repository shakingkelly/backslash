import React from 'react';
import IAVMedia from './IAVMedia';
import Draggable from 'react-draggable';

import Editor from './Editor';

const Preview = (props) => {

    return (
        <div>
            {
                props.selectedIndex.map((selected, index) => {
                    return (
                        props.data[selected].type === 'md' ?
                            // <Draggable>
                                // <div>
                                    <Editor key={selected} item={props.data[selected]} order={index} changeEditorFilenameFn={props.changeEditorFilenameFn} />
                                // </div>
                            // </Draggable>
                            :
                            <IAVMedia key={selected} item={props.data[selected]} order={index} />
                    )
                })
            }
        </div>

    )
}

export default Preview;

