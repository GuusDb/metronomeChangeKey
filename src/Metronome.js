import React, { Component } from 'react';
import './metronome.css';

const click1 = '//daveceddia.com/freebies/react-metronome/click1.wav';
const click2 = '//daveceddia.com/freebies/react-metronome/click2.wav';
const notes = [
  'C',
  'C#',
  'Db',
  'D',
  'D#',
  'Eb',
  'E',
  'F',
  'F#',
  'Gb',
  'G',
  'G#',
  'Ab',
  'A',
  'A#',
  'Bb',
  'B',
];

class Metronome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPlaying: false,
      count: 0,
      bpm: 100,
      beatsPerMeasure: 4,
      measure: 0,
      measureChange: 2,
      note: 'C',
    };

    this.click1 = new Audio(click1);
    this.click2 = new Audio(click2);
  }

  handleInputChange = (event) => {
    const bpm = event.target.value;

    if (this.state.isPlaying) {
      // stop old timer and start a new one
      clearInterval(this.timer);
      this.timer = setInterval(this.playClick, (60 / bpm) * 1000);

      // set the new bpm
      // and reset the beat counter
      this.setState({
        count: 0,
        bpm,
      });
    } else {
      // otherwise, just update the bpm
      this.setState({ bpm });
    }
  };

  handleMeasureChange = (event) => {
    const measureChange = event.target.value;

    if (this.state.isPlaying) {
      // stop old timer and start a new one
      clearInterval(this.timer);
      this.timer = setInterval(this.playClick, (60 / this.state.bpm) * 1000);

      // set the new bpm
      // and reset the beat counter
      this.setState({
        count: 0,
        measureChange,
      });
    } else {
      // otherwise, just update the bpm
      this.setState({ measureChange });
    }
  };

  playClick = () => {
    const { count, beatsPerMeasure, measure, measureChange } = this.state;

    // alternate click sounds
    if (count % beatsPerMeasure === 0) {
      this.click2.play();
      if (measure % measureChange === 0) {
        this.state.note = notes[Math.floor(Math.random() * notes.length)];
      }
      this.setState((state) => ({
        measure: (state.measure + 1) % state.measureChange,
      }));
    } else {
      this.click1.play();
    }

    // keep track of which beat we're on
    this.setState((state) => ({
      count: (state.count + 1) % state.beatsPerMeasure,
    }));
  };

  startStop = () => {
    if (this.state.isPlaying) {
      // stop the timer
      clearInterval(this.timer);
      this.setState({
        isPlaying: false,
      });
    } else {
      // start a timer with current bpm
      this.timer = setInterval(this.playClick, (60 / this.state.bpm) * 1000);
      this.setState(
        {
          count: 0,
          isPlaying: true,
          measure: 0,
          // play a click immediately (after setState finishes)
        },
        this.playClick,
      );
    }
  };

  render() {
    const { isPlaying, bpm } = this.state;

    return (
      <div className='metronome'>
        <div className='bpm-slider'>
          <h1>{this.state.note}</h1>
          <p>{bpm} BPM</p>
          <input
            type='range'
            min='60'
            max='240'
            value={bpm}
            onChange={this.handleInputChange}
          />
          <label for='tentacles'>Measures per key change</label>
          <input
            type='number'
            id='measure'
            name='measure'
            min='1'
            max='20'
            defaultValue={this.state.measureChange}
            onChange={this.handleMeasureChange}
          ></input>
        </div>
        <button onClick={this.startStop}>{isPlaying ? 'Stop' : 'Start'}</button>
      </div>
    );
  }
}

export default Metronome;
