import React, { Component } from 'react'
class DragAndDrop extends Component {
    state = {
        drag: false
    }
    dropRef = React.createRef()
    handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }
    handleDragIn = (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.dragCounter++
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            this.setState({ drag: true })
        }
    }
    handleDragOut = (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.dragCounter--
        if (this.dragCounter === 0) {
            this.setState({ drag: false })
        }
    }
    handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.setState({ drag: false })
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            // console.log('[e.dataTransfer.files]', e.dataTransfer.files.length)
            this.props.handleFileDrop(e.dataTransfer.files)
            e.dataTransfer.clearData()
            this.dragCounter = 0
        } else {
            console.log(e.dataTransfer.getData('text/plain'));
            this.props.handleURLDrop(e.dataTransfer.getData('text/plain'));
        }
    }
    componentDidMount() {
        let div = this.dropRef.current
        div.addEventListener('dragenter', this.handleDragIn)
        div.addEventListener('dragleave', this.handleDragOut)
        div.addEventListener('dragover', this.handleDrag)
        div.addEventListener('drop', this.handleDrop)
    }
    componentWillUnmount() {
        let div = this.dropRef.current
        div.removeEventListener('dragenter', this.handleDragIn)
        div.removeEventListener('dragleave', this.handleDragOut)
        div.removeEventListener('dragover', this.handleDrag)
        div.removeEventListener('drop', this.handleDrop)
    }
    render() {
        return (
            <div className="dropzone-border" ref={this.dropRef}>
                {this.state.drag &&
                    <div className="dropzone-shadow" />
                }
                {/* {this.props.children} */}
            </div>
        )
    }
}
export default DragAndDrop