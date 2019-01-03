jssor_slider_init = function(sliderId) {
	var jssor_1_options = {
	  $AutoPlay: 1,
	  $ArrowNavigatorOptions: {
		$Class: $JssorArrowNavigator$
	  }
	};

	var jssorSlider = new $JssorSlider$(sliderId, jssor_1_options);

	/*#region responsive code begin*/

	var MAX_WIDTH = 980;

	function ScaleSlider() {
		var containerElement = jssorSlider.$Elmt.parentNode;
		var containerWidth = containerElement.clientWidth;

		if (containerWidth) {

			var expectedWidth = Math.min(MAX_WIDTH || containerWidth, containerWidth);

			jssorSlider.$ScaleWidth(expectedWidth);
		}
		else {
			window.setTimeout(ScaleSlider, 30);
		}
	}

	ScaleSlider();

	$Jssor$.$AddEvent(window, "load", ScaleSlider);
	$Jssor$.$AddEvent(window, "resize", ScaleSlider);
	$Jssor$.$AddEvent(window, "orientationchange", ScaleSlider);
	/*#endregion responsive code end*/
};