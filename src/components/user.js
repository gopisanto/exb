import React from 'react';
import PropTypes from 'prop-types';

const User = ({ user, onUserClick, classes }) => {
  const {
    id,
    name,
    username,
    email,
  } = user;
  const className = `user ${classes}`;

  return (
    <div className={className} onClick={() => onUserClick(id)} role="button" tabIndex="0">
      <figure>
        <img src="../../assets/circle.png" alt="circle" />
      </figure>
      <section>
        <label>{name}</label><br />
        <label>{username}</label><br />
        <label>{email}</label>
      </section>
    </div>
  );
};

User.propTypes = {
  user: PropTypes.object,
  onUserClick: PropTypes.func.isRequired,
  classes: PropTypes.string,
};

User.defaultProps = {
  user: {},
  classes: '',
};

export default User;
