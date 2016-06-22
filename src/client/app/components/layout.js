// utilities imports //

import React from 'react';
import 'semantic-ui-checkbox/checkbox.css'
import 'semantic-ui-dropdown/dropdown.css'
$.fn.checkbox = require('semantic-ui-checkbox')
$.fn.dropdown = require('semantic-ui-dropdown')
import 'semantic-ui-transition/transition.css'
$.fn.transition = require('semantic-ui-transition')

/////////////////////////////////// 
import html2jade from 'html2jade';
import ace from 'brace';
import 'brace/mode/html';
import 'brace/theme/monokai';
import 'brace/mode/jade';






export default class MainLayout extends React.Component {
  
  constructor(props) {
    super(props);
    this.displayName = 'MainLayout';
    this.convertHtmlToJade = this.convertHtmlToJade.bind(this);
    this.htmlEditor = null;
    this.jadeEditor = null;  
  }
  
  componentDidMount() {
    let self = this;
    self.htmlEditor = ace.edit('html-edit');
    self.htmlEditor.getSession().setMode('ace/mode/html');
    self.htmlEditor.setTheme('ace/theme/monokai');
    self.jadeEditor = ace.edit('jade-edit');
    self.jadeEditor.getSession().setMode('ace/mode/jade');
    self.jadeEditor.setTheme('ace/theme/monokai');
    
    self.htmlEditor.getSession().on('change', function(e) {
      let htmlVal = self.htmlEditor.getValue();
      html2jade.convertHtml(htmlVal, {}, function(err, jade) {
        console.log('jade ', jade);
        self.jadeEditor.setValue(jade);
      });
    });
    
    // $('.ui.checkbox').checkbox({
    //   // onChecked() {
    //   //   console.log('chekcbox is checked ');
    //   // },
      
    //   // onUnchecked() {
    //   //   console.log('checkbox is unchecked here ');
    //   // }
    // });
    $('.ui.selection.dropdown').dropdown({});
  }
  
  convertHtmlToJade() {
    let self = this,
        htmlVal = this.htmlEditor.getValue();
    html2jade.convertHtml(htmlVal, {}, function(err, jade) {
      self.jadeEditor.setValue(jade);
    });
  }
  
  render() {
    return (
      <div className={this.displayName}>
      
        <div className="ui center aligned container">
          <div className="ui selection dropdown">
            <input type="hidden" name="gender" />
            <i className="dropdown icon" />
            <div className="default text">Gender</div>
            <div className="menu">
              <div className="item" data-value={1}>Male</div>
              <div className="item" data-value={0}>Female</div>
            </div>
          </div>
        </div>
             
        <div className="ui stackable two column grid">
          <div className="column">
            <div id="html-edit"></div>
          </div>
          <div className="column">
            <div id="jade-edit"></div>
          </div> 
        </div>
        
        <div className="ui center aligned container">
          <div className="ui massive button" onClick={this.convertHtmlToJade}>
            Convert
          </div>
        </div>
        
      </div>
    );
  }
}