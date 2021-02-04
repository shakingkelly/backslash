import React, { Component } from 'react';
import './App.css';
import Playlist from './components/Playlist';
import Preview from './components/Preview';
import DragAndDrop from './components/DragAndDrop';
import GlobalDrawArea from './components/GlobalDrawArea';
import Recorder from './components/Recorder';

import Draggable from 'react-draggable';
import Hotkeys from 'react-hot-keys';
import HotButton from './components/HotButton';

import axios from 'axios';
const API_KEY = 'AIzaSyCou-4kz6C3Cu9HJytXcYR9Ax3r3JHA1GI';

class App extends Component {

	constructor(props) {
		super(props);

		// desktop
		// let data = JSON.parse(localStorage.getItem('files'));
		// if (!data) {
		// 	data = [{ id: 10, name: 'img', url: './asset/cave.jpg', type: 'img', text: '' },
		// 	{ id: 20, name: 'av', url: './asset/JavaScript.mp4', type: 'av', text: '' },
		// 	{ id: 30, name: 'txt', url: './asset/hiya.md', type: 'md', text: 'hiya' }]
		// }

		// web 
		const data = [{ id: 10, name: 'cave', url: './asset/cave.jpg', type: 'img', text: '' },
		{ id: 20, name: 'vid', url: 'https://www.youtube.com/watch?v=nbUqsZlDErg', type: 'av', text: '' },
		{ id: 100, name: 'tall', url: './asset/tall.png', type: 'img', text: '' },
		// { id: 101, name: 'cave', url: './asset/cave.jpg', type: 'img', text: '' },
		// { id: 102, name: 'cave', url: './asset/cave.jpg', type: 'img', text: '' },
		// { id: 103, name: 'cave', url: './asset/cave.jpg', type: 'img', text: '' },
		// { id: 104, name: 'cave', url: './asset/cave.jpg', type: 'img', text: '' },
		// { id: 105, name: 'cave', url: './asset/cave.jpg', type: 'img', text: '' },
		// { id: 106, name: 'cave', url: './asset/cave.jpg', type: 'img', text: '' },
		// { id: 107, name: 'cave', url: './asset/cave.jpg', type: 'img', text: '' },
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
			showAudio: true
		}
		// console.log('[START]', this.state)
	}


