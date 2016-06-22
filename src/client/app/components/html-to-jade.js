// utilities imports //

$.fn.checkbox = require('semantic-ui-checkbox');
$.fn.transition = require('semantic-ui-transition');

/* utils */
import html2jade from 'html2jade';
import ace from 'brace';
import 'brace/mode/html';
import 'brace/theme/chrome';
import 'brace/mode/jade';
const emptyLineRegex = /^(?=\n)$|^\s*|\s*$|\n\n+/gm;





export default class HtmltoJade extends React.Component {
  
  constructor(props) {
    super(props);
    this.displayName = 'HtmltoJade';
    this.convertHtmlToJade = this.convertHtmlToJade.bind(this);
    this.selectText = this.selectText.bind(this);
    this.state = { editWhileTyping: false };
    this.htmlEditor = null;
    this.jadeEditor = null;
  }
  
  componentDidMount() {
    let self = this;
    self.htmlEditor = ace.edit('html-edit');
    self.htmlEditor.setOptions({
      mode: 'ace/mode/html',
      theme: 'ace/theme/chrome',
      fontSize: 16,
      tabSize: 2,
      showLineNumbers: false,
      showGutter: false,
      maxLines: Infinity
    });
    
    // to stop error warning
    self.htmlEditor.$blockScrolling = Infinity;

    self.jadeEditor = ace.edit('jade-edit');
    self.jadeEditor.setOptions({
      mode: 'ace/mode/jade',
      theme: 'ace/theme/chrome',
      fontSize: 16,
      tabSize: 2,
      showLineNumbers: false,
      showGutter: false,
      maxLines: Infinity,
      readOnly: true
    });
    
    // to stop error warning
    self.jadeEditor.$blockScrolling = Infinity;
     
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
  
  shouldComponentUpdate(nextProps, nextState) {
    let self = this;
    console.log('see nextState.editWhileTyping', nextState.editWhileTyping);
    if (nextState.editWhileTyping === true) {
      console.log('see if it enters');
      self.htmlEditor.getSession().on('change', self.convertHtmlToJade);
    } else {
      console.log('in the else block here ');
      self.htmlEditor.getSession().off('change', self.convertHtmlToJade);
    }
    return true;
  }
    
  convertHtmlToJade() {
    let self = this,
        htmlVal = this.htmlEditor.getValue();
    htmlVal = htmlVal.replace(emptyLineRegex, '');
    html2jade.convertHtml(htmlVal, {}, function(err, jade) {
      self.jadeEditor.setValue(jade, -1);
    });
  }
  
  selectText() {
    this.jadeEditor.selectAll();
  }
  
  render() {
    return (
      <div className={this.displayName}>
        <div className="ui container">
          
          <div className="ui checkbox">
            <input type="checkbox" name="example" />
            <label>Convert while typing</label>
          </div>
        
          
          <div className="ui stackable two column centered grid">
            <div className="column">
              <h3 className="ui header">
                Html
              </h3>
              <div id="html-edit"></div>
            </div>
            <div className="column">
              <h3 className="ui header">
                Jade
                <div className="ui right floated button" onClick={this.selectText}>
                  Select All
                </div>
              </h3>
              <div id="jade-edit"></div>
            </div>
          </div>
          
          <div className="ui center aligned container">
            <div className="ui massive button" name="convertButton" onClick={this.convertHtmlToJade}>
              Convert
            </div>
          </div>
          
        </div>
      </div>
    );
  }
}