// var ctx = document.getElementById("traffic-chart");

// var chart = new Chart(ctx, {
// 	type: 'line',
// 	data: {
// 		labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8", "Week 9", "Week 10", "Week 11"],
// 		datasets: [{
// 			label: '# of Hits',
// 			fill: true,
// 			lineTension: 0.0,
//             backgroundColor: "rgba(75,192,192,0.4)",
//             borderColor: "rgba(75,192,192,1)",
//             borderCapStyle: 'butt',
//             borderDash: [],
//             borderDashOffset: 0.0,
//             borderJoinStyle: 'miter',
//             pointBorderColor: "rgba(75,192,192,1)",
//             pointBackgroundColor: "#fff",
//             pointBorderWidth: 1,
//             pointHoverRadius: 5,
//             pointHoverBackgroundColor: "rgba(75,192,192,1)",
//             pointHoverBorderColor: "rgba(220,220,220,1)",
//             pointHoverBorderWidth: 2,
//             pointRadius: 1,
//             pointHitRadius: 10,
// 			data: [750, 1200, 950, 1500, 2000, 1500, 1750, 1350, 1700, 2200, 1800, 2100],
// 		}]
// 	},
// 	options: {
// 		scales: {
// 			yAxes: [{
// 				ticks: {
// 					beginAtZero: true
// 				}
// 			}]
// 		}
// 	}
// });


var trafficDataWeekly = {
	labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8", "Week 9", "Week 10", "Week 11"],
	series: [
		[750, 1200, 950, 1500, 2000, 1500, 1750, 1350, 1700, 2200, 1800, 2100]
	]
};

var lineOptions = {
	showArea: true,
	lineSmooth: Chartist.Interpolation.none()
};

new Chartist.Line('#traffic-chart', trafficDataWeekly, lineOptions);

var dailyTraffic = {
	labels: ["S", "M", "T", "W", "T", "F", "S"],
	series: [
	[75, 100, 175, 125, 225, 200, 100]
	]
}

new Chartist.Bar('#daily-traffic-chart', dailyTraffic)

var mobileUsers = {
	labels: ["Phones", "Tablets", "Desktop"],
	series: [70, 18, 12]
};

var pieOptions = {
	donut: true,
	startAngle: 90,
	showLabel: false
};

var pieChart = new Chartist.Pie("#mobile-users-chart", mobileUsers, pieOptions);