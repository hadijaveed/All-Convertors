import React, { Component } from 'react';
import { getEditorConfig, emptyLineRegex } from '../store/index';
import html2jade from 'html2jade';
import ace from 'brace';
import 'brace/mode/html';
import 'brace/theme/chrome';
import 'brace/mode/jade';

export default class HtmlToJade extends Component {

    constructor() {
        super();
        this.convertHtmlToJade = this.convertHtmlToJade.bind(this);
    }

    componentDidMount() {
        let self = this;
        self.htmlEditor = ace.edit('html-editor');
        self.htmlEditor.setOptions(getEditorConfig('html'));

        // convert event on change
        self.htmlEditor.getSession().on('change', self.convertHtmlToJade);

        self.jadeEditor = ace.edit('jade-editor');
        self.jadeEditor.setOptions(getEditorConfig('jade'));
    }

    convertHtmlToJade() {
        let self = this,
            htmlVal = this.htmlEditor.getValue();
        htmlVal = htmlVal.replace(emptyLineRegex, '');
        html2jade.convertHtml(htmlVal, {}, (err, jade) => {
            self.jadeEditor.setValue(jade, -1);
        });
    }

    render() {
        return (
            <div className="row">
                <div className="box-container">
                    <h2>Html</h2>
                    <div id="html-editor" className="editor"></div>
                </div>

                <div className="box-container">
                    <h2 className="right-aligned">Jade</h2>
                    <div id="jade-editor" className="editor"></div>
                </div>

            </div>
        );

    }
}
