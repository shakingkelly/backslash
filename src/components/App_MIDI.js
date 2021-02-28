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

class App extends Component {

    constructor(props) {
        super(props);
        this.midiButtons = [0, 1, 2, 3, 4, 5, 6, 7,
            16, 17, 18, 19, 20, 21, 22, 23,
            32, 33, 34, 35, 36, 37, 38, 39,
            48, 49, 50, 51, 52, 53, 54, 55,
            64, 65, 66, 67, 68, 69, 70, 71,
            80, 81, 82, 83, 84, 85, 86, 87,
            6, 97, 98, 99, 100, 101, 102, 103,
            112, 113, 114, 115, 116, 117, 118, 119]; // 没用, 用available ids

        // desktop
        // let data = JSON.parse(localStorage.getItem('files'));
        // if (!data) {
        // 	data = [{ id: 10, name: 'img', url: './asset/cave.jpg', type: 'img' },
        // 	{ id: 20, name: 'av', url: './asset/JavaScript.mp4', type: 'av' },
        // 	{ id: 30, name: 'txt', url: './asset/hiya.md', type: 'md', text: 'hiya' }]
        // }

        // web 
        const data = [];
        // by introducing MIDI, fix data size at max 64
        for (let i = 0; i < 8; i++) {
            for (let j = i * 16; j < i * 16 + 8; j++) {
                // test
                // data.push({ id: j });
                data.push(null);
            }
        }
        data[0] = { id: 0, name: 'cave', url: './asset/cave.jpg', type: 'img' };
        data[1] = { id: 1, name: 'vid', url: './asset/JavaScript.mp4', type: 'av' };
        data[2] = { id: 2, name: 'tall', url: './asset/tall.png', type: 'img' };
        data[3] = { id: 3, name: 'hiya', url: './asset/hiya.md', type: 'md', text: 'hiya' };

        // there's only one type of ID which is midi button id
        // two types of index: 1. order in playlist, 2. fixed order in button list
        this.state = {
            // data: data || [],
            data: data || new Array(64),
            selectedIndex: [],  // index/order in playlist
            id2index: { 0: 0, 1: 1, 2: 2, 3: 3 },
            index2id: { 0: 0, 1: 1, 2: 2, 3: 3 }, // midiID & playlist index
            showList: true,
            listView: 'list',
            showZone: true,
            showGlobalCanvas: false,
            showAudio: true,
            nextSpare: data.length,
            inputs: [],
            outputs: [],
            midiMode: false
        }

        this.availableIDs = [...this.midiButtons];
        this.id2indexMIDI = id => { return Math.floor(id / 16) * 8 + id % 16; }
        this.index2idMIDI = index => { return Math.floor(index / 8) * 16 + index % 8; }
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
                    output.send([144, 0, 17]);
                    output.send([144, 1, 17]);
                    output.send([144, 2, 17]);
                    output.send([144, 3, 17]);
                    this.availableIDs.shift();
                    this.availableIDs.shift();
                    this.availableIDs.shift();
                    this.availableIDs.shift();
                });
        }
    }

    onMIDIMessage = (message) => {
        const type = message.data[0];
        const midiButton = message.data[1];
        if (type === 144) {
            // ignore 128
            const clickedIndex = this.midiButtons.indexOf(midiButton);
            const clickedID = this.state.index2id[clickedIndex];
            this.changeSelectionMIDI(clickedID);
        }
    }


    /* DROPZONE */

    // add files doesn't bind file to playlist ordering yet
    /** @callback [called in dropzone handleDrop] */
    addFiles = (files) => {
        let data = this.state.data;
        for (var i = 0; i < files.length; i++) {
            const nextAvailableID = this.availableIDs.shift();
            if (!nextAvailableID) {
                console.log('no vacancy!');
                break;
            }
            let type = '';
            let newData = { id: len, name: files[i].name, url: files[i].path, type: type };
            if (files[i].name.endsWith(".jpg") || files[i].name.endsWith(".png") || files[i].name.endsWith(".gif") || files[i].name.endsWith(".bmp")) {
                newData.type = 'img';
            } else if (files[i].name.endsWith(".md") || files[i].name.endsWith(".txt")) {
                newData.type = 'md';
                files[i].text().then(result => newData.text = result);
            } else if (files[i].name.endsWith(".mp3") || files[i].name.endsWith(".mp4") || files[i].name.endsWith(".webm") || files[i].name.endsWith(".wav") || files[i].name.endsWith(".mov") || files[i].name.endsWith(".m4v")) {
                newData.type = 'av';
            } else {
                console.log('[addFiles] file type not supported!');
                continue;
            }
            data[this.id2index(nextAvailableID)] = newData;
        }
        localStorage.setItem('files', JSON.stringify(data));
        this.setState({ data: data });
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
        data[this.id2index(midiID)] = newData;
        console.log('[addFileMIDI]', midiID, data[this.id2index(midiID)]);
        localStorage.setItem('files', JSON.stringify(data));
        this.setState({ data: data });
    }

    /** @callback [called in dropzone handleDrop] */
    addURL = (url) => {
        const nextAvailableID = this.availableIDs.shift();
        if (!nextAvailableID) {
            console.log('no vacancy!');
        } else {
            const youtubeID = url.split('=')[1];
            axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${youtubeID}&key=${API_KEY}&part=snippet`)
                .then((response) => {
                    const youtubeTitle = response.data.items[0].snippet.localized.title;
                    console.log('[addURL] YouTube Title:', youtubeTitle);
                    let data = this.state.data;
                    data[this.id2index(nextAvailableID)] = { id: data.length, name: youtubeTitle, url: url, type: 'av' };
                    localStorage.setItem('files', JSON.stringify(data));
                    this.setState({ data: data });
                })
        }
    }

    addURLMIDI = (midiID, url) => {
        this.state.outputs[0].send([128, midiID, 17]);
        this.state.outputs[0].send([144, midiID, 17]);
        const pos = this.availableIDs.indexOf(midiID);
        if (pos !== -1) {
            this.availableIDs.slice(pos, 1);
        }
        const youtubeID = url.split('=')[1];
        axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${youtubeID}&key=${API_KEY}&part=snippet`)
            .then((response) => {
                const youtubeTitle = response.data.items[0].snippet.localized.title;
                console.log('[addURL] YouTube Title:', youtubeTitle);
                let data = this.state.data;
                data[this.id2index(nextAvailableID)] = { id: data.length, name: youtubeTitle, url: url, type: 'av' };
                localStorage.setItem('files', JSON.stringify(data));
                this.setState({ data: data });
            })
    }

    clearLS = (keyName, e, handle) => {
        if (e) { console.log('[clearLS:Hotkeys]', keyName, e, handle); }
        localStorage.clear();
        this.setState({ data: new Array(64), selectedIndex: [] })
    }

    deleteFromLS = id => event => {
        if (this.state.selectedIndex.length > 0) {
            console.log('[deleteFromLS] disabled when showing preview!')
        } else {
            // here all is playlist index 
            let data = this.state.data;
            let id2index = this.state.id2index;
            let index2id = {};
            const index = id2index[id];
            delete id2index[id];
            for (var key in id2index) {
                if (id2index[key] > index) {
                    id2index[key]--;
                }
            }
            for (var key in id2index) {
                index2id[id2index[key]] = key;
            }
            // here is fixed button idex
            data[this.id2indexMIDI(id)] = null;
            this.setState({ data: data, id2index: id2index, index2id: index2id });
            localStorage.setItem('files', JSON.stringify(data));
        }
    }

    toggleZone = (keyName, e, handle) => {
        if (e) { console.log('[toggleZone:Hotkeys]', keyName, e, handle); }
        this.setState({ showZone: !this.state.showZone })
    }
    /* END DROPZONE */


    /* PLAYLIST */
    changeSelection = clickedID => event => {
        const clickedIndex = this.state.id2index[clickedID];
        let selectedIndex = [...this.state.selectedIndex];
        let selectedID = [];
        selectedIndex.forEach((index, i) => {
            selectedID.push(this.state.index2id[index]);
        })
        if (!selectedID.includes(clickedID)) {
            // if (event.shiftKey) {
            selectedIndex.push(clickedIndex);
            // } else {
            // 	selectedIndex = [clickedIndex];
            // }
        } else {
            // if (event.shiftKey) {
            selectedIndex.splice(selectedIndex.indexOf(clickedIndex), 1);
            // } else {
            // 	selectedIndex = [];
            // }
        }
        this.setState({ selectedIndex: [...selectedIndex] }, () => { /*console.log('[changeSelection:callback]', this.state.selectedIndex)*/ }); // so only after render, it reset the states
    }

    changeSelectionMIDI = clickedID => {
        const clickedIndex = this.state.id2index[clickedID];
        let selectedIndex = [...this.state.selectedIndex];
        let selectedID = [];
        selectedIndex.forEach((index, i) => {
            selectedID.push(this.state.index2id[index]);
        })
        if (!selectedID.includes(clickedID)) {
            selectedIndex.push(clickedIndex);
            this.state.outputs[0].send([128, this.midiButtons[clickedIndex], 1]);
            this.state.outputs[0].send([144, this.midiButtons[clickedIndex], 1]);
        } else {
            selectedIndex.splice(selectedIndex.indexOf(clickedIndex), 1);
            this.state.outputs[0].send([128, this.midiButtons[clickedIndex], 1]);
            // if the cell is associated with a file
            if (this.state.data[clickedIndex].name) {
                this.state.outputs[0].send([144, this.midiButtons[clickedIndex], 17]);
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
        this.setState({ data: newState, id2index: newId2index, index2id: newIndex2id, selectedIndex: newSelectedIndex });
    }

    toggleList = (keyName, e, handle) => {
        if (e) { console.log('[toggleList:Hotkeys]', keyName, e, handle); }
        this.setState({ showList: !this.state.showList });
    }

    toggleListView = () => {
        const view = this.state.listView;
        if (view === 'list') {
            this.setState({ listView: 'grid' });
        } else {
            this.setState({ listView: 'list' });
        }
    }
    /* END PLAYLIST */


    /* PREVIEW */
    prev = (keyName, e, handle) => {
        if (e) { console.log('[prev:Hotkeys]', keyName, e, handle); }
        if (this.state.selectedIndex.length === 1) {
            this.setState({ selectedIndex: this.state.selectedIndex[0] === 0 ? [this.state.data.length - 1] : [this.state.selectedIndex[0] - 1] });
        } else {
            console.log('[prev] disabled in multiselection!')
        }
    }
    next = (keyName, e, handle) => {
        if (e) { console.log('[next:Hotkeys]', keyName, e, handle); }
        if (this.state.selectedIndex.length === 1) {
            this.setState({ selectedIndex: this.state.selectedIndex[0] === this.state.data.length - 1 ? [0] : [this.state.selectedIndex[0] + 1] });
        } else {
            console.log('[next] disabled in multiselection!')
        }
    }

    clearPreview = (keyName, e, handle) => {
        if (e) { console.log('[clearPreview:Hotkeys]', keyName, e, handle); }
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

    changeOrder = clickedID => event => {
        // id, index doesn't change, dicts no change, only order changes, so could use index as id or vice versa
        // but order is not actually used in IAVMedia
        // so equivalent to deselect all then select them back in new order
        const clickedIndex = this.state.id2index[clickedID];
        let selectedIndex = [...this.state.selectedIndex];

        this.clearPreview();
        const indexOfClickedIndex = selectedIndex.indexOf(clickedIndex);
        selectedIndex.splice(indexOfClickedIndex, 1);
        selectedIndex.push(clickedIndex);
        this.setState({ selectedIndex: selectedIndex });
        console.log('[changeOrder]', selectedIndex);
    }
    /* END PREVIEW */

    /** @deprecated [audio component is not hide-able] */
    toggleAudio = (keyName, e, handle) => {
        if (e) { console.log('[toggleAudio]', keyName, e, handle); }
        this.setState({ showAudio: !this.state.showAudio });
    }



    render() {
        return (
            /* CONTAINER */
            <div>

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
                        <MIDIDropZone handleFileDropFN={this.addFileMIDI} />
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
                            {this.state.showList && <button className="action" onClick={this.toggleListView}>{this.state.listView === 'list' ? 'GRID' : 'LIST'}</button>}
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
                            <HotButton keyName="left" buttonClass="action" actionFN={this.prev}>PREV</HotButton>
                            <HotButton keyName="right" buttonClass="action" actionFN={this.next}>NEXT</HotButton>
                            <HotButton keyName="ctrl+p" buttonClass="delete" actionFN={this.clearPreview}>CLEAR</HotButton>
                        </div>
                    }
                    <Preview
                        data={this.state.data}
                        selectedIndex={this.state.selectedIndex}
                        changeEditorFilenameFN={this.changeEditorFilename}
                        saveCanvasFN={this.saveCanvas}
                        savePositionFN={this.savePosition}
                        changeOrderFN={this.changeOrder}
                    />
                </div>
            </div>
        )
    }
}

export default App;

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