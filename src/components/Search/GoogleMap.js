import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp';
import PropTypes from 'prop-types';

class GoogleMap extends Component {
 
  static mapMarkerToMap(place, map, i) {
    const label = place.name[0];
    const marker = new window.google.maps.Marker({
      map,
      position: { lat: place.location.lat, lng: place.location.lng },
      title: place.name,
      animation: window.google.maps.Animation.DROP,
      id: i,
      label,
    });
    return marker;
  }

  static populateInfoWindow = (map, marker, infowindow) => {
    if (infowindow.getPosition() !== marker.position) {
      if (infowindow.marker) {
        infowindow.marker.setAnimation(null);
      }
    marker.setAnimation(window.google.maps.Animation.BOUNCE);
      infowindow.marker = marker;
      infowindow.setContent(`<div>${marker.title}</div>`);
      infowindow.open(map, marker);
      infowindow.addListener('closeclick', () => {
        infowindow.setPosition(null);
        marker.setAnimation(null);
      });
      GoogleMap.fetchWikiData(marker, infowindow);
    }
  };

  static fetchWikiData = (marker, infowindow) => {
    const address = marker.title;
    const wikiurl = `https://en.wikipedia.org/w/api.php?&origin=*&action=opensearch&format=json&search=${address}`;
    let wikiElemItem = `<div role="dialog" class="infowindow" tabindex="0" aria-labelledby="infowindow-help">
      <h2>${address}</h2>
      <p id="infowindow-help">Relevant Wikipedia Links</p>
    <ul>`;

    fetch(wikiurl)
      .then(response => response.json())
      .then((data) => {
        if (data.error && data.error.code && data.error.info) {
          throw data.error.info;
        }
        for (let i = 0; i < data.length; i += 1) {
          wikiElemItem += data[i].length
            ? `<li class="infowindow-item">
                <a target ="_blank" href=http://en.wikipedia.org/wiki/${data[i]}>
                  ${data[i]}
                </a>
            </li>`
            : '';
        }
        wikiElemItem += '</ul></div>';
        infowindow.setContent(wikiElemItem);
      })
      .catch((error) => {
        wikiElemItem += `<p class='error' style='color:red'>${error}</p></ul></div>`;
        infowindow.setContent(wikiElemItem);
      });
  };

  static propTypes = {
    locations: PropTypes.instanceOf(Array).isRequired,
    filterText: PropTypes.string.isRequired,
    selectedPlaceTitle: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.myMapContainer = React.createRef();
  }

  state = {
    map: null,
    largeInfowindow: null,
    markers: [],
  }

  componentDidMount() {
    window.initMap = this.initMap;
    window.googleError = this.googleError;
    if (typeof window.google === 'object' && typeof window.google.maps === 'object') {
      this.initMap();
    } else {
      this.loadGoogleMapAPIJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyBVMyaFOgLLX5sQxMWec5Nu6oM_Nmxvwtw&callback=initMap');
    }
  }
  componentDidUpdate(prevProps) {
    const { filterText, selectedPlaceTitle, locations } = this.props;
    const { map } = this.state;
    if (filterText !== prevProps.filterText) {
      this.setState({ markers: this.filterMarkerOnMap(filterText) });
    }
    if (selectedPlaceTitle !== prevProps.selectedPlaceTitle) {
      this.setState({ markers: this.animateSelectedPlaceOnMap(selectedPlaceTitle) });
    }
    if (locations.length && (locations !== prevProps.locations)) {
      if (map && !filterText) {
        this.loadMarkersOnMap();
      }
    }
  }

  loadGoogleMapAPIJS = (src) => {
    const ref = window.document.getElementsByTagName('script')[0];
    const script = window.document.createElement('script');
    script.src = src;
    script.setAttribute('onerror', 'googleError()');
    script.async = true;
    ref.parentNode.insertBefore(script, ref);
  }
  initMap = () => {
    const { locations } = this.props;
    const map = new window.google.maps.Map(this.myMapContainer.current, {
      center: { lat: 20.342011, lng: 85.804517 },
      zoom: 6,
    });
    const largeInfowindow = new window.google.maps.InfoWindow();
    this.setState({ map, largeInfowindow });
    if (locations.length) {
      this.loadMarkersOnMap();
    }
  }
  googleError = () => {
    const content = window.document.getElementById('map-error');
    content.hidden = false;
    window.document.getElementById('map').appendChild(content);
  }
  animateSelectedPlaceOnMap = (placeTitle) => {
    const { map, markers, largeInfowindow } = this.state;
    for (let i = 0; i < markers.length; i += 1) {
      if (placeTitle === markers[i].title) {
        markers[i].setAnimation(window.google.maps.Animation.BOUNCE);
        GoogleMap.populateInfoWindow(map, markers[i], largeInfowindow);
      } else {
        markers[i].setAnimation(null);
      }
    }
    return markers;
  };

  filterMarkerOnMap = (filterText) => {
    const { map, markers } = this.state;
    const match = new RegExp(escapeRegExp(filterText.trim()), 'i');
    for (let i = 0; i < markers.length; i += 1) {
      if (match.test(markers[i].title)) {
        markers[i].setMap(map);
      } else {
        markers[i].setMap(null);
      }
    }
    return markers;
  }
  loadMarkersOnMap = () => {
    const { map, largeInfowindow, markers } = this.state;
    const { locations } = this.props;
const bounds = new window.google.maps.LatLngBounds();
    for (let i = 0; i < locations.length; i += 1) {
      const marker = GoogleMap.mapMarkerToMap(locations[i], map, i);
      markers.push(marker);
      marker.addListener('click', () => (function captureMarker() {
        GoogleMap.populateInfoWindow(map, marker, largeInfowindow);
      }(marker)));
      bounds.extend(marker.position);
    }
    map.fitBounds(bounds);
  }

  render() {
    return (
      <section id="maptab" role="application">
        {}
        <div ref={this.myMapContainer} id="map" aria-label="Places on Map" aria-describedby="map-help" />
        {}
        <div id="map-help">
          <p>
            Map showing the places as per the
            <a target="_blank" rel="noopener noreferrer" href="https://developer.foursquare.com/">
              <span> Foursquare API</span>
            </a>
          </p>
        </div>
        {}
        <div id="map-error" aria-label="Can not load the Map" hidden>
          <p>
            <span className="error">
              "This page can not load Google Maps correctly."
            </span>
            <br />
            <em>
              Google Map API now requires the use of a valid API Key.
            </em>
            <br />
            <a href="https://developers.google.com/maps/documentation/javascript/get-api-key">
              Go get one!
            </a>
          </p>
        </div>
      </section>
    );
  }
}

export default GoogleMap;
