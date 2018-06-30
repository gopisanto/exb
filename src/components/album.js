import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { includes, get } from 'lodash';

const Album = ({
  album,
  selectedAlbumIds,
  onAlbumSelect,
  selectAllAlbums,
}) => (
  <div className="album">
    <input type="checkbox" name={album.title} checked={includes(selectedAlbumIds, album.id) || selectAllAlbums} onClick={() => onAlbumSelect(album.id)} />
    <label htmlFor={album.title}>{album.title}</label>
  </div>
);

Album.propTypes = {
  album: PropTypes.object,
  selectedAlbumIds: PropTypes.array,
  onAlbumSelect: PropTypes.func.isRequired,
  selectAllAlbums: PropTypes.bool,
};

Album.defaultProps = {
  album: {},
  selectedAlbumIds: [],
  selectAllAlbums: false,
};

export default connect(state => ({
  selectedAlbumIds: get(state, 'userManagement.selectedAlbumIds'),
  selectAllAlbums: get(state, 'userManagement.selectAllAlbums'),
}))(Album);
