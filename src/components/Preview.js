import React from 'react';
import IAVMedia from './IAVMedia';
// import Draggable from 'react-draggable';

const Preview = (props) => {

    return (
        <div>
            {
                props.selectedIndex.map((selected, index) => {
                    return (
                        <IAVMedia key={selected} item={props.data[selected]} order={index} />
                        // <Draggable key={selected}>
                            // <div>
                                
                            // </div>
                        // </Draggable>
                    )
                })
            }
        </div>

    )
}

export default Preview;

