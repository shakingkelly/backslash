import React from 'react';
import IAVMedia from './IAVMedia';
// import Draggable from 'react-draggable';

const Preview = (props) => {

    return (
        <div>
            {
                props.selectedIndex.map((selected, index) => {
                    return (
                        props.data[selected].type === 'md' ?
                            <IAVMedia key={selected} item={props.data[selected]} order={index} />
                            // <Draggable key={selected}>
                            // <div>

                            // </div>
                            // </Draggable>
                            :
                            <Editor key={selected} item={props.data[selected]} order={index} changeEditorFilenameFn={props.changeEditorFilenameFn} />
                    )
                })
            }
        </div>

    )
}

export default Preview;

