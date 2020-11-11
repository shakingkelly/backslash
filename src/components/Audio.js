import React, { Component } from 'react';
import { ReactMic } from 'react-mic';

class Audio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      record: false,
      src: ''
    }
  }

  startRecording = () => {
    this.setState({ record: true });
  }

  stopRecording = () => {
    this.setState({ record: false });
  }

  onData(recordedBlob) {
    // console.log('chunk of real-time data is: ', recordedBlob);
  }

  onStop(recordedBlob) {
    console.log('[Audio:onStop] recordedBlob is: ', recordedBlob.blobURL);
    const url = URL.createObjectURL(recordedBlob.blob);
    this.setState({ src: url });
  }

  render() {
    return (
      <div>
        <div>
          <ReactMic
            record={this.state.record}
            className="sound-wave"
            onStop={data => this.onStop(data)}
            onData={this.onData}
            strokeColor="red"
            backgroundColor="black"
            width={120}
            height={60} />
        </div>
        <button onClick={this.startRecording} type="button" style={{ width: 30, height: 30 }}>⦿</button>
        {/* eslint-disable-next-line */}
        <button onClick={this.stopRecording} type="button" style={{ width: 30, height: 30 }}>◼</button>
        <button style={{ width: 60, height: 30 }}><a href={this.state.src} download="Blah.webm">⬇</a></button>
      </div>
    );
  }
}

export default Audio;





























// import DrawArea from './components/DrawArea'

// class Cover extends Component {

//     constructor() {
//         super();
//         this.state = {
//             imgWidth: 800,
//             showCanvas: false,
//             canvasWidth: 800,
//             canvasHeight: 800
//         }
//     }



//     toggleCanvas = () => {
//         const boundingRect = this.refs.coverImg.getBoundingClientRect();
//         this.setState({ showCanvas: !this.state.showCanvas, canvasWidth: boundingRect.right - boundingRect.left, canvasHeight: boundingRect.bottom - boundingRect.top });
//         console.log(this.state);
//     }

//     // relativeCoordinatesForEvent(mouseEvent) {
//     //     const boundingRect = this.refs.coverImg.getBoundingClientRect();

//     //     if (mouseEvent.clientX > boundingRect.right || mouseEvent.clientX < boundingRect.left || mouseEvent.clientY > boundingRect.bottom || mouseEvent.clientY < boundingRect.top) {
//     //         console.log('out of canvas, clicking button?')
//     //         return null;
//     //     } else {
//     //         // console.log(relativeX, relativeY)
//     //     }

//     //     return {
//     //         x: mouseEvent.clientX,
//     //         y: mouseEvent.clientY,
//     //     };
//     // }

//     render() {
//         return (
//             <div>
//                 <div>
//                     <img ref='coverImg' width={this.state.imgWidth} src='./asset/cave.jpg' alt='./asset/cave.jpg' style={{ zIndex: 0, position: 'absolute' }} />
//                     {this.state.showCanvas && <DrawArea canvasWidth={this.state.canvasWidth} canvasHeight={this.state.canvasHeight} />}
//                     {/* applied style from css -> css file overrides inline style! */}
//                 </div>
//                 <button onClick={this.toggleCanvas} style={{zIndex: 200, position: 'relative'}}>{this.state.showCanvas ? 'hide' : 'show'}</button>
//             </div>
//         )
//     }



// }
// export default Cover;