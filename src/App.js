// ❗️❗️❗️LAST WORKING MIDI TEST VER: CHECK COMMIT b952d1b0ca❗️❗️❗️


/** WHEN TO USE APP
 * must not connect with midi controller
 * playlist is appendable
 */

import React, { Component } from 'react';
import Draggable from 'react-draggable';
import Playlist from './components/Playlist';
import Preview from './components/Preview';
import DragAndDrop from './components/DragAndDrop';
import GlobalDrawArea from './components/GlobalDrawArea';
import Recorder from './components/Recorder';
import HotButton from './components/HotButton';
import Hotkeys from 'react-hot-keys';
import axios from 'axios';
import SideNav from './components/SideNav';

const API_KEY = 'AIzaSyCou-4kz6C3Cu9HJytXcYR9Ax3r3JHA1GI';

class App extends Component {

	constructor(props) {
		super(props);
		// should also have 64 sparekeys @deprecated
		// this.spareKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'];  // key assignment follows sort result; 23

		// desktop
		// let data = JSON.parse(localStorage.getItem('files'));
		// if (!data) {
		// 	data = [{ id: 10, name: 'img', url: './asset/cave.jpg', type: 'img' },
		// 	{ id: 20, name: 'av', url: './asset/JavaScript.mp4', type: 'av' },
		// 	{ id: 30, name: 'txt', url: './asset/hiya.md', type: 'md', text: 'hiya' }]
		// }

		// web 
		const data = [{ id: 10, name: 'cave', url: './asset/cave.jpg', type: 'img' },
		{ id: 20, name: 'vid', url: './asset/JavaScript.mp4', type: 'av' },
		{ id: 100, name: 'tall', url: './asset/tall.png', type: 'img' },
		// { id: 101, name: 'cave', url: './asset/cave.jpg', type: 'img' },
		// { id: 102, name: 'cave', url: './asset/cave.jpg', type: 'img' },
		// { id: 103, name: 'cave', url: './asset/cave.jpg', type: 'img' },
		// { id: 104, name: 'cave', url: './asset/cave.jpg', type: 'img' },
		// { id: 105, name: 'cave', url: './asset/cave.jpg', type: 'img' },
		// { id: 106, name: 'cave', url: './asset/cave.jpg', type: 'img' },
		// { id: 107, name: 'cave', url: './asset/cave.jpg', type: 'img' },
		{ id: 30, name: 'hiya', url: './asset/hiya.md', type: 'md', text: 'hiya' }]

		this.state = {
			data: data || [],
			selectedIndex: [],
			id2index: { 10: 0, 20: 1, 100: 2, 30: 3 },
			index2id: { 0: 10, 1: 20, 2: 100, 3: 30 },
			showList: true,
			listView: 'list',
			showZone: true,
			showGlobalCanvas: false,
			showAudio: true,
			nextSpare: data.length,
		}

		console.log('===== START =====', this.state);
	}



	/* DROPZONE */
	/** @callback [called in dropzone handleDrop] */
	addFiles = (files) => {
		let data = this.state.data;
		let len = this.state.data.length;
		for (var i = 0; i < files.length; i++) {
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
			data.push(newData);
			len += 1
		}
		localStorage.setItem('files', JSON.stringify(data));
		this.setState({ data: data });
	}

	/** @callback [called in dropzone handleDrop] */
	addURL = (url) => {
		const youtubeID = url.split('=')[1];
		axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${youtubeID}&key=${API_KEY}&part=snippet`)
			.then((response) => {
				const youtubeTitle = response.data.items[0].snippet.localized.title;
				console.log('[addURL] YouTube Title:', youtubeTitle);
				let data = this.state.data;
				data.push({ id: data.length, name: youtubeTitle, url: url, type: 'av' });
				localStorage.setItem('files', JSON.stringify(data));
				this.setState({ data: data });
			})
	}

	clearLS = (keyName, e, handle) => {
		if (e) { console.log('[clearLS:Hotkeys]', keyName, e, handle); }
		localStorage.clear();
		this.setState({ data: [], selectedIndex: [] })
	}

	deleteFromLS = id => event => {
		if (this.state.selectedIndex.length > 0) {
			console.log('[deleteFromLS] disabled when showing preview!')
		} else {
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
			data.splice(index, 1);
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

	// logic bug: this one can never remove some file from preview
	// 而且没啥用
	// @deprecated
	changeSelection2 = (keyName, e, handle) => {
		console.log('[changeSelection2]', keyName);
		// is the combination of "select" & "bring to front" thru hotkeys
		const clickedIndex = this.spareKeys.indexOf(keyName);
		const clickedID = this.state.index2id[clickedIndex];
		// simulate clicking twice
		// first remove from preview, then displaying again
		const loops = this.state.selectedIndex.includes(clickedIndex) ? 2 : 1;
		let oldSelectedIndex = [...this.state.selectedIndex];
		let selectedID;
		let selectedIndex;
		for (var loop = 0; loop < loops; loop++) {
			selectedIndex = [...oldSelectedIndex];
			selectedID = [];
			selectedIndex.forEach((index, i) => {
				selectedID.push(this.state.index2id[index]);
			})
			// only keeps the "with shift key" scenario
			if (!selectedID.includes(clickedID)) {
				selectedIndex.push(clickedIndex);
			} else {
				selectedIndex.splice(selectedIndex.indexOf(clickedIndex), 1);
			}
			oldSelectedIndex = [...selectedIndex];
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
				{/* {this.state.data.slice(0, 8).map((item, i) => {
					return (
						<Hotkeys onKeyDown={this.changeSelection2} keyName={this.spareKeys[i]} />
					)
				})} */}
				{/* <SideNav /> */}

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

					<div className='dropzone'>
						<Drag>
							{this.state.showZone && <DragAndDrop handleFileDrop={this.addFiles} handleURLDrop={this.addURL} />}
							<HandleButton />
							<HotButton keyName="shift+z" buttonClass="action" actionFN={this.toggleZonge}>{this.state.showZone ? 'HIDE' : 'DROPZONE'}</HotButton>
						</Drag>
					</div>

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
						// changeOrderFN={this.changeOrder}
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