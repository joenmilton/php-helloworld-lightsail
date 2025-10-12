import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { 
    loadDashboardCreatedVsClosedStats, 
    loadClientDealStats,
    loadByCreatedDateStats ,
    loadDashboardStats
} from '../../../redux';
import Chart from "react-apexcharts";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function Dashboard({
    settingsLoading, settings,

    dashboardStatsLoading, dashboardClientDealStatsLoading, createdVsClosedStatsLoading, byCreatedDateStatsLoading,
    dashboardStats, createdVsClosedStats, byCreatedDateStats, dashboardClientDealStats,

    loadDashboardCreatedVsClosedStats, loadByCreatedDateStats, loadDashboardStats, loadClientDealStats
}) {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedPipeline, setSelectedPipeline] = useState(null);

    useEffect(() => {   
        if (settingsLoading || !selectedPipeline) return;

        loadDashboardCreatedVsClosedStats({ year: selectedYear, pipeline_id: selectedPipeline });
        loadByCreatedDateStats({ year: selectedYear, pipeline_id: selectedPipeline });
        loadDashboardStats({ year: selectedYear, pipeline_id: selectedPipeline });
        loadClientDealStats({ year: selectedYear, pipeline_id: selectedPipeline });
    }, [selectedYear, selectedPipeline, settingsLoading]);

    useEffect(() => {   
        if (settingsLoading) return;


        // Set default pipeline
        if (settings?.pipelines && settings.pipelines.length > 0) {
            // First, try to find "Marketing" pipeline
            const marketingPipeline = settings.pipelines.find(pipeline => pipeline.name === "Marketing");
            
            if (marketingPipeline) {
                // If Marketing pipeline exists, set it as default
                setSelectedPipeline(marketingPipeline.id);
            } else {
                // If Marketing doesn't exist, use the first pipeline
                setSelectedPipeline(settings.pipelines[0].id);
            }
        }

    }, [settingsLoading, settings]);



    const handleYearChange = (year) => {
        setSelectedYear(parseInt(year));
    };

    const handlePipelineChange = (pipelineId) => {
        setSelectedPipeline(pipelineId);
    };

    // Generate year options (current year and 5 years back)
    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    for (let year = currentYear; year >= currentYear - 5; year--) {
        yearOptions.push(year);
    }

    // Prepare chart data
    const chartData = !settingsLoading && selectedPipeline && byCreatedDateStats?.categories ? {
        labels: byCreatedDateStats.categories,
        datasets: [
            {
                label: 'Total Created',
                data: byCreatedDateStats.series[0].data,
                backgroundColor: '#776acf',
                borderColor: '#776acf',
                borderWidth: 1,
                yAxisID: 'y',
                order: 1,

                barThickness: 10,
            },
            {
                label: 'Open',
                data: byCreatedDateStats.series[1].data,
                backgroundColor: '#ffc107',
                borderColor: '#ffc107',
                borderWidth: 1,
                yAxisID: 'y1',
                stack: 'stacked',
                order: 2,

                barThickness: 10,
            },
            {
                label: 'Owned',
                data: byCreatedDateStats.series[2].data,
                backgroundColor: '#34c38f',
                borderColor: '#34c38f',
                borderWidth: 1,
                yAxisID: 'y1',
                stack: 'stacked',
                order: 2,

                barThickness: 10,
            },
            {
                label: 'Lost',
                data: byCreatedDateStats.series[3].data,
                backgroundColor: '#f46a6a',
                borderColor: '#f46a6a',
                borderWidth: 1,
                yAxisID: 'y1',
                stack: 'stacked',
                order: 2,

                barThickness: 10,
            }
        ]
    } : {
        labels: [],
        datasets: []
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'top',
                onClick: null,
            },
            title: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return context.dataset.label + ': ' + context.parsed.y + ' deals';
                    }
                }
            }
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: false,
                    text: 'Months'
                },
                grid: {
                    display: false,
                },
            },
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                    display: false,
                    text: 'Total Created'
                },
                grid: {
                    display: false,
                },
            },
            y1: {
                type: 'linear',
                display: false,
                position: 'right',
                title: {
                    display: false,
                    text: 'Status Breakdown'
                },
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
    };

    return (
        <div className="container-fluid chart-container">
            <div className="row">
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-body pb-2">
                            <div className="d-flex align-items-start mb-4 mb-xl-0">
                                <div className="flex-grow-1">
                                    <h5 className="card-title">Deal Overview</h5>
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="dropdown me-2 d-inline-block">
                                        <a className="dropdown-toggle text-reset" href="#" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <span className="fw-semibold">Pipeline:</span> <span className="text-muted">
                                                {settings?.pipelines?.find(p => p.id === selectedPipeline)?.name || 'Select Pipeline'}<i className="mdi mdi-chevron-down ms-1"></i>
                                            </span>
                                        </a>
                                        <div className="dropdown-menu dropdown-menu-end">
                                            {settings?.pipelines?.map(pipeline => (
                                                <a 
                                                    key={pipeline.id} 
                                                    className={`dropdown-item ${pipeline.id === selectedPipeline ? 'active' : ''}`} 
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handlePipelineChange(pipeline.id);
                                                    }}
                                                >
                                                    {pipeline.name}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="dropdown d-inline-block">
                                        <a className="dropdown-toggle text-reset" href="#" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <span className="fw-semibold">Year:</span> <span className="text-muted">{selectedYear}<i className="mdi mdi-chevron-down ms-1"></i></span>
                                        </a>
                                        <div className="dropdown-menu dropdown-menu-end">
                                            {yearOptions.map(year => (
                                                <a 
                                                    key={year} 
                                                    className={`dropdown-item ${year === selectedYear ? 'active' : ''}`} 
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleYearChange(year);
                                                    }}
                                                >
                                                    {year}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row align-items-center">
                                <div className="col-xl-4">
                                    <div className="card bg-light mb-0">
                                        <div className="card-body">
                                            {dashboardStatsLoading || settingsLoading || !selectedPipeline ? (
                                                <div className="d-flex justify-content-center align-items-center" style={{ height: '425px' }}>
                                                    <div className="spinner-border text-primary" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                    <span className="ms-2">Loading data...</span>
                                                </div>
                                            ) : (
                                            <div className="py-2">
                                                <h5>Total Deals:</h5>

                                                <div className="d-flex mt-4 align-items-center">
                                                    <h2 className="pt-1 mb-1">{dashboardStats.total_created}</h2>
                                                    <div className="ms-3">
                                                        <span className={`badge ${dashboardStats.total_created_change_percentage > 0 ? 'bg-success' : 'bg-danger'}`}>
                                                            <i className={`mdi ${dashboardStats.total_created_change_percentage > 0 ? 'mdi-arrow-up' : 'mdi-arrow-down'} me-1`}></i>
                                                            {Math.abs(dashboardStats.total_created_change_percentage)}%
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-muted font-size-15 text-truncate">From {dashboardStats.date_from} to {dashboardStats.date_to}</p>
                                                <div className="row mt-4">
                                                    <div className="col">
                                                        <div className="d-flex mt-2">
                                                            <i className="mdi mdi-square-rounded font-size-10 text-success mt-1"></i>
                                                            <div className="flex-grow-1 ms-2 ps-1">

                                                                <div className="d-flex align-items-center">
                                                                    <h5 className="mb-0">{dashboardStats.total_owned}</h5>
                                                                    <div className="ms-3">
                                                                        <span className={`badge ${dashboardStats.total_owned_change_percentage > 0 ? 'bg-success' : 'bg-danger'}`}>
                                                                            <i className={`mdi ${dashboardStats.total_owned_change_percentage > 0 ? 'mdi-arrow-up' : 'mdi-arrow-down'} me-1`}></i>
                                                                            {Math.abs(dashboardStats.total_owned_change_percentage)}%
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                
                                                                <p className="text-muted text-truncate mb-0">Owned Total</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col">
                                                        <div className="d-flex mt-2">
                                                            <i className="mdi mdi-square-rounded font-size-10 text-danger mt-1"></i>
                                                            <div className="flex-grow-1 ms-2 ps-1">

                                                                <div className="d-flex align-items-center">
                                                                    <h5 className="mb-0">{dashboardStats.total_lost}</h5>
                                                                    <div className="ms-3">
                                                                        <span className={`badge ${dashboardStats.total_lost_change_percentage > 0 ? 'bg-success' : 'bg-danger'}`}>
                                                                            <i className={`mdi ${dashboardStats.total_lost_change_percentage > 0 ? 'mdi-arrow-up' : 'mdi-arrow-down'} me-1`}></i>
                                                                            {Math.abs(dashboardStats.total_lost_change_percentage)}%
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                <p className="text-muted text-truncate mb-0">Lost Total</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            )}

                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-8">
                                    <div>
                                    {createdVsClosedStatsLoading || settingsLoading || !selectedPipeline ? (
                                        <div className="d-flex justify-content-center align-items-center" style={{ height: '425px' }}>
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            <span className="ms-2">Loading chart data...</span>
                                        </div>
                                        ) : createdVsClosedStats?.categories && createdVsClosedStats?.series ? (
                                            <Chart
                                                options={{
                                                    chart: {
                                                        height: 410,
                                                        type: "line",
                                                        toolbar: {
                                                            show: false
                                                        },
                                                        zoom: {
                                                            enabled: false
                                                        },
                                                        pan: {
                                                            enabled: false
                                                        }
                                                    },
                                                    plotOptions: {
                                                        bar: {
                                                            borderRadius: 3,
                                                            horizontal: false,
                                                            columnWidth: "64%",
                                                            endingShape: "rounded"
                                                        }
                                                    },
                                                    dataLabels: {
                                                        enabled: false
                                                    },
                                                    stroke: {
                                                        show: true,
                                                        width: [0, 3],
                                                        colors: ["transparent", "#34c38f"]
                                                    },
                                                    colors: ['#776acf', '#34c38f'],
                                                    xaxis: {
                                                        categories: createdVsClosedStats.categories
                                                    },
                                                    grid: {
                                                        borderColor: "#f1f1f1"
                                                    },
                                                    fill: {
                                                        opacity: 1
                                                    },
                                                    legend: {
                                                        show: true,
                                                        position: 'top'
                                                    },
                                                    tooltip: {
                                                        y: {
                                                            formatter: function (val) {
                                                                return val + " deals";
                                                            }
                                                        }
                                                    }
                                                }}
                                                series={createdVsClosedStats.series}
                                                type="line"
                                                height={425}
                                            />
                                        ) : (
                                        <div className="d-flex justify-content-center align-items-center" style={{ height: '425px' }}>
                                            <div className="text-center">
                                                <i className="mdi mdi-chart-line font-size-24 text-muted"></i>
                                                <p className="text-muted mt-2">No chart data available</p>
                                            </div>
                                        </div>
                                    )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row align-items-center">
                <div className="col-xl-8">
                    <div className="card">
                        <div className="card-body pb-2">
                            <div>

                                { byCreatedDateStatsLoading || settingsLoading || !selectedPipeline ? (
                                    <div className="d-flex justify-content-center align-items-center" style={{ height: '425px' }}>
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <span className="ms-2">Loading chart data...</span>
                                    </div>
                                ) : chartData && chartData.datasets && chartData.datasets.length > 0 ? (
                                    <div style={{ height: '425px' }}>
                                        <Bar data={chartData} options={chartOptions} />
                                    </div>
                                ) : (
                                    <div className="d-flex justify-content-center align-items-center" style={{ height: '425px' }}>
                                        <div className="text-center">
                                            <i className="mdi mdi-chart-line font-size-24 text-muted"></i>
                                            <p className="text-muted mt-2">No chart data available</p>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-4">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex align-items-start">
                                <div className="flex-grow-1">
                                    <h5 className="card-title mb-2">Client Deals</h5>
                                </div>
                            </div>
                            {dashboardClientDealStatsLoading || settingsLoading || !selectedPipeline ? (
                                <div className="d-flex justify-content-center align-items-center" style={{ height: '287px' }}>
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <span className="ms-2">Loading chart data...</span>
                                </div>
                            ) : dashboardClientDealStats?.series && dashboardClientDealStats?.labels ? (
                                <div>
                                    <div id="chart-donut">
                                        <Chart
                                            options={{
                                                chart: {
                                                    height: 287,
                                                    type: "donut"
                                                },
                                                plotOptions: {
                                                    pie: {
                                                        donut: {
                                                            size: "75%"
                                                        }
                                                    }
                                                },
                                                dataLabels: {
                                                    enabled: false
                                                },
                                                colors: ['#34c38f', '#776acf'],
                                                legend: {
                                                    show: false
                                                },
                                                tooltip: {
                                                    y: {
                                                        formatter: function (val, { series, seriesIndex, dataPointIndex, w }) {
                                                            const labels = dashboardClientDealStats.labels;
                                                            return labels[seriesIndex] + ': ' + val + ' deals';
                                                        }
                                                    }
                                                }
                                            }}
                                            series={dashboardClientDealStats.series}
                                            labels={dashboardClientDealStats.labels}
                                            type="donut"
                                            height={287}
                                        />
                                    </div>
                                    <div className="mt-1 px-2">
                                        <div className="order-wid-list d-flex justify-content-between border-bottom">
                                            <p className="mb-0"><i className="mdi mdi-square-rounded font-size-10 me-2" style={{ color: '#34c38f' }}></i>Client Deals</p>
                                            <div>
                                                <span className="pe-5">{dashboardClientDealStats.linked_deals}</span>
                                            </div>
                                        </div>
                                        <div className="order-wid-list d-flex justify-content-between">
                                            <p className="mb-0"><i className="mdi mdi-square-rounded font-size-10 me-2" style={{ color: '#776acf' }}></i>Unknown Deals</p>
                                            <div>
                                                <span className="pe-5">{dashboardClientDealStats.unlinked_deals}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex justify-content-center align-items-center" style={{ height: '287px' }}>
                                    <div className="text-center">
                                        <i className="mdi mdi-chart-pie font-size-24 text-muted"></i>
                                        <p className="text-muted mt-2">No chart data available</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>


            </div>


        </div>
    )
}
const mapStateToProps = (state) => ({
    settings: state.common.settings,
    settingsLoading: state.common.isLoading,

    dashboardStatsLoading: state.dashboard.dashboardStatsLoading,
    dashboardStats: state.dashboard.dashboardStats,
    createdVsClosedStatsLoading: state.dashboard.dashboardCreatedVsClosedStatsLoading,
    createdVsClosedStats: state.dashboard.dashboardCreatedVsClosedStats,
    byCreatedDateStatsLoading: state.dashboard.dashboardByCreatedDateStatsLoading,
    byCreatedDateStats: state.dashboard.dashboardByCreatedDateStats,
    dashboardClientDealStatsLoading: state.dashboard.dashboardClientDealStatsLoading,
    dashboardClientDealStats: state.dashboard.dashboardClientDealStats,




});
const mapDispatchToProps = {
    loadDashboardCreatedVsClosedStats,
    loadByCreatedDateStats,
    loadDashboardStats,
    loadClientDealStats
};
  
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);