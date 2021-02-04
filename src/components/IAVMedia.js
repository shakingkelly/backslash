import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import DrawArea from './DrawArea';
import Draggable from 'react-draggable';
import HotButton from './HotButton';
import Hotkeys from 'react-hot-keys';
import { Rnd } from 'react-rnd';

class IAVMedia extends Component {

    // colors = { 0: 'red', 1: 'orange', 2: 'Yellow', 3: 'lime', 4: 'green', 5: 'blue', 6: 'navy', 7: 'purple', 8: 'indigo', 9: 'dimgray' };
    colors = { 0: '#9E9FCF', 1: '#8889cf', 2: '#7677cf', 3: '#6466d1', 4: '#5456d1', 5: '#4547d1', 6: '#3437d1', 7: '#2125d1', 8: '#1317d1', 9: '#0408d1' }
    zButtonStyle = { zIndex: 200, position: 'relative' };

    // 这个是移动之后selected index不变（所以media自动变了）
    // componentWillReceiveProps(nextProps) {
    //     this.name = nextProps.item.name;
    //     this.url = nextProps.item.url;
    //     this.type = nextProps.item.type;
    //     this.media = null;
    // }

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

    id = this.props.item.id;
    name = this.props.item.name;
    url = this.props.item.url;
    type = this.props.item.type;
    position = this.props.item.position;
    order = this.props.order;
    saveCanvasFN = this.props.saveCanvasFN;

    state = {
        orgScale: 0,
        imgWidth: 640,
        imgHeight: 360,
        showCanvas: false,
        canvasWidth: 0,
        canvasHeight: 0,
        dragX: document.getElementById("preview-pos").getBoundingClientRect().left,
        dragY: document.getElementById("preview-pos").getBoundingClientRect().top,
        fullscreen: false,
        prevImgWidth: 0,
        prevImgHeight: 0,
        x: this.position ? this.position.x : 0,
        y: this.position ? this.position.y : 0,
        undolines: this.props.item.undolines || [],
        redoline: []
    }

    saveCanvas = () => {
        this.saveCanvasFN(this.id, this.state.undolines);
    }

    mediaClickHandler = (event) => { console.log('[load undolines]', this.state.undolines) };

    // resizing: all use horizontal edge as anchor (considering use cases). 
    // AKA currently all heights are not necessary. 
    // it's here just in case of using vertical edge as anchor.
    larger = (keyName, e, handle) => {
        if (e) { console.log('[larger:Hotkeys]', keyName, e, handle); }
        const currWidth = this.state.imgWidth;
        const currHeight = this.state.imgHeight;
        if (currWidth < window.innerWidth) {
            this.setState({ imgWidth: currWidth * 1.1, imgHeight: currHeight * 1.1, prevImgWidth: currWidth * 1.1, prevImgHeight: currHeight * 1.1 }); // 
        }
    }

    smaller = (keyName, e, handle) => {
        if (e) { console.log('[smaller:Hotkeys]', keyName, e, handle); }
        const currWidth = this.state.imgWidth;
        const currHeight = this.state.imgHeight;
        if (currWidth > 100) {
            this.setState({ imgWidth: currWidth * 0.9, imgHeight: currHeight * 0.9, prevImgWidth: currWidth * 0.9, prevImgHeight: currHeight * 0.9 }); // 
        }
    }

    toggleFullscreen = () => {
        // if (!this.state.fullscreen) {
        //     const tempWidth = this.state.imgWidth;
        //     const tempX = this.state.dragX;
        //     const tempY = this.state.dragY;
        //     this.setState({ imgWidth: window.innerWidth, prevImgWidth: tempWidth, fullscreen: true, dragX: 0, dragY: 0, prevX: tempX, prevY: tempY, canvasWidth: window.innerWidth });
        // } else {
        //     this.setState({ imgWidth: this.state.prevImgWidth, fullscreen: false, dragX: this.state.prevX, dragY: this.state.prevY, canvasWidth: this.state.prevImgWidth });
        // }
        this.setState({ fullscreen: !this.state.fullscreen });
    }

