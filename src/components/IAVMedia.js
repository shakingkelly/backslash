import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import DrawArea from './DrawArea';
import HotButton from './HotButton';
import Hotkeys from 'react-hot-keys';
import { Rnd } from 'react-rnd';

class IAVMedia extends Component {

    constructor(props) {
        super(props);
        this.colors = { 0: '#9E9FCF', 1: '#8889cf', 2: '#7677cf', 3: '#6466d1', 4: '#5456d1', 5: '#4547d1', 6: '#3437d1', 7: '#2125d1', 8: '#1317d1', 9: '#0408d1' };
        this.zButtonStyle = { zIndex: 200, position: 'relative' };
        this.id = props.item.id;
        this.name = props.item.name;
        this.url = props.item.url;
        this.type = props.item.type;
        this.position = props.item.position;
        this.order = props.order;

        this.state = {
            orgRatio: 0,        // get in onImgLoad; only for img 
            w: 640,      // default w/h for img&av; img keeps org ratio; cannot get av w/h on load so set default to long 
            h: 360,
            showCanvas: false,
            canvasWidth: 0,     // updated passively thru img w/h
            canvasHeight: 0,
            fullscreen: false,
            x: this.position ? this.position.x : 0,     // propagated from data
            y: this.position ? this.position.y : 0,
            undolines: this.props.item.undolines || [], // propagated from data
            redoline: []
        }
    }

    // 这个要点两次才能变??
    componentDidUpdate(prevProps, prevState) {
        // console.log('[componentDidUpdate]', prevProps.item.name, this.props.item.name)
        // only update if the data has changed
        // if (prevProps.item !== this.props.item) {
        //     this.name = this.props.item.name;
        //     this.url = this.props.item.url;
        //     this.type = this.props.item.type;
        // }
        this.id = this.props.item.id;
        this.name = this.props.item.name;
        this.url = this.props.item.url;
        this.type = this.props.item.type;
        this.position = this.props.item.position;
        this.order = this.props.order;
    }


    // resizing: all use horizontal edge as anchor (considering use cases). 
    // AKA currently all heights are not necessary. 
    // it's here just in case of using vertical edge as anchor.
    /** @deprecated [changed to rnd] */
    larger = (keyName, e, handle) => {
        if (e) { console.log('[larger:Hotkeys]', keyName, e, handle); }
        const currWidth = this.state.w;
        const currHeight = this.state.h;
        if (currWidth < window.innerWidth) {
            this.setState({ w: currWidth * 1.1, h: currHeight * 1.1 });
        }
    }
    /** @deprecated [changed to rnd] */
    smaller = (keyName, e, handle) => {
        if (e) { console.log('[smaller:Hotkeys]', keyName, e, handle); }
        const currWidth = this.state.w;
        const currHeight = this.state.h;
        if (currWidth > 100) {
            this.setState({ w: currWidth * 0.9, h: currHeight * 0.9 });
        }
    }

    enterFullscreen = (keyName, e, handle) => {
        if (e) { console.log('[enterFullscreen:Hotkeys]', keyName, e, handle); }
        if (this.refs.redraw) {
            // bring drawarea's lines here
            // guess this is copy by reference, as in just need to copy onece here, no need to update when exit fullscreen
            this.setState({ fullscreen: true, undolines: this.refs.redraw.state.undolines, redolines: this.refs.redraw.state.redolines });
        } else {
            this.setState({ fullscreen: true });
        }
    }
    exitFullscreen = (keyName, e, handle) => {
        if (e) { console.log('[exitFullscreen:Hotkeys]', keyName, e, handle); }
        this.setState({ fullscreen: false });
    }

    toggleCanvas = (keyName, e, handle) => {
        if (e) { console.log('[toggleCanvas:Hotkeys]', keyName, e, handle); }
        this.setState({
            showCanvas: !this.state.showCanvas,
            canvasHeight: this.state.h + 8,
            canvasWidth: this.state.w + 8
        });
    }

