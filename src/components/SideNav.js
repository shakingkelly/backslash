import React from "react";

const SideNav = (props) => {
	const width = 200;
	const height = 100;
	const [xPosition, setX] = React.useState(-width);

	const toggleMenu = () => {
		if (xPosition < 0) {
			setX(0);
		} else {
			setX(-width);
		}
	};

	const toggleBackground = () => {
		const bodyElt = document.querySelector("body");
		if (!bodyElt.classList.contains('light')) {
			bodyElt.classList.add('light');
		} else {
			bodyElt.classList.remove('light');
		}
	}

	React.useEffect(() => {
		setX(0);
	}, []);

	return (
		// <React.Fragment>
		<div
			className="side-bar"
			style={{
				transform: `translatex(${xPosition}px)`,
				width: width,
				Height: height
			}}
		>
			<button
				onClick={() => toggleMenu()}
				className="toggle-menu"
				style={{
					transform: `translate(${width}px, 0vh)`
				}}
			></button>
			<div className="content">
				<button className="action" onClick={toggleBackground}>{document.querySelector("body").classList.contains('light') ? 'Dark' : 'Light'}</button>
				<button className="action" onClick={props.toggleMIDIFN}>{props.useMIDI ? 'Disable MIDI' : 'Enable MIDI'}</button>
			</div>
		</div>
		// </React.Fragment>
	);
};

export default SideNav;