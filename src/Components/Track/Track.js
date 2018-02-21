import React from 'react';
import './Track.css';

class Track extends React.Component {
  constructor(props) {
    super(props);

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.renderAction = this.renderAction.bind(this);
  }

  addTrack() {
    this.props.onAdd(this.props.track);
  }

  removeTrack() {
    this.props.onRemove(this.props.track);
  }

  renderAction() {
    if (this.props.isRemoval) {
      return
        <a id={this.props.track.key} className="Track-action" onClick={this.removeTrack}>-</a>
    } else {
      return
        <a id={this.props.track.key} className="Track-action" onClick={this.addTrack}>+</a>
    }
  }


  render() {
    return(
      <div className="Track">
        <div className="Track-information">
        //this should be filled
          <h3> {this.props.track.name} </h3>
          <p> {this.props.track.artist} | {this.props.track.album}</p>
        </div>
        <a className="Track-action"> plus or minus will go here </a>
      </div>
    );
  }
}

export default Track;
