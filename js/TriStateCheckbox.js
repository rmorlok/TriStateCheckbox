/* 
 * Tri-state checkbox
 * TriStateCheckbox.js
 * Copyright 2010, Steel Underpants Software (Ryan Morlok)
 * Released under the MIT, BSD, and GPL Licenses.
 * 
 */
(function(window, $) {

if( typeof window.SteelUnderpants === "undefined")
	window.SteelUnderpants = {};

CLASSES = {
	triStateCheckbox: "TriStateCheckbox",
	checked: "checked",
	mixed: "mixed",
	disabled: "disabled"
};

EVENTS = {
	clicked: "clicked",
	checked: "checked",
	enabled: "enabled"
};

window.SteelUnderpants.TriStateCheckbox = function(options) {	
	var state = {
		checked: false,
		enabled: true,
		tabIndex: -1,
	}
	
	$.extend(state, options);
	
	var me = $(document.createElement("a"))
		.attr("role", "checkbox")
		.attr("aria-checked", state.checked.toString())
		.attr("aria-disabled", (!state.enabled).toString())
		.attr("tabindex", state.tabIndex.toString())
		.addClass(CLASSES.triStateCheckbox)
		.bind("click.internal", function() {
			if( state.enabled )
				me.checked(state.checked === "mixed" || !state.checked);
		})
		.bind("keypress.internal", function(event) {
			if( state.enabled && event.charCode == 32 )
				me.checked(state.checked === "mixed" || !state.checked);
		})[0];
	
	checked(state.checked, true);
	enabled(state.enabled, true);
	
	function checked(val, initializing) {
		if( typeof val === "undefined" )
			return state.checked;

		if( initializing 
			|| !(state.checked === val
					|| (state.checked && val === "true")
					|| (!state.checked && val === "false")) ) {

			if( !val || val === "false" ) {
				state.checked = false;
				$(me)
					.attr("aria-checked", "false")
					.removeClass(CLASSES.mixed)
					.removeClass(CLASSES.checked);
			} else if( val === "mixed" ) {
				state.checked = "mixed";
				$(me)
					.attr("aria-checked", "false")
					.removeClass(CLASSES.checked)
					.addClass(CLASSES.mixed);
			} else {
				state.checked = true;
				$(me)
					.attr("aria-checked", "true")
					.removeClass(CLASSES.mixed)
					.addClass(CLASSES.checked);
			}
			
			if( !initializing )
				$(me).trigger(EVENTS.checked);
		}
	}
	
	function enabled(val, initializing) {
		if( typeof val === "undefined" )
			return state.enabled;
		
		if( initializing || val != state.enabled ) {
			if( val ) {
				state.enabled = true;
				$(me)
					.attr("aria-disabled", "false")
					.removeClass(CLASSES.disabled);
			} else {
				state.enabled = false;
				$(me)
					.attr("aria-disabled", "true")
					.addClass(CLASSES.disabled);
			}
			
			if( !initializing )
				$(me).trigger(EVENTS.enabled);
		}
	}
	
	me.checked = function(val) { return checked(val, false); };
	me.enabled = function(val) { return enabled(val, false); };
	
	return me;
}

})(window, jQuery);