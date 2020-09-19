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
    }

    name = this.props.item.name;
    url = this.props.item.url;
    type = this.props.item.type;

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
            <div style={{ display: 'inline-block' }}>
                {this.type === 'img' && <img width={this.state.width} src={this.url} alt={this.url} />}
                {this.type === 'av' && <ReactPlayer style={this.style} url={this.url} controls={true} playing={true} />}
                {/* {this.type === 'av' && <ReactPlayer url='https://www.youtube.com/watch?v=ysz5S6PUM-U' controls={true}/>} */}

                <button onClick={this.larger.bind(this)}>+</button>
                <button onClick={this.smaller.bind(this)}>-</button>

            </div>
        )

    }
}

export default IAVMedia;