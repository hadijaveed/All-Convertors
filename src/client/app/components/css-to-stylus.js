// utilities imports //

$.fn.checkbox = require('semantic-ui-checkbox');
$.fn.transition = require('semantic-ui-transition');

/* Module imports */
import Css2Stylus from 'css2stylus';
import ace from 'brace';
import 'brace/mode/css';
import 'brace/theme/chrome';
import 'brace/mode/stylus';
const emptyLineRegex = /^(?=\n)$|^\s*|\s*$|\n\n+/gm;





export default class CssToStylus extends React.Component {
  
  constructor(props) {
    super(props);
    this.displayName = 'CssToStylus';
    this.convertCssToStylus = this.convertCssToStylus.bind(this);
    this.state = { editWhileTyping: false };
    this.cssEditor = null;
    this.stylusEditor = null;
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

    self.stylusEditor = ace.edit('stylus-edit');
    self.stylusEditor.setOptions({
      mode: 'ace/mode/stylus',
      theme: 'ace/theme/chrome',
      fontSize: 16,
      tabSize: 2,
      showLineNumbers: false,
      showGutter: false,
      maxLines: Infinity,
      readOnly: true
    });
    
    // to stop error warning
    self.stylusEditor.$blockScrolling = Infinity;
     
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
    if (nextState.editWhileTyping === true) {
      self.cssEditor.getSession().on('change', self.convertCssToStylus);
    } else {
      self.cssEditor.getSession().off('change', self.convertCssToStylus);
    }
    
    return true;
  }
    
  convertCssToStylus() {
    let self = this,
        htmlVal = this.cssEditor.getValue(),
        converter = new Css2Stylus.Converter(htmlVal);
    converter.processCss();
    self.stylusEditor.setValue(converter.getStylus(), -1);
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
              <h3 className="ui header"> Css </h3>
              <div id="css-edit"></div>
            </div>
            <div className="column">
              <h3 className="ui header"> Stylus </h3>
              <div id="stylus-edit"></div>
            </div>
          </div>
          
          <div className="ui center aligned container">
            <div className="ui massive button" name="convertButton" onClick={this.convertCssToStylus}>
              Convert
            </div>
          </div>
          
        </div>
      </div>
    );
  }
}