import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map, includes, filter, get } from 'lodash';
import Dropzone from 'react-dropzone';

import { getUserIndex } from '../helpers';
import { onImageDrop } from '../actions';

const onDrop = onImageDropAction => (accepted) => {
  onImageDropAction(accepted);
};

const Photos = ({ photos, onImageDrop: onImageDropAction }) => (
  <Dropzone disableClick className="ignore" onDrop={onDrop(onImageDropAction)}>
    <div className="photos-container">
      <h2>{photos.length} photos</h2>
      <div className="photos">
        {map(photos, photo => <img src={photo.url} alt={photo.title} key={photo.id} />)}
      </div>
    </div>
  </Dropzone>
);

Photos.propTypes = {
  photos: PropTypes.array,
  onImageDrop: PropTypes.func,
};

Photos.defaultProps = {
  photos: [],
  onImageDrop: () => null,
};

export default connect((state) => {
  const users = get(state, 'userManagement.users');
  const selectedUserId = get(state, 'userManagement.selectedUserId');
  const selectedAlbumIds = get(state, 'userManagement.selectedAlbumIds');
  const photos = filter(
    get(users, `${getUserIndex(users, selectedUserId)}.photos`),
    photo => includes(selectedAlbumIds, photo.albumId),
  );

  return { photos };
}, { onImageDrop })(Photos);
