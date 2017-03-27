import React, { Component } from 'react';
import { getEditorConfig, emptyLineRegex } from '../store/index';
import Css2Less from '../custom_modules/css2less';
import ace from 'brace';
import 'brace/mode/css';
import 'brace/theme/chrome';
import 'brace/mode/less';


export default class CssToScss extends Component {

    constructor() {
        super();
        this.convertCssToScss = this.convertCssToScss.bind(this);
    }

    componentDidMount() {
        let self = this;
        self.cssEditor = ace.edit('css-editor');
        self.cssEditor.setOptions(getEditorConfig('css'));

        // convert event on change
        self.cssEditor.getSession().on('change', self.convertCssToScss);

        self.lessEditor = ace.edit('less-editor');
        self.lessEditor.setOptions(getEditorConfig('less'));
    }

    convertCssToScss() {
        let self = this,
            cssVal = this.cssEditor.getValue().toString();

        let convertedValue = Css2Less(cssVal, { indentSize: 2 });

        self.lessEditor.setValue(convertedValue, -1);
    }

    render() {
        return (
            <div className="row">
                <div className="box-container">
                    <h2>Css</h2>
                    <div id="css-editor" className="editor"></div>
                </div>

                <div className="box-container">
                    <h2 className="right-aligned">Less</h2>
                    <div id="less-editor" className="editor"></div>
                </div>

            </div>
        );

    }
}
