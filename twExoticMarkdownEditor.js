/*
  twExoticMarkdownEditor.js 
  This awesome plugin will thoroughly transform your editor (inline/iframe) to a powerful and neat
  neat Markdown editor, better than a bare textarea or any other Markdown editor I have seen.
  Bagged with highly configurable toolbar (buttons) and context menu filled with raw awesomeness.
 
  Works seamlesslyly with tinymceBubbleBar.js to give you that out-of-web experience - floating toolbar.
  Works seamlesslyly with twPreCodeManager.js to cater for fenced block codes.
  Works seamlesslyly with modxMagicHoverLink.js for inserting links and images from file browser and so forth.

  https://github.com/donShakespeare/twExoticMarkdownEditor
  Demo: http://www.leofec.com/modx-revolution/
  (c) 2016 by donShakespeare for MODx awesome TinymceWrapper

  Usage:

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
*/
var mainExotic = '<style id=mainExotic>.twExoticMarkdownEditor:before {display: block;content: "markdown";position: absolute;top: 2px;right: 5px;font-style: italic;font-size: 10px;background: #F2F2F2;padding: 1px 2px;border-radius: 4px;color: #2F4150;}.twExoticMarkdownEditor:hover:before{opacity:0.3;}</style>';

function saveMyFootMarks(myMarks) {
  var marks = tinymce.html.Entities.decode(myMarks.replace(/(?:<br>|<br \/>)/g, "\n").replace(/(&nbsp;)/g, " ").replace(/(?:&amp;gt;|&gt;)/g, ">"));
  return marks;
}
function getMyFootMarks(myMarks) {
  var marks = tinymce.html.Entities.encodeAllRaw(myMarks).replace(/  /g, " &nbsp;").replace(/(?:\r\n|\r|\n)/g, "<br />").replace(/(?:&amp;gt;|&gt;)/g, ">").replace(/(?:&amp;)/g, "&");
  return marks;
}
function makeMyFootMarks(editor,firstPart,lorem,lastPart) {
  var range = editor.selection.getContent();
  if (range.trim() !== '') {
    lorem = range.trim();
  }
  editor.undoManager.transact(function() {
    editor.selection.setContent(firstPart+lorem+lastPart)
  });
}
tinymce.PluginManager.add('twExoticMarkdownEditor', function(editor) {
  editor.on('BeforeExecCommand', function(e) {
    // console.log(e.command)
    if(e.command == "twPreCodeManager" || e.command == "SelectAll" || e.command == "undo" || e.command == "redo" || e.command == "Undo" || e.command == "Redo" || e.command == "mceInsertContent" || e.command == "InsertLineBreak" || e.command == "Delete" || e.command == "mceSave"){
    }
    else{
      e.preventDefault;
      return false;
    }
  });
  editor.on('BeforeSetContent', function(e) {
    editor.settings.forced_root_block = "";
    editor.settings.force_p_newlines = false;
    editor.settings.force_br_newlines = true;
    // editor.settings.paste_as_text = true;
    // editor.settings.valid_elements = "br";
    editor.settings.unMarkedContent = getMyFootMarks(e.content);
    // console.log("beforesetcont")
  });
  editor.on('LoadContent',function(e){
    if(!$(editor.getBody()).hasClass(editor.getParam("twExoticMarkdownEditorSettings",{}).skipClass)){
      editor.setContent(editor.settings.unMarkedContent, {format:"raw"})
    }
    if(editor.getParam("twExoticMarkdownEditorSettings",{}).removeClasses){
      $(editor.getBody()).removeClass(editor.getParam("twExoticMarkdownEditorSettings",{}).removeClasses);
    }
    // console.log("LoadContent")
  });
  editor.on('init', function(e) {
    editor.settings.twExoticMarkdownEditor = true;
    if(editor.getParam("twExoticMarkdownEditorSettings",{}).addAttr !== false){
      $(editor.getBody()).attr("markdown",1);
    }
    if(editor.getParam("twExoticMarkdownEditorSettings",{}).addClass !==false){
      $(editor.getBody()).addClass("twExoticMarkdownEditor");
      if(!$(editor.getBody()).parents("html").find("head #mainExotic").length){
        $(editor.getBody()).parents("html").find("head").append(mainExotic);
      }
    }
    // console.log("init")
  });
  editor.on('SaveContent', function(e) {
    if(editor.isHidden()){
      editor.windowManager.alert("Please do not save while in hidden mode",function(){
      editor.show()
      })
    }
    e.content = saveMyFootMarks(e.content);
    // console.log("SaveContent")
  });
  // editor.on('PreProcess', function(e) {
  //     console.log('PreProcess event');
  // });
  // editor.on('NodeChange',function(e){
  //     $(editor.getBody()).children().not("br").contents().unwrap();
  //     // $(editor.getBody()).children().not("br").remove();
  //     $(editor.getBody()).find("br").replaceWith("<br>");
  //     console.log("")
  // });
  // editor.on('drop', function(e) {
  //   var dataTransfer = e.dataTransfer;
  //   if (dataTransfer && dataTransfer.files && dataTransfer.files.length > 0) {
  //   e.preventDefault();
  //   }
  // });
  editor.on('PastePreProcess', function(args) {
    // if(editor.settings.valid_elements !== "br"){
      var text = $("<div/>").html(args.content.replace(/  /g, " &nbsp;").replace(/(?:\r\n|\r|\n)/g, "<br>"));
      text.children().contents().unwrap();
      args.content = text.html();
      //or below
      // args.content = args.content.replace(/<(?!br\s*\/?)[^>]+>/g, "").replace(/(?:\r\n|\r|\n)/g, "<br>");
      // editor.windowManager.alert("Beware! RTE init setting 'valid_elements: \"br\"' is missing");
    // }
  })
  // editor.removeShortcut('ctrl+b');
  // editor.remove('ctrl+b');
  editor.shortcuts.add('ctrl+b', '', function(){
    makeMyFootMarks(editor,"**","BOLD","** ")
  });
  editor.shortcuts.add('meta+b', '', function(){
    makeMyFootMarks(editor,"**","BOLD","** ")
  });
  editor.shortcuts.add('ctrl+i', '', function(){
    makeMyFootMarks(editor,"_","ITALIC","_ ")
  });
  editor.shortcuts.add('meta+i', '', function(){
    makeMyFootMarks(editor,"_","ITALIC","_ ")
  });
  editor.addButton('boldMD', {
    icon: "bold",
    tooltip: "Insert/Make Bold (ctrl+b)",
    onclick: function() {
      makeMyFootMarks(editor,"**","BOLD","** ")
    }
  });
  editor.addButton('italicMD', {
    icon: "italic",
    tooltip: "Insert/Make Italic (ctrl+i)",
    onclick: function() {
      makeMyFootMarks(editor,"_","ITALIC","_ ")
    }
  });
  editor.addButton('linkMD', {
    icon: "link",
    tooltip: "Insert/Make Link",
    onclick: function() {
      makeMyFootMarks(editor,"[","LINK_TEXT","](http://link.com) ")
    }
  });
  editor.addButton('imageMD', {
    icon: "image",
    tooltip: "Insert/Make Image",
    onclick: function() {
      makeMyFootMarks(editor,'![','IMAGE_ALT','](image.jpg "TOOL_TIP") ')
    }
  });
  editor.addButton('blockquoteMD', {
    icon: "blockquote",
    tooltip: "Insert/Make Blockquote",
    onclick: function() {
      makeMyFootMarks(editor,'<br>>','QUOTE','<br><br>')
    }
  });
  editor.addButton('codeMD', {
    icon: "code",
    tooltip: "Insert/Make Pre/Code",
    onclick: function() {
      makeMyFootMarks(editor,'<br>```language-<br>','CODE','<br>```<br><br>')
    }
  })
  editor.addButton('numlistMD', {
    icon: "numlist",
    tooltip: "Insert/Make Number List",
    onclick: function() {
      makeMyFootMarks(editor,'<br>1. ','ITEM_ONE','<br>2. ITEM_TWO<br>3. ITEM_THREE<br><br>')
    }
  });
  editor.addButton('bullistMD', {
    icon: "bullist",
    tooltip: "Insert/Make Bullet List",
    onclick: function() {
      makeMyFootMarks(editor,'<br>+ ','ITEM_ONE','<br>+ ITEM_TWO<br><br>+ ITEM_THREE<br><br>')
    }
  });
  editor.addButton('tableMD', {
    icon: "table",
    tooltip: "Generate Markdown Tables (external link)",
    onclick: function() {
      window.open("http://www.tablesgenerator.com/markdown_tables");
    }
  });
  editor.addMenuItem('boldMD', {
    icon: "bold",
    text: "Insert/Make Bold",
    onclick: function() {
      makeMyFootMarks(editor,"**","BOLD","** ")
    }
  });
  editor.addMenuItem('italicMD', {
    icon: "italic",
    text: "Insert/Make Italic",
    onclick: function() {
      makeMyFootMarks(editor,"_","ITALIC","_ ")
    }
  });
  editor.addMenuItem('linkMD', {
    icon: "link",
    text: "Insert/Make Link",
    onclick: function() {
      makeMyFootMarks(editor,"[","LINK_TEXT","](http://link.com) ")
    }
  });
  editor.addMenuItem('imageMD', {
    icon: "image",
    text: "Insert/Make Image",
    onclick: function() {
      makeMyFootMarks(editor,'![','IMAGE_ALT','](image.jpg "TOOL_TIP") ')
    }
  });
  editor.addMenuItem('blockquoteMD', {
    icon: "blockquote",
    text: "Insert/Make Blockquote",
    onclick: function() {
      makeMyFootMarks(editor,'<br>>','QUOTE','<br><br>')
    }
  });
  editor.addMenuItem('codeMD', {
    icon: "code",
    text: "Insert/Make Pre/Code",
    onclick: function() {
      makeMyFootMarks(editor,'<br>```language-<br>','CODE','<br>```<br><br>')
    }
  });
  editor.addMenuItem('numlistMD', {
    icon: "numlist",
    text: "Insert/Make Number List",
    onclick: function() {
      makeMyFootMarks(editor,'<br>1. ','ITEM_ONE','<br>2. ITEM_TWO<br>3. ITEM_THREE<br><br>')
    }
  });
  editor.addMenuItem('bullistMD', {
    icon: "bullist",
    text: "Insert/Make Bullet List",
    onclick: function() {
      makeMyFootMarks(editor,'<br>+ ','ITEM_ONE','<br>+ ITEM_TWO<br><br>+ ITEM_THREE<br><br>')
    }
  });
  editor.addMenuItem('tableMD', {
    icon: "table",
    text: "Tables (external link)",
    onclick: function() {
      window.open("http://www.tablesgenerator.com/markdown_tables");
    }
  });
});
