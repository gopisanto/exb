import React from 'react';
import PropTypes from 'prop-types';

const AddAlbum = ({ createAlbum, onCancel }) => (
  <div className="add-album-modal">
    <div className="add-album-content">
      <label htmlFor="addAlbum">Abum name</label>
      <input name="addAlbum" className="album-title" />
      <div>
        <button onClick={onCancel}>Cancel</button>
        <button onClick={() => createAlbum(document.querySelector('.album-title').value)}>Create</button>
      </div>
    </div>
  </div>
);

AddAlbum.propTypes = {
  createAlbum: PropTypes.func,
  onCancel: PropTypes.func.isRequired,
};

AddAlbum.defaultProps = {
  createAlbum: () => null,
};

export default AddAlbum;
