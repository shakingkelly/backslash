import React, { Component } from 'react';
import RichTextEditor from 'react-rte';
import HotButton from './HotButton';
import { Rnd } from 'react-rnd';

class Editor extends Component {

    constructor(props) {
        super(props);

        this.id = props.item.id;
        this.name = props.item.name;
        this.text = props.item.text;
        this.order = props.order;
        this.position = props.item.position;

        this.state = {
            // value: RichTextEditor.createEmptyValue(),
            value: RichTextEditor.createValueFromString(this.text, "markdown"),
            filename: this.name,
            inputValue: this.name,
            x: this.position ? this.position.x : 30,
            y: this.position ? this.position.y : 30,
            h: 0,
            w: 0
        }
    }


    // copied from IAVMedia 
    componentDidUpdate(prevProps, prevState) {
        this.id = this.props.item.id;
        this.name = this.props.item.name;
        this.text = this.props.item.text;
        this.order = this.props.order;
    }

    _logState() {
        let editorState = this.state.value.getEditorState();
        let contentState = window.contentState = editorState.getCurrentContent().toJS();
        console.log(contentState);
    }

    _onChange = (value) => {
        this.setState({ value });
        if (this.props.onChange) {
            // Send the changes up to the parent component as an HTML string.
            // This is here to demonstrate using `.toString()` but in a real app it
            // would be better to avoid generating a string on each change.
            this.props.onChange(value.toString('html'));
        }
    };

    _onChangeSource(event) {
        let source = event.target.value;
        let oldValue = this.state.value;
        this.setState({ value: oldValue.setContentFromString(source, this.state.format, { customBlockFn: this.getTextAlignBlockMetadata }) });
    }

    getTextAlignClassName = (contentBlock) => {
        switch (contentBlock.getData().get('textAlign')) {
            case 'ALIGN_LEFT':
                return 'text-align--left';
            case 'ALIGN_CENTER':
                return 'text-align--center';
            case 'ALIGN_RIGHT':
                return 'text-align--right';
            case 'ALIGN_JUSTIFY':
                return 'text-align--justify';
            default:
                return '';
        }
    };
    getTextAlignStyles = (contentBlock) => {
        switch (contentBlock.getData().get('textAlign')) {
            case 'ALIGN_LEFT':
                return { style: { textAlign: 'left' } };
            case 'ALIGN_CENTER':
                return { style: { textAlign: 'center' } };
            case 'ALIGN_RIGHT':
                return { style: { textAlign: 'right' } };
            case 'ALIGN_JUSTIFY':
                return { style: { textAlign: 'justify' } };
            default:
                return {};
        }
    };
    getTextAlignBlockMetadata = (element) => {
        switch (element.style.textAlign) {
            case 'right':
                return { data: { textAlign: 'ALIGN_RIGHT' } };
            case 'center':
                return { data: { textAlign: 'ALIGN_CENTER' } };
            case 'justify':
                return { data: { textAlign: 'ALIGN_JUSTIFY' } };
            case 'left':
                return { data: { textAlign: 'ALIGN_LEFT' } };
            default:
                return {};
        }
    };



    save = () => {
        this._logState();
        // const newFilename = document.getElementById("filename").value;
        const newFilename = this.state.inputValue;
        const newText = this.state.value.toString('markdown', { blockStyleFn: this.getTextAlignStyles });
        this.setState({ filename: newFilename });
        this.props.changeEditorFilenameFN(this.id, newFilename, newText);
        return newFilename;
    }
    download = () => {
        const newFilename = this.save();
        const element = document.createElement("a");
        const file = new Blob([this.state.value.toString('markdown', { blockStyleFn: this.getTextAlignStyles })], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = newFilename + ".md";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    render() {

        return (
            <Rnd
                size={{ width: this.state.w, height: this.state.h }}
                position={{ x: this.state.x, y: this.state.y }}
                onDragStop={(e, d) => { 
                    this.setState({ x: d.x, y: d.y });
                    this.props.savePositionFN(this.id, d.x, d.y);
                }}
                onResize={(e, direction, ref, delta, position) => {
                    this.setState({
                        w: ref.offsetWidth,
                        h: ref.offsetHeight,
                        ...position,
                    });
                }}
                dragHandleClassName="handle"
                minWidth='480px'
                minHeight='200px'
            >
                <div className="editor-container"> 
                    <div className="list-item">
                        <HandleButton />
                        <button onClick={this.props.changeOrderFN(this.id)} style={this.zButtonStyle}>bring to front</button>
                        <input className="editor-filename" type="text" placeholder="filename" value={this.state.inputValue} onChange={e => this.setState({ inputValue: e.target.value })} />
                        <HotButton buttonClass="action" actionFN={this.save} keyName="ctrl+s">Save</HotButton>
                        <HotButton buttonClass="files" actionFN={this.download} keyName="ctrl+d">Download</HotButton>
                    </div>
                    <div className="editor">
                        <RichTextEditor
                            // toolbarConfig={toolbarConfig}
                            value={this.state.value}
                            onChange={this._onChange}
                            placeholder="Tell a story"
                            blockStyleFn={this.getTextAlignClassName}
                        />
                        {/* debug */}
                        {/* <div className="row">
                            <textarea
                                className="source"
                                placeholder="Editor Source"
                                value={this.state.value.toString('markdown', { blockStyleFn: this.getTextAlignStyles })}
                                onChange={this._onChangeSource}
                            />
                        </div> */}
                    </div>
                </div>
            </Rnd>
        );
    }
}

export default Editor;

const HandleButton = () => {
    return (
        <button className="handle" style={{ zIndex: 200, position: 'relative' }}>
            <span role="img" aria-label="handle emoji">🧲</span>
        </button>
    )
}

    // downloadTxtFile = () => {
    //     const element = document.createElement("a");
    //     const file = new Blob([this.state.value.toString('markdown', { blockStyleFn: this.getTextAlignStyles })], { type: 'text/plain' });
    //     element.href = URL.createObjectURL(file);
    //     const filename = document.getElementById("filename").value;
    //     element.download = filename + ".md";
    //     document.body.appendChild(element); // Required for this to work in FireFox
    //     element.click();
    //     return filename;
    // }
    // saveMarkdown = () => {
    //     this._logState();
    //     const newFilename = this.downloadTxtFile();
    //     this.setState({ filename: newFilename });
    //     this.changeEditorFilename(this.id, newFilename);
    // }