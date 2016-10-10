function MaskedPassword(passfield, symbol) {
	if(typeof document.getElementById == 'undefined'
		|| typeof document.styleSheets == 'undefined') { return false; }

	if(passfield == null) { return false; }
	
	this.symbol = symbol;
	this.isIE = typeof document.uniqueID != 'undefined';
	passfield.value = '';
	passfield.defaultValue = '';
	passfield._contextwrapper = this.createContextWrapper(passfield);
	this.fullmask = false; 

	var wrapper = passfield._contextwrapper;
	var hiddenfield = '<input type="hidden" name="' + passfield.name + '">';
	var textfield = this.convertPasswordFieldHTML(passfield);
	wrapper.innerHTML = hiddenfield + textfield;
	passfield = wrapper.lastChild;
	passfield.className += ' masked';
	passfield.setAttribute('autocomplete', 'off');
	passfield._realfield = wrapper.firstChild;
	passfield._contextwrapper = wrapper;
	this.limitCaretPosition(passfield);

	var self = this;

	this.addListener(passfield, 'change', function(e) { 
		self.fullmask = false; 
		self.doPasswordMasking(self.getTarget(e)); 
	});
	this.addListener(passfield, 'input', function(e) { 
		self.fullmask = false; 
		self.doPasswordMasking(self.getTarget(e)); 
	});
	this.addListener(passfield, 'propertychange', function(e) { 
		self.doPasswordMasking(self.getTarget(e)); 
	});
	this.addListener(passfield, 'keyup', function(e) { 
		if (!/^(9|1[678]|224|3[789]|40)$/.test(e.keyCode.toString())) {
			self.fullmask = false; 
			self.doPasswordMasking(self.getTarget(e));
		}
	});
	this.addListener(passfield, 'blur', function(e) { 
		self.fullmask = true; 
		self.doPasswordMasking(self.getTarget(e)); 
	});
	
	this.forceFormReset(passfield);
	return true;
}