    onImgLoad = ({ target: img }) => {
        const divide = this.divide;
        if (this.state.orgRatio !== 0) {
            // only need to get ratio once on the first load 
            console.log('not again');
            return;
        }
        const orgRatio = divide(img.width, img.height);
        if (orgRatio >= 1) {
            this.setState({ orgRatio: orgRatio, w: 640, h: img.height }, () => { console.log('long', img.width, img.height, this.state.orgRatio) });
        } else {
            this.setState({ orgRatio: orgRatio, w: img.width, h: 360 }, () => { console.log('tall', img.width, img.height, this.state.orgRatio) });
        }
    }
    divide = (a, b) => {
        return (
            parseFloat((a / b).toFixed(2))
        ) 
    }


    render() {
        // console.log('[IAVMedia:render]', this.url); // worked after put in publics
        const { orgRatio, fullscreen, showCanvas, undolines, redolines, w, h, canvasWidth, canvasHeight, x, y } = this.state;

        // img 
        const fullWidthLong = window.screen.width;
        const fullWidthTall = orgRatio * window.screen.height;
        const fullHeightLong = 1 / orgRatio * window.screen.width;
        const fullHeightTall = window.screen.height;
        const long = orgRatio >= 1;
        // console.log('long?tall', long);

        return (

            fullscreen ?
                <div className="img-container" style={{ position: 'absolute', left: 0, top: 0 }}>
                    {this.type === 'img' &&
                        <img ref='coverImg'
                            width={long ? fullWidthLong : fullWidthTall}
                            height={long ? fullHeightLong : fullHeightTall}
                            src={this.url} alt={this.url} style={{ zIndex: 0, position: 'absolute' }} />
                    }
                    {this.type === 'img' &&
                        <DrawArea className={showCanvas ? 'shown' : 'hidden'} ref="redraw"
                            isVisible={showCanvas ? true : false}
                            canvasWidth={long ? fullWidthLong : fullWidthTall}
                            canvasHeight={long ? fullHeightLong : fullHeightTall}
                            prevUndolines={undolines}
                            prevRedolines={redolines} />
                    }
                    {this.type === 'av' &&
                        <ReactPlayer style={{ zIndex: 0, position: 'absolute', left: 0, top: 0 }}
                            url={this.url} controls={true}
                            width={window.screen.width} height={window.screen.height} />
                    }
                    {this.type === 'img' && <Hotkeys onKeyDown={this.toggleCanvas} keyName="shift+c" />}
                    <Hotkeys onKeyDown={this.exitFullscreen} keyName="esc"></Hotkeys>
                </div>
                :
                <Rnd
                    dragHandleClassName="handle" size={{ width: w + 8, height: h + 8 }} position={{ x: x, y: y }}
                    lockAspectRatio={true}
                    onDragStop={(e, d) => {
                        this.setState({ x: d.x, y: d.y });
                        this.props.savePositionFN(this.id, d.x, d.y);
                    }}
                    onResizeStop={(e, direction, ref, delta, position) => {
                        this.setState({
                            w: ref.offsetWidth,
                            h: ref.offsetHeight,
                            canvasWidth: ref.offsetWidth + 8,
                            canvasHeight: ref.offsetHeight + 8,
                            ...position,
                        });
                    }}
                >
                    <div>
                        {this.type === 'img' &&
                            <div style={{
                                zIndex: 0, position: 'absolute',
                                border: ['dashed', this.colors[this.order], '4px'].join(' ')
                            }} >
                                {long ? <img onLoad={this.onImgLoad} ref='coverImg' src={this.url} alt={this.url} width={w} />
                                : <img onLoad={this.onImgLoad} ref='coverImg' src={this.url} alt={this.url} height={h} />}
                                
                            </div>
                        }
                        {this.type === 'img' &&
                            <DrawArea className={showCanvas ? 'shown' : 'hidden'} ref="redraw"
                                isVisible={showCanvas ? true : false}
                                canvasWidth={canvasWidth} canvasHeight={canvasHeight}
                                prevUndolines={undolines} prevRedolines={redolines} />
                        }
                        {this.type === 'av' &&
                            <ReactPlayer url={this.url} controls={true} width={w} height={h}
                                style={{ zIndex: 0, position: 'absolute', border: ['dashed', this.colors[this.order], '4px'].join(' ') }} />
                        }
                        {/* org +/- buttons  */}
                        {this.type === 'img' &&
                            <div>
                                <HandleButton />
                                {/* onClick={this.props.changeOrderFN(this.id)} */}
                                <button style={this.zButtonStyle}>bring to front</button>
                                <HotButton buttonClass="action" style={this.zButtonStyle} actionFN={this.toggleCanvas} keyName="shift+c">{showCanvas ? 'HIDE CANVAS' : 'SHOW CANVAS'}</HotButton>
                                {showCanvas && <button className="action" onClick={() => this.props.saveCanvasFN(this.id, undolines)} style={this.zButtonStyle}>save canvas</button>}
                                <HotButton buttonClass="action" style={this.zButtonStyle} actionFN={this.enterFullscreen} keyName="f">FULLSCREEN</HotButton>
                            </div>
                        }
                        {this.type === 'av' && 
                        <div>
                            <HandleButton />
                            {/* onClick={this.props.changeOrderFN(this.id)} */}
                            <button style={this.zButtonStyle}>bring to front</button>
                        </div>
                        }
                    </div>
                </Rnd>
        )
    }
}

