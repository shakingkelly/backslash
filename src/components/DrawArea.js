import React from 'react';
import { SketchPicker } from 'react-color';
import HotButton from './HotButton';

class DrawArea extends React.Component {
    constructor() {
        super();

        this.state = {
            undolines: [],
            redolines: [],
            isDrawing: false,
            currStrokeWidth: 1,
            currStrokeColor: '#fff',
            showColors: false
        };

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);

        this.undo = this.undo.bind(this);
        this.redo = this.redo.bind(this);
        this.clearCanvas = this.clearCanvas.bind(this);
        this.toggleStroke = this.toggleStroke.bind(this);
        this.togglePicker = this.togglePicker.bind(this);
        this.pickColor = this.pickColor.bind(this);
    }

    componentDidMount() {
        document.addEventListener("mouseup", this.handleMouseUp);
    }

    componentWillUnmount() {
        document.removeEventListener("mouseup", this.handleMouseUp);
    }

    handleMouseDown(mouseEvent) {
        if (mouseEvent.button !== 0) {
            return;
        }

        const point = this.relativeCoordinatesForEvent(mouseEvent);
        if (!point) {
            return;
        }
        let newUndoLines = this.state.undolines;
        let newLine = [[point], this.state.currStrokeWidth, this.state.currStrokeColor];
        newUndoLines.push(newLine);

        this.setState({
            undolines: newUndoLines,
            redolines: [],
            isDrawing: true
        });
    }

    handleMouseMove(mouseEvent) {
        if (!this.state.isDrawing) {
            return;
        }

        const point = this.relativeCoordinatesForEvent(mouseEvent);
        if (!point) {
            return;
        }
        let newUndoLines = this.state.undolines;
        let lastLine = newUndoLines.pop();
        lastLine[0].push(point);
        newUndoLines.push(lastLine);

        this.setState({ undolines: newUndoLines });
    }

    handleMouseUp() {
        this.setState({ isDrawing: false });
    }

    relativeCoordinatesForEvent(mouseEvent) {
        const boundingRect = this.refs.drawArea.getBoundingClientRect();
        const relativeX = mouseEvent.clientX - boundingRect.left;
        const relativeY = mouseEvent.clientY - boundingRect.top;

        if (mouseEvent.clientX > boundingRect.right || mouseEvent.clientX < boundingRect.left || mouseEvent.clientY > boundingRect.bottom || mouseEvent.clientY < boundingRect.top) {
            // if (relativeX > 400 || relativeX < 0 || relativeY > 400 || relativeY < 0) 
            console.log('[DrawArea:coord] out of box, clicking button?')
            return null;
        } else {
            // console.log(relativeX, relativeY)
        }

        return {
            x: relativeX,
            y: relativeY,
        };
    }

    undo() {
        let newUndoLines = [...this.state.undolines];
        let newRedoLines = [...this.state.redolines];
        // console.log('[undo] before:', newUndoLines.length, newRedoLines.length)

        if (newUndoLines.length <= 0) {
            console.log('[undo] nothing there!')
            return;
        }
        newRedoLines.push(newUndoLines.pop());

        // console.log('[undo] after:', newUndoLines.length, newRedoLines.length)
        this.setState({ undolines: newUndoLines, redolines: newRedoLines });
    }

    redo() {
        let newUndoLines = [...this.state.undolines];
        let newRedoLines = [...this.state.redolines];
        // console.log('[redo] before:', newUndoLines.length, newRedoLines.length)
        if (newRedoLines.length <= 0) {
            console.log('[redo] nothing there!')
            return;
        }
        newUndoLines.push(newRedoLines.pop());

        // console.log('[redo] after:', newUndoLines.length, newRedoLines.length)
        this.setState({ undolines: newUndoLines, redolines: newRedoLines });
    }

    clearCanvas() {
        this.setState({ undolines: [], redolines: [], isDrawing: false })
    }

    toggleStroke() {
        if (this.state.currStrokeWidth === 1) {
            this.setState({currStrokeWidth: 10})
        } else {
            this.setState({currStrokeWidth: 1})
        }
    }

    togglePicker() {
        this.setState({showColors: !this.state.showColors})
    }

    pickColor(color) {
        this.setState({currStrokeColor: color.hex})
    }

    render() {
        return (
            <div
                className="draw-area"
                ref="drawArea"
                onMouseDown={this.handleMouseDown}
                onMouseMove={this.handleMouseMove}
                style={{
                    width: this.props.canvasWidth,
                    height: this.props.canvasHeight
                    // left: this.props.canvasLeft,
                    // top: this.props.canvasTop
                }}
            >
                <Drawing lines={this.state.undolines} />
                {/* <button className="action" onClick={this.undo}>undo</button>
                <button className="action" onClick={this.redo}>redo</button>
                <button className="action" onClick={this.clearCanvas}>clear canvas</button>
                <button className="action" onClick={this.toggleStroke}>{this.state.currStrokeWidth === 1 ? 'L' : 'S'}</button>
                <button className="action" onClick={this.togglePicker}>{this.state.showColors ? 'hide colors' : 'show colors'}</button> */}
                <HotButton className="action" actionFN={this.undo} keyName="ctrl+z">undo</HotButton>
                <HotButton className="action" actionFN={this.redo} keyName="ctrl+shift+z">redo</HotButton>
                <HotButton className="action" actionFN={this.clearCanvas} keyName="ctrl+c">clear</HotButton>
                <HotButton className="action" actionFN={this.toggleStroke} keyName="shift+b">{this.state.currStrokeWidth === 1 ? 'L' : 'S'}</HotButton>
                <HotButton className="action" actionFN={this.togglePicker} keyName="shift+h">{this.state.showColors ? 'hide colors' : 'show colors'}</HotButton>
                {this.state.showColors && <SketchPicker className="color-picker" color={this.state.currStrokeColor} onChangeComplete={this.pickColor} />}
            </div>
        );
    }
}

function Drawing({ lines }) {
    return (
        <svg className="drawing" style={{ width: '100%', height: '100%' }}>
            {lines.map((line, index) => (
                <DrawingLine key={index} line={line[0]} strokeWidth={line[1]} strokeColor={line[2]}/>
            ))}
        </svg>
    );
}

function DrawingLine({ line, strokeWidth, strokeColor }) {
    const pathData = "M " +
        line
            .map(p => {
                return `${p['x']} ${p['y']}`;
            })
            .join(" L ");

    return <path className="path" d={pathData} style={{ fill: 'none', strokeWidth: strokeWidth, stroke: strokeColor, strokeLinejoin: 'round', strokeLinecap: 'round' }} />;
}


export default DrawArea;