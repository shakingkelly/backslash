import React, { Component } from 'react';
import ReactPlayer from 'react-player';

class IAVMedia extends Component {


    // style = {
    //     maxWidth: '500px',
    //     overflow: 'auto', 
    //     resize: 'both'
    // }
    style = {
        maxWidth: '500px'
    }

    colors = {0: 'red', 1: 'orange', 2: 'Yellow', 3: 'lime', 4: 'green', 5: 'blue', 6: 'navy', 7: 'purple', 8: 'indigo', 9: 'dimgray'}

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

    state = { width: 500 }

    mediaClickHandler = (event) => { console.log('[IAVMedia] should play media file') }

    larger = () => {
        console.log('[larger]')
        if (this.state.width < 1000) {
            this.setState({width: this.state.width + 100})
        }
    }

    smaller = () => {
        console.log('[smaller]')
        if (this.state.width > 100) {
            this.setState({width: this.state.width - 100})
        }
    }

    render() {
        console.log('[render]', this.url) // worked after put in pulics
        return (
            <div style={{ display: 'inline-block', border: ['dashed', this.colors[this.order], '4px'].join(' ') }}>
                {this.type === 'img' && <img width={this.state.width} src={this.url} alt={this.url} />}
                {this.type === 'av' && <ReactPlayer style={this.style} url={this.url} controls={true} playing={true} />}
                {/* {this.type === 'av' && <ReactPlayer url='https://www.youtube.com/watch?v=ysz5S6PUM-U' controls={true}/>} */}

                <button>{this.order}</button>
                <button onClick={this.larger.bind(this)}>+</button>
                <button onClick={this.smaller.bind(this)}>-</button>

            </div>
        )

    }
}

export default IAVMedia;