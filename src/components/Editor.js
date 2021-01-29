import React, { Component } from 'react';
import RichTextEditor from 'react-rte';
import Draggable from 'react-draggable';
import HotButton from './HotButton';

class Editor extends Component {

    // copied from IAVMedia 
    componentDidUpdate(prevProps, prevState) {
        console.log('[componentDidUpdate]', prevProps.item.name, this.props.item.name);
        this.id = this.props.item.id;
        this.name = this.props.item.name;
        this.text = this.props.item.text;
        this.order = this.props.order;
    }

    id = this.props.item.id;
    name = this.props.item.name;
    text = this.props.item.text;
    changeEditorFilename = this.props.changeEditorFilenameFn;
    order = this.props.order;

    state = {
        // value: RichTextEditor.createEmptyValue()
        value: RichTextEditor.createValueFromString(this.text, "markdown"),
        filename: this.name,
        inputValue: this.name
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
            this.props.onChange(
                value.toString('html')
            );
        }
    };

    _onChangeSource(event) {
        let source = event.target.value;
        let oldValue = this.state.value;
        this.setState({
            value: oldValue.setContentFromString(source, this.state.format, { customBlockFn: this.getTextAlignBlockMetadata }),
        });
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
                return {
                    style: {
                        textAlign: 'left',
                    },
                };

            case 'ALIGN_CENTER':
                return {
                    style: {
                        textAlign: 'center',
                    },
                };

            case 'ALIGN_RIGHT':
                return {
                    style: {
                        textAlign: 'right',
                    },
                };

            case 'ALIGN_JUSTIFY':
                return {
                    style: {
                        textAlign: 'justify',
                    },
                };

            default:
                return {};
        }
    };
    getTextAlignBlockMetadata = (element) => {
        switch (element.style.textAlign) {
            case 'right':
                return {
                    data: {
                        textAlign: 'ALIGN_RIGHT',
                    },
                };

            case 'center':
                return {
                    data: {
                        textAlign: 'ALIGN_CENTER',
                    },
                };

            case 'justify':
                return {
                    data: {
                        textAlign: 'ALIGN_JUSTIFY',
                    },
                };

            case 'left':
                return {
                    data: {
                        textAlign: 'ALIGN_LEFT',
                    },
                };

            default:
                return {};
        }
    };

    downloadTxtFile = () => {
        const element = document.createElement("a");
        const file = new Blob([this.state.value.toString('markdown', { blockStyleFn: this.getTextAlignStyles })], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        const filename = document.getElementById("filename").value;
        element.download = filename + ".md";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
        return filename;
    }
    saveMarkdown = () => {
        this._logState();
        const newFilename = this.downloadTxtFile();
        this.setState({ filename: newFilename });
        this.changeEditorFilename(this.id, newFilename);
    }

    save = () => {
        this._logState();
        // const newFilename = document.getElementById("filename").value;
        const newFilename = this.state.inputValue;
        const newText = this.state.value.toString('markdown', { blockStyleFn: this.getTextAlignStyles });
        console.log('[Editor.js save]', newText);
        this.setState({ filename: newFilename });
        this.changeEditorFilename(this.id, newFilename, newText);
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
        const toolbarConfig = {
            // Optionally specify the groups to display (displayed in the order listed).
            display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS'],
            INLINE_STYLE_BUTTONS: [
                { label: 'Bold', style: 'BOLD', className: 'custom-css-class' },
                { label: 'Italic', style: 'ITALIC' },
                { label: 'Underline', style: 'UNDERLINE' }
            ],
            BLOCK_TYPE_DROPDOWN: [
                { label: 'Normal', style: 'unstyled' },
                { label: 'Heading Large', style: 'header-one' },
                { label: 'Heading Medium', style: 'header-two' },
                { label: 'Heading Small', style: 'header-three' }
            ],
            BLOCK_TYPE_BUTTONS: [
                { label: 'UL', style: 'unordered-list-item' },
                { label: 'OL', style: 'ordered-list-item' }
            ]
        };
        return (
            <Draggable handle=".handle">
                <div>  {/* className="box no-cursors" */}
                    <div className="list-item">
                        <button className="handle"><span role="img" aria-label="handle emoji">🧲</span></button>
                        <input className="editor-filename" type="text" placeholder="filename" value={this.state.inputValue} onChange={e => this.setState({ inputValue: e.target.value })} />
                        {/* <button className="action" onClick={this.save}>Save</button>
                        <button className="files" onClick={this.download}>Download</button> */}
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
            </Draggable>

        );
    }
}

export default Editor;

