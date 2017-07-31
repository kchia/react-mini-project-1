import React, { Component } from 'react';

/**
 * The TagsTable class component
 */
export default class TagsTable extends Component {

  /**
   * Add tag to or remove tag from a list of targeted tags.
   * @function
   * @param {Object} event - Checkbox DOM element event
   */
  handleTagClick (event) {
    let selectedTags = this.props.selectedTags.slice();
    let currentTagId = Number(event.target.value);

    /** Return true if a tag is already selected on the page;
    false otherwise. */
    const isTagAlreadySelected = (tagId) => {
      let selectedTags = this.props.selectedTags.slice();
      for(let selectedTag of selectedTags) {
        if(selectedTag.tagId === tagId) return true;
      }
      return false;
    };

    /** Add tag to list of targeted tags if user checks the box. */
    if(event.target.checked) {

      if(!isTagAlreadySelected(currentTagId)) {
        selectedTags.push({ tagId: currentTagId, priority: 3 });
      }

    /** Remove tag from list of targeted tags if user unchecks the box. */
    } else {
      for(let [index, selectedTag] of selectedTags.entries()) {
        if(selectedTag.tagId === currentTagId) selectedTags.splice(index,1);
      }
    }

    this.props.updateSelectedTags(selectedTags);
  }

  /**
   * Return true if a tag is in the site's list of selected tags.
   * @function
   * @param {Object} siteTag - site tag object
   * @return {Boolean}
   */
  isSelectedTag (siteTag) {
    let selectedTags = this.props.selectedTags.slice();
    for(let selectedTag of selectedTags) {
      if(selectedTag.tagId === siteTag.tagId) return true;
    }
    return false;  
  }

  /**
   * Get the site tag priority
   * @function
   * @param {Object} siteTag - site tag object
   * @return {Number} site tag priority
   */
  getSiteTagPriority (siteTag) {
    for(let selectedTag of this.props.selectedTags) {
      if(selectedTag.tagId === siteTag.tagId) return selectedTag.priority;
    }

    /** Default value to 3 if not a targeted tag */
    return 3;
  }

  /**
   * Create a dictionary from environments state
   * @function
   * @return {Object} dictionary representing environments state
   */
  environmentsObj () {
    let output = {};
    for(let environment of this.props.environments) {
      output[environment.id] = environment.name;
    }
    return output;
  }

  /**
   * Construct the string for the Environments column
   * @function
   * @param {Array} ids - an array of environment ids
   * @return {String} list of possible environments for display
   */
  createEnvironmentString (ids) {
    let output = '';
    for(let id of ids) {
      output+= this.environmentsObj()[id] + ', ';
    }
    return output.slice(0, -2);
  }

  /**
   * Construct strings for various properties of the site tag
   * @function
   * @param {Object} siteTag - site tag object
   * @param {String} key - site tag property
   * @return {String} string values for different columns in the table
   */
  createSiteTagString (siteTag, key) {
    return key === 'environmentIds' ? 
      this.createEnvironmentString(siteTag[key]) : String(siteTag[key]); 
  }

  /**
   * Handle targeted tag priority selection event
   * @function
   * @param {Number} priority - the priority selected by the user
   * @param {Number} siteTagId - the id of the tag being handled
   */
  handlePrioritySelect(priority, siteTagId) {    
    let selectedTags = this.props.selectedTags.slice();

    for(let selectedTag of selectedTags) {
      if(selectedTag.tagId === siteTagId) selectedTag.priority = priority;
    }

    this.props.updateSelectedTags(selectedTags);
  }

  /**
   * Render the checkbox input field for the Targeted? column.
   * @function
   * @param {Object} siteTag - site tag object
   */
  renderTagStatus (siteTag) {
    return (
      <input 
        type='checkbox'
        value={siteTag.tagId}
        checked={this.isSelectedTag(siteTag)}
        onChange={this.handleTagClick.bind(this)}
      />
    )
  }

  /**
   * Render the priority options for the Priority column.
   * @function
   * @param {Object} siteTag - site tag object
   */
  renderPriorityOptions (siteTag) {
    return (
      <div className='tag-priority-options'>
        {[1,2,3,4,5].map((priority, index) => {
          return (
            <span key={index}>
              <input
                type='radio'
                className='tag-priority-option'
                value={priority}
                checked={this.getSiteTagPriority(siteTag) === priority}
                onChange={() => this.handlePrioritySelect(priority, siteTag.tagId)}
              />
              <label htmlFor={'tab' + index}>{priority}</label>
            </span>
          )
        })}
      </div>
    )  
  }

  /** Render only the tags associated with the selected environment.
   * @function
   */
  renderRelevantTags () {

    let relevantTags = [];

    const siteTags = this.props.siteTags;

    for(let siteTag of siteTags) {
      if(siteTag.environmentIds.indexOf(this.props.selectedEnvironmentId) > -1){
        relevantTags.push(siteTag);
      } 
    }

    let filteredTags = relevantTags.filter((tag) => {
      return tag.name.toLowerCase().indexOf(this.props.search.toLowerCase()) > -1 
        || tag.tagId.toString().toLowerCase().indexOf(this.props.search) > -1;
    });

    return filteredTags.map((siteTag, index) => {
      return (
        <tr key={index}>
          <td>
            {this.renderTagStatus(siteTag)}
          </td>
          <td>
            {this.createSiteTagString(siteTag, 'tagId')}
          </td>
          <td>
            {this.createSiteTagString(siteTag, 'name')}
          </td>
          <td>
            {this.createSiteTagString(siteTag, 'environmentIds')}
          </td>
          <td>
            {this.renderPriorityOptions(siteTag)}
          </td>
        </tr>
      )
    });
  }

  /** Render the tags table */
  render() {
    return (
      <table className='dashboard-tags-table'>
        <thead>
          <tr>
            <th>Target?</th>
            <th>ID</th>
            <th>Name</th>
            <th>Environments</th>
            <th>Priority</th>
          </tr>
        </thead>
        <tbody>
          {this.renderRelevantTags()}
        </tbody>
      </table>
    )
  }
}