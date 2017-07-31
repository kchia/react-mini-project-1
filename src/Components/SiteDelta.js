import React, { Component } from 'react';

/**
 * The SiteDelta class component
 */
export default class SiteDelta extends Component {

  render() {
    return (
      <div className='site-delta-info'>
        <h1>Site Delta Info:</h1>
        {this.props.siteDelta.name && <p>Site Name: {this.props.siteDelta.name}</p>}
        {this.props.siteDelta.environmentId &&  <p>Environment Id: {this.props.siteDelta.environmentId}</p>} 
        {this.props.siteDelta.targetedTagsAdded &&  <p>Tags Added: {JSON.stringify(this.props.siteDelta.targetedTagsAdded)}</p>} 
        {this.props.siteDelta.targetedTagsRemoved &&  <p>Tags Removed: {JSON.stringify(this.props.siteDelta.targetedTagsRemoved)}</p>} 
        {this.props.siteDelta.targetedTagsModified &&  <p>Tags Modified: {JSON.stringify(this.props.siteDelta.targetedTagsModified)}</p>} 
      </div>
    )
  }
}