import React, { Component } from 'react';
import HtmltoJade from './components/_html_to_jade';
import HtmlToJsx from './components/_html_to_jsx';
import CssToStylus from './components/_css_to_stylus';
import './styles/App.less';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { editor: 'htmlToJade' };
        this.dropdownHandler = this.dropdownHandler.bind(this);
        this.renderConvertor = this.renderConvertor.bind(this);
    }

    dropdownHandler(e) {
        this.setState({ editor: e.target.value });
    }

    renderConvertor() {
        const convertors = {
            htmlToJade: <HtmltoJade />,
            htmlToJsx: <HtmlToJsx />,
            cssToStylus: <CssToStylus />
        };
        return convertors[this.state.editor];
    }

    render() {
        return (
            <div className="container">
                <div className="row center">
                    <h1>Syntax Convertor</h1>
                </div>
                <div className="row center">
                    <select
                        value={this.state.editor}
                        onChange={this.dropdownHandler}
                        className="dropdown">

                        <option value="htmlToJade">Html to Jade</option>
                        <option value="htmlToJsx">Html to Jsx</option>
                        <option value="cssToScss">Css to Scss</option>
                        <option value="cssToStylus">Css to Stylus</option>

                    </select>
                </div>
                <div className="row">
                    {this.renderConvertor()}
                </div>

            </div>
        );
    }
}

export default App;