	/* DROPZONE */
	addFiles = (files) => {
		let data = this.state.data;
		let len = this.state.data.length;

		for (var i = 0; i < files.length; i++) {
			let type = '';
			let newData = { id: len, name: files[i].name, url: files[i].path, type: type, text: '' };
			if (files[i].name.endsWith(".jpg") || files[i].name.endsWith(".png") || files[i].name.endsWith(".gif") || files[i].name.endsWith(".bmp")) {
				newData.type = 'img';
			} else if (files[i].name.endsWith(".md") || files[i].name.endsWith(".txt")) {
				newData.type = 'md';
				files[i].text().then(result => newData.text = result);
			} else if (files[i].name.endsWith(".mp3") || files[i].name.endsWith(".mp4") || files[i].name.endsWith(".webm")) {
				newData.type = 'av';
			} else {
				// file type not supported
			}

			data.push(newData);
			len += 1
			// console.log('[addFiles]', newData.url, newData.text);
		}

		localStorage.setItem('files', JSON.stringify(data));
		this.setState({ data: data });
	}
	addURL = (url) => {
		const youtubeID = url.split('=')[1];
		axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${youtubeID}&key=${API_KEY}&part=snippet`)
			.then((response) => {
				const youtubeTitle = response.data.items[0].snippet.localized.title;
				console.log('youtubeTitle:', youtubeTitle);

				let data = this.state.data;
				data.push({ id: data.length, name: youtubeTitle, url: url, type: 'av', text: '' });
				localStorage.setItem('files', JSON.stringify(data));
				this.setState({ data: data });
			})

	}

	clearLS = (keyName, e, handle) => {
		if (e) { console.log('[clearLS:Hotkeys]', keyName, e, handle); }
		localStorage.clear();
		// localStorage.setItem('files', '')
		this.setState({ data: [], selectedIndex: [] })
	}

	deleteFromLS = id => event => {
		console.log('[deleteFromLS]')
		if (this.state.selectedIndex.length > 0) {
			console.log('disabled when showing preview!')
		} else {
			// let selectedArr = this.state.selectedIndex
			let data = this.state.data
			let id2index = this.state.id2index
			let index2id = {}
			const index = id2index[id]

			delete id2index[id]
			for (var key in id2index) {
				if (id2index[key] > index) {
					id2index[key]--
				}
			}
			for (var key in id2index) {
				index2id[id2index[key]] = key
			}

			data.splice(index, 1)
			// selectedArr.splice(index, 1)
			// selectedArr.forEach((selected, i) => {
			// 	if (selected > index) {
			// 		selectedArr[i]--
			// 	}
			// })

			// this.setState({ data: data, selectedIndex: [...selectedArr], id2index: id2index, index2id: index2id })
			this.setState({ data: data, id2index: id2index, index2id: index2id })
			localStorage.setItem('files', JSON.stringify(data))
		}
	}

	toggleZone = (keyName, e, handle) => {
		if (e) { console.log('[toggleZone:Hotkeys]', keyName, e, handle); }
		this.setState({ showZone: !this.state.showZone })
	}
	/* END DROPZONE */


	/* PLAYLIST */
	changeSelection = clickedID => event => {
		console.log('[changeSelection]', event.shiftKey, 'item.id:', clickedID)
		const clickedIndex = this.state.id2index[clickedID]
		let selectedIndex = [...this.state.selectedIndex]
		let selectedID = []
		selectedIndex.forEach((index, i) => {
			selectedID.push(this.state.index2id[index])
		})
		if (!selectedID.includes(clickedID)) {
			if (event.shiftKey) {
				selectedIndex.push(clickedIndex)
			} else {
				selectedIndex = [clickedIndex]
			}
		} else {
			if (event.shiftKey) {
				selectedIndex.splice(selectedIndex.indexOf(clickedIndex), 1)
			} else {
				selectedIndex = []
			}
		}

		this.setState({ selectedIndex: [...selectedIndex] }, () => { console.log('[changeSelection:callback]', this.state.selectedIndex) }) // so only after render, it reset the states
		console.log('[changeSelection:selectedIndex]', this.state.selectedIndex)
	}

	updateSortable = (newState) => {
		let newId2index = {}
		let newIndex2id = {}
		let newSelectedIndex = []
		let selectedId = []

		// get currently selected items' id
		this.state.selectedIndex.forEach((selected, i) => {
			selectedId.push(this.state.index2id[selected])
		})

		// update the relationship dicts
		newState.forEach((item, index) => {
			newId2index[item.id] = index
			newIndex2id[index] = item.id
		})

		// map current selected item ids to new index 
		selectedId.forEach((selected, i) => {
			newSelectedIndex.push(newId2index[selected])
		})

		this.setState({ data: newState, id2index: newId2index, index2id: newIndex2id, selectedIndex: newSelectedIndex })
	}

	toggleList = (keyName, e, handle) => {
		if (e) { console.log('[toggleList:Hotkeys]', keyName, e, handle); }
		this.setState({ showList: !this.state.showList })
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
			this.setState({ selectedIndex: this.state.selectedIndex[0] === 0 ? [this.state.data.length - 1] : [this.state.selectedIndex[0] - 1] })
		} else {
			console.log('Prev/next is disabled when multiselection!')
		}
	}

	next = (keyName, e, handle) => {
		if (e) { console.log('[next:Hotkeys]', keyName, e, handle); }
		if (this.state.selectedIndex.length === 1) {
			this.setState({ selectedIndex: this.state.selectedIndex[0] === this.state.data.length - 1 ? [0] : [this.state.selectedIndex[0] + 1] })
		} else {
			console.log('Prev/next is disabled when multiselection!')
		}
	}

	clearPreview = (keyName, e, handle) => {
		if (e) { console.log('[clearPreview:Hotkeys]', keyName, e, handle); }
		this.setState({ selectedIndex: [] })
	}

	toggleGlobalCanvas = (keyName, e, handle) => {
		if (e) { console.log('[toggleGlobalCanvas:Hotkeys]', keyName, e, handle); }
		this.setState({ showGlobalCanvas: !this.state.showGlobalCanvas })
	}
	/* END PREVIEW */

	changeEditorFilename = (id, newFilename, newText) => {
		let data = this.state.data;
		data[this.state.id2index[id]].name = newFilename;
		data[this.state.id2index[id]].text = newText;
		this.setState({ data: data });
	}

	toggleAudio = (keyName, e, handle) => {
		if (e) { console.log('[toggleAudio]', keyName, e, handle); }
		this.setState({ showAudio: !this.state.showAudio });
	}

	// should be included in changeSelection if img 
	// also prev next 
	saveCanvas = (id, undolines) => {
		let data = this.state.data;
		data[this.state.id2index[id]].undolines = undolines;
		this.setState({ data: data });
		console.log('[saveCanvas]', this.state.data[this.state.id2index[id]].undolines);
	}

	render() {
		// console.log('[render]', this.state.data.length)
		return (
			/* CONTAINER */
			<div>
				<HotButton keyName="shift+alt+c" buttonClass="action" actionFN={this.toggleGlobalCanvas}>GLOBAL CANVAS</HotButton>
				{this.state.showGlobalCanvas && <GlobalDrawArea canvasWidth={window.innerWidth} canvasHeight={window.innerHeight} />}

				{/* METADATA ROW */}
				<div className="metadata">

					<div className='audio'>
						<Draggable handle=".handle"><div>
							{/* {this.state.showAudio && <Recorder />} */}
							<Recorder />
							<button className="handle"><span role="img" aria-label="handle emoji">🧲</span></button>
							{/* <HotButton keyName="shift+a" buttonClass="action" actionFN={this.toggleAudio}>{this.state.showAudio ? 'HIDE' : 'RECORDER'}</HotButton> */}
						</div></Draggable>
					</div>

					<div className='dropzone'>
						<Draggable handle=".handle"><div>
							{this.state.showZone && <DragAndDrop handleFileDrop={this.addFiles} handleURLDrop={this.addURL} />}
							<button className="handle"><span role="img" aria-label="handle emoji">🧲</span></button>
							<HotButton keyName="shift+z" buttonClass="action" actionFN={this.toggleZone}>{this.state.showZone ? 'HIDE' : 'DROPZONE'}</HotButton>
						</div></Draggable>
					</div>

					<div className='playlist'>
						<Draggable handle=".handle"><div>
							{
								this.state.showList &&
								<Playlist data={this.state.data} selectedIndex={this.state.selectedIndex} updated={this.updateSortable} clicked={this.changeSelection} clickDeleted={this.deleteFromLS} view={this.state.listView} />
							}
							<button className="handle"><span role="img" aria-label="handle emoji">🧲</span></button>
							{this.state.showList && <button className="action" onClick={this.toggleListView}>{this.state.listView === 'list' ? 'GRID' : 'LIST'}</button>}
							<HotButton keyName="shift+l" buttonClass="action" actionFN={this.toggleList}>{this.state.showList ? 'HIDE' : 'PLAYLIST'}</HotButton>
							{this.state.showList && <HotButton keyName="ctrl+l" buttonClass="delete" actionFN={this.clearLS}>CLEAR</HotButton>}
						</div></Draggable>
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
					<Preview data={this.state.data} selectedIndex={this.state.selectedIndex} changeEditorFilenameFn={this.changeEditorFilename} saveCanvasFN={this.saveCanvas} />
				</div>
			</div>
		)

	}
}

export default App;
