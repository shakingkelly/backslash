import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import DrawArea from './DrawArea';
import Draggable from 'react-draggable';
import HotButton from './HotButton';
import Hotkeys from 'react-hot-keys';

class IAVMedia extends Component {

    // colors = { 0: 'red', 1: 'orange', 2: 'Yellow', 3: 'lime', 4: 'green', 5: 'blue', 6: 'navy', 7: 'purple', 8: 'indigo', 9: 'dimgray' };
    colors = {0:'#9E9FCF', 1:'#8889cf', 2:'#7677cf', 3:'#6466d1', 4:'#5456d1', 5:'#4547d1', 6:'#3437d1', 7:'#2125d1', 8:'#1317d1', 9:'#0408d1'}
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
        console.log('[componentDidUpdate]', prevProps.item.name, this.props.item.name)
        // only update if the data has changed
        // if (prevProps.item !== this.props.item) {
        //     this.name = this.props.item.name;
        //     this.url = this.props.item.url;
        //     this.type = this.props.item.type;
        // }
        this.name = this.props.item.name;
        this.url = this.props.item.url;
        this.type = this.props.item.type;
        this.order = this.props.order;
    }

    name = this.props.item.name;
    url = this.props.item.url;
    type = this.props.item.type;
    order = this.props.order;

    state = {
        imgWidth: 640,
        imgHeight: 360,
        showCanvas: false,
        canvasWidth: 0,
        canvasHeight: 0,
        dragX: document.getElementById("preview-pos").getBoundingClientRect().left,
        dragY: document.getElementById("preview-pos").getBoundingClientRect().top,
        fullscreen: false,
        // prevX: document.getElementById("preview-pos").getBoundingClientRect().left,
        // prevY: document.getElementById("preview-pos").getBoundingClientRect().top,
        prevImgWidth: 0,
        prevImgHeight: 0
    }

    mediaClickHandler = (event) => { console.log('[IAVMedia] playing') };

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
        if (e) {console.log('[enterFullscreen:Hotkeys]', keyName, e, handle);}
        this.setState( {fullscreen: true});
    }
    exitFullscreen = (keyName, e, handle) => {
        if (e) {console.log('[exitFullscreen:Hotkeys]', keyName, e, handle);}
        this.setState( {fullscreen: false});
    }

    toggleCanvas = (keyName, e, handle) => {
        if (e) {console.log('[toggleCanvas:Hotkeys]', keyName, e, handle);}
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
        let scale = 1;
        if (img.width / img.height >= 1) {
            // long img
            scale = 640 / img.width;
            this.setState({ imgWidth: 640, imgHeight: scale * img.height });
            console.log('[onImgLoad] long img');
        } else {
            // tall img
            scale = 360 / img.height;
            this.setState({ imgWidth: scale * img.width, imgHeight: 360 });
            console.log('[onImgLoad] tall img');
        }
    }

    render() {
        console.log('[IAVMedia:render]', this.url); // worked after put in publics
        // const avWidth = this.state.imgWidth.toString() + 'px';
        // const avHeight = (this.state.imgWidth * 9 / 16).toString() + 'px';

        // onLoad doesn't work on react-player, so these have no effect
        // ratio is always 640/360 as is the default width/height in react-player
        // anyways. could always use +/- button as work-around ¯\_(ツ)_/¯
        let fullAVWidth = '';
        let fullAVHeight = '';
        const imgWidth = this.state.imgWidth;
        const imgHeight = this.state.imgHeight;        
        const screenRatio = window.screen.width / window.screen.height;
        const avRatio = imgWidth / imgHeight;
        if (avRatio / screenRatio >= 1) {
            // long av
            console.log('[IAVMedia] long av');
            fullAVWidth = window.screen.width.toString() + 'px';
            fullAVHeight = (imgHeight / imgWidth * window.screen.width).toString() + 'px';
        } else {
            // tall av
            console.log('[IAVMedia] tall av');
            fullAVHeight = window.screen.height.toString() + 'px';
            fullAVWidth = (imgWidth / imgHeight * window.screen.height).toString() + 'px';
        }

        return (

            this.state.fullscreen ?
                <div style={{ position: 'absolute', left: 0, top: 0 }}>
                    {this.type === 'img' && <img ref='coverImg' width={window.screen.width} height={this.state.imgHeight / this.state.imgWidth * window.screen.width} src={this.url} alt={this.url} style={{ zIndex: 0, position: 'absolute' }} />}
                    {this.type === 'img' && this.state.showCanvas && <DrawArea canvasWidth={window.screen.width} canvasHeight={this.state.imgHeight / this.state.imgWidth * window.screen.width} />}
                    {this.type === 'av' && <ReactPlayer url={this.url} controls={true} width={fullAVWidth} height={fullAVHeight} style={{ zIndex: 0, position: 'absolute', left: 0, top: 0 }} />}
                    {this.type === 'img' && 
                        // <button className="action" onClick={this.toggleCanvas} style={{ zIndex: 200, position: 'relative' }}>{this.state.showCanvas ? 'HIDE CANVAS' : 'SHOW CANVAS'}</button>
                        <Hotkeys onKeyDown={this.toggleCanvas} keyName="shift+c" />
                    }
                    {/* <button className="action" style={{ zIndex: 200, position: 'relative' }} onClick={this.toggleFullscreen}>{this.state.fullscreen ? 'ESC' : 'FULLSCREEN'}</button> */}
                    <Hotkeys onKeyDown={this.exitFullscreen} keyName="esc"></Hotkeys>
                </div>
                :
                <Draggable handle='.handle'>
                    <div style={{ position: 'absolute', left: this.state.dragX, top: this.state.dragY }}>
                        {this.type === 'img' && <img onLoad={this.onImgLoad} ref='coverImg' width={this.state.prevImgWidth > 0 ? this.state.prevImgWidth : this.state.imgWidth} src={this.url} alt={this.url} style={{ zIndex: 0, position: 'absolute', border: ['dashed', this.colors[this.order], '4px'].join(' '), borderRadius: '25px' }} />}
                        {this.type === 'img' && this.state.showCanvas && <DrawArea canvasWidth={this.state.canvasWidth} canvasHeight={this.state.canvasHeight} />}
                        {this.type === 'av' && <ReactPlayer url={this.url} controls={true} width={this.state.prevImgWidth > 0 ? this.state.prevImgWidth : this.state.imgWidth} height={this.state.prevImgHeight > 0 ? this.state.prevImgHeight : this.state.imgHeight} style={{ zIndex: 0, position: 'absolute', border: ['dashed', this.colors[this.order], '4px'].join(' '), borderRadius: '25px' }} />}
                        <button className="handle" style={{ zIndex: 200, position: 'relative' }}><span role="img" aria-label="handle emoji">🧲</span></button>
                        {!this.state.showCanvas && !this.state.fullscreen && 
                            <HotButton buttonClass="action" style={this.zButtonStyle} actionFN={this.smaller.bind(this)} keyName="-">-</HotButton>
                        }
                        {!this.state.showCanvas && !this.state.fullscreen && 
                            <HotButton buttonClass="action" style={this.zButtonStyle} actionFN={this.larger.bind(this)} keyName="=">+</HotButton>
                        }
                        {this.type === 'img' && 
                            <HotButton buttonClass="action" style={this.zButtonStyle} actionFN={this.toggleCanvas} keyName="shift+c">{this.state.showCanvas ? 'HIDE CANVAS' : 'SHOW CANVAS'}</HotButton>
                        }
                        <HotButton buttonClass="action" style={this.zButtonStyle} actionFN={this.enterFullscreen} keyName="f">FULLSCREEN</HotButton>
                    </div>
                </Draggable>


        )

    }
}

export default IAVMedia;

