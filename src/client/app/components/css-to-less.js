// utilities imports //

import React from 'react';
$.fn.checkbox = require('semantic-ui-checkbox');
$.fn.transition = require('semantic-ui-transition');

/*  module related utilities  */

import css2less from 'css2less';
import ace from 'brace';
import 'brace/mode/css';
import 'brace/theme/chrome';
import 'brace/mode/less';
const emptyLineRegex = /^(?=\n)$|^\s*|\s*$|\n\n+/gm;


export default class CssToLess extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = 'CssToLess';
    this.convertCssToLess = this.convertCssToLess.bind(this);
    this.state = { editWhileTyping: false };
    this.cssEditor = null;
    this.lessEditor = null;
  }
  
  componentDidMount() {
    let self = this;
    self.cssEditor = ace.edit('css-edit');
    self.cssEditor.setOptions({
      mode: 'ace/mode/css',
      theme: 'ace/theme/chrome',
      fontSize: 16,
      tabSize: 2,
      showLineNumbers: false,
      showGutter: false,
      maxLines: Infinity
    });
    
    // to stop error warning
    self.cssEditor.$blockScrolling = Infinity;

    self.lessEditor = ace.edit('less-edit');
    self.lessEditor.setOptions({
      mode: 'ace/mode/less',
      theme: 'ace/theme/chrome',
      fontSize: 16,
      tabSize: 2,
      showLineNumbers: false,
      showGutter: false,
      maxLines: Infinity,
      readOnly: true
    });
    
    // to stop error warning
    self.lessEditor.$blockScrolling = Infinity;
     
    $('.ui.checkbox').checkbox({
      onChecked() {
        $('[name="convertButton"]').hide();
        self.setState({ editWhileTyping: true });
      },
      
      onUnchecked() {
        $('[name="convertButton"]').show();
        self.setState({ editWhileTyping: false });
      }
    });

  }
  
  // shouldComponentUpdate(nextProps, nextState) {
  //   let self = this;
  //   if (nextState.editWhileTyping === true) {
  //     self.cssEditor.getSession().on('change', self.convertCssToLess);  
  //   } else {
  //     self.cssEditor.getSession().on('change', self.convertCssToLess);
  //   }   
  //   return true;
  // }
  
  convertCssToLess() {
    let self = this,
        cssVal = self.cssEditor.getValue(),
        options = {},
        val;
        
    // cssVal = cssVal.replace(emptyLineRegex, '');
    val = css2less(cssVal);
    self.lessEditor.setValue(val, -1);
  }
  
  render() {
    return (
      <div className={this.displayName}>
        <div className="ui container">
          
{/*          <div className="ui checkbox">
            <input type="checkbox" name="example" />
            <label>Convert while typing</label>
          </div>*/}
        
          
          <div className="ui stackable two column centered grid">
            <div className="column">
              <h3 className="ui header"> Css </h3>
              
              <div id="css-edit"></div>
            </div>
            <div className="column">
              <h3 className="ui header"> Less </h3>
              <div id="less-edit"></div>
            </div>
          </div>
          
          <div className="ui center aligned container">
            <div className="ui massive button" name="convertButton" onClick={this.convertCssToLess}>
              Convert
            </div>
          </div>
          
        </div>
      </div>
    );
  }
}