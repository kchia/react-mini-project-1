import React, { Component } from 'react';
import Site from './Site.js';
import Environment from './Environment.js';
import Search from './Search.js';
import TagsTable from './TagsTable.js';
import SiteDelta from './SiteDelta.js';
import '../App.css';

/**
 * The App Class component is the 'parent' app component.
 */
export default class App extends Component {

  /** Initialize state with a constructor function */
  constructor() {

    super();

    /** Represents a list of possible classifications for a site */
    const environments = [
        {
          id: 1,
          name: 'Mobile Web'
        },
        {
          id: 2,
          name: 'Mobile App'
        },
        {
          id: 3,
          name: 'Desktop'
        },
        {
          id: 4,
          name: 'Connected TV'
        },
      ];


    /** Represents the default parent state */
    this.state = {
      environments: environments,

      /** The site data, including name, environmentId, & targeted tags */
      site: {},

      /** The difference between the previously saved tags/site info 
      and newly selected tags/site info */
      siteDelta: {},

      siteName: '',

      selectedEnvironmentId: null,

      /** All possible site tags */
      siteTags: [],

      /** All previously saved site tags */
      targetedTags: [],

      /** All currently selected tags, which may include previously saved/targeted tags */
      selectedTags: [],

      /** User-inputted search string */
      search: ''
    };
  }

  /**
   * A React component lifecycle method that is invoked immediately 
   * after a component is mounted. 
   */
  componentDidMount() {
    this.getInitialState([
      {
        url: 'https://ui-test-api.lkqd.com/sites/123',
        stateName: 'site'
      },
      {
        url: 'https://ui-test-api.lkqd.com/tags', 
        stateName: 'siteTags'
      }
    ]);
  }

  /**
   * Make GET request(s) to fetch resource(s)
   * @function
   * @param {Array} urls - An array of urls and their statenames
   */
  getInitialState(urls) {

    for(let url of urls) {

      let urlString = url.url;
      let stateName = url.stateName;

      console.log('Fetching ' + stateName + ' data!');

      fetch(urlString)
        .then((response) => response.json())
        .then((data) => {
          if(stateName === 'site') {
            this.setState({ 
              site: data,
              targetedTags: data.targetedTags,
              selectedTags: data.targetedTags,
              selectedEnvironmentId: Number(data.environmentId) 
            });
          } else {
            this.setState({ siteTags: data});
          }

          console.log('Successfully fetched ' + stateName + ' data!');

        })
        .catch((error) => {
          console.error(error);
        });
    }

  }

