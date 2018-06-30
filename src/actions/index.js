import axios from 'axios';
import { get, findIndex, map, includes, without, find } from 'lodash';

const ns = 'src.actions.index';
export const FETCH_USERS = `${ns}.fetchUsers`;
export const FETCH_ERROR = `${ns}.fetchError`;
export const FETCH_USER_ALBUMS = `${ns}.fetchUserAlbums`;
export const UPDATE_SELECTED_USER_ID = `${ns}.updateSelectedUserId`;
export const UPDATE_USER_ALBUMS_PHOTOS = `${ns}.updateUserAlbumsPhotos`;
export const UPDATE_SELECTED_ALBUM_IDS = `${ns}.updateSelectedAlbumIds`;
export const UPDATE_SELECT_ALL_ALBUMS = `${ns}.updateSelectAllAlbums`;
export const INITIALISE_USER = `${ns}.initialiseUser`;
export const CREATE_ALBUM = `${ns}.createAlbum`;
export const ADD_PHOTO = `${ns}.addPhoto`;
export const APP_ERROR = `${ns}.appError`;

export const fetchUsers = () => async (dispatch) => {
  try {
    const users = await axios.get('http://jsonplaceholder.typicode.com/users');

    dispatch({ type: FETCH_USERS, payload: users });
  } catch (error) {
    dispatch({ type: FETCH_ERROR, payload: error });
  }
};

export const fetchAlbumsPhotos = (userAlbums, userId) => Promise.all(map(
  userAlbums,
  album => axios.get(`http://jsonplaceholder.typicode.com/photos?albumId=${album.id}&&userId=${userId}`),
));

export const fetchUserAlbums = id => async (dispatch, getState) => {
  dispatch({ type: INITIALISE_USER });
  const users = get(getState(), 'userManagement.users');
  const userIndex = findIndex(users, user => user.id === id);
  dispatch({ type: UPDATE_SELECTED_USER_ID, payload: id });
  if ((get(users, `${userIndex}.albums`) || []).length > 0) {
    return;
  }

  try {
    const userAlbums = await axios(`http://jsonplaceholder.typicode.com/albums?userId=${id}`);
    const userAlbumsPhotos = await Promise.all(map(
      userAlbums.data,
      album => axios.get(`http://jsonplaceholder.typicode.com/photos?albumId=${album.id}&&userId=${id}`),
    ));
    dispatch({ type: UPDATE_USER_ALBUMS_PHOTOS, payload: { userAlbumsPhotos, userAlbums } });
    dispatch({ type: FETCH_USER_ALBUMS, payload: { userAlbums, id } });
  } catch (error) {
    dispatch({ type: FETCH_ERROR, payload: error });
  }
};

export const onAlbumSelect = albumId => (dispatch, getState) => {
  const selectedAlbumIds = get(getState(), 'userManagement.selectedAlbumIds') || [];

  dispatch({
    type: UPDATE_SELECTED_ALBUM_IDS,
    payload: includes(selectedAlbumIds, albumId) ? without(selectedAlbumIds, albumId) : selectedAlbumIds.concat(albumId),
  });
};

export const onSelectAll = () => (dispatch, getState) => {
  const selectAllAlbums = get(getState(), 'userManagement.selectAllAlbums');

  dispatch({ type: UPDATE_SELECT_ALL_ALBUMS, payload: !selectAllAlbums });
};

export const createAlbum = title => async (dispatch, getState) => {
  const userId = get(getState(), 'userManagement.selectedUserId');

  try {
    const resp = await axios.post('http://jsonplaceholder.typicode.com/albums', { title, userId });
    dispatch({ type: CREATE_ALBUM, payload: resp.data });
  } catch (error) {
    dispatch({ type: FETCH_ERROR, payload: error });
  }
};

export const onImageDrop = file => async (dispatch, getState) => {
  const state = getState();
  const userId = get(state, 'userManagement.selectedUserId');
  const selectedAlbumIds = get(state, 'userManagement.selectedAlbumIds') || [];
  const albumId = selectedAlbumIds[0];
  const url = file[0].preview;
  const thumbnailUrl = file.preview;
  const { title } = find(get(state, `userManagement.users.${userId}.albums`), album => album.id === albumId) || {};

  if (selectedAlbumIds.length !== 1) {
    dispatch({ type: APP_ERROR, payload: { message: 'Please select only one Album' } });
    return;
  }

  try {
    const resp = await axios.post('http://jsonplaceholder.typicode.com/photos', {
      albumId,
      url,
      thumbnailUrl,
      title,
    });
    dispatch({
      type: ADD_PHOTO,
      payload: {
        albumId,
        url,
        thumbnailUrl,
        title,
        id: resp.data,
      },
    });
    dispatch({ type: APP_ERROR, payload: {} });
  } catch (error) {
    dispatch({ type: FETCH_ERROR, payload: error });
  }
};
