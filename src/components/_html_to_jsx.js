import React, { Component } from 'react';
import { getEditorConfig, emptyLineRegex } from '../store/index';
import html2jsx from 'htmltojsx/src/htmltojsx';
import ace from 'brace';
import 'brace/mode/html';
import 'brace/theme/chrome';
import 'brace/mode/jsx';

export default class HtmlToJsx extends Component {

    constructor() {
        super();
        this.convertHtmlToJsx = this.convertHtmlToJsx.bind(this);
    }

    componentDidMount() {
        let self = this;
        self.htmlEditor = ace.edit('html-editor');
        self.htmlEditor.setOptions(getEditorConfig('html'));

        // convert event on change
        self.htmlEditor.getSession().on('change', self.convertHtmlToJsx);

        self.jsxEditor = ace.edit('jsx-editor');
        self.jsxEditor.setOptions(getEditorConfig('jsx'));

        // init jsx convertor
        self.jsxConvertor = new html2jsx({
            createClass: true,
            outputClassName: 'AwesomeComponent'
        });
    }

    convertHtmlToJsx() {
        let self = this,
            htmlVal = self.htmlEditor.getValue();
        htmlVal = htmlVal.replace(emptyLineRegex, '');
        let convertedValue = self.jsxConvertor.convert(htmlVal);
        self.jsxEditor.setValue(convertedValue, -1);
    }

    render() {
        return (
            <div className="row">
                <div className="box-container">
                    <h2>Html</h2>
                    <div id="html-editor" className="editor"></div>
                </div>

                <div className="box-container">
                    <h2 className="right-aligned">Jsx</h2>
                    <div id="jsx-editor" className="editor"></div>
                </div>

            </div>
        );

    }
}
