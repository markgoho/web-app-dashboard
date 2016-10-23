var $navItem = $('nav ul li');

$navItem.click(function () {
	console.log("Nav item clicked");
	if ($(this).hasClass("nav-highlight")) {
		$(this).removeClass("nav-highlight");
		//$(this).children().css("opacity", 0.6);
	} else {
		$navItem.removeClass("nav-highlight");
		$(this).addClass("nav-highlight");
		//$(this).children().css("opacity", 1);
	}
});