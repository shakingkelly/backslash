import React, { Component } from 'react';
import App from './App';
import AppMIDI from './AppMIDI';

class AppAll extends Component {

    constructor() {
        super();
        this.state = { midi: false };
    }

    componentDidMount() {
        const self = this;
        if (!("requestMIDIAccess" in navigator)) {
            console.log('Browser does not support WebMIDI');
        } else {
            navigator.requestMIDIAccess()
                .then((access) => {
                    const inputs = access.inputs;
                    const outputs = access.outputs;
                    if (inputs.length > 0 && outputs.length > 0) {
                        self.setState({ midi: true });
                    }
                    inputs.forEach((midiInput) => {
                        console.log(`inputs: ${midiInput.name}`);
                    })
                    outputs.forEach((midiOutput) => {
                        console.log(`outputs: ${midiOutput.name}`);
                    })
                });
        }
    }

    render() {
        console.log(this.state.midi ? '***** USING APPMIDI *****' : '***** USING APP *****');
        return (
            this.state.midi ? <AppMIDI /> : <App />
        );

    }
}

export default AppAll;