import {render} from 'react-dom';
import ConvertorRenderer from './client/app/components/convertorRenderer';
import './client/app/styles/style.less';
import 'semantic-ui/dist/semantic.min.css';
$.fn.dropdown = require('semantic-ui-dropdown');
$.fn.transition = require('semantic-ui-transition');


class MainLayout extends React.Component {
  constructor() {
    super();
    this.name = 'MainLayout';
    this.state = { convertor: 'htmltojade' };
  }
  
  componentDidMount() {
    let self = this;
    $('.ui.selection.dropdown').dropdown({
      onChange(val) {
        self.setState({ convertor: val });
      }
    });
  }
  
  render() {
    return (
      <div className={this.name}>
        <div className="ui container">
          <h1 className="ui header"> All Convertors </h1>
          <div className="ui selection dropdown">
            <input type="hidden" name="convertor-dropdown" />
            <i className="dropdown icon" />
            <div className="default text">Select Convertor</div>
            <div className="menu">
              <div className="item active" data-value={'htmltojade'}>Html to Jade</div>
              <div className="item" data-value={'htmltojsx'}>Html to Jsx</div>
              <div className="item" data-value={'csstostylus'}>Css to Stylus</div>
              <div className="item" data-value={'lesstocss'}>Css to Less</div>
            </div>
          </div>
        </div>
        <ConvertorRenderer convertor={this.state.convertor} />
      </div>
    );
  }
}

render(<MainLayout />, document.getElementById('root'));