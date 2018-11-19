import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import Filter from './Filter';
import PlacesList from './PlacesList';
import GoogleMap from './GoogleMap';

class Search extends Component {

  updateQuery = debounce((query) => { this.updateQueryState(query); }, 300);
static propTypes = {
    isListOpen: PropTypes.bool.isRequired,
  };
  state = {
    locations: [],
    filterQuery: '',
    selectedPlaceTitle: '',
  }
  componentDidMount() {
    fetch('https://api.foursquare.com/v2/venues/search?ll=20.339457,85.807439&client_id=CVWIG4CWVEER0UPINDFIIWU4FLFYW1JPXCTR5TWTPYPL5KOF&client_secret=UZPWQWMG2MDEDHGQ33XIAP3IZMDDRWKAYWZDR10NNXDLON1E&limit=25&v=20180707')
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        throw Error('No data found for co-ordinates: 22.5726,88.3639');
      })
      .then((data) => {
        if (data.response && data.response.venues) {
          const locations = data.response.venues;
          this.setState({ locations });
        } else {
          throw Error('No venues detail found for co-ordinates: 22.5726,88.3639');
        }
      })
      .catch(error => this.handleRequestError(error));
  }
  handleRequestError = (error) => {
    const listElement = window.document.getElementById('places-list');
    const errorPara = window.document.createElement('p');
    errorPara.className = 'error';
    errorPara.textContent = error;
    errorPara.style = 'color: red';
    listElement.appendChild(errorPara);
  }
  updateQueryState = (filterQuery) => {
    this.setState({ filterQuery });
  }
  selectPlace = (selectedPlaceTitle) => {
    this.setState({ selectedPlaceTitle });
  }

  render() {
    const { locations, filterQuery, selectedPlaceTitle } = this.state;
    const { isListOpen } = this.props;
    let filteredLocations;
    if (filterQuery.trim()) {
      const match = new RegExp(escapeRegExp(filterQuery.trim()), 'i');
filteredLocations = locations.filter(location => match.test(location.name));
    } else {
      filteredLocations = locations;
    }

    return (
      <main aria-label="Neighborhood Map" role="main">
        <section id="placelistview" className={isListOpen ? 'listview open' : 'listview'}>
          {}
          <Filter updateQuery={this.updateQuery} />
          {}
          <PlacesList
            locations={filteredLocations}
            selectPlace={this.selectPlace}
          />
        </section>
        {}
        <GoogleMap
          locations={filteredLocations}
          filterText={filterQuery}
          selectedPlaceTitle={selectedPlaceTitle}
        />
      </main>
    );
  }
}
export default Search;