import React, { Component } from 'react';
import App from './App';
import AppMIDI from './AppMIDI';
import SideNav from './components/SideNav';

class AppAll extends Component {

    constructor() {
        super();
        this.state = { hasMIDI: undefined, useMIDI: true };
    }

    componentDidMount() {
        if (!("requestMIDIAccess" in navigator)) {
            console.log('Browser does not support WebMIDI');
        } else {
            navigator.requestMIDIAccess()
                .then((access) => {
                    const inputs = access.inputs;
                    const outputs = access.outputs;
                    // console.log(`inputs: ${inputs}; outputs: ${outputs}`);
                    if (inputs.size > 0 && outputs.size > 0) {
                        console.log('set midi true');
                        this.setState({ hasMIDI: true });
                    } else {
                        console.log('set midi false');
                        this.setState({ hasMIDI: false });
                    }
                    console.log('mount:', this.state);
                    inputs.forEach((midiInput) => {
                        console.log(`inputs: ${midiInput.name}`);
                    })
                    outputs.forEach((midiOutput) => {
                        console.log(`outputs: ${midiOutput.name}`);
                    })
                });
        }
    }

    toggleMIDI = () => {
        if (!this.state.loading && this.state.hasMIDI === true) {
            this.setState({ useMIDI: !this.state.useMIDI }, () => { console.log('toggleMIDI:', this.state) });
            console.log('toggleMIDI:', this.state);
        }
    }

    render() {

        console.log('render app:', this.state);
        console.log((this.state.hasMIDI && this.state.useMIDI) ? '***** USING APPMIDI *****' : '***** USING APP *****');

        if (typeof this.state.hasMIDI === 'undefined') {
            return (
                <h2 style={{color: 'white'}}>debug 1</h2>
            );
        }

        return (
            <div>
                {this.state.hasMIDI === true ? <SideNav toggleMIDIFN={this.toggleMIDI} useMIDI={this.state.useMIDI}/>:null}
                {(this.state.hasMIDI === true && this.state.useMIDI === true) ? <AppMIDI /> : <App />}
            </div>
        );
        


    }
}

export default AppAll;