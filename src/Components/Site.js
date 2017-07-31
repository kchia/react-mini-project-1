import React, { Component } from 'react';

/**
 * The Site class component
 */
export default class Site extends Component {

  /** Construct the string for the Site Name */
  createSiteNameString () {
    if(this.props.site) return this.props.site.name;
  };

  /** Render the site name section */
  render() {
    return (
      <div>
        <h1 className='dashboard-site-title'>Site: {this.props.siteName || this.createSiteNameString() }</h1>
        <div className='dashboard-site-name'>
          <label>Name:</label>
          <input
            type='text'
            placeholder={this.createSiteNameString()}
            onChange={this.props.handleTitleChange}
          />
        </div>
      </div>)
  }
}