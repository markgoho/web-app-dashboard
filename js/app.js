/**
 * Chartist.js plugin to display a data label on top of the points in a line chart.
 *
 */
/* global Chartist */
(function (window, document, Chartist) {
  'use strict';

  var defaultOptions = {
    currency: undefined,
    currencyFormatCallback: undefined,
    tooltipOffset: {
      x: 0,
      y: -20
    },
    anchorToPoint: false,
    appendToBody: false,
    class: undefined,
    pointClass: 'ct-point'
  };

  Chartist.plugins = Chartist.plugins || {};
  Chartist.plugins.tooltip = function (options) {
    options = Chartist.extend({}, defaultOptions, options);

    return function tooltip(chart) {
      var tooltipSelector = options.pointClass;
      if (chart instanceof Chartist.Bar) {
        tooltipSelector = 'ct-bar';
      } else if (chart instanceof Chartist.Pie) {
        // Added support for donut graph
        if (chart.options.donut) {
          tooltipSelector = 'ct-slice-donut';
        } else {
          tooltipSelector = 'ct-slice-pie';
        }
      }

      var $chart = chart.container;
      var $toolTip = $chart.querySelector('.chartist-tooltip');
      if (!$toolTip) {
        $toolTip = document.createElement('div');
        $toolTip.className = (!options.class) ? 'chartist-tooltip' : 'chartist-tooltip ' + options.class;
        if (!options.appendToBody) {
          $chart.appendChild($toolTip);
        } else {
          document.body.appendChild($toolTip);
        }
      }
      var height = $toolTip.offsetHeight;
      var width = $toolTip.offsetWidth;

      hide($toolTip);

      function on(event, selector, callback) {
        $chart.addEventListener(event, function (e) {
          if (!selector || hasClass(e.target, selector))
            callback(e);
        });
      }

      on('mouseover', tooltipSelector, function (event) {
        var $point = event.target;
        var tooltipText = '';

        var isPieChart = (chart instanceof Chartist.Pie) ? $point : $point.parentNode;
        var seriesName = (isPieChart) ? $point.parentNode.getAttribute('ct:meta') || $point.parentNode.getAttribute('ct:series-name') : '';
        var meta = $point.getAttribute('ct:meta') || seriesName || '';
        var hasMeta = !!meta;
        var value = $point.getAttribute('ct:value');

        if (options.transformTooltipTextFnc && typeof options.transformTooltipTextFnc === 'function') {
          value = options.transformTooltipTextFnc(value);
        }

        if (options.tooltipFnc && typeof options.tooltipFnc === 'function') {
          tooltipText = options.tooltipFnc(meta, value);
        } else {
          if (options.metaIsHTML) {
            var txt = document.createElement('textarea');
            txt.innerHTML = meta;
            meta = txt.value;
          }

          meta = '<span class="chartist-tooltip-meta">' + meta + '</span>';

          if (hasMeta) {
            tooltipText += meta + '<br>';
          } else {
            // For Pie Charts also take the labels into account
            // Could add support for more charts here as well!
            if (chart instanceof Chartist.Pie) {
              var label = next($point, 'ct-label');
              if (label) {
                tooltipText += text(label) + '<br>';
              }
            }
          }

          if (value) {
            if (options.currency) {
              if (options.currencyFormatCallback !== undefined) {
                value = options.currencyFormatCallback(value, options);
              } else {
                value = options.currency + value.replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,');
              }
            }
            value = '<span class="chartist-tooltip-value">' + value + '</span>';
            tooltipText += value;
          }
        }

        if(tooltipText) {
          $toolTip.innerHTML = tooltipText;
          setPosition(event);
          show($toolTip);

          // Remember height and width to avoid wrong position in IE
          height = $toolTip.offsetHeight;
          width = $toolTip.offsetWidth;
        }
      });

      on('mouseout', tooltipSelector, function () {
        hide($toolTip);
      });

      on('mousemove', null, function (event) {
        if (false === options.anchorToPoint)
          setPosition(event);
      });

      function setPosition(event) {
        height = height || $toolTip.offsetHeight;
        width = width || $toolTip.offsetWidth;
        var offsetX = - width / 2 + options.tooltipOffset.x;
        var offsetY = - height + options.tooltipOffset.y;
        var anchorX, anchorY;

        if (!options.appendToBody) {
          var box = $chart.getBoundingClientRect();
          var left = event.pageX - box.left - window.pageXOffset ;
          var top = event.pageY - box.top - window.pageYOffset ;

          if (true === options.anchorToPoint && event.target.x2 && event.target.y2) {
            anchorX = parseInt(event.target.x2.baseVal.value);
            anchorY = parseInt(event.target.y2.baseVal.value);
          }

          $toolTip.style.top = (anchorY || top) + offsetY + 'px';
          $toolTip.style.left = (anchorX || left) + offsetX + 'px';
        } else {
          $toolTip.style.top = event.pageY + offsetY + 'px';
          $toolTip.style.left = event.pageX + offsetX + 'px';
        }
      }
    };
  };

  function show(element) {
    if(!hasClass(element, 'tooltip-show')) {
      element.className = element.className + ' tooltip-show';
    }
  }

  function hide(element) {
    var regex = new RegExp('tooltip-show' + '\\s*', 'gi');
    element.className = element.className.replace(regex, '').trim();
  }

  function hasClass(element, className) {
    return (' ' + element.getAttribute('class') + ' ').indexOf(' ' + className + ' ') > -1;
  }

  function next(element, className) {
    do {
      element = element.nextSibling;
    } while (element && !hasClass(element, className));
    return element;
  }

  function text(element) {
    return element.innerText || element.textContent;
  }

} (window, document, Chartist));

