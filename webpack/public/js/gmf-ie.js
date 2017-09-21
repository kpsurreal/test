$('input, textarea').not('input[gmf-selectize]').click(function() {
	$(this).focus();
});