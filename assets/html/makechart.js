/**
 * 绘制曲线和条形图的组合图形
 * @param {JSON} options 
 */
function makeLineAndColumnChart(options) {
    Highcharts.chart(options.container, {
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: options.title
        },
        subtitle: {
            text: options.subtitle || ""
        },
        xAxis: [{
            categories: options.categories,
            crosshair: true
        }],
        yAxis: [{ // Primary yAxis
            labels: {
                format: '{value} ' + options.primaryFormat,
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            title: {
                text: options.primaryTitle,
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }
        }, { // Secondary yAxis
            title: {
                text: options.secondTitle,
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                format: '{value} ' + options.secondFormat,
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            opposite: true
        }],
        tooltip: {
            shared: true
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            x: 70,
            verticalAlign: 'top',
            y: 0,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        series: [{
            name: options.secondTitle,
            type: 'column',
            yAxis: 1,
            data: options.secondData,
            tooltip: {
                valueSuffix: options.secondFormat
            }
    
        }, {
            name: options.primaryTitle,
            type: 'spline',
            data: options.primaryData,
            tooltip: {
                valueSuffix: options.primaryFormat
            }
        }]
    });
}

function makeLinesChart(options) {

    Highcharts.chart(options.container, {
        chart: {
            type: "spline"
        },

        title: {
            text: options.title
        },
    
        subtitle: {
            text: options.subtitle || ""
        },
    
        yAxis: {
            title: {
                text: options.format
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
    
        // plotOptions: {
        //     series: {
        //         label: {
        //             connectorAllowed: false
        //         },
        //         pointStart: 2010
        //     }
        // },
        xAxis: [{
            categories: options.categories,
            crosshair: true
        }],
    
        series: options.data,
    
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    
    });
}