// ------------------------------------ Tooltip plugin


// Traffic Charts

var trafficDataWeekly = {
	labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8", "Week 9", "Week 10", "Week 11"],
	series: [
		[750, 1200, 950, 1500, 2000, 1500, 1750, 1350, 1700, 2200, 1800]
	]
};

var trafficDataDaily = {
	labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
	series: [
		[200, 150, 250, 200, 375, 175, 225]
	]
};

var trafficDataHourly = {
	labels: ["0-3", "3-6", "6-9", "9-12", "12-15", "15-18", "18-21", "21-24"],
	series: [
		[5, 15, 25, 75, 100, 50, 225, 50]
	]
};

var trafficDataMonthly = {
	labels: ["January", "February", "March", "April", "May", "June"],
	series: [
		[3500, 5000, 5750, 4750, 5250, 5900]
	]
};

var lineOptions = {
	showArea: true,
	lineSmooth: Chartist.Interpolation.none(),
	fullWidth: true,
	plugins: [
		Chartist.plugins.tooltip()
	]
};

var trafficData = new Chartist.Line('#traffic-chart', trafficDataWeekly, lineOptions);

// Hourly, Daily, Weekly, Monthly button behavior

var $trafficBtn = $('#traffic-timeline div');
$trafficBtn.click(function () {
	$trafficBtn.removeClass('active');
	trafficData.update(window[$(this).attr('id')]); //update the chart with the data Object
	$(this).addClass('active');
});


// Daily Traffic Chart

var dailyTraffic = {
	labels: ["S", "M", "T", "W", "T", "F", "S"],
	series: [
    [75, 100, 175, 125, 225, 200, 100],
    [50, 125, 175, 120, 300, 150, 75]
	]
};

var barChartOptions = {
  //seriesBarDistance: 30
};

var barChart = new Chartist.Bar('#daily-traffic-chart', dailyTraffic, barChartOptions);

// Mobile Users Chart

var mobileUsers = {
	labels: ["Phones", "Tablets", "Desktop", "Smartwatches"],
	series: [70, 18, 12, 25]
};

