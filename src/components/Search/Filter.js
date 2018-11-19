import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Filter extends Component {
  static propTypes = {
    updateQuery: PropTypes.func.isRequired,
  }

  state = {
    inputValue: '',
  }

  updateInput = (inputValue) => {
    this.setState({ inputValue });
  }

  render() {
    const { inputValue } = this.state;
    const { updateQuery } = this.props;
    return (
      <label htmlFor="filter-text">
        <input
          id="filter-text"
          type="text"
          role="search"
          placeholder="Filter"
          value={inputValue}
          onChange={(event) => {
            this.updateInput(event.target.value);
            updateQuery(event.target.value);
          }}
        />
        <span id="filter-help">
          Filter
        </span>
      </label>
    );
  }
}

export default Filter;
