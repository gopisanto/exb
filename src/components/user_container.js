import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map, isEmpty, filter, get } from 'lodash';
import classnames from 'classnames';

import UserHeading from './user_heading';
import UserSearch from './user_search';
import User from './user';
import Albums from './albums';
import Photos from './photos';
import { fetchUsers, fetchUserAlbums } from '../actions';

const createUser = (onUserClick, selectedUserId) => user => <User user={user} key={user.id} onUserClick={onUserClick} classes={classnames({ selected: selectedUserId === user.id })} />;

class UserContainer extends Component {
  constructor(props) {
    super(props);

    this.onSearchClick = this.onSearchClick.bind(this);
    this.backToHeading = this.backToHeading.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onUserClick = this.onUserClick.bind(this);

    this.state = { showSearchInput: false, searchTerm: '' };
  }

  componentDidMount() {
    this.props.fetchUsers();
  }

  onSearchClick() {
    this.setState({ showSearchInput: true });
  }

  onInputChange(value) {
    this.setState({ searchTerm: value });
  }

  onUserClick(id) {
    this.props.fetchUserAlbums(id);
  }

  backToHeading() {
    this.setState({ showSearchInput: false });
  }

  render() {
    const {
      users,
      selectedUserId,
      appError,
      error,
    } = this.props;
    const { showSearchInput, searchTerm } = this.state;

    return (
      <div>
        { !isEmpty(get(appError, 'message')) && <h2 className="error">{appError.message}</h2>}
        { !isEmpty(get(error, 'message')) && <h2 className="error">Technical error occured.</h2>}
        <div className="container">
          <div className="user-container">
            {showSearchInput ? <UserSearch backToHeading={this.backToHeading} onInputChange={this.onInputChange} /> : <UserHeading onSearchClick={this.onSearchClick} />}
            {map(isEmpty(searchTerm)
              ? users
              : filter(
                users,
                user => user.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1,
              ), createUser(this.onUserClick, selectedUserId))}
          </div>
          <div>
            <Albums />
            <Photos />
          </div>
        </div>
      </div>
    );
  }
}

UserContainer.propTypes = {
  fetchUsers: PropTypes.func.isRequired,
  fetchUserAlbums: PropTypes.func.isRequired,
  users: PropTypes.array,
  selectedUserId: PropTypes.number,
  appError: PropTypes.object.isRequired,
  error: PropTypes.object,
};

UserContainer.defaultProps = {
  users: [],
  selectedUserId: null,
  error: {},
};

export default connect(state => ({
  users: state.userManagement.users,
  selectedUserId: state.userManagement.selectedUserId,
  appError: state.userManagement.appError,
  error: state.userManagement.error,
}), { fetchUsers, fetchUserAlbums })(UserContainer);
