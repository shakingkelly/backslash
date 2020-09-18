import React, { Component } from 'react';
import './App.css';
import Playlist from './components/Playlist';
import Preview from './components/Preview';
// import TestFs from './TestFs.ts';
import DragAndDrop from './components/DragAndDrop';


class App extends Component {

	constructor(props) {
		super(props);

		// let data = [{ id: 10, name: 'outside file', url: '/Users/sjx/Pictures/2001_A_Space_Odyssey_1.jpg', type: 'img' }]
		// const files_json = TestFs.getDirectoryListing()
		// console.log('[files_json]', files_json)
		// const files_name = files_json.slice(4, -2).split(',\n  ')

		// files_name.forEach((file, index) => {
		// 	file = file.slice(1, -1)
		// 	if (file.endsWith('.png')) {
		// 		data.push({ id: index, name: file, url: './asset/' + file, type: 'img' })
		// 	} else if (file.endsWith('.mp4') || file.endsWith('.mp3')) {
		// 		data.push({ id: index, name: file, url: './asset/' + file, type: 'av' })
		// 	}
		// })

		// const data = JSON.parse(localStorage.getItem('files'))
		// console.log('[localStorage.getItem]', data)

		const data = [{id: 10, name: 'outside file', url: './asset/cave.jpg', type: 'img'}]

		this.state = { data: data || [], selectedId: [], showList: true }
		console.log(this.state)
	}

	changeSelection = index => event => {
		console.log('[changeSelection]', event.shiftKey, index)
		let selectedIdArr = this.state.selectedId
		if (event.shiftKey) {
			if (!this.state.selectedId.includes(index)) {
				selectedIdArr.push(index)
			}
		} else {
			selectedIdArr = [index]
		}
		this.setState({ selectedId: [...selectedIdArr] }, () => { console.log('[callback]', this.state.selectedId) }) // so only after render, it reset the states
		console.log(this.state.selectedId)
	}

	prevNext = direction => event => {
		console.log('[prevNext]')
		if (this.state.selectedId.length === 1) {
			direction === 'prev' ?
				this.setState({ selectedId: this.state.selectedId[0] === 0 ? [this.state.data.length - 1] : [this.state.selectedId[0] - 1] }) :
				this.setState({ selectedId: this.state.selectedId[0] === this.state.data.length - 1 ? [0] : [this.state.selectedId[0] + 1] })
		} else {
			console.log('Prev/next is disabled when multiselection!')
		}
		console.log(this.state.selectedId)
	}

	toggleList = () => {
		this.setState({ showList: !this.state.showList })
	}

	clearPreview = () => {
		this.setState({ selectedId: [] })
	}

	updateSortable = (newState) => {
		this.setState({ data: newState })
	}

	addFiles = (files) => {
		let data = this.state.data
		let len = this.state.data.length

		for (var i = 0; i < files.length; i++) {
			let type = 'av'
			if (files[i].name.endsWith(".jpg") || files[i].name.endsWith(".png")) {
				type = 'img'
			}
			data.push({ id: len, name: files[i].name, url: files[i].path, type: type })
			len += 1
			console.log('[addFiles]', files[i].path)
		}

		localStorage.setItem('files', JSON.stringify(data));
		this.setState({ data: data })
	}

	clearLS = () => {
		localStorage.clear();
		this.setState({ data: [] })
		this.setState({ selectedId: [] })
	}

	// not sure if use index or id
	deleteSelection = index => event => {
		console.log('[deleteSelection]')
		let selectedIdArr = this.state.selectedId
		let data = this.state.data
		data.splice(index, 1)
		selectedIdArr.splice(index, 1)
		this.setState({ data: data, selectedId: [...selectedIdArr] })
		localStorage.setItem('files', JSON.stringify(data))
	}

	render() {
		console.log('[render]', this.state.selectedId)
		return (
			<div>
				<DragAndDrop handleDrop={this.addFiles}>
					<div style={{position: 'absolute',
								top: 0,
								botton: 0,
								left: 0,
								right: 0,
								textAlign: 'center',
                                color: 'salmon',
                                fontSize: 24}}>
						Drop Zone
					</div>
				</DragAndDrop>
				<div className='playlist' style={{ width: '50%' }}>
					{
						this.state.showList &&
						<Playlist data={this.state.data} selectedId={this.state.selectedId} updated={this.updateSortable} clicked={this.changeSelection} clickDeleted={this.deleteSelection} />
					}
					<button onClick={this.toggleList}>{this.state.showList ? 'hide' : 'show'}</button>
					<button onClick={this.clearLS}>clear playlist</button>
				</div>
				<div className='preview'>
					<Preview data={this.state.data} selectedId={this.state.selectedId} />
					<button onClick={this.prevNext('prev')}>prev</button>
					<button onClick={this.prevNext('next')}>next</button>
					<button onClick={this.clearPreview}>clear preview</button>
				</div>
				<div style={{ border: '2px solid', padding: '20px', width: '300px', resize: 'both' }}> this should be resizable! </div>
			</div>
		)

	}
}

export default App;
