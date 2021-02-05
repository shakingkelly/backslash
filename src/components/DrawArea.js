import React from 'react';
import { SketchPicker } from 'react-color';
import HotButton from './HotButton';

class DrawArea extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            undolines: props.prevUndolines || [],
            redolines: props.prevRedolines || [],
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
        if (mouseEvent.button !== 0 || !this.props.isVisible) {
            return;
        }
        const point = this.relativeCoordinatesForEvent(mouseEvent);
        if (!point) {
            return;
        }
        let newUndoLines = this.state.undolines;
        let newLine = [[this.relativePosToLengthPercent(point)], this.state.currStrokeWidth, this.state.currStrokeColor];
        newUndoLines.push(newLine);
        this.setState({
            undolines: newUndoLines,
            redolines: [],
            isDrawing: true
        });
    }

    handleMouseMove(mouseEvent) {
        if (!this.state.isDrawing || !this.props.isVisible) {
            return;
        }
        const point = this.relativeCoordinatesForEvent(mouseEvent);
        if (!point) {
            return;
        }
        let newUndoLines = this.state.undolines;
        let lastLine = newUndoLines.pop();
        lastLine[0].push(this.relativePosToLengthPercent(point));
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
        }
        return { rx: relativeX, ry: relativeY };
    }
    relativePosToLengthPercent = (point) => {
        return { pw: point.rx / this.props.canvasWidth, ph: point.ry / this.props.canvasHeight };
    }
    lengthPercentToRelativePos = (percent) => {
        return { rx: percent.pw * this.props.canvasWidth, ry: percent.ph * this.props.canvasHeight };
    }

    undo() {
        let newUndoLines = [...this.state.undolines];
        let newRedoLines = [...this.state.redolines];
        if (newUndoLines.length <= 0) {
            console.log('[undo] nothing there!')
            return;
        }
        newRedoLines.push(newUndoLines.pop());
        this.setState({ undolines: newUndoLines, redolines: newRedoLines });
    }

    redo() {
        let newUndoLines = [...this.state.undolines];
        let newRedoLines = [...this.state.redolines];
        if (newRedoLines.length <= 0) {
            console.log('[redo] nothing there!')
            return;
        }
        newUndoLines.push(newRedoLines.pop());
        this.setState({ undolines: newUndoLines, redolines: newRedoLines });
    }

    clearCanvas() {
        this.setState({ undolines: [], redolines: [], isDrawing: false })
    }

    toggleStroke() {
        if (this.state.currStrokeWidth === 1) {
            this.setState({ currStrokeWidth: 10 })
        } else {
            this.setState({ currStrokeWidth: 1 })
        }
    }

    togglePicker() {
        this.setState({ showColors: !this.state.showColors })
    }

    pickColor(color) {
        this.setState({ currStrokeColor: color.hex })
    }

    render() {
        return (
            <div
                className={this.props.className === "shown" ? "draw-area-shown" : "draw-area-hidden"}
                ref="drawArea"
                onMouseDown={this.handleMouseDown} onMouseMove={this.handleMouseMove}
                style={{ width: this.props.canvasWidth, height: this.props.canvasHeight }}
            >
                <Drawing lines={this.state.undolines} scaleFN={this.lengthPercentToRelativePos} />
                <HotButton buttonClass="action" actionFN={this.undo} keyName="ctrl+z">undo</HotButton>
                <HotButton buttonClass="action" actionFN={this.redo} keyName="ctrl+shift+z">redo</HotButton>
                <HotButton buttonClass="action" actionFN={this.clearCanvas} keyName="ctrl+c">clear</HotButton>
                <HotButton buttonClass="action" actionFN={this.toggleStroke} keyName="shift+b">{this.state.currStrokeWidth === 1 ? 'L' : 'S'}</HotButton>
                <HotButton buttonClass="action" actionFN={this.togglePicker} keyName="shift+h">{this.state.showColors ? 'hide colors' : 'show colors'}</HotButton>
                {this.state.showColors && <SketchPicker className="color-picker" color={this.state.currStrokeColor} onChangeComplete={this.pickColor} />}
            </div>
        );
    }
}

function Drawing({ lines, scaleFN }) {
    return (
        <svg className="drawing" width='100%' height='100%'>
            {/* viewBox="0 0 640 360" preserveAspectRatio="none" width={boxWidth} height={boxHeight} */}
            {lines.map((line, index) => (
                <DrawingLine key={index} line={line[0]} strokeWidth={line[1]} strokeColor={line[2]} scaleFN={scaleFN} />
            ))}
        </svg>
    );
}

function DrawingLine({ line, strokeWidth, strokeColor, scaleFN }) {
    const pathData = "M " +
        line
            .map(p => {
                const scaledP = scaleFN(p);
                return `${scaledP['rx']} ${scaledP['ry']}`;
            })
            .join(" L ");

    return <path className="path" d={pathData} style={{ fill: 'none', strokeWidth: strokeWidth, stroke: strokeColor, strokeLinejoin: 'round', strokeLinecap: 'round' }} />;
}

export default DrawArea;