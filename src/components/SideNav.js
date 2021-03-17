import React, { Component } from "react";




class SideNav extends Component {

	constructor(props) {
		super(props);
		this.state = { xPosition: 0, width: 300, height: 100 };
	}

	toggleMenu = () => {
		if (this.state.xPosition < 0) {
			this.setState({ xPosition: 0 });
		} else {
			this.setState({ xPosition: -this.state.width });
		}
	}

	toggleBackground = () => {
		const bodyElt = document.querySelector("body");
		if (!bodyElt.classList.contains('light')) {
			bodyElt.classList.add('light');
		} else {
			bodyElt.classList.remove('light');
		}
	}

	render() {
		return (
			<div
				className="side-bar"
				style={{
					transform: `translatex(${this.state.xPosition}px)`,
					width: this.state.width,
					Height: this.state.height
				}}
			>
				<button
					className="toggle-menu"
					onClick={this.toggleMenu}
					style={{
						transform: `translate(${this.state.width}px, 0vh)`
					}}
				></button>
				<div className="content">
					<button className="action menu" onClick={this.toggleBackground}>Change Background</button>
					<button className="action menu" onClick={this.props.toggleMIDIFN}>{this.props.useMIDI ? 'Disable MIDI' : 'Enable MIDI'}</button>
				</div>
			</div>
		)
	}

}

export default SideNav;