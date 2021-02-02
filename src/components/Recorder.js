import React, { Component } from "react";

const audioType = "audio/*";

class Recorder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time: {},
            seconds: 0,
            paused: false,
            recording: false,
            mediaNotFound: false,
            audioURL: null,
            audioBlob: null
        };
        this.timer = 0;
        this.startTimer = this.startTimer.bind(this);
        this.getDuration = this.getDuration.bind(this);
    }

    startRecording(e) {
        e.preventDefault();
        // wipe old data chunks
        this.chunks = [];
        // start recorder with 10ms buffer
        this.mediaRecorder.start(10);
        this.startTimer();
        this.setState({ recording: true, paused: false });
    }

    stopRecording(e) {
        clearInterval(this.timer);
        e.preventDefault();
        this.mediaRecorder.stop();
        this.setState({ time: {}, recording: false, paused: false });
        this.saveAudio();
    }

    reset(e) {
        if (this.state.recording) {
            this.stopRecording(e);
        }
        this.setState({
            time: {},
            seconds: 0,
            paused: false,
            recording: false,
            mediaNotFound: false,
            audioURL: null,
            audioBlob: null
        });

    }

    handleAudioPause(e) {
        e.preventDefault();
        clearInterval(this.timer);
        this.mediaRecorder.pause();
        this.setState({ paused: true });
    }

    handleAudioStart(e) {
        e.preventDefault();
        this.startTimer();
        this.mediaRecorder.resume();
        this.setState({ paused: false });
    }

    saveAudio() {
        const audioBlob = new Blob(this.chunks, { type: audioType });
        const audioURL = window.URL.createObjectURL(audioBlob);
        this.setState({ audioURL: audioURL, audioBlob: audioBlob });
    }

    startTimer() {
        this.timer = setInterval(this.getDuration, 1000);
    }
    secondsToTime(secs) {
        let hours = Math.floor(secs / (60 * 60));
        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);
        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);
        let obj = {
            h: hours,
            m: minutes,
            s: seconds
        };
        return obj;
    }
    getDuration() {
        // add one second, set state so a re-render happens.
        let seconds = this.state.seconds + 1;
        this.setState({
            time: this.secondsToTime(seconds),
            seconds: seconds
        });
    }

    async componentDidMount() {
        // console.log(navigator.mediaDevices);
        navigator.getUserMedia =
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia;
        if (navigator.mediaDevices) {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            this.chunks = [];
            this.mediaRecorder.ondataavailable = e => {
                if (e.data && e.data.size > 0) {
                    this.chunks.push(e.data);
                }
            };
        } else {
            this.setState({ mediaNotFound: true });
            console.log("Media Decives will work only with SSL.....");
        }
    }

    render() {
        const { recording, audioURL, time, mediaNotFound, paused } = this.state;
        return (
            <div className='recorder_library_box'>
                {!mediaNotFound ? (
                    <div className='record_section'>
                        <div className='audio_section'>
                            {audioURL !== null ? (
                                <div>
                                    <audio controls style={{width: '250px'}}>
                                        <source src={audioURL} type="audio/ogg" />
                                        <source src={audioURL} type="audio/mpeg" />
                                    </audio>
                                    <button className='handle' onClick={(e) => this.reset(e)}>🔄</button>
                                    <button className='handle'><a href={this.state.audioURL} download="Blah.webm">⬇️</a></button>
                                </div>
                            ) : null}
                        </div>
                        {!recording ? (
                            !audioURL && <button className='handle' onClick={e => this.startRecording(e)}>⏺️</button>
                        ) : (
                                <div className='record_controller'>
                                    <div className='duration' style={{ color: '#fff', fontSize: '25px' }}>
                                        {time.m !== undefined ? `${time.m <= 9 ? "0" + time.m : time.m}` : "00"}:{time.s !== undefined ? `${time.s <= 9 ? "0" + time.s : time.s}` : "00"}
                                    </div>
                                    <button className='handle' onClick={e => this.stopRecording(e)}>⏹️</button>
                                    <button className='handle' onClick={!paused ? e => this.handleAudioPause(e) : e => this.handleAudioStart(e)}>{paused ? '▶️' : '⏸️'}</button>
                                </div>
                            )}
                    </div>
                ) : (
                        <p style={{ color: "#fff", marginTop: 30, fontSize: 25 }}>
                            Seems the site is Non-SSL
                        </p>
                    )}
            </div>
        );
    }
}

export default Recorder;
