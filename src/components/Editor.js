import React, { Component } from 'react';
import RichTextEditor from 'react-rte';
import { convertToRaw } from 'draft-js';

class Editor extends Component {

  state = {
    value: RichTextEditor.createEmptyValue()
  }

  _logState() {
    let editorState = this.state.value.getEditorState();
    let contentState = window.contentState = editorState.getCurrentContent().toJS();
    console.log(contentState);
  }

  _logStateRaw() {
    let editorState = this.state.value.getEditorState();
    let contentState = editorState.getCurrentContent();
    let rawContentState = convertToRaw(contentState);
    console.log(JSON.stringify(rawContentState));
  }

  _onChange = (value) => {
    this.setState({value});
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
      value: oldValue.setContentFromString(source, this.state.format, {customBlockFn: this.getTextAlignBlockMetadata}),
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
    const file = new Blob([this.state.value.toString('markdown', { blockStyleFn: this.getTextAlignStyles })], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    const filename = document.getElementById("filename").value; 
    element.download = filename + ".md";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  saveMarkdown = () => {
    this._logState();
    this.downloadTxtFile();
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
      <div style={{width: '560px'}}>
        <input type="text" id="filename" placeholder="filename" style={{width: '553px'}}></input>
        <RichTextEditor
          // toolbarConfig={toolbarConfig}
          value={this.state.value}
          onChange={this._onChange}
          placeholder="Tell a story"
          blockStyleFn={this.getTextAlignClassName}
        />
        <button onClick={this.saveMarkdown}>Download</button>

        {/* <div className="row">
          <textarea
            className="source"
            placeholder="Editor Source"
            value={this.state.value.toString('markdown', { blockStyleFn: this.getTextAlignStyles })}
            onChange={this._onChangeSource}
          />
        </div> */}
      </div>

    );
  }
}

export default Editor;

