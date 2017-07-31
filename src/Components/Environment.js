import React, { Component } from 'react';

/**
 * The Environment class component
 */
export default class Environment extends Component {

  /** Render radio buttons for different site environment options */
  renderEnvironments () {
    return(
      <div className='environment-radio-tabs'>
        {this.props.environments.map((environment, index) => {
          const environmentId = environment.id;
          return (
            <span key={index}>
              <input
                type='radio'
                className='environment-radio-tab'
                value={environmentId}
                checked={this.props.selectedEnvironmentId === environmentId}
                onChange={this.props.handleEnvironmentChange}
              />
              <label htmlFor={'tab' + index}>{environment.name}</label>
            </span>
          )
        })}
      </div>
    )
  } 


  /** Render the site environment section */
  render() {
    return (
      <div className='dashboard-site-environment'>
        <label>Environment:</label>
        {this.renderEnvironments()}
      </div>
    )
  }
}