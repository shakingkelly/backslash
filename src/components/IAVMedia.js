import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import DrawArea from './DrawArea';
import Draggable from 'react-draggable';

class IAVMedia extends Component {


    // style = {
    //     maxWidth: '500px',
    //     overflow: 'auto', 
    //     resize: 'both'
    // }
    style = {
        maxWidth: '500px'
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
        imgWidth: 800,
        showCanvas: false,
        canvasWidth: 800,
        canvasHeight: 800,
        dragX: 10,
        dragY: 10
    }

    mediaClickHandler = (event) => { console.log('[IAVMedia] should play media file') }

    larger = () => {
        console.log('[larger]')
        if (this.state.imgWidth < 1000) {
            this.setState({ imgWidth: this.state.imgWidth + 100 })
        }
    }

    smaller = () => {
        console.log('[smaller]')
        if (this.state.imgWidth > 100) {
            this.setState({ imgWidth: this.state.imgWidth - 100 })
        }
    }

    toggleCanvas = () => {
        const boundingRect = this.refs.coverImg.getBoundingClientRect();
        this.setState({
            showCanvas: !this.state.showCanvas,
            canvasWidth: boundingRect.right - boundingRect.left,
            canvasHeight: boundingRect.bottom - boundingRect.top,
            dragX: boundingRect.left,
            dragY: boundingRect.top
        });
        console.log('[toggleCanvas]', this.state);
    }

    render() {
        console.log('[render]', this.url) // worked after put in publics
        return (
            <div>
                {
                    this.state.showCanvas ?
                        <div style={{ position: 'absolute', left: this.state.dragX, top: this.state.dragY }}>
                            {this.type === 'img' && <img ref='coverImg' width={this.state.imgWidth} src={this.url} alt={this.url} style={{ zIndex: 0, position: 'absolute', border: ['dashed', this.colors[this.order], '4px'].join(' ') }} />}
                            {this.type === 'img' && <DrawArea canvasWidth={this.state.canvasWidth} canvasHeight={this.state.canvasHeight} />}
                            {this.type === 'av' && <ReactPlayer style={this.style} url={this.url} controls={true} playing={true} />}
                            {/* {this.type === 'av' && <ReactPlayer url='https://www.youtube.com/watch?v=ysz5S6PUM-U' controls={true}/>} */}

                            <button style={{ zIndex: 200, position: 'relative' }}>{this.order}</button>
                            <button style={{ zIndex: 200, position: 'relative' }} onClick={this.larger.bind(this)}>+</button>
                            <button style={{ zIndex: 200, position: 'relative' }} onClick={this.smaller.bind(this)}>-</button>
                            {this.type === 'img' && <button onClick={this.toggleCanvas} style={{ zIndex: 200, position: 'relative' }}>hide canvas</button>}
                        </div>
                        :
                        <Draggable>
                            <div style={{ position: 'absolute', left: this.state.dragX, top: this.state.dragY }}>
                                {this.type === 'img' && <img ref='coverImg' width={this.state.imgWidth} src={this.url} alt={this.url} style={{ zIndex: 0, position: 'absolute', border: ['dashed', this.colors[this.order], '4px'].join(' ') }} />}
                                {this.type === 'av' && <ReactPlayer style={this.style} url={this.url} controls={true} playing={true} />}

                                <button style={{ zIndex: 200, position: 'relative' }}>{this.order}</button>
                                <button style={{ zIndex: 200, position: 'relative' }} onClick={this.larger.bind(this)}>+</button>
                                <button style={{ zIndex: 200, position: 'relative' }} onClick={this.smaller.bind(this)}>-</button>
                                {this.type === 'img' && <button onClick={this.toggleCanvas} style={{ zIndex: 200, position: 'relative' }}>show canvas</button>}
                            </div>
                        </Draggable>
                }
            </div>

            // , left: this.state.dragX, top: this.state.dragY 
            // canvasLeft={this.state.dragX} canvasTop={this.state.dragY}


        )

    }
}

export default IAVMedia;


// import React, { Component } from 'react';
// import DrawArea from './components/DrawArea'

// class Cover extends Component {

//     constructor() {
//         super();
//         this.state = {
//             imgWidth: 800,
//             showCanvas: false,
//             canvasWidth: 800,
//             canvasHeight: 800
//         }
//     }

//     toggleCanvas = () => {
//         const boundingRect = this.refs.coverImg.getBoundingClientRect();
//         this.setState({ showCanvas: !this.state.showCanvas, canvasWidth: boundingRect.right - boundingRect.left, canvasHeight: boundingRect.bottom - boundingRect.top });
//         console.log(this.state);
//     }


//     render() {
//         return (
//             <div>
//                 <div>
//                     <img ref='coverImg' width={this.state.imgWidth} src='./asset/cave.jpg' alt='./asset/cave.jpg' style={{ zIndex: 0, position: 'absolute' }} />
//                     {this.state.showCanvas && <DrawArea canvasWidth={this.state.canvasWidth} canvasHeight={this.state.canvasHeight} />}
//                     {/* applied style from css -> css file overrides inline style! */}
//                 </div>
//                 <button onClick={this.toggleCanvas} style={{zIndex: 200, position: 'relative'}}>{this.state.showCanvas ? 'hide' : 'show'}</button>
//             </div>
//         )
//     }



// }
// export default Cover;