var pieOptions = {
	donut: true,
	startAngle: 90,
	showLabel: false
};

var pieChart = new Chartist.Pie("#mobile-users-chart", mobileUsers, pieOptions);

// Alert box close

var $closeAlert = $('#close-alert'); // X icon

$closeAlert.click(function () { // when clicked
  $(this).parent().hide(); // hide alert box (parent)
});


// New Notification popup

var $newNotification = $('.notification-bell');
var $notificationDot = $('#new-notification');
var $notificationBox = $('#notification-box');

$newNotification.click(function () {
  $notificationDot.hide();
  $notificationBox.show();
});

$notificationBox.click(function () {
  $notificationBox.hide();
});

// Autocomplete for users -----------------------------

var $userList = $('#new-members .name-email h3');
var $searchBox = $('#user-search');
var $resultBox = $('#autocomplete-box');


$searchBox.keyup(function () {
  var $searchString = $(this).val().toLowerCase(); //convert the input box's value to lowercase
  var $matchedList = $resultBox.children();
  $resultBox.show(); // show the resultsbox as user types

  $userList.each(function() { // for each H3 in the list
    var $innerText = $(this).text(); //assign the inner text to a variable

    if ($searchString === "") { // if the search string is empty
      $matchedList.html(""); // make the ul empty as well
    } else {
      if ($innerText.toLowerCase().search($searchString) != -1) { // if the search string is found
        $matchedList.append('<li>' + $innerText + '</li>'); //add that as a list itme to the list
      }
    }

  });

  var $resultName = $('#autocomplete-box ul li'); //after the list items have been made, convert to a JQ object
  $resultName.click(function() { // if a user clicks on a list item
    $searchBox.val($(this).text()); // assign that to the value in the search box
    $resultBox.hide(); // close the results box
    $matchedList.html("");
  });

});

// ----------------------------------------------------



// Send message to user -------------------------------

var $sendMessage = $('.message-send');
var $message = $('#message');
var $messageSent = $('.message-sent');
var $messageError = $('.message-error');

function checkInput () {
  if (!$(this).val()) {
    $(this).css('background-color', '#D46A6A');
  } else {
    $(this).css('background-color', '#81C98F');
  }
}

$searchBox.blur(checkInput); // when the box loses focus, check input
$message.blur(checkInput);

$sendMessage.click(function(event) {
  event.preventDefault(); // prevent the form from sending
  if (!$searchBox.val()) {
    $searchBox.css('background-color', '#D46A6A');
  }

  if (!$message.val()) {
    $message.css('background-color', '#D46A6A');
  }

  if (!$message.val() || !$searchBox.val()) {
    $messageError.css('display', 'flex').fadeOut(5000);
  } else {
    $searchBox.val("").attr('style',''); // clear inputs and reset css to original value
    $message.val("").attr('style','');
    $messageSent.css('display', 'flex').fadeOut(5000); // display the success message, then fade out over 5 seconds  
  }
  
});

// Save settings in Local storage

var $emailNotification = $('#email-notifications');
var $publicProfile = $('#public-profile');
var $timeZone = $('#time-zone');

// check to see what localStorage has for values, then set checkbox accordingly

if (localStorage.email === "true") {
  $emailNotification[0].checked = true;
} else {
  $emailNotification[0].checked = false;
}

if (localStorage.profile === "true") {
  $publicProfile[0].checked = true;
} else {
  $publicProfile[0].checked = false;
}

$timeZone.val(localStorage.timeZone);


// Put checked state into storage
$emailNotification.click(function () {
  localStorage.setItem('email', $emailNotification[0].checked);
  console.log("Email checked status now: " + $emailNotification[0].checked);
});

$publicProfile.click(function () {
  localStorage.setItem('profile', $publicProfile[0].checked);
  console.log("Profile checked status now: " + $publicProfile[0].checked);
});

$timeZone.click(function () {
  localStorage.setItem('timeZone', $timeZone.val());
});