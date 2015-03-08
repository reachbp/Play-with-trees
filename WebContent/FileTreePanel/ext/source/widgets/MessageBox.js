/*
 * Ext JS Library 1.0.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

/**
 * @class Ext.MessageBox
 * Utility class for generating different styles of message boxes.  The alias Ext.Msg can also be used.
 * Example usage:
 *<pre><code>
// Basic alert:
Ext.Msg.alert('Status', 'Changes saved successfully.');

// Prompt for user data:
Ext.Msg.prompt('Name', 'Please enter your name:', function(btn, text){
    if (btn == 'ok'){
        // process text value...
    }
});

// Show a dialog using config options:
Ext.Msg.show({
   title:'Save Changes?',
   msg: 'Your are closing a tab that has unsaved changes. Would you like to save your changes?',
   buttons: Ext.Msg.YESNOCANCEL,
   fn: processResult,
   animEl: 'elId'
});
 </code></pre>
 * @singleton
 */

Ext.MessageBox = function(){
    var dlg, opt, mask, waitTimer, vTimer;
    var bodyEl, msgEl, textboxEl, textareaEl, progressEl, pp, eMsgEl;
    var buttons, activeTextEl, bwidth;
	var vtask;
	var allKeys = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127];

	// private
    var handleValidation = function(){
		if(opt.validator) {
			var result = opt.validator(activeTextEl.dom.value);
			var isValid = (result == true || result == '' || result == []);
			var eMsg = '';
			if(typeof result == 'object') {
				for(var a in result) {
					if(a=='remove'){continue;}
					eMsg += result[a];
					if(a < result.length-1) {
						eMsg += '<br />';
					}
				}
			}
			else {
				eMsg = result;
			}
			Ext.MessageBox.updateText(opt.msg, !isValid ? eMsg : '');

			if(opt.buttons.yes) {
				buttons.yes.setDisabled(!isValid);
			}
			if(opt.buttons.ok) {
				buttons.ok.setDisabled(!isValid);
			}
		}
		vtask.completed = true;
    };

    // private
	var scheduleValidation = function(obj, charCode, e){
		if(dlg.isVisible() && opt && opt.buttons){
			vtask.completed = false;
			vtask.delay(vTimer);
		}
	};

    // private
    var handleButton = function(button){
        dlg.hide();
        Ext.callback(opt.fn, opt.scope||window, [button, activeTextEl.dom.value], 1);
    };

    // private
    var handleHide = function(){
        if(opt && opt.cls){
            dlg.el.removeClass(opt.cls);
        }
        if(waitTimer){
            Ext.TaskMgr.stop(waitTimer);
            waitTimer = null;
        }
    };

    // private
    var updateButtons = function(b){
        var width = 0;
        if(!b){
            buttons["ok"].hide();
            buttons["cancel"].hide();
            buttons["yes"].hide();
            buttons["no"].hide();
            dlg.footer.dom.style.display = 'none';
            return width;
        }
        dlg.footer.dom.style.display = '';
        for(var k in buttons){
            if(typeof buttons[k] != "function"){
                if(b[k]){
                    buttons[k].show();
                    buttons[k].setText(typeof b[k] == "string" ? b[k] : Ext.MessageBox.buttonText[k]);
                    width += buttons[k].el.getWidth()+15;
                }else{
                    buttons[k].hide();
                }
            }
        }
        return width;
    };

    // private
    var handleEsc = function(d, k, e){
        if(opt && opt.closable !== false){
            dlg.hide();
        }
        if(e){
            e.stopEvent();
        }
    };

    return {
        /**
         * Returns a reference to the underlying {@link Ext.BasicDialog} element
         * @return {Ext.BasicDialog} dialog The BasicDialog element
         */
        getDialog : function(){
           if(!dlg){
                dlg = new Ext.BasicDialog("x-msg-box", {
                    autoCreate : true,
                    shadow: true,
                    draggable: true,
                    resizable:false,
                    constraintoviewport:false,
                    fixedcenter:true,
                    collapsible : false,
                    shim:true,
                    modal: true,
                    width:400, height:100,
                    buttonAlign:"center",
                    closeClick : function(){
                        if(opt && opt.buttons && opt.buttons.no && !opt.buttons.cancel){
                            handleButton("no");
                        }else{
                            handleButton("cancel");
                        }
                    }
                });
                dlg.on("hide", handleHide);
                mask = dlg.mask;
                dlg.addKeyListener(27, handleEsc);
                buttons = {};
                var bt = this.buttonText;
                buttons["ok"] = dlg.addButton(bt["ok"], handleButton.createCallback("ok"));
                buttons["yes"] = dlg.addButton(bt["yes"], handleButton.createCallback("yes"));
                buttons["no"] = dlg.addButton(bt["no"], handleButton.createCallback("no"));
                buttons["cancel"] = dlg.addButton(bt["cancel"], handleButton.createCallback("cancel"));
                bodyEl = dlg.body.createChild({
                    tag:"div",
                    html:'<span class="ext-mb-text"></span><br /><input type="text" class="ext-mb-input" /><textarea class="ext-mb-textarea"></textarea><br /><span class="ext-mb-eMsg"></span><div class="ext-mb-progress-wrap"><div class="ext-mb-progress"><div class="ext-mb-progress-bar">&#160;</div></div></div>'
                });
                msgEl = bodyEl.dom.firstChild;
                textboxEl = Ext.get(bodyEl.dom.childNodes[2]);
                textboxEl.enableDisplayMode();
                textboxEl.addKeyListener([10,13], function(){
					if(dlg.isVisible() && opt && opt.buttons){
						handleValidation();
                        if(opt.buttons.ok && !buttons.ok.disabled && vtask.completed){
                            handleButton("ok");
                        }else if(opt.buttons.yes && !buttons.yes.disabled && vtask.completed){
                            handleButton("yes");
                        }
                    }
                });
				if(!vtask) {
					vtask = new Ext.util.DelayedTask(handleValidation);
				}
				textboxEl.addKeyListener(allKeys, scheduleValidation);
                textareaEl = Ext.get(bodyEl.dom.childNodes[3]);
                textareaEl.enableDisplayMode();
				textareaEl.addKeyListener(allKeys, scheduleValidation);
                eMsgEl = bodyEl.dom.childNodes[5];
                progressEl = Ext.get(bodyEl.dom.childNodes[6]);
                progressEl.enableDisplayMode();
                var pf = progressEl.dom.firstChild;
                pp = Ext.get(pf.firstChild);
                pp.setHeight(pf.offsetHeight);
            }
            return dlg;
        },

        /**
         * Updates the message box body text
         * @param {String} text Replaces the message box element's innerHTML with the specified string (defaults to
         * the XHTML-compliant non-breaking space character &#160;)
         * @return {Ext.MessageBox} messageBox This message box
         */
        updateText : function(text, eMessage){
            if(!dlg.isVisible() && !opt.width){
                dlg.resizeTo(this.maxWidth, 100); // resize first so content is never clipped from previous shows
            }
            msgEl.innerHTML = text || '&#160;';
            eMsgEl.innerHTML = eMessage || '&#160; &#160;';
            var w = Math.max(Math.min(opt.width || msgEl.offsetWidth, this.maxWidth), 
                        Math.max(opt.minWidth || this.minWidth, bwidth));
            if(opt.prompt){
                activeTextEl.setWidth(w);
            }
            if(dlg.isVisible()){
                dlg.fixedcenter = false;
            }
            dlg.setContentSize(w, bodyEl.getHeight());
            if(dlg.isVisible()){
                dlg.fixedcenter = true;
            }
			activeTextEl.focus();
            return this;
        },

        /**
         * Updates a progress-style message box's text and progress bar.  Only relevant on message boxes
         * initiated via {@link Ext.MessageBox#progress} or by calling {@link Ext.MessageBox#show} with progress: true.
         * @param {Number} value Any number between 0 and 1 (e.g., .5)
         * @param {String} text If defined, the message box's body text is replaced with the specified string (defaults to undefined)
         * @return {Ext.MessageBox} messageBox This message box
         */
        updateProgress : function(value, text){
            if(text){
                this.updateText(text);
            }
            pp.setWidth(Math.floor(value*progressEl.dom.firstChild.offsetWidth));
            return this;
        },        

        /**
         * Returns true if the message box is currently displayed
         * @return {Boolean} isVisible True if the message box is visible, else false
         */
        isVisible : function(){
            return dlg && dlg.isVisible();  
        },

        /**
         * Hides the message box if it is displayed
         */
        hide : function(){
            if(this.isVisible()){
                dlg.hide();
            } 
			dlg = null;
        },

        /**
         * Displays a new message box, or reinitializes an existing message box, based on the config options
         * passed in. All functions (e.g. prompt, alert, etc) on MessageBox call this function internally.
         * The following config object properties are supported:
         * <pre>
Property    Type             Description
----------  ---------------  ----------------------------------------------------------------------
title       String           The title text
closable    Boolean          False to hide the top-right close box (defaults to true)
prompt      Boolean          True to prompt the user to enter single-line text (defaults to false)
multiline   Boolean          True to prompt the user to enter multi-line text (defaults to false)
progress    Boolean          True to display a progress bar (defaults to false)
value       String           The string value to set into the active textbox element if displayed
buttons     Object/Boolean   A button config object (e.g., Ext.MessageBox.OKCANCEL or {ok:'Foo',
                             cancel:'Bar'}), or false to not show any buttons (defaults to false)
msg         String           A string that will replace the existing message box body text (defaults
                             to the XHTML-compliant non-breaking space character &#160;)
cls         String           A custom CSS class to apply to the message box element
proxyDrag   Boolean          True to display a lightweight proxy while dragging (defaults to false)
modal       Boolean          False to allow user interaction with the page while the message box is
                             displayed (defaults to true)
</pre>
         *
         * Example usage:
         * <pre><code>
Ext.Msg.show({
   title: 'Address',
   msg: 'Please enter your address:',
   width: 300,
   buttons: Ext.MessageBox.OKCANCEL,
   multiline: true,
   fn: saveAddress,
   animEl: 'addAddressBtn'
});
</code></pre>
         * @param {Object} config Configuration options
         * @return {Ext.MessageBox} messageBox This message box
         */
        show : function(options){
            if(this.isVisible()){
                this.hide();
            }
            var d = this.getDialog();
            opt = options;
            d.setTitle(opt.title || "&#160;");
            d.close.setDisplayed(opt.closable !== false);
            activeTextEl = textboxEl;
            opt.prompt = opt.prompt || (opt.multiline ? true : false);
            if(opt.prompt){
                if(opt.multiline){
                    textboxEl.hide();
                    textareaEl.show();
                    textareaEl.setHeight(typeof opt.multiline == "number" ?
                        opt.multiline : this.defaultTextHeight);
                    activeTextEl = textareaEl;
                }else{
                    textboxEl.show();
                    textareaEl.hide();
                }
            }else{
                textboxEl.hide();
                textareaEl.hide();
            }
            progressEl.setDisplayed(opt.progress === true);
            this.updateProgress(0);
            activeTextEl.dom.value = opt.value || "";
            if(opt.prompt){
                dlg.setDefaultButton(activeTextEl);
            }else{
                var bs = opt.buttons;
                var db = null;
                if(bs && bs.ok){
                    db = buttons["ok"];
                }else if(bs && bs.yes){
                    db = buttons["yes"];
                }
                dlg.setDefaultButton(db);
            }
            bwidth = updateButtons(opt.buttons);
            this.updateText(opt.msg);
            if(opt.cls){
                d.el.addClass(opt.cls);
            }
            d.proxyDrag = opt.proxyDrag === true;
            d.modal = opt.modal !== false;
            d.mask = opt.modal !== false ? mask : false;
            if(!d.isVisible()){
                // force it to the end of the z-index stack so it gets a cursor in FF
                document.body.appendChild(dlg.el.dom);
                d.animateTarget = null;
                d.show(options.animEl);
            }
			vTimer = opt.vTimer || 200;
			vtask.delay(vTimer);
            return this;
        },

        /**
         * Displays a message box with a progress bar.  This message box has no buttons and is not closeable by
         * the user.  You are responsible for updating the progress bar as needed via {@link Ext.MessageBox#updateProgress}
         * and closing the message box when the process is complete.
         * @param {String} title The title bar text
         * @param {String} msg The message box body text
         * @return {Ext.MessageBox} messageBox This message box
         */
        progress : function(title, msg){
            this.show({
                title : title,
                msg : msg,
                buttons: false,
                progress:true,
                closable:false,
                minWidth: this.minProgressWidth
            });
            return this;
        },

        /**
         * Displays a standard read-only message box (comparable to the basic JavaScript alert prompt) with an OK
         * button. If a callback function is passed it will be called after the user clicks the button, and the
         * id of the button that was clicked will be passed as the only parameter to the callback
         * (could also be the top-right close button).
         * @param {String} title The title bar text
         * @param {String} msg The message box body text
         * @param {Function} fn (optional) The callback function invoked after the message box is closed
         * @param {Object} scope (optional) The scope of the callback function
         * @return {Ext.MessageBox} messageBox This message box
         */
        alert : function(title, msg, fn, scope){
            this.show({
                title : title,
                msg : msg,
                buttons: this.OK,
                fn: fn,
                scope : scope
            });
            return this;
        },

        /**
         * Displays a message box with an infinitely auto-updating progress bar.  This can be used to block user
         * interaction while waiting for a long-running process to complete that does not have defined intervals.
         * You are responsible for closing the message box when the process is complete.
         * @param {String} msg The message box body text
         * @param {String} title (optional) The title bar text
         * @return {Ext.MessageBox} messageBox This message box
         */
        wait : function(msg, title){
            this.show({
                title : title,
                msg : msg,
                buttons: false,
                closable:false,
                progress:true,
                modal:true,
                width:300,
                wait:true
            });
            waitTimer = Ext.TaskMgr.start({
                run: function(i){
                    Ext.MessageBox.updateProgress(((((i+20)%20)+1)*5)*.01);
                },
                interval: 1000
            });
            return this;
        },

        /**
         * Displays a confirmation message box with Yes and No buttons.  If a callback function is passed it will
         * be called after the user clicks either button, and the id of the button that was clicked
         * will be passed as the only parameter to the callback (could also be the top-right close button).
         * @param {String} title The title bar text
         * @param {String} msg The message box body text
         * @param {Function} fn (optional) The callback function invoked after the message box is closed
         * @param {Object} scope (optional) The scope of the callback function
         * @return {Ext.MessageBox} messageBox This message box
         */
        confirm : function(title, msg, fn, scope){
            this.show({
                title : title,
                msg : msg,
                buttons: this.YESNO,
                fn: fn,
                scope : scope
            });
            return this;
        },

        /**
         * Displays a message box with OK and Cancel buttons prompting the user to enter some text.  The prompt can
         * be a single-line or multi-line textbox.  If a callback function is passed it will be called after the user
         * clicks either button, and the id of the button that was clicked (could also be the top-right
         * close button) and the text that was entered will be passed as the two parameters to the callback.
         * @param {String} title The title bar text
         * @param {String} msg The message box body text
         * @param {Function} fn (optional) The callback function invoked after the message box is closed
         * @param {Object} scope (optional) The scope of the callback function
         * @param {Boolean/Number} multiline (optional) True to create a multiline textbox using the defaultTextHeight
         * property, or the height in pixels to create the textbox (defaults to false / single-line)
         * @return {Ext.MessageBox} messageBox This message box
         */
        prompt : function(title, msg, fn, scope, multiline, validator){
            this.show({
                title : title,
                msg : msg,
                buttons: this.OKCANCEL,
                fn: fn,
                minWidth:250,
                scope : scope,
                prompt:true,
                multiline: multiline,
				validator: validator
            });
            return this;
        },

        /**
         * Button config that displays a single OK button
         * @type Object
         */
        OK : {ok:true},
        /**
         * Button config that displays Yes and No buttons
         * @type Object
         */
        YESNO : {yes:true, no:true},
        /**
         * Button config that displays OK and Cancel buttons
         * @type Object
         */
        OKCANCEL : {ok:true, cancel:true},
        /**
         * Button config that displays Yes, No and Cancel buttons
         * @type Object
         */
        YESNOCANCEL : {yes:true, no:true, cancel:true},

        /**
         * The default height in pixels of the message box's multiline textarea if displayed (defaults to 75)
         * @type Number
         */
        defaultTextHeight : 75,
        /**
         * The maximum width in pixels of the message box (defaults to 600)
         * @type Number
         */
        maxWidth : 600,
        /**
         * The minimum width in pixels of the message box (defaults to 100)
         * @type Number
         */
        minWidth : 100,
        /**
         * The minimum width in pixels of the message box progress bar if displayed (defaults to 250)
         * @type Number
         */
        minProgressWidth : 250,
        /**
         * An object containing the default button text strings that can be overriden for localized language support.
         * Supported properties are: ok, cancel, yes and no.
         * Customize the default text like so: Ext.MessageBox.buttonText.yes = "Si";
         * @type Object
         */
        buttonText : {
            ok : "OK",
            cancel : "Cancel",
            yes : "Yes",
            no : "No"
        }
    };
}();

/**
 * Shorthand for {@link Ext.MessageBox}
 */
Ext.Msg = Ext.MessageBox;