//note(@duncanmid): CodeOverview - Coda 2 Sidebar Plugin v.1.1 | © D.G. Midwinter, @duncanmid


//note(@duncanmid): options

var appearance = {
	'color': '#F6F7EE',
	'background-color': '#142636',
	'hover': '#005CA4',
	'selected': '#243F57'
};


var parameters = {
	'font-size': '6',
	'scale on hover': '4',
	'white-space': 'pre',
};

var colors 	= Object.keys(appearance);
var options = Object.keys(parameters);



//done(@duncanmid): setup options

function setup() {
	
	colors.forEach( function(key) {
		
		if( window.CodaPlugInPreferences.preferenceForKey(key) === undefined ) {
			window.CodaPlugInPreferences.setPreferenceForKey(parameters[key], key);
		}
	});
	
	options.forEach( function(key) {
		
		if( window.CodaPlugInPreferences.preferenceForKey(key) === undefined ) {
			window.CodaPlugInPreferences.setPreferenceForKey(parameters[key], key);
		}
	});
}

setup();



//done(@duncanmid): inject style

function addStyles( rule ) {
	
	var style = document.createElement('style');
	
	if (style.styleSheet) {
	
		style.styleSheet.cssText = rule;
	
	} else {
	
		style.appendChild(document.createTextNode(rule));
	}
	
	document.getElementsByTagName('head')[0].appendChild(style);
}



//done(@duncanmid): set theme

function setTheme() {
	
	//note(@duncanmid): apply colors
	
	colors.forEach( function(key) {
		
		var val = window.CodaPlugInPreferences.preferenceForKey(key);
		
		$('input[name="' + key + '"]').val( val ).css({'border-color': val });
		
		switch(key) {
			
			case 'color':
			
				$('body').css({'color': val });
				var bodyrule = 'footer .options-svg { fill: ' + val + '; }';
				addStyles( bodyrule );
			
			break;
			
			case 'background-color':
			
				$('body').css({'background-color': val });
				
			break;
			
			case 'hover':
			
				var backgroundrule 	= '.code-line:hover { background-color: ' + val + ';}';
				addStyles( backgroundrule );
				
			break;
			
			case 'selected':
			
				var selected = '.code-line.selected { background-color: ' + val + ';}';
				addStyles( selected );
				
			break;
		}
		
	});
	
	//note(@duncanmid): apply settings
	
	options.forEach( function(key) {
		
		var val = window.CodaPlugInPreferences.preferenceForKey(key);
		
		switch (key) {
			
			case 'font-size':
				
				$('#option-1').val( val );
				$('#main-list').css({'font-size': val + 'px'});
				
			break;
			
			case 'scale on hover':
				
				$('#option-2').val( val );	
				
				
				
				var ruleScale = '.code-line:hover { transform: scale(' + val + ');}';
				addStyles( ruleScale );
				
			break;
			
			case 'white-space':
				
				if( val == 'pre' ) {
					
					$('#option-3-a').prop('checked', true);
					$('#main-list').removeClass('pre-wrap');
					
				} else {
					
					$('#option-3-b').prop('checked', true);
					$('#main-list').addClass('pre-wrap');
				}
				
			break;
		}
	});
}



//done(@duncanmid): populate options

function populateOptions() {
	
	$('.labels-options').html('');
	$('.additional-options').html('');
	
	colors.forEach( function(key) {
		
		var color = window.CodaPlugInPreferences.preferenceForKey(key);
		
		$('.labels-options').append('<label><span>' + key + '</span>: <input type="text" name="' + key + '" style="border-color: ' + color + '" value="' + color + '" /></label>');
	});
	
	var counter = 1;
	
	options.forEach( function(key) {
		
		var value = window.CodaPlugInPreferences.preferenceForKey(key);
		
		switch(counter) {
			
			case 1:
			
			 $('#option-' + counter ).css({'font-size': value + 'px'});
			
			break;
			
			case 2:
			
				$('.additional-options').append('<label><span>' + key + '</span><input id="option-' + counter + '" data-key="' + key + '" type="range" value="' + value + '" min="1" max="5" /></label>');
				
			break;
			
			case 3:
			
				$('.additional-options').append('<div class="radio-buttons"><span>white-space</span><label>pre <input id="option-3-a" name="' + key + '" data-key="' + key + '" type="radio" value="pre" /></label><label>pre-wrap <input id="option-3-b" name="' + key + '" data-key="' + key + '" type="radio" value="pre-wrap" /></label></div>');
			
			break;
		}
		
		counter++;
	});
}



