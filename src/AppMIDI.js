
/** WHEN TO USE APP_MIDI
 * must connect with midi controller
 * user can use both mouse and midi 
 * playlist is grid view only, shows fixed 64 entries
 */


import React, { Component } from 'react';
import Draggable from 'react-draggable';
import Playlist from './components/Playlist';
import Preview from './components/Preview';
import DragAndDrop from './components/DragAndDrop';
import GlobalDrawArea from './components/GlobalDrawArea';
import Recorder from './components/Recorder';
import HotButton from './components/HotButton';
import axios from 'axios';
import MIDIDropZone from './components/MIDIDropZone';

const API_KEY = 'AIzaSyCou-4kz6C3Cu9HJytXcYR9Ax3r3JHA1GI';

class AppMIDI extends Component {

    constructor(props) {
        super(props);

        // web 
        const newData = [];
        // by introducing MIDI, fix data size at max 64
        for (let i = 0; i < 8; i++) {
            for (let j = i * 16; j < i * 16 + 8; j++) {
                newData.push({ id: j });
            }
        }

        // const data = [...emptyData];
        // data[0] = { id: 0, name: 'cave', url: './asset/cave.jpg', type: 'img' };
        // data[1] = { id: 1, name: 'vid', url: './asset/JavaScript.mp4', type: 'av' };
        // data[2] = { id: 2, name: 'tall', url: './asset/tall.png', type: 'img' };
        // data[3] = { id: 3, name: 'hiya', url: './asset/hiya.md', type: 'md', text: 'hiya' };

        // desktop
        // change infinite appending list to Array(64)
        let data = JSON.parse(localStorage.getItem('files'));
        if (data) {
            let ptData = 0;
            for (let ptNewData = 0; ptNewData < newData.length; ptNewData++) {
                if (ptData >= data.length) {
                    break;
                }
                if (newData[ptNewData].id === data[ptData].id) {
                    newData[ptNewData] = { ...data[ptData] };
                    ptData++;
                }
            }
        }

        console.log('[AppMIDI newData]', newData);

        // there's only one type of ID which is midi button id
        // two types of index: 
        // 1. order in playlist: almost all func logic 
        // 2. fixed order in button list: only when need data/LED change
        this.state = {
            data: newData,
            selectedIndex: [],  // playlist index/order
            id2index: { 0: 0, 1: 1, 2: 2, 3: 3 },
            index2id: { 0: 0, 1: 1, 2: 2, 3: 3 }, // midiID <=> playlist index
            showList: true,
            listView: 'grid',  // grid only 
            showZone: true,
            showGlobalCanvas: false,
            showAudio: true,
            inputs: [],
            outputs: [],
            midiMode: false,
            showMIDI: true
        }

        this.availableIDs = [0, 1, 2, 3, 4, 5, 6, 7,
            16, 17, 18, 19, 20, 21, 22, 23,
            32, 33, 34, 35, 36, 37, 38, 39,
            48, 49, 50, 51, 52, 53, 54, 55,
            64, 65, 66, 67, 68, 69, 70, 71,
            80, 81, 82, 83, 84, 85, 86, 87,
            6, 97, 98, 99, 100, 101, 102, 103,
            112, 113, 114, 115, 116, 117, 118, 119];
        this.id2indexMIDI = id => { return Math.floor(id / 16) * 8 + id % 16; }
        this.index2idMIDI = index => { return Math.floor(index / 8) * 16 + index % 8; } // midiID <=> button index/pos
        console.log('===== START =====', this.state);
    }