MaskedPassword.prototype = {

	doPasswordMasking : function(textbox) {
		var plainpassword = '';

		if (textbox._realfield.value != '') {
			for (var i=0; i<textbox.value.length; i++) {
				if (textbox.value.charAt(i) == this.symbol) {
					plainpassword += textbox._realfield.value.charAt(i);
				} else {
					plainpassword += textbox.value.charAt(i);
				}
			}
		} else  { 
			plainpassword = textbox.value; 
		}
	
		var maskedstring = this.encodeMaskedPassword(plainpassword, this.fullmask, textbox);
		
		if (textbox._realfield.value != plainpassword || textbox.value != maskedstring) { 
			textbox._realfield.value = plainpassword;
			textbox.value = maskedstring;
		}
	},
	encodeMaskedPassword : function(passwordstring, fullmask, textbox) {
		var characterlimit = fullmask === true ? 0 : 1;
		
		//create the masked password string then iterate  
		//through he characters in the plain password
		for(var maskedstring = '', i=0; i<passwordstring.length; i++)
		{
			//if we're below the masking limit, 
			//add a masking symbol to represent this character
			if(i < passwordstring.length - characterlimit) 
			{ 
				maskedstring += this.symbol; 
			}
			//otherwise just copy across the real character
			else 
			{
				maskedstring += passwordstring.charAt(i); 
			}
		}
		
		//return the final masked string
		return maskedstring;
	},
	
	
	//create a context wrapper element around a password field
	createContextWrapper : function(passfield)
	{
		//create the wrapper and add its class
		//it has to be an inline element because we don't know its context
		var wrapper = document.createElement('span');
		
		//enforce relative positioning
		wrapper.style.position = 'relative';
		
		//insert the wrapper directly before the passfield
		passfield.parentNode.insertBefore(wrapper, passfield);
		
		//then move the passfield inside it
		wrapper.appendChild(passfield);
		
		//return the wrapper reference
		return wrapper;
	},
	
	
	//force a form to reset its values, so that soft-refresh does not retain them
	forceFormReset : function(textbox)
	{
		//find the parent form from this textbox reference
		//(which may not be a textbox, but that's fine, it just a reference name!)
		while(textbox)
		{
			if(/form/i.test(textbox.nodeName)) { break; }
			textbox = textbox.parentNode;
		}
		//if the reference is not a form then the textbox wasn't wrapped in one
		//so in that case we'll just have to abandon what we're doing here
		if(!/form/i.test(textbox.nodeName)) { return null; }
		
		//otherwise bind a load event to call the form's reset method
		//we have to defer until load time for IE or it won't work
		//because IE renders the page with empty fields 
		//and then adds their values retrospectively!
		//(but in other browsers we can use DOMContentLoaded;
		// and the load listener function takes care of that split)
		this.addSpecialLoadListener(function() { textbox.reset(); });
		
		//return the now-form reference
		return textbox;
	},
	
	
	//copy the HTML from a password field to a plain text field, 
	//we have to convert the field this way because of Internet Explorer
	//because it doesn't support setting or changing the type of an input
	convertPasswordFieldHTML : function(passfield, addedattrs)
	{
		//start the HTML for a text field
		var textfield = '<input';
		
		//now run through the password fields' specified attributes 
		//and copy across each one into the textfield HTML
		//*except* for its name and type, and any formtools underscored attributes
		//we need to exclude the name because we'll define that separately
		//depending on the situation, and obviously the type, and formtools attributes
		//because we control them and their meaning in separate conditions too
		for(var fieldattributes = passfield.attributes, 
				j=0; j<fieldattributes.length; j++)
		{
			//we have to check .specified otherwise we'll get back every single attribute
			//that the element might possibly have! which is what IE puts in the attributes 
			//collection, with default values for unspecified attributes
			if(fieldattributes[j].specified && !/^(_|type|name)/.test(fieldattributes[j].name))
			{
				textfield += ' ' + fieldattributes[j].name + '="' + fieldattributes[j].value + '"';
			}
		}
		
		//now add the type of "text" to the end, plus an autocomplete attribute, and close it
		//we add autocomplete attribute for added safety, though it probably isnt necessary, 
		//since browsers won't offer to remember it anywway, because the field has no name
		//this uses HTML4 empty-element syntax, but we don't need to distinguish by spec
		//because the browser's internal representations will generally be identical anyway
		textfield += ' type="text" autocomplete="off">';
		
		//return the finished textfield HTML
		return textfield;
	},
	
	
	//this crap is what it takes to force the caret in a textbox to stay at the end
	//I'd really rather not to do this, but it's the only way to have reliable encoding
	limitCaretPosition : function(textbox)
	{
		//create a null timer reference and start function
		var timer = null, start = function()
		{
			//prevent multiple instances
			if(timer == null) 
			{
				//IE uses this range stuff
				if(this.isIE)
				{
					//create an interval that continually force the position
					//as long as the field has the focus
					timer = window.setInterval(function() 
					{ 
						//we can only force position to the end
						//because there's no way to know whether there's a selection
						//or just a single caret point, because the range methods 
						//we could use to determine that don't work on created fields
						//(they generate "Invalid argument" errors)
						var range = textbox.createTextRange(),
							valuelength = textbox.value.length,
							character = 'character';
						range.moveEnd(character, valuelength);
						range.moveStart(character, valuelength);
						range.select();				
					
					//not so fast as to be a major CPU hog
					//but fast enough to do the job effectively
					}, 100);
				}
				//other browsers have these selection properties
				else
				{
					//create an interval that continually force the position
					//as long as the field has the focus
					timer = window.setInterval(function() 
					{ 
						//allow selection from or position at the end
						//otherwise force position to the end
						var valuelength = textbox.value.length;
						if(!(textbox.selectionEnd == valuelength && textbox.selectionStart <= valuelength))
						{
							textbox.selectionStart = valuelength;
							textbox.selectionEnd = valuelength;
						}
						
					//ditto
					}, 100);
				}
			}
		},
		
		//and a stop function
		stop = function()
		{
			window.clearInterval(timer);
			timer = null;
		};
		
		//add events to start and stop the timer
		this.addListener(textbox, 'focus', function() { start(); });
		this.addListener(textbox, 'blur', function() { stop(); });
	},
	
	
	//add an event listener
	//this is deliberately not called "addEvent" so that we can 
	//compress the name, which would otherwise also effect "addEventListener"
	addListener : function(eventnode, eventname, eventhandler)
	{
		if(typeof document.addEventListener != 'undefined')
		{
			return eventnode.addEventListener(eventname, eventhandler, false);
		}
		else if(typeof document.attachEvent != 'undefined')
		{
			return eventnode.attachEvent('on' + eventname, eventhandler);
		}
	},
	
	
	//add a special load listener, split between 
	//window load for IE and DOMContentLoaded for others
	//this is only used by the force form reset method, which wants that split
	addSpecialLoadListener : function(eventhandler)
	{
		//we specifically need a browser condition here, not a feature test
		//because we know specifically what should be given to who
		//and that doesn't match general support for these constructs
		if(this.isIE)
		{
			return window.attachEvent('onload', eventhandler);
		}
		else
		{
			return document.addEventListener('DOMContentLoaded', eventhandler, false);
		}
	},
	
	
	//get an event target by sniffing for its property name
	//(assuming here that e is already a cross-model reference
	//as it is from addListener because attachEvent in IE 
	//automatically provides a corresponding event argument)
	getTarget : function(e)
	{
		//just in case!
		if(!e) { return null; }
		
		//otherwise return the target
		return e.target ? e.target : e.srcElement;
	}

}


