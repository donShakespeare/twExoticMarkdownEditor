# twExoticMarkdownEditor
Transform any TinyMCE RTE instance to a state-of-the-art extensible Markdown Editor 

This awesome plugin will thoroughly transform your editor (inline/iframe) to a powerful and neat
neat Markdown editor, better than a bare textarea or any other Markdown editor I have seen.
Bagged with highly configurable toolbar (buttons) and context menu filled with raw awesomeness.

Works seamlesslyly with *tinymceBubbleBar.js* to give you that out-of-web experience - floating toolbar.

Works seamlesslyly with *twPreCodeManager.js* to cater for fenced block codes.

Works seamlesslyly with *modxMagicHoverLink.js* for inserting links and images from file browser and so forth.

# Usage:

```language-javascript
tinymce.init({
  selector: "textarea",
  //inline: true, //for contenteditable selector
  forced_root_block : "", //!important
  force_br_newlines : true, //!important
  force_p_newlines : false, //!important
  valid_elements: "br", //!important
  paste_as_text: true, //!important
  external_plugins: {
    twExoticMarkdownEditor: "[[++assets_url]]components/tinymcewrapper/tinymceplugins/twExoticMarkdownEditor.js", //!important
    bubbleBar: "[[++assets_url]]components/tinymcewrapper/tinymceplugins/tinymceBubbleBar.js", //!important
    twPreCodeManager: "[[++assets_url]]components/tinymcewrapper/tinymceplugins/twPreCodeManager.js",
    modxMagicHoverLink: "[[++assets_url]]components/tinymcewrapper/tinymceplugins/modxMagicHoverLink.js",
  },
  twExoticMarkdownEditorSettings: {
    addClass: false, //default is true (add .twExoticMarkdownEditor class to editor body)
    removeClasses: "a b c", // remove class(es) when editor loads - smoothly reveal editor only after text has been prepared
    skipClass: "", // do not process this particular editor content, skip it!
    addAttr: false, //default is true (add markdown="1" to editor body) good for parsing mixed content in mark/parsedownExtra
  },
  plugins: "paste contextmenu save searchreplace", //!important
  toolbar: "modxMagicHoverLink twPreCodeManager boldMD italicMD linkMD imageMD blockquoteMD codeMD numlistMD bullistMD tableMD undo redo searchreplace bubbleBarOptionsButton", //!important
  menubar: false,
  contextmenu: "modxMagicHoverLink twPreCodeManager boldMD italicMD linkMD imageMD blockquoteMD codeMD numlistMD bullistMD tableMD undo redo searchreplace template" //!important
})
```