  /**
   * Make POST request to save resource
   * @function
   * @param {Object} event - the 'Save' button click event
   */
  save(event){
    event.preventDefault();

    /** Clone the site object fetched from the endpoint */
    let data = Object.assign({}, this.state.site);

    data.siteId = this.state.site.siteId;
    data.name = this.state.siteName;
    data.environmentId = this.state.selectedEnvironmentId;
    data.targetedTags = this.state.selectedTags;

    /** At this point, we can compute the delta between previously saved data and
    new user-inputted data that is being saved */
    this.updateSiteDelta(data);

    console.log('Saving data!', data);

    fetch('https://ui-test-api.lkqd.com/sites/' + this.state.site.siteId, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Accept': 'text/plain',          
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then((data) => {
      console.log(data);
    });
  } 

  /**
   * Handle title field change event
   * @function
   * @param {Object} event - the 'Name:' field DOM element event
   */
  handleTitleChange(event) {
    this.setState({ 
      siteName: event.target.value
    });
  }

  /**
   * Handle environment tabs change event
   * @function
   * @param {Object} event - the 'Environment:' field DOM element event
   */
  handleEnvironmentChange(event) {
    this.setState({
      selectedEnvironmentId: Number(event.target.value),
      selectedTags: []
    }, () => console.log(this.state.selectedTags));
  }

  /**
   * Update the search state 
   * @function
   * @param {Object} event - the 'Search...' field DOM element event
   */
  updateSearch(event) {
    this.setState({
      search: event.target.value
    });
  }

  /**
   * Update the selected tags state
   * @function
   * @param {Array} selectedTags - an array of user selected tags
   */
  updateSelectedTags(selectedTags) {
    this.setState({
      selectedTags
    /** For debugging: To check that the state has been updated as expected */
    }, () => console.log(this.state.selectedTags)); 
  }

  /**
   * Update the delta object that describes the difference
   * between previously saved site data and new user inputted data
   * @function
   * @param {Object} newPayload - new site data
   */
  updateSiteDelta(newPayload) {
    const siteDelta = this.computeSiteDelta(this.state.site, newPayload);
    this.setState({
      siteDelta
    });
  }

  /**
   * Compute the difference between previously saved site data and new user inputted data
   * @function
   * @param {Object} before - initial site state
   * @param {Object} after - final site state
   * @return {Object} The delta object describing any changes to the site data
   */
  computeSiteDelta(before, after) {

      /** In our diff object, we keep track of tags removed, added, 
      or modified (i.e., when priority is changed), amongst other things*/
    let diff = {
      targetedTagsRemoved: [],
      targetedTagsAdded: [],
      targetedTagsModified: []
    };

    const createTagIdToPriorityMap = (arr) => {
      let output = {};
      for(let item of arr) {
        output[item.tagId] = item.priority;
      }
      return output;
    };

    const createTargetedTagObj = (tagId, priority) => {
      return { tagId, priority };
    };

    for(let key in before) {
      /** When key is either 'name' or 'environmentId' */
      if(!Array.isArray(before[key])){
        if(before[key] !== after[key]) diff[key] = after[key];

      /** When key is 'targetedTags' */
      } else {

        let beforeTagIdToPriorityMap = createTagIdToPriorityMap(before.targetedTags);
        let afterTagIdToPriorityMap = createTagIdToPriorityMap(after.targetedTags);

        /** Check for newly added tags */
        for(let afterObj of after[key]) {
          if(!beforeTagIdToPriorityMap[afterObj.tagId]) {
            diff['targetedTagsAdded'].push(
              createTargetedTagObj(afterObj.tagId, afterObj.priority)
            );
          }
        }

        for(let beforeObj of before[key]) {
          /** Check for tags that were removed */
          if(!afterTagIdToPriorityMap[beforeObj.tagId]) {
            diff['targetedTagsRemoved'].push(
              createTargetedTagObj(beforeObj.tagId, beforeObj.priority)
            );
          } else {

            /** Check for tags that were modified */
            if(beforeObj.priority !== afterTagIdToPriorityMap[beforeObj.tagId]) {

              diff['targetedTagsModified'].push(
                createTargetedTagObj(beforeObj.tagId, 
                afterTagIdToPriorityMap[beforeObj.tagId])
              );
            }
          }
        }

      }
    };

    if(!diff['targetedTagsRemoved'].length) delete diff['targetedTagsRemoved'];
    if(!diff['targetedTagsAdded'].length) delete diff['targetedTagsAdded'];
    if(!diff['targetedTagsModified'].length) delete diff['targetedTagsModified'];

    return diff;
  }

  /** Renders the app and its child components 'Site', 'Environment', 'Search', 
  'TagsTable', & 'SiteDelta'. Data are passed from App to children via props */
  render() {
    return (
      <div className='site-editor-dashboard'>
        <form onSubmit={this.save.bind(this)}>
          <div className='dashboard-site-wrapper'>
            <Site 
              site={this.state.site}
              siteName={this.state.siteName}
              handleTitleChange={this.handleTitleChange.bind(this)}
            />
            <Environment 
              environments={this.state.environments}
              selectedEnvironmentId={this.state.selectedEnvironmentId}
              handleEnvironmentChange={this.handleEnvironmentChange.bind(this)}
            />
          </div>
          <div className='dashboard-tags'>
            <h1 className='dashboard-tags-title'>Tags</h1>
            <div className='dashboard-tags-search-bar'>
              <Search
                search={this.state.search}
                updateSearch={this.updateSearch.bind(this)}
              />
            </div>
            <TagsTable
              siteTags={this.state.siteTags}
              selectedTags={this.state.selectedTags}
              updateSelectedTags={this.updateSelectedTags.bind(this)}
              environments={this.state.environments}
              selectedEnvironmentId={this.state.selectedEnvironmentId}
              search={this.state.search}
            />
          </div>
          <input
            type='submit'
            value='Save'
          />
        </form>
        <SiteDelta siteDelta={this.state.siteDelta}/>
      </div>
    );
  }
}
