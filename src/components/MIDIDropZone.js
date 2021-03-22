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
            const playlistIndex = this.props.id2index[item.id];
            const buttonID = this.index2idMIDI(playlistIndex);
            if (this.props.selectedIndex.includes(playlistIndex)) {
                this.bgColor[playlistIndex] = 'purple';
                // console.log(`[MIDIDropzone] playlist index: ${playlistIndex} \nbutton id: ${buttonID} \npurple`);
            } else if (item.name) {
                this.bgColor[playlistIndex] = 'yellow';
                // console.log(`[MIDIDropzone] playlist index: ${playlistIndex} \nbutton id: ${buttonID} \nyellow`);
            } else {
                this.bgColor[playlistIndex] = 'transparent';
            }
        });
        // console.log(this.bgColor);

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
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(16)]} midiID={16} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(17)]} midiID={17} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(18)]} midiID={18} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(19)]} midiID={19} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(20)]} midiID={20} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(21)]} midiID={21} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(22)]} midiID={22} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(23)]} midiID={23} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                    </div>
                    <div className='midirow-3' style={{ display: 'flex' }}>
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(32)]} midiID={32} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(33)]} midiID={33} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(34)]} midiID={34} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(35)]} midiID={35} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(36)]} midiID={36} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(37)]} midiID={37} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(38)]} midiID={38} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(39)]} midiID={39} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                    </div>
                    <div className='midirow-4' style={{ display: 'flex' }}>
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(48)]} midiID={48} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(49)]} midiID={49} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(50)]} midiID={50} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(51)]} midiID={51} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(52)]} midiID={52} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(53)]} midiID={53} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(54)]} midiID={54} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(55)]} midiID={55} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                    </div>
                    <div className='midirow-5' style={{ display: 'flex' }}>
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(64)]} midiID={64} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(65)]} midiID={65} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(66)]} midiID={66} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(67)]} midiID={67} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(68)]} midiID={68} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(69)]} midiID={69} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(70)]} midiID={70} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(71)]} midiID={71} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                    </div>
                    <div className='midirow-6' style={{ display: 'flex' }}>
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(80)]} midiID={80} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(81)]} midiID={81} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(82)]} midiID={82} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(83)]} midiID={83} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(84)]} midiID={84} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(85)]} midiID={85} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(86)]} midiID={86} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(87)]} midiID={87} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                    </div>
                    <div className='midirow-7' style={{ display: 'flex' }}>
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(96)]} midiID={96} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(97)]} midiID={97} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(98)]} midiID={98} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(99)]} midiID={99} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(100)]} midiID={100} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(101)]} midiID={101} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(102)]} midiID={102} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(103)]} midiID={103} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                    </div>
                    <div className='midirow-8' style={{ display: 'flex' }}>
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(112)]} midiID={112} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(113)]} midiID={113} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(114)]} midiID={114} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(115)]} midiID={115} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(116)]} midiID={116} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(117)]} midiID={117} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(118)]} midiID={118} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
                        <DragAndDrop className={this.bgColor[this.id2indexMIDI(119)]} midiID={119} handleFileDropFN={this.props.handleFileDropFN} handleURLDropFN={this.props.handleURLDropFN} />
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