    enterFullscreen = (keyName, e, handle) => {
        if (e) { console.log('[enterFullscreen:Hotkeys]', keyName, e, handle); }
        if (this.refs.redraw) {
            console.log('[fullscreen ref]', this.refs.redraw);
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
        // const boundingRect = this.refs.coverImg.getBoundingClientRect();
        this.setState({
            showCanvas: !this.state.showCanvas,
            canvasHeight: this.state.prevImgHeight > 0 ? this.state.prevImgHeight + 8 : this.state.imgHeight + 8,
            canvasWidth: this.state.prevImgWidth > 0 ? this.state.prevImgWidth + 8 : this.state.imgWidth + 8
            // canvasWidth: boundingRect.right - boundingRect.left,
            // canvasHeight: boundingRect.bottom - boundingRect.top
            // dragX: boundingRect.left,
            // dragY: boundingRect.top
        });
    }

    onImgLoad = ({ target: img }) => {
        if (this.state.orgScale != 0) {
            return;
        }

        let scale = 1;
        if (img.width / img.height >= 1) {
            scale = 640 / img.width;
            this.setState({ orgScale: img.width / img.height, imgWidth: 640, imgHeight: scale * img.height });
            console.log('[onImgLoad] long', img.width, img.height);
        } else {
            scale = 360 / img.height;
            this.setState({ orgScale: img.width / img.height, imgWidth: scale * img.width, imgHeight: 360 });
            console.log('[onImgLoad] tall', img.width, img.height);
        }
    }

    render() {
        // console.log('[IAVMedia:render]', this.url); // worked after put in publics

        // img 
        const fullWidthLong = window.screen.width;
        const fullWidthTall = this.state.orgScale * window.screen.height;
        const fullHeightLong = 1 / this.state.orgScale * window.screen.width;
        const fullHeightTall = window.screen.height;
        const long = this.state.orgScale >= 1;

        return (

            this.state.fullscreen ?
                <div style={{ position: 'absolute', left: 0, top: 0 }}>
                    {this.type === 'img' &&
                        <img ref='coverImg'
                            width={long ? fullWidthLong : fullWidthTall}
                            height={long ? fullHeightLong : fullHeightTall}
                            src={this.url} alt={this.url} style={{ zIndex: 0, position: 'absolute' }} />
                    }
                    {this.type === 'img' &&
                        <DrawArea className={this.state.showCanvas ? 'shown' : 'hidden'}
                            isVisible={this.state.showCanvas ? true : false}
                            ref="redraw"
                            canvasWidth={long ? fullWidthLong : fullWidthTall}
                            canvasHeight={long ? fullHeightLong : fullHeightTall}
                            prevUndolines={this.state.undolines}
                            prevRedolines={this.state.redolines} />
                    }
                    {this.type === 'av' && <ReactPlayer url={this.url} controls={true} width={window.screen.width} height={window.screen.height} style={{ zIndex: 0, position: 'absolute', left: 0, top: 0 }} />}
                    {this.type === 'img' && <Hotkeys onKeyDown={this.toggleCanvas} keyName="shift+c" />}
                    <Hotkeys onKeyDown={this.exitFullscreen} keyName="esc"></Hotkeys>
                </div>
                :
                <Rnd
                    size={{ width: this.state.imgWidth + 8, height: this.state.imgHeight + 8 }}
                    position={{ x: this.state.x, y: this.state.y }}
                    onDragStop={(e, d) => {
                        // console.log('[onDragStop]', d);
                        this.setState({ x: d.x, y: d.y });
                        this.props.savePositionFN(this.id, d.x, d.y);
                    }}
                    onResizeStop={(e, direction, ref, delta, position) => {
                        // console.log('[onResizeStop]', direction, ref, delta, position);
                        this.setState({
                            imgWidth: ref.offsetWidth,
                            imgHeight: ref.offsetHeight,
                            canvasWidth: ref.offsetWidth + 8,
                            canvasHeight: ref.offsetHeight + 8,
                            ...position,
                        });
                    }}
                    dragHandleClassName="handle"
                >

                    <div>
                        {this.type === 'img' &&
                            <div style={{ width: this.state.prevImgWidth > 0 ? this.state.prevImgWidth : this.state.imgWidth, height: this.state.prevImgHeight > 0 ? this.state.prevImgHeight : this.state.imgHeight, zIndex: 0, position: 'absolute', border: ['dashed', this.colors[this.order], '4px'].join(' '), borderRadius: '25px' }} >
                                <img onLoad={this.onImgLoad} ref='coverImg' src={this.url} alt={this.url} style={{ width: '100%', height: '100%' }} />
                            </div>
                        }
                        {this.type === 'img' &&
                            <DrawArea className={this.state.showCanvas ? 'shown' : 'hidden'}
                                isVisible={this.state.showCanvas ? true : false}
                                ref="redraw"
                                canvasWidth={this.state.canvasWidth}
                                canvasHeight={this.state.canvasHeight}
                                prevUndolines={this.state.undolines}
                                prevRedolines={this.state.redolines} />
                        }
                        {this.type === 'av' && <ReactPlayer url={this.url} controls={true} width={this.state.prevImgWidth > 0 ? this.state.prevImgWidth : this.state.imgWidth} height={this.state.prevImgHeight > 0 ? this.state.prevImgHeight : this.state.imgHeight} style={{ zIndex: 0, position: 'absolute', border: ['dashed', this.colors[this.order], '4px'].join(' '), borderRadius: '25px' }} />}
                        <button className="handle" style={{ zIndex: 200, position: 'relative' }} onClick={this.mediaClickHandler}><span role="img" aria-label="handle emoji">🧲</span></button>
                        {!this.state.showCanvas && !this.state.fullscreen &&
                            <HotButton buttonClass="action" style={this.zButtonStyle} actionFN={this.smaller.bind(this)} keyName="-">-</HotButton>
                        }
                        {!this.state.showCanvas && !this.state.fullscreen &&
                            <HotButton buttonClass="action" style={this.zButtonStyle} actionFN={this.larger.bind(this)} keyName="=">+</HotButton>
                        }
                        {this.type === 'img' &&
                            <div>
                                <HotButton buttonClass="action" style={this.zButtonStyle} actionFN={this.toggleCanvas} keyName="shift+c">{this.state.showCanvas ? 'HIDE CANVAS' : 'SHOW CANVAS'}</HotButton>
                                {this.state.showCanvas && <button onClick={this.saveCanvas} style={this.zButtonStyle}>save canvas</button>}                        
                                <HotButton buttonClass="action" style={this.zButtonStyle} actionFN={this.enterFullscreen} keyName="f">FULLSCREEN</HotButton>
                            </div>
                        }
                    </div>
                </Rnd>


        )

    }
}

export default IAVMedia;

