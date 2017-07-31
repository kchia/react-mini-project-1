import React, { Component } from 'react';

/**
 * The Search class component
 */
export default class Search extends Component {

  /** Render the search field */
  render() {
    return (
      <input
        type='text'
        value={this.props.search}
        onChange={this.props.updateSearch} 
        placeholder='Search...'
      />
    )
  }
}