    componentDidMount() {
        if (!("requestMIDIAccess" in navigator)) {
            console.log('Browser does not support WebMIDI');
        } else {
            this.setState({ midiMode: true });
            navigator.requestMIDIAccess()
                .then((access) => {
                    // Get lists of available MIDI controllers
                    const inputs = access.inputs;
                    const outputs = access.outputs;
                    inputs.forEach((midiInput) => {
                        midiInput.onmidimessage = this.onMIDIMessage;
                        this.setState({ inputs: this.state.inputs.concat(midiInput) });
                    })
                    outputs.forEach((midiOutput) => {
                        this.setState({ outputs: this.state.outputs.concat(midiOutput) });
                    })
                    console.log('MIDI inputs:', this.state.inputs);
                    console.log('MIDI outputs:', this.state.outputs);

                    // test: turn on LED of the cells associated with the sample files
                    const output = this.state.outputs[0];
                    // output.send([144, 0, 17]);
                    // output.send([144, 1, 17]);
                    // output.send([144, 2, 17]);
                    // output.send([144, 3, 17]);
                    // this.availableIDs.shift();
                    // this.availableIDs.shift();
                    // this.availableIDs.shift();
                    // this.availableIDs.shift();
                    this.state.data.forEach((item) => {
                        output.send([128, item.id, 17]);
                        if (item.name) {
                            output.send([144, item.id, 17]);
                        }
                        const availableIndex = this.availableIDs.indexOf(item.id);
                        if (availableIndex !== -1) {
                            this.availableIDs.splice(availableIndex, 1);
                        }
                    })
                });
        }
    }

    onMIDIMessage = (message) => {
        const type = message.data[0];
        const buttonID = message.data[1];
        const dataIndex = this.id2indexMIDI(buttonID);
        if (this.state.data[dataIndex].name && type === 144) {
            // disable empty cell && ignore 128
            this.changeSelectionMIDI(buttonID);
        }
    }

    /** @callback [called in dropzone handleDropFN] */
    // MIDI, only add single file in one drag
    addFileMIDI = (midiID, files) => {
        const file = files[0];
        let data = this.state.data;
        let type = '';
        let newData = { id: midiID, name: file.name, url: file.path, type: type };
        if (file.name.endsWith(".jpg") || file.name.endsWith(".png") || file.name.endsWith(".gif") || file.name.endsWith(".bmp")) {
            newData.type = 'img';
        } else if (file.name.endsWith(".md") || file.name.endsWith(".txt")) {
            newData.type = 'md';
            file.text().then(result => newData.text = result);
        } else if (file.name.endsWith(".mp3") || file.name.endsWith(".mp4") || file.name.endsWith(".webm") || file.name.endsWith(".wav") || file.name.endsWith(".mov") || file.name.endsWith(".m4v")) {
            newData.type = 'av';
        } else {
            console.log('[addFileMIDI] file type not supported!');
        }
        // turn on LED of the cells associated with the added file
        this.state.outputs[0].send([128, midiID, 17]);
        this.state.outputs[0].send([144, midiID, 17]);
        // if cell is previously empty, remove id from available list
        const pos = this.availableIDs.indexOf(midiID);
        if (pos !== -1) {
            this.availableIDs.slice(pos, 1);
        }
        // if cell if previously occupied, overwrite with new file
        data[this.id2indexMIDI(midiID)] = newData;
        console.log('[addFileMIDI]', midiID, data[this.id2indexMIDI(midiID)]);
        // localStorage.setItem('files', JSON.stringify(data));
        // compress Array(64)
        let compressedData = [];
        data.forEach((item) => {
            if (item.name) {
                compressedData.push(item);
            }
        })
        // sort by id 
        compressedData.sort(function (first, second) {
            return first.id - second.id;
        });
        console.log('compressedData:', compressedData);
        localStorage.setItem('files', JSON.stringify(compressedData));
        this.setState({ data: data });
    }

