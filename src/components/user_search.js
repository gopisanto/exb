import React, { Component } from 'react';
import PropTypes from 'prop-types';

class UserSearch extends Component {
  constructor(props) {
    super(props);

    this.onInputChange = this.onInputChange.bind(this);
    this.clearInput = this.clearInput.bind(this);
    this.backToHeading = this.backToHeading.bind(this);

    this.state = { searchTerm: '' };
  }

  onInputChange({ target: { value: searchTerm } }) {
    this.setState({ searchTerm });
    this.props.onInputChange(searchTerm);
  }

  clearInput() {
    this.setState({ searchTerm: '' });
    this.props.onInputChange('');
  }

  backToHeading() {
    this.clearInput();
    this.props.backToHeading();
  }

  render() {
    return (
      <div className="app-bar-bg">
        <div className="search-container">
          <img src="../../assets/left-arrow.png" className="left-arrow" alt="left" onClick={this.backToHeading} />
          <input
            type="text"
            value={this.state.searchTerm}
            onChange={this.onInputChange}
            className="search-input"
            placeholder="Search users"
          />
          <img src="../../assets/close.png" alt="close" className="close" onClick={this.clearInput} />
        </div>
      </div>
    );
  }
}

UserSearch.propTypes = {
  backToHeading: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
};

export default UserSearch;
