define(["jquery", "ajaxService", "highCards"], function($, createAjaxService) {
	return function createReportModule() {
		var service = createAjaxService();
		var reportChart = $("#reportChart");
		var responseHolder = $("#responseHolder");
		var statusHolder = $("#statusHolder");
		var statusesButton = $("#statusButton");
		var responsesButton = $("#responseButton");
		var statusList = $("#statusList");
		var responseList = $("#responseTimeList");
		var prevButton = $("#prevButton");
		var nextButton = $("#nextButton");

		var pageIndex = 0;
		var pageSize = 100;
		var pageCount = 0;

		var zonesArray = [];
		var responseArray = [];

		function init() {
			statusesButton.click(loadStatuses);
			responsesButton.click(loadResponses);
			prevButton.click(loadPrev);
			nextButton.click(loadNext);
			service.getReport(function(data) {
				if(data.err) {
					return;
				}
				writeStatusList(data.state_changes);
				zonesArray = getZonesArray(data.state_changes);
				responseArray = data.average_response;


				pageCount = Math.floor(responseArray.length / pageSize);
				pageIndex = pageCount;

				setPage();
			});
		}

		function setPage() {

			var from = pageIndex * pageSize;
			var to = from + pageSize;

			var responseFragment = progressResponseArray(responseArray.slice(from, to));

			var startTime = responseArray[from].utc_time;

			drawReportChart(responseFragment, startTime);
			writeResponseList(responseArray.slice(from, to));
		}

		function loadPrev() {
			if(pageIndex === 0) {
				pageIndex = pageCount;
			} else {
				pageIndex --;
			}
			setPage();
		}
		function loadNext() {
			if(pageIndex === pageCount) {
				pageIndex = 0;
			} else {
				pageIndex ++;
			}
			setPage();
		}

		function loadResponses(e) {
			e.preventDefault();
			responsesButton.parent().addClass("active");
			statusesButton.parent().removeClass("active");

			responseList.show();
			statusList.hide();
		}
		function loadStatuses(e) {
			e.preventDefault();
			responsesButton.parent().removeClass("active");
			statusesButton.parent().addClass("active");

			responseList.hide();
			statusList.show();
		}

		function drawReportChart(dataArray, startTime) {
			reportChart.highcharts({
				chart: {
					type: "area"
				},
				title: {
					text: "Check response time"
				},
				xAxis: {
					type: "datetime"
				},
				yAxis: {
					title: {
						text: ''
					},
					labels: {
						formatter: function () {
							return this.value + "ms";
						}
					}
				},
				tooltip: {
					shared: true,
					valueSuffix: " ms"
				},
				plotOptions: {
					area: {
						stacking: "normal",
						lineColor: "#666666",
						lineWidth: 1,
						marker: {
							lineWidth: 1,
							lineColor: "#666666"
						}
					}
				},
				series: [
					{
						pointInterval: 600,
						pointStart: startTime,
						name: "Response time",
						data: dataArray

						/*,
						//TODO: it should color the chart horizontaly according to the statuses but does not work...
						zoneAxes: "x",
						zones: zonesArray
						*/
					}
				]
			});
		}

		function progressResponseArray(data) {
			var result = [];
			var count = data.length;
			for(var i = 0; i < count; i++) {
				if(data[i])
				result.push(data[i].response_time);
			}
			return result;
		}

		function getZonesArray(data) {
			var result = [];
			var count = data.length;
			for(var i = 0; i < count; i++) {
				var color = data[i].status === "DOWN" ? "#FF0000" : "#f7a35c";
				var value = data[i].utc_to;
				result.push({
					color: color,
					value: value
				});
			}
			return result;
		}

		function writeResponseList(data) {
			var responseRows = "";
			var count = data.length;
			for(var i = 0; i < count; i++) {
				responseRows += "<tr>";
				responseRows += "<td>";
				responseRows +=  new Date(data[i].utc_time).toUTCString();
				responseRows += "</td>";
				responseRows += "<td>";
				responseRows +=  data[i].response_time;
				responseRows += "</td>";
				responseRows += "</tr>";
			}
			responseHolder.empty();
			responseHolder.html(responseRows);
		}

		function writeStatusList(data) {
			var statusRows = "";
			var count = data.length;
			for(var i = 0; i < count; i++) {
				statusRows += "<tr>";
				statusRows += "<td>";
				statusRows +=  new Date(data[i].utc_from).toUTCString();
				statusRows += "</td>";
				statusRows += "<td>";
				statusRows +=  new Date(data[i].utc_to).toUTCString();
				statusRows += "</td>";
				statusRows += "<td>";
				statusRows +=  data[i].status;
				statusRows += "</td>";
				statusRows += "</tr>";
			}
			statusHolder.empty();
			statusHolder.html(statusRows);
		}

		return {
			init: init
		};
	};
});