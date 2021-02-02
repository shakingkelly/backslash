const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let analyser = audioCtx.createAnalyser();

const AudioContext  = {

  getAudioContext() {
    return audioCtx;
  },

  getAnalyser() {
    return analyser;
  },

  resetAnalyser() {
    analyser = audioCtx.createAnalyser();
  },

  // decodeAudioData() {
  //   audioCtx.decodeAudioData(audioData).then(function(decodedData) {
  //     // use the decoded data here
  //   });
  // }

}

export default AudioContext;






// import React, { Component } from 'react';
// import { ReactMic } from 'react-mic';

// class Audio extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       record: false,
//       src: '',
//       width: 120,
//       height: 60
//     }
//   }

//   startRecording = () => {
//     this.setState({ record: true });
//   }

//   stopRecording = () => {
//     this.setState({ record: false });
//   }

//   onData(recordedBlob) {
//     // console.log('chunk of real-time data is: ', recordedBlob);
//   }

//   onStop(recordedBlob) {
//     console.log('[Audio:onStop] recordedBlob is: ', recordedBlob.blobURL);
//     const url = URL.createObjectURL(recordedBlob.blob);
//     this.setState({ src: url });
//   }

//   render() {
//     return (
//       <div>
//         <div>
//           <ReactMic
//             record={this.state.record}
//             className="sound-wave"
//             onStop={data => this.onStop(data)}
//             onData={this.onData}
//             strokeColor="red"
//             backgroundColor="black"
//             width={this.state.width}
//             height={this.state.height} />
//         </div>
//         <button className="action" onClick={this.startRecording}>Start</button>
//         <button className="action" onClick={this.stopRecording}>Stop</button>
//         <div><button className="files"><a href={this.state.src} download="Blah.webm">Download</a></button></div>
        
//       </div>
//     );
//   }
// }

// export default Audio;
