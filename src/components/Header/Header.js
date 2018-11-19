import React from 'react';
import PropTypes from 'prop-types';
import Toggle from './Toggle';

const Header = ({ showPlaceList }) => (
  <header>
    <h1 id="page-header">
      Infocity Bhubaneswar
    </h1>
    {}
    <Toggle showPlaceList={showPlaceList} />
  </header>
);
Header.propTypes = {
  showPlaceList: PropTypes.func.isRequired,
};

export default Header;
