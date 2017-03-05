const editorConfig = {
    mode: 'ace/mode/html',
    theme: 'ace/theme/chrome',
    fontSize: 14,
    tabSize: 2,
    showLineNumbers: false,
    showGutter: false,
    maxLines: Infinity
};

let getEditorConfig = function(editor) {
    if (!editor) return;
    let editorTypes = {
        html: function() {
            return Object.assign({}, editorConfig, {
                mode: 'ace/mode/html',
                readOnly: false
            });
        },

        jade: function() {
            return Object.assign({}, editorConfig, {
                mode: 'ace/mode/jade',
                readOnly: true
            });
        },

        jsx: function() {
            return Object.assign({}, editorConfig, {
                mode: 'ace/mode/jsx',
                readOnly: true
            });
        },

        css: function() {
            return Object.assign({}, editorConfig, {
                mode: 'ace/mode/css',
                readOnly: false
            });
        },

        stylus: function() {
            return Object.assign({}, editorConfig, {
                mode: 'ace/mode/stylus',
                readOnly: true
            });
        }
    };
    if (editorTypes.hasOwnProperty(editor)) {
        console.log('see eidtor ', editor, 'value ', editorTypes[editor]());
        return editorTypes[editor]();
    }
};

const emptyLineRegex = /^(?=\n)$|^\s*|\s*$|\n\n+/gm;

export { getEditorConfig, emptyLineRegex };
