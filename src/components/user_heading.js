import React from 'react';
import PropTypes from 'prop-types';

const UserHeading = ({ onSearchClick }) => (
  <div className="app-bar-bg">
    <label className="users">Users</label>
    <img src="../../assets/search.svg" className="search" alt="search" onClick={onSearchClick} />
  </div>
);

UserHeading.propTypes = {
  onSearchClick: PropTypes.func.isRequired,
};

export default UserHeading;
