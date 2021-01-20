import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import DrawArea from './DrawArea';
import Draggable from 'react-draggable';

class IAVMedia extends Component {

    style = {
        maxWidth: '640px'
    }

    colors = { 0: 'red', 1: 'orange', 2: 'Yellow', 3: 'lime', 4: 'green', 5: 'blue', 6: 'navy', 7: 'purple', 8: 'indigo', 9: 'dimgray' }

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
        canvasWidth: 800,
        canvasHeight: 800,
        dragX: 0,
        dragY: 0,
        fullscreen: false,
        prevImgWidth: 640
    }

    mediaClickHandler = (event) => { console.log('[IAVMedia] playing') };

    larger = () => {
        if (this.state.imgWidth < window.innerWidth) {
            this.setState({ imgWidth: this.state.imgWidth + 100, prevImgWidth: this.state.imgWidth + 100 });
        }
    }

    smaller = () => {
        if (this.state.imgWidth > 100) {
            this.setState({ imgWidth: this.state.imgWidth - 100, prevImgWidth: this.state.imgWidth - 100 });
        }
    }

    toggleFullscreen = () => {
        if (!this.state.fullscreen) {
            const tempWidth = this.state.imgWidth;
            this.setState({ imgWidth: window.innerWidth, prevImgWidth: tempWidth, fullscreen: true });
        } else {
            if (this.type === 'img') {
                this.toggleCanvas();
            }
            this.setState({ imgWidth: this.state.prevImgWidth, fullscreen: false });
        }
    }

    toggleCanvas = () => {
        const boundingRect = this.refs.coverImg.getBoundingClientRect();
        this.setState({
            showCanvas: !this.state.showCanvas,
            canvasWidth: boundingRect.right - boundingRect.left,
            canvasHeight: boundingRect.bottom - boundingRect.top
            // dragX: boundingRect.left,
            // dragY: boundingRect.top
        });
    }

    render() {
        console.log('[IAVMedia:render]', this.url); // worked after put in publics
        const avWidth = this.state.imgWidth.toString() + 'px';
        const avHeight = (this.state.imgWidth * 9 / 16).toString() + 'px';

        return (
            <Draggable handle='.handle'>
                <div style={{ position: 'absolute', left: this.state.dragX, top: this.state.dragY }}>
                    {this.type === 'img' && <img ref='coverImg' width={this.state.imgWidth} src={this.url} alt={this.url} style={{ zIndex: 0, position: 'absolute', border: ['dashed', this.colors[this.order], '4px'].join(' ') }} />}
                    {this.type === 'img' && this.state.showCanvas && <DrawArea canvasWidth={this.state.canvasWidth} canvasHeight={this.state.canvasHeight} />}
                    {this.type === 'av' && <ReactPlayer url={this.url} controls={true} width={avWidth} height={avHeight} style={{ zIndex: 0, position: 'absolute', border: ['dashed', this.colors[this.order], '4px'].join(' ') }} />}
                    <button className="handle button-order-num pure-button" style={{ zIndex: 200, position: 'relative' }}>{this.order}</button>
                    {!this.state.showCanvas && !this.state.fullscreen && <button className="button-sizer pure-button" style={{ zIndex: 200, position: 'relative' }} onClick={this.smaller.bind(this)}>-</button>}
                    {!this.state.showCanvas && !this.state.fullscreen && <button className="button-sizer pure-button" style={{ zIndex: 200, position: 'relative' }} onClick={this.larger.bind(this)}>+</button>}
                    {this.type === 'img' && <button className="button-canvas pure-button" onClick={this.toggleCanvas} style={{ zIndex: 200, position: 'relative' }}>{this.state.showCanvas ? 'HIDE CANVAS' : 'SHOW CANVAS'}</button>}
                    <button style={{ zIndex: 200, position: 'relative' }} onClick={this.toggleFullscreen}>{this.state.fullscreen ? 'ESC' : 'FULLSCREEN'}</button>
                </div>
            </Draggable>
        )

    }
}

export default IAVMedia;

