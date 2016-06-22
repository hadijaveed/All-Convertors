// utilities imports //

$.fn.checkbox = require('semantic-ui-checkbox');
$.fn.transition = require('semantic-ui-transition');



import html2jsx from 'htmltojsx';
import ace from 'brace';
import 'brace/mode/html';
import 'brace/theme/chrome';
import 'brace/mode/jsx';
const emptyLineRegex = /^(?=\n)$|^\s*|\s*$|\n\n+/gm;





export default class HtmlToJsx extends React.Component {
  
  constructor(props) {
    super(props);
    this.displayName = 'HtmltoJsx';
    this.convertHtmlToJsx = this.convertHtmlToJsx.bind(this);
    this.state = { editWhileTyping: false };
    this.htmlEditor = null;
    this.jsxEditor = null;
  }
  
  componentDidMount() {
    let self = this,
        htmlEditorOptions = { mode: 'ace/mode/html' },
        jsxEditorOptions = { mode: 'ace/mode/jsx', readOnly: true };
    _.extend(htmlEditorOptions, this.props.editorOptions);
    _.extend(jsxEditorOptions, this.props.editorOptions);
    
    self.htmlEditor = ace.edit('html-edit');
    self.htmlEditor.setOptions(htmlEditorOptions);
    
    // to stop error warning
    self.htmlEditor.$blockScrolling = Infinity;

    self.jsxEditor = ace.edit('jsx-edit');
    self.jsxEditor.setOptions(jsxEditorOptions);
    
    // to stop error warning
    
    self.jsxEditor.$blockScrolling = Infinity;
     
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
    self.jsxConvertor = new html2jsx ({
      createClass: true,
      outputClassName: 'AwesomeComponent'
    });
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    let self = this;
    if (nextState.editWhileTyping === true) {
      self.htmlEditor.getSession().on('change', self.convertHtmlToJsx);
    } else {
      self.htmlEditor.getSession().off('change', self.convertHtmlToJsx);
    }
    
    return true;
  }
    
  convertHtmlToJsx() {
    let self = this,
        htmlVal = this.htmlEditor.getValue();
    htmlVal = htmlVal.replace(emptyLineRegex, '');
    let convertedValue = self.jsxConvertor.convert(htmlVal);
    self.jsxEditor.setValue(convertedValue, -1);
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
              <h3 className="ui header"> Html </h3>
              <div id="html-edit"></div>
            </div>
            <div className="column">
              <h3 className="ui header"> Jsx </h3>
              <div id="jsx-edit"></div>
            </div>
          </div>
          
          <div className="ui center aligned container">
            <div className="ui massive button" name="convertButton" onClick={this.convertHtmlToJsx}>
              Convert
            </div>
          </div>
          
        </div>
      </div>
    );
  }
}