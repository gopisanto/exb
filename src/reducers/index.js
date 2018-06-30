import { combineReducers } from 'redux';
import Immutable from 'seamless-immutable';
import { forEach, map } from 'lodash';

import {
  FETCH_USERS,
  FETCH_ERROR,
  FETCH_USER_ALBUMS,
  UPDATE_SELECTED_USER_ID,
  UPDATE_USER_ALBUMS_PHOTOS,
  UPDATE_SELECTED_ALBUM_IDS,
  UPDATE_SELECT_ALL_ALBUMS,
  INITIALISE_USER,
  CREATE_ALBUM,
  ADD_PHOTO,
  APP_ERROR,
} from '../actions';
import { getUserIndex } from '../helpers';

const INITIAL_STATE = Immutable({
  users: [],
  selectedUserId: null,
  selectedAlbumIds: [],
  selectAllAlbums: false,
});

const process = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case FETCH_USERS: return state.set('users', payload.data || []);
    case FETCH_ERROR: return state.set('error', payload);
    case FETCH_USER_ALBUMS: return state.updateIn(
      ['users', getUserIndex(state.users, payload.id)],
      user => Object.assign({}, user, { albums: payload.userAlbums.data }),
    );
    case UPDATE_SELECTED_USER_ID: return state.set('selectedUserId', payload);
    case UPDATE_USER_ALBUMS_PHOTOS: {
      let photos = [];

      forEach(payload.userAlbumsPhotos, (albumPhotos) => {
        photos = photos.concat(albumPhotos.data);
      });

      return state.setIn(
        ['users', getUserIndex(state.users, state.selectedUserId), 'photos'],
        photos,
      );
    }
    case UPDATE_SELECTED_ALBUM_IDS: return state.set('selectedAlbumIds', payload).set('selectAllAlbums', false);
    case UPDATE_SELECT_ALL_ALBUMS: {
      const { users, selectedUserId } = state;
      const selectedUserAlbums = users[getUserIndex(users, selectedUserId)].albums;

      return state.set('selectAllAlbums', payload)
        .set('selectedAlbumIds', payload ? map(selectedUserAlbums, album => album.id) : []);
    }
    case INITIALISE_USER: return state.set('selectedAlbumIds', []).set('selectAllAlbums', false);
    case CREATE_ALBUM: return state.updateIn(
      ['users', getUserIndex(state.users, state.selectedUserId), 'albums'],
      albums => [...albums, payload],
    );
    case ADD_PHOTO: return state.updateIn(
      ['users', getUserIndex(state.users, state.selectedUserId), 'photos'],
      photos => [...photos, payload],
    );
    case APP_ERROR: return state.set('appError', payload);
    default: return state;
  }
};

export default combineReducers({
  userManagement: process,
});