export default IAVMedia;

const HandleButton = () => {
    return (
        <button className="handle" style={{ zIndex: 200, position: 'relative' }}>
            <span role="img" aria-label="handle emoji">🧲</span>
        </button>
    )
}

// {/* org +/- buttons  */}
// {!this.state.showCanvas && !this.state.fullscreen &&
//     <HotButton buttonClass="action" style={this.zButtonStyle} actionFN={this.smaller.bind(this)} keyName="-">-</HotButton>
// }
// {!this.state.showCanvas && !this.state.fullscreen &&
//     <HotButton buttonClass="action" style={this.zButtonStyle} actionFN={this.larger.bind(this)} keyName="=">+</HotButton>
// }

// org "constructor":
    // colors = { 0: 'red', 1: 'orange', 2: 'Yellow', 3: 'lime', 4: 'green', 5: 'blue', 6: 'navy', 7: 'purple', 8: 'indigo', 9: 'dimgray' };
    // colors = { 0: '#9E9FCF', 1: '#8889cf', 2: '#7677cf', 3: '#6466d1', 4: '#5456d1', 5: '#4547d1', 6: '#3437d1', 7: '#2125d1', 8: '#1317d1', 9: '#0408d1' }
    // zButtonStyle = { zIndex: 200, position: 'relative' };

    // id = this.props.item.id;
    // name = this.props.item.name;
    // url = this.props.item.url;
    // type = this.props.item.type;
    // position = this.props.item.position;
    // order = this.props.order;
    // saveCanvasFN = this.props.saveCanvasFN;

    // state = {
    //     orgScale: 0,        // get in onImgLoad; only for img (should be orgRatio)
    //     imgWidth: 640,      // default w/h for img&av; img keeps org ratio; cannot get av w/h on load so set default to long 
    //     imgHeight: 360,
    //     showCanvas: false,
    //     canvasWidth: 0,     // updated passively thru img w/h
    //     canvasHeight: 0,
    //     // dragX: document.getElementById("preview-pos").getBoundingClientRect().left,  // deprecated; originally for calc pos when toggle fullscreen
    //     // dragY: document.getElementById("preview-pos").getBoundingClientRect().top,
    //     fullscreen: false,
    //     prevImgWidth: 0,
    //     prevImgHeight: 0,
    //     x: this.position ? this.position.x : 0,     // propagated from data
    //     y: this.position ? this.position.y : 0,
    //     undolines: this.props.item.undolines || [], // propagated from data
    //     redoline: []
    // }