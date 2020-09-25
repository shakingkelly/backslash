import React from 'react';
import IAVMedia from './IAVMedia';
import Draggable from 'react-draggable';

const Preview = (props) => {

    return (
        <div>
            {
                props.selectedIndex.map((selected, index) => {
                    return (
                        <Draggable key={selected}>
                            <div><IAVMedia item={props.data[selected]} order={index} /></div>
                        </Draggable>
                    )
                })
            }
        </div>

    )
}

export default Preview;

// original in App.js
// {
//     this.state.selectedId.map((selected, index) => {
//         return (
//             <Draggable key={selected}>
//                 <div><IAVMedia item={this.state.data[selected]} /></div>
//             </Draggable>
//         )
//     })
// }