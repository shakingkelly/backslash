import React, { Component } from 'react';
import DragAndDrop from './DragAndDrop';


// data needs to be within 64 files
// using MIDI button to assign need to keep file match index in data array
class MIDIDropZone extends Component {

    bgColor = Array(64).fill('transparent');
    id2indexMIDI = id => { return Math.floor(id / 16) * 8 + id % 16; }
    index2idMIDI = index => { return Math.floor(index / 8) * 16 + index % 8; } // midiID <=> button index/pos


    render() {
        this.props.data.forEach(item => {
            if (this.props.selectedIndex.includes(this.id2indexMIDI(item.id))) {
                this.bgColor[this.id2indexMIDI(item.id)] = 'purple';
            } else if (item.name) {
                this.bgColor[this.id2indexMIDI(item.id)] = 'yellow';
            }
        });
        console.log(this.bgColor);

        // this.bgColor[this.id2indexMIDI(0)]

        return (
            <div className="midi-controller" style={{border: 'solid red 4px'}}>
                <div className='midi-matrix'>
                    <div className='midirow-1' style={{ display: 'flex' }}>
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(0)]} midiID={0} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(1)]} midiID={1} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(2)]} midiID={2} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(3)]} midiID={3} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(4)]} midiID={4} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(5)]} midiID={5} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(6)]} midiID={6} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(7)]} midiID={7} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                    </div>
                    <div className='midirow-2' style={{ display: 'flex' }}>
                        <DragAndDrop midiID={16} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={17} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={18} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={19} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={20} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={21} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={22} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={23} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                    </div>
                    <div className='midirow-3' style={{ display: 'flex' }}>
                        <DragAndDrop midiID={32} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={33} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={34} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={35} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={36} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={37} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={38} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={39} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                    </div>
                    <div className='midirow-4' style={{ display: 'flex' }}>
                        <DragAndDrop midiID={48} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={49} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={50} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={51} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={52} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={53} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={54} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={55} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                    </div>
                    <div className='midirow-5' style={{ display: 'flex' }}>
                        <DragAndDrop midiID={64} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={65} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={66} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={67} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={68} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={69} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={70} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={71} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                    </div>
                    <div className='midirow-6' style={{ display: 'flex' }}>
                        <DragAndDrop midiID={80} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={81} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={82} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={83} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={84} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={85} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={86} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={87} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                    </div>
                    <div className='midirow-7' style={{ display: 'flex' }}>
                        <DragAndDrop midiID={96} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={97} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={98} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={99} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={100} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={101} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={102} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={103} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                    </div>
                    <div className='midirow-8' style={{ display: 'flex' }}>
                        <DragAndDrop midiID={112} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={113} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={114} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={115} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={116} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={117} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={118} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop midiID={119} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                    </div>
                </div>
                <div className="func-btns" style={{display: 'flex'}}>
                    <button style={{height: '50px', width: '50px', borderRadius: '50%', backgroundColor: 'red', margin: '6px'}}></button>
                    <button style={{height: '50px', width: '50px', borderRadius: '50%', backgroundColor: 'red', margin: '6px'}}></button>
                    <button style={{height: '50px', width: '50px', borderRadius: '50%', backgroundColor: 'red', margin: '6px'}}></button>
                </div>
            </div>

        )
    }


}

export default MIDIDropZone;