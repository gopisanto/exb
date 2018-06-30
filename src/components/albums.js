import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { map, get } from 'lodash';

import { getUserIndex } from '../helpers';
import { onAlbumSelect as onAlbumSelectAction, onSelectAll as onSelectAllAction, createAlbum } from '../actions';
import Album from './album';
import AddAlbum from './add-album';

class Albums extends Component {
  constructor(props) {
    super(props);

    this.openAddAlbum = this.openAddAlbum.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.createAlbum = this.createAlbum.bind(this);

    this.state = { showAddAlbumModal: false };
  }

  onCancel() {
    this.setState({ showAddAlbumModal: false });
  }

  openAddAlbum() {
    this.setState({ showAddAlbumModal: true });
  }

  createAlbum(title) {
    this.props.createAlbum(title);
    this.onCancel();
  }

  render() {
    const {
      albums,
      onAlbumSelect,
      onSelectAll,
      selectAllAlbums,
    } = this.props;
    const { showAddAlbumModal } = this.state;

    return (
      <div className="albums-container">
        <h2>Albums</h2>
        <span className="selectAll">
          <input type="checkbox" name="selectAll" onClick={onSelectAll} checked={selectAllAlbums} />
          <label htmlFor="selectAll">Select all</label>
        </span>
        <div className="albums">
          {map(albums, album => <Album key={album.id} album={album} onAlbumSelect={onAlbumSelect} />)}
        </div>
        <img src="../../assets/add.png" alt="add album" className="add-album" onClick={this.openAddAlbum} />
        {showAddAlbumModal && <AddAlbum onCancel={this.onCancel} createAlbum={this.createAlbum} />}
      </div>
    );
  }
}

Albums.propTypes = {
  albums: PropTypes.array,
  onAlbumSelect: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  selectAllAlbums: PropTypes.bool,
  createAlbum: PropTypes.func.isRequired,
};

Albums.defaultProps = {
  albums: [],
  selectAllAlbums: false,
};

export default connect(
  (state) => {
    const userIndex = getUserIndex(get(state, 'userManagement.users'), get(state, 'userManagement.selectedUserId'));

    return {
      albums: get(state, `userManagement.users.${userIndex}.albums`),
      selectAllAlbums: get(state, 'userManagement.selectAllAlbums'),
    };
  },
  { onAlbumSelect: onAlbumSelectAction, onSelectAll: onSelectAllAction, createAlbum },
)(Albums);
