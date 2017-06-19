"use strict";

define(['echarts'], function (echarts) {
	if (!window.ccj) {
		window.ccj = {};
	}

	function chart(dom, title, x, y, legend, type) {
		var chart = echarts.init(dom),
			option = {
				title: {
					text: title,
					x: 'center'
				},
				tooltip: {
					trigger: 'item',
					formatter: "{a} <br/>{b} : {c} ({d}%)"
				},
				toolbox: {
					show: true,
					feature: {
						dataZoom: {
							yAxisIndex: 'none'
						},
						dataView: {readOnly: false},
						restore: {},
						saveAsImage: {}
					}
				}
			};

		if(type !== 'pie') {
			option['tooltip']['formatter'] = "{a} <br/>{b} : {c}";
			option['xAxis'] = {
				data: x
			};
			option['yAxis'] = [{}];
			option["legend"] = {
				data:[legend],
				orient: 'vertical',
				left: 'left'
			};
			option['series'] = [{
				name: legend,
				type: type,
				data: y
			}];
		}else {
			var d = [];
			for (var i = 0, len = x.length; i<len; i++) {
				d.push({
					value: x[i],
					name: y[i]
				})
			}
			option["legend"] = {
				data: y,
				orient: 'vertical',
				left: 'left'
			};
			option['series'] = [{
				name: legend,
				type: type,
				radius : '55%',
				center: ['50%', '60%'],
				data:d,
				itemStyle: {
					emphasis: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}
			}];
		}
		chart.setOption(option);
	}

	function chartBar(dom, title, x, y, legend) {
		chart(dom, title, x, y, legend, 'bar')
	}

	function chartPie(dom, title, value, name, legend) {
		chart(dom, title, value, name, legend, 'pie')
	}

	function chartLine(dom, title, value, name, legend) {
		chart(dom, title, value, name, legend, 'line')
	}

	ccj.charts = {
		bar: chartBar,
		pie: chartPie,
		line: chartLine
	};

	return ccj;
});
 