//done(@duncanmid): html entieties

function encodeHtmlEntity(string) {
	
	var array = [];
	
	for ( var i=string.length-1; i >= 0; i-- ) {
	
		array.unshift(['&#', string[i].charCodeAt(), ';'].join(''));
	}
	
	return array.join('');
}



//done(@duncanmid): make an array of all lines in current coda doc

function getDocumentLines() {

	var theDoc = window.CodaTextView.string(); 
	
	if ( theDoc ) {
		
		var linesArr = theDoc.split('\n');
		
		return linesArr;
	
	} else {
		
		clearAllItems();
		return null;
	}
}



//done(@duncanmid): CODA text view will save

function textViewWillSave(CodaTextView) {
	
	clearAllItems();	
	loadAllItems();
}



//done(@duncanmid): CODA text view will focus

function textViewDidFocus(CodaTextView) { 
	
	clearAllItems();
	loadAllItems();
}



//issue: this would be ideal -- CODA text view will close
/*
function textViewWillClose(CodaTextView) {
	
	//...
}
*/



//done(@duncanmid): clear all items

function clearAllItems() {
	
	$('#main-list').html('');
}



//done(@duncanmid): parse all folders and load to list

function loadAllItems() {
	
	var lines 		= getDocumentLines(),
		linenum 	= 1,
		charcount 	= 0,
		length 		= 0,
		html 		= '';
	
	if( lines ) {
	
		lines.forEach( function(message) {
			
			length = message.length + 1;
			
			message = encodeHtmlEntity( message );
			
			if( message.length < 1 ) {
				
				message = '&nbsp;';
			}
			
			html += '<div class="code-line" data-line="' + linenum + '" data-start="' + charcount + '" data-length="' + length + '">' + message + '</div>';
			
			charcount = (charcount + length);
			linenum++;
		});
		
		$('#main-list').append( html );
		
		//note(@duncanmid): apply tabs
		var tabs = CodaTextView.tabWidth();
		$('#main-list').css({'tab-size': tabs.toString()});
	}
}



//note(@duncanmid): docready

$(document).ready(function() {
	
	populateOptions();
	setTheme();
	loadAllItems();
	
	
	
	//done(@duncanmid): onclick code line
	
	$('body').on('click', '.code-line', function( e ) {
		
		var linenum = $(this).data('line'),
			start 	= $(this).data('start'),
			length 	= $(this).data('length');
		
		$('.code-line').removeClass('selected');
		
		$(this).addClass('selected');
		
		CodaTextView.goToLineAndColumn(linenum, 0);
		CodaTextView.setSelectedRange({length:length, location:start});
		
	});
	
	
	
	//done(@duncanmid): on change colors
	
	$('body').on('keypress', '.labels-options input', function( event ) {
		
		
		if( event.keyCode == 13 || event.keyCode == 9 ) {
			
			var key = $(this).attr('name'),
				val = $(this).val();
			
			if(val !== undefined) {
			
				window.CodaPlugInPreferences.setPreferenceForKey(val, key);
				setTheme();
			}
		}
	});
	
	
	
	//done(@duncanmid): on change options
	
	$('[id*="option-"]').change( function() {
		
		var val = $(this).val(),
			key = $(this).data('key');
		
		if(val !== undefined) {
			
			window.CodaPlugInPreferences.setPreferenceForKey(val, key);
			setTheme();
		}
	});
	
	
	
	//done(@duncanmid): open options panel
	
	$('#toggle-options').click( function() {
		
		$('footer').toggleClass('revealed');
		
		if( $('footer').hasClass('revealed') ) {
			
			setTimeout(function(){
				$('#main-list').addClass('blur');
			}, 150);
		
		} else {
			
			$('#main-list').removeClass('blur');
		}
	});
	
	
	$('#twitter').click( function() {
		
		window.CodaPlugInsController.displayHTMLString('<meta http-equiv="refresh" content="1;url=http://twitter.com/duncanmid" />');
		
	});
});
