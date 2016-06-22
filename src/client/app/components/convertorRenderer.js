import HtmltoJade from './html-to-jade';
import CsstoLess from './css-to-less';
import HtmlToJsx from './html-to-jsx';
import Css2Stylus from './css-to-stylus';

let aceEditorOptions = {
  theme: 'ace/theme/chrome',
  fontSize: 16,
  tabSize: 2,
  showLineNumbers: false,
  showGutter: false,
  maxLines: Infinity
};

export default class ConvertorRenderer extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    let convertor;
    switch (this.props.convertor) {
      case 'htmltojade':
        convertor = <HtmltoJade editorOptions = {aceEditorOptions}/>;
        break;
      case 'lesstocss':
        convertor = <CsstoLess editorOptions = {aceEditorOptions}/>;
        break;
      case 'htmltojsx':
        convertor = <HtmlToJsx editorOptions = {aceEditorOptions}/>;
        break;
      case 'csstostylus':
        convertor = <Css2Stylus editorOptions = {aceEditorOptions}/>;
        break;
    }
    
    return (
      <div>
        {convertor}
      </div>
    );
  }
}