    /** @callback [called in dropzone handleDrop] */
    addURLMIDI = (midiID, url) => {
        console.log('[addURLMIDI] url:', url);
        const youtubeID = url.split('=')[1];
        axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${youtubeID}&key=${API_KEY}&part=snippet`)
            .then((response) => {
                const youtubeTitle = response.data.items[0].snippet.localized.title;
                console.log('[addURL] YouTube Title:', youtubeTitle);
                this.state.outputs[0].send([128, midiID, 17]);
                this.state.outputs[0].send([144, midiID, 17]);
                const pos = this.availableIDs.indexOf(midiID);
                if (pos !== -1) {
                    this.availableIDs.slice(pos, 1);
                }
                let data = this.state.data;
                data[this.id2indexMIDI(midiID)] = { id: midiID, name: youtubeTitle, url: url, type: 'av' };
                // localStorage.setItem('files', JSON.stringify(data));
                // compress Array(64)
                let compressedData = [];
                data.forEach((item) => {
                    if (item.name) {
                        compressedData.push(item);
                    }
                })
                // sort by id 
                compressedData.sort(function (first, second) {
                    return first.id - second.id;
                });
                console.log('compressedData:', compressedData);
                localStorage.setItem('files', JSON.stringify(compressedData));
                this.setState({ data: data });
            })
    }

    clearLS = (keyName, e, handle) => {
        if (e) { console.log('[clearLS:Hotkeys]', keyName, e, handle); }
        const emptyData = [];
        for (let i = 0; i < 8; i++) {
            for (let j = i * 16; j < i * 16 + 8; j++) {
                emptyData.push({ id: j });
                this.state.outputs[0].send([128, j, 1]);
            }
        }
        localStorage.clear();
        // this.setState({ data: emptyData, selectedIndex: [] })
        this.setState({ data: [], selectedIndex: [] });
    }

    toggleZone = (keyName, e, handle) => {
        if (e) { console.log('[toggleZone:Hotkeys]', keyName, e, handle); }
        this.setState({ showZone: !this.state.showZone })
    }
    /* END DROPZONE */


    /* PLAYLIST */
    // deprecate shift key
    // click once, add to preview; click again, remove from preview 
    changeSelection = clickedDataID => event => {
        const clickedIndex = this.state.id2index[clickedDataID];  // data index = playlist index
        const buttonID = this.index2idMIDI(clickedIndex);

        let selectedIndex = [...this.state.selectedIndex];
        let selectedID = [];

        console.log(`[changeSelection] selected index: ${selectedIndex}`);
        console.log(`clicked: ${this.state.data[clickedIndex].name} \ndataID: ${clickedDataID} \ndata index = playlist index: ${clickedIndex} \nbutton id: ${buttonID}`);

        selectedIndex.forEach((index, i) => {
            selectedID.push(this.state.index2id[index]);
        })
        if (!selectedID.includes(clickedDataID)) {
            selectedIndex.push(clickedIndex);
            this.state.outputs[0].send([128, buttonID, 1]);
            this.state.outputs[0].send([144, buttonID, 1]);
        } else {
            selectedIndex.splice(selectedIndex.indexOf(clickedIndex), 1);
            this.state.outputs[0].send([128, buttonID, 1]);
            // if the cell is associated with a file
            // update: it has to. empty cell doesn't have onclick (in playlist), so won't trigger this function
            this.state.outputs[0].send([144, buttonID, 17]);
        }
        this.setState({ selectedIndex: [...selectedIndex] }, () => { /*console.log('[changeSelection:callback]', this.state.selectedIndex)*/ }); // so only after render, it reset the states
    }

    changeSelectionMIDI = midiID => {
        const clickedIndex = this.state.id2index[midiID];
        let selectedIndex = [...this.state.selectedIndex];
        let selectedID = [];
        selectedIndex.forEach((index, i) => {
            selectedID.push(this.state.index2id[index]);
        })
        if (!selectedID.includes(midiID)) {
            selectedIndex.push(clickedIndex);
            this.state.outputs[0].send([128, midiID, 1]);
            this.state.outputs[0].send([144, midiID, 1]);
        } else {
            selectedIndex.splice(selectedIndex.indexOf(clickedIndex), 1);
            this.state.outputs[0].send([128, midiID, 1]);
            // if the cell is associated with a file
            if (this.state.data[clickedIndex].name) {
                this.state.outputs[0].send([144, midiID, 17]);
            }
        }
        this.setState({ selectedIndex: [...selectedIndex] });
    }

    updateSortable = (newState) => {
        let newId2index = {};
        let newIndex2id = {};
        let newSelectedIndex = [];
        let selectedId = [];
        // get currently selected items' id
        this.state.selectedIndex.forEach((selected, i) => {
            selectedId.push(this.state.index2id[selected]);
        })
        // update the relationship dicts
        newState.forEach((item, index) => {
            newId2index[item.id] = index;
            newIndex2id[index] = item.id;
        })
        // map current selected item ids to new index 
        selectedId.forEach((selected, i) => {
            newSelectedIndex.push(newId2index[selected]);
        })
        // resetLED, but need to wait midi device to load
        this.setState({ data: newState, id2index: newId2index, index2id: newIndex2id, selectedIndex: newSelectedIndex });
    }

    resetLED = () => {
        console.log('selectedIndex', this.state.selectedIndex);
        // console.log(this.state.data);  // data dict order changed (should be in update sortable), data index = playlist index
        // console.log(this.state.index2id);
        // console.log(this.state.id2index);
        // turn off all lights
        const output = this.state.outputs[0];
        for (let i = 0; i < 8; i++) {
            for (let j = i * 16; j < i * 16 + 8; j++) {
                const dataID = j;
                const dataIndex = this.state.id2index[dataID];
                const playlistIndex = this.state.id2index[dataID];
                const buttonID = this.index2idMIDI(playlistIndex);
                output.send([128, buttonID, 1]);
                if (this.state.data[dataIndex].name) {
                    if (this.state.selectedIndex.indexOf(playlistIndex) !== -1) {
                        // cell has file and selected
                        output.send([144, buttonID, 1]);
                        console.log(`turn on: ${this.state.data[dataIndex].name} \ndata id: ${j} \ndata index: ${dataIndex} \nplaylist index: ${playlistIndex} \nbutton id: ${buttonID}`);
                    } else {
                        // cell has file but not selected
                        output.send([144, buttonID, 17]);
                        console.log(`turn off: ${this.state.data[dataIndex].name} \ndata id: ${j} \ndata index: ${dataIndex} \nplaylist index: ${playlistIndex} \nbutton id: ${buttonID}`);
                    }
                }
            }
        }
    }

    toggleList = (keyName, e, handle) => {
        if (e) { console.log('[toggleList:Hotkeys]', keyName, e, handle); }
        this.setState({ showList: !this.state.showList });
    }

    toggleMIDIArea = () => {
        this.setState({ showMIDI: !this.state.showMIDI });
    }
    /* END PLAYLIST */


    /* PREVIEW */
    clearPreview = (keyName, e, handle) => {
        if (e) { console.log('[clearPreview:Hotkeys]', keyName, e, handle); }
        for (let i = 0; i < 8; i++) {
            for (let j = i * 16; j < i * 16 + 8; j++) {
                const dataID = j;
                const dataIndex = this.state.id2index[dataID];
                const playlistIndex = this.state.id2index[dataID];
                const buttonID = this.index2idMIDI(playlistIndex);
                this.state.outputs[0].send([128, j, 1]);
                if (this.state.data[dataIndex].name) {
                    this.state.outputs[0].send([144, buttonID, 17]);
                }
            }
        }
        this.setState({ selectedIndex: [] });
    }

    toggleGlobalCanvas = (keyName, e, handle) => {
        if (e) { console.log('[toggleGlobalCanvas:Hotkeys]', keyName, e, handle); }
        this.setState({ showGlobalCanvas: !this.state.showGlobalCanvas });
    }

    /** @callback [passed to preview] */
    changeEditorFilename = (id, newFilename, newText) => {
        let data = this.state.data;
        data[this.state.id2index[id]].name = newFilename;
        data[this.state.id2index[id]].text = newText;
        this.setState({ data: data });
    }

    /** @todo [should be included in changeSelection, prev, next if img] */
    /** @callback [passed to preview] */
    saveCanvas = (id, undolines) => {
        let data = this.state.data;
        data[this.state.id2index[id]].undolines = undolines;
        this.setState({ data: data });
    }

    /** @callback [passed to preview] */
    savePosition = (id, x, y) => {
        // called in Rnd onDragStop callback
        let data = this.state.data;
        data[this.state.id2index[id]].position = { x, y };
        this.setState({ data: data });
    }
    /* END PREVIEW */


    render() {
        return (
            /* CONTAINER */
            <div>
                {/* <SideNav />  */}
                <button onClick={this.resetLED}>resetLED</button>
                <HotButton keyName="shift+alt+c" buttonClass="action" actionFN={this.toggleGlobalCanvas}>GLOBAL CANVAS</HotButton>
                {this.state.showGlobalCanvas && <GlobalDrawArea canvasWidth={window.innerWidth} canvasHeight={window.innerHeight} />}

                {/* METADATA ROW */}
                <div className="metadata">

                    <div className='audio'>
                        <Drag>
                            <Recorder />
                            <HandleButton />
                        </Drag>
                    </div>

                    {this.state.midiMode
                        ?
                        <div>
                            <Drag>
                                {this.state.showMIDI && <MIDIDropZone handleFileDropFN={this.addFileMIDI} handleURLDropFN={this.addURLMIDI} data={this.state.data} selectedIndex={this.state.selectedIndex} id2index={this.state.id2index} />}
                                <HandleButton />
                                <button className="action" onClick={this.toggleMIDIArea}>{this.state.showMIDI ? 'HIDE' : 'MIDI Ctrl'}</button>
                            </Drag>
                        </div>
                        :
                        <div className='dropzone'>
                            <Drag>
                                {this.state.showZone && <DragAndDrop handleFileDrop={this.addFiles} handleURLDrop={this.addURL} />}
                                <HandleButton />
                                <HotButton keyName="shift+z" buttonClass="action" actionFN={this.toggleZonge}>{this.state.showZone ? 'HIDE' : 'DROPZONE'}</HotButton>
                            </Drag>
                        </div>
                    }


                    <div className='playlist'>
                        <Drag>
                            {
                                this.state.showList &&
                                <Playlist
                                    data={this.state.data}
                                    selectedIndex={this.state.selectedIndex}
                                    updated={this.updateSortable}
                                    clicked={this.changeSelection}
                                    clickDeleted={this.deleteFromLS}
                                    view={this.state.listView}
                                />
                            }
                            <HandleButton />
                            <HotButton keyName="shift+l" buttonClass="action" actionFN={this.toggleList}>{this.state.showList ? 'HIDE' : 'PLAYLIST'}</HotButton>
                            {this.state.showList && <HotButton keyName="ctrl+l" buttonClass="delete" actionFN={this.clearLS}>CLEAR</HotButton>}
                        </Drag>
                    </div>
                </div>

                {/* PREVIEWS */}
                <div className='preview'>
                    {
                        this.state.selectedIndex.length > 0 &&
                        <div>
                            <HotButton keyName="ctrl+p" buttonClass="delete" actionFN={this.clearPreview}>CLEAR</HotButton>
                        </div>
                    }
                    <Preview
                        data={this.state.data}
                        selectedIndex={this.state.selectedIndex}
                        changeEditorFilenameFN={this.changeEditorFilename}
                        saveCanvasFN={this.saveCanvas}
                        savePositionFN={this.savePosition}
                    // changeOrderFN={this.changeOrder}
                    />
                </div>
            </div>
        )
    }
}

export default AppMIDI;

const HandleButton = () => {
    return (
        <button className="handle"><span role="img" aria-label="handle emoji">🧲</span></button>
    )
}

const Drag = (props) => {
    return (
        <Draggable handle=".handle">
            <div>
                {props.children}
            </div>
        </Draggable>
    )
}