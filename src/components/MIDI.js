import React, { Component } from 'react';

class MIDI extends Component {

    state = {inputs: [], outputs: []};

    componentDidMount() {
        if (!("requestMIDIAccess" in navigator)) {
            console.log('browser does not support WebMIDI');
        }

        console.log('haha');
        navigator.requestMIDIAccess()
            .then((access) => {

                // Get lists of available MIDI controllers
                const inputs = access.inputs;
                const outputs = access.outputs;
                console.log(inputs);  // MIDIInputMap {size: 1}
                

                inputs.forEach((midiInput) => {
                    midiInput.onmidimessage = this.onMIDIMessage;
                    let stateIn = this.state.inputs;
                    stateIn.push(midiInput);
                    this.setState({inputs: stateIn});
                })

                outputs.forEach((midiOutput) => {
                    console.log(`FOUND output: ${midiOutput.name}`);
                    let stateOut = this.state.outputs;
                    stateOut.push(midiOutput);
                    this.setState({outputs: stateOut});
                })

                console.log('all inputs:', this.state.inputs);
                console.log('all outputs:', this.state.outputs);

                // all inputs: 
                //     [MIDIInput]
                //     0: MIDIInput
                //     connection: "open"
                //     id: "1957052217"
                //     manufacturer: "MIDIPLUS"
                //     name: "SmartPAD"
                //     onmidimessage: message => { console.log(message.data); }
                //     onstatechange: null
                //     state: "connected"
                //     type: "input"
                //     version: ""
            });

    }

    onMIDIMessage = (message) => {
        console.log(message.data);
    }

    sendOutput = () => {
        const msg = [144, 64, 1];
        this.state.outputs[0].send(msg);
        console.log('sent', msg);
    }

    render () {
        return (
            <button onClick={this.sendOutput}>click me</button>
        )
    }
}

export default MIDI;