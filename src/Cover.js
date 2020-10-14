import React, { Component } from 'react';
import DrawArea from './components/DrawArea'

class Cover extends Component {

    constructor() {
        super();
        this.state = {
            imgWidth: 800,
            showCanvas: false,
            canvasWidth: 800,
            canvasHeight: 800
        }
    }



    toggleCanvas = () => {
        const boundingRect = this.refs.coverImg.getBoundingClientRect();
        this.setState({ showCanvas: !this.state.showCanvas, canvasWidth: boundingRect.right - boundingRect.left, canvasHeight: boundingRect.bottom - boundingRect.top });
        console.log(this.state);
    }

    // relativeCoordinatesForEvent(mouseEvent) {
    //     const boundingRect = this.refs.coverImg.getBoundingClientRect();

    //     if (mouseEvent.clientX > boundingRect.right || mouseEvent.clientX < boundingRect.left || mouseEvent.clientY > boundingRect.bottom || mouseEvent.clientY < boundingRect.top) {
    //         console.log('out of canvas, clicking button?')
    //         return null;
    //     } else {
    //         // console.log(relativeX, relativeY)
    //     }

    //     return {
    //         x: mouseEvent.clientX,
    //         y: mouseEvent.clientY,
    //     };
    // }

    render() {
        return (
            <div>
                <div>
                    <img ref='coverImg' width={this.state.imgWidth} src='./asset/cave.jpg' alt='./asset/cave.jpg' style={{ zIndex: 0, position: 'absolute' }} />
                    {this.state.showCanvas && <DrawArea canvasWidth={this.state.canvasWidth} canvasHeight={this.state.canvasHeight} />}
                    {/* applied style from css -> css file overrides inline style! */}
                </div>
                <button onClick={this.toggleCanvas} style={{zIndex: 200, position: 'relative'}}>{this.state.showCanvas ? 'hide' : 'show'}</button>
            </div>
        )
    }



}
export default Cover;