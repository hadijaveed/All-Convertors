import React, { Component } from 'react';
import { getEditorConfig, emptyLineRegex } from '../store/index';
import Css2Stylus from '../custom_modules/css2stylus';
import ace from 'brace';
import 'brace/mode/css';
import 'brace/theme/chrome';
import 'brace/mode/stylus';

export default class CssToStylus extends Component {

    constructor() {
        super();
        this.convertCssToStylus = this.convertCssToStylus.bind(this);
    }

    componentDidMount() {
        let self = this;
        self.cssEditor = ace.edit('css-editor');
        self.cssEditor.setOptions(getEditorConfig('css'));

        // convert event on change
        self.cssEditor.getSession().on('change', self.convertCssToStylus);

        self.stylusEditor = ace.edit('stylus-editor');
        self.stylusEditor.setOptions(getEditorConfig('stylus'));
    }

    convertCssToStylus() {
        let self = this,
            cssVal = this.cssEditor.getValue(),
            converter = new Css2Stylus.Converter(cssVal);
        converter.processCss();
        self.stylusEditor.setValue(converter.getStylus(), -1);
    }

    render() {
        return (
            <div className="row">
                <div className="box-container">
                    <h2>Css</h2>
                    <div id="css-editor" className="editor"></div>
                </div>

                <div className="box-container">
                    <h2 className="right-aligned">Stylus</h2>
                    <div id="stylus-editor" className="editor"></div>
                </div>

            </div>
        );

    }
}
