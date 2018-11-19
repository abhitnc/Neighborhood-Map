import React, { Component } from 'react';
import './App.css';
import { Header, Search } from './components';

class NeighborhoodApp extends Component {
  state = {
    isListOpen: false,
  }

  showListView = () => {
    this.setState(prevState => ({
      isListOpen: !prevState.isListOpen,
    }));
  }

  render() {
    const { isListOpen } = this.state;
    return (
      <div className="App">
        <Header showPlaceList={this.showListView} />
        <Search isListOpen={isListOpen} />
      </div>
    );
  }
}

export default NeighborhoodApp;
