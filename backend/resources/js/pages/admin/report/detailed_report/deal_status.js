import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import DetailedReportTable from './component/DetailedReportTable';
import RewardedReportTable from './component/RewardedReportTable';
import Select from 'react-select';
import { fetchPipelineUsers, fetchDealStatusReport } from '../../../../redux/report/action';

import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";

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
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function DealStatusReport({
    pipelineList, 
    fetchPipelineUsers, fetchDealStatusReport
}) {
    const [errors, setErrors] = useState({});

    const [dateRangeOptions, setDateRangeOptions] = useState([
        {
            value: 'today',
            label: 'Today'
        },
        {
            value: 'yesterday',
            label: 'Yesterday'
        },
        {
            value: 'this-week',
            label: 'This Week'
        },
        {
            value: 'last-week',
            label: 'Last Week'
        },
        {
            value: 'this-month',
            label: 'This Month'
        },
        {
            value: 'last-month',
            label: 'Last Month'
        },
        {
            value: 'this-year',
            label: 'This Year'
        },
        {
            value: 'last-year',
            label: 'Last Year'
        },
        {
            value: 'custom-range',
            label: 'Custom Range'
        }
    ]);

    const [statusOptions, setStatusOptions] = useState([
        {
            value: '2',
            label: 'Won'
        },
        {
            value: '3',
            label: 'Lost'
        },
        {
            value: '1',
            label: 'Open'
        },
    ]);

    const [isFetching, setIsFetching] = useState(false);
    const [isStatusLoading, setIsStatusLoading] = useState(false);
    const [isDetailedReportLoading, setIsDetailedReportLoading] = useState(false);

    const [statusReport, setStatusReport] = useState(null);
    const [amountReport, setAmountReport] = useState(null);
    const [detailedReport, setDetailedReport] = useState(null);

    const [dealRewardsReport, setDealRewardsReport] = useState(null);
    const [totalDealRewards, setTotalDealRewards] = useState(null);

    const [pipelineUserOptions, setPipelineUserOptions] = useState([
        {
            value: '-',
            label: 'All'
        },
    ]);

    const [formData, setFormData] = useState({
        pipeline: null,
        status: {
            value: '2',
            label: 'Won'
        },
        pipeline_user: {
            value: '-',
            label: 'All'
        },
        date_range: null,
        custom_range: null
    });

    const handleSelectChange = async (name, value) => {
        // First update the form data
        const updatedFormData = {
            ...formData,
            [name]: value
        };

        // Reset pipeline_user to "All" only when pipeline changes
        if(name === 'pipeline') {
            updatedFormData.pipeline_user = {
                value: '-',
                label: 'All'
            };
        }

        setFormData(updatedFormData);

        // Then handle pipeline-specific logic
        if(name === 'pipeline') {
            const response = await fetchPipelineUsers(value.value);
            if(response.httpCode === 200) {
                setPipelineUserOptions(response.data);
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsFetching(true);
            setIsStatusLoading(true);
            setIsDetailedReportLoading(true);
            setErrors({});

            const response = await fetchDealStatusReport(formData);
            setStatusReport(response?.chart_data?.status);
            setAmountReport(response?.chart_data?.amount);
            setDetailedReport(response?.total_deals)
            setDealRewardsReport(response?.deal_rewards_chart_data?.status);
            setTotalDealRewards(response?.total_deal_rewards);

            setIsDetailedReportLoading(false);
            setIsStatusLoading(false);
        } catch (error) {
            if (error.errors) {
                const newErrors = {};
                Object.keys(error.errors).forEach(key => {
                    newErrors[key] = Array.isArray(error.errors[key]) 
                        ? error.errors[key][0] 
                        : error.errors[key];
                });
                setErrors(newErrors);
            } else {
                setErrors({
                    name: error.message || 'An error occurred while saving'
                });
            }
            return;
        } finally {
            setIsFetching(false);
            setIsStatusLoading(false);
            setIsDetailedReportLoading(false);
        }
    };

    const fetchDetailedReportList = async (queryFilter) => {
        console.log(queryFilter);
        // const response = await fetchDealStatusReport(queryFilter);
        // setDetailedReport(response?.total_deals)
    }

    return (
        <div className='container-fluid'>

            <form onSubmit={handleSubmit} className='d-flex align-items-start mb-4 mb-xl-0 mb-2'>
                <div className='flex-grow-1'>
                    <div className='btn-toolbar'>
                        <div className='btn-group me-2 mb-2'>
                            <div>
                                <label className='form-label text-secondary mb-0'>Pipeline</label>
                                <Select
                                    id="pipeline"
                                    classNamePrefix="pipeline-select"
                                    placeholder={"Select Pipeline...."}
                                    closeMenuOnSelect={true}
                                    isClearable={true}
                                    value={formData?.pipeline}
                                    options={pipelineList ? pipelineList.map(pipeline => ({
                                        value: pipeline.id,
                                        label: pipeline.name
                                    })) : []}
                                    onChange={(values) => handleSelectChange('pipeline', values)}
                                    styles={{
                                        container: (provided) => ({
                                        ...provided,
                                        minWidth: 200,
                                        }),
                                    }}
                                />
                                {errors?.pipeline && (
                                    <div className="d-block text-danger">
                                        {Array.isArray(errors.pipeline) ? errors.pipeline[0] : errors.pipeline}
                                    </div>
                                )}
                            </div>
                            
                        </div>
                        <div className='btn-group me-2 mb-2'>
                            <div>
                                <label className='form-label text-secondary mb-0'>Date Range</label>
                                <Select
                                    id="date-range"
                                    classNamePrefix="date-range-select"
                                    placeholder={"Select Date Range...."}
                                    closeMenuOnSelect={true}
                                    value={formData?.date_range}
                                    options={dateRangeOptions}
                                    onChange={(values) => handleSelectChange('date_range', values)}
                                    styles={{
                                            container: (provided) => ({
                                            ...provided,
                                            minWidth: 200,
                                        }),
                                    }}
                                />
                                {errors?.date_range && (
                                    <div className="d-block text-danger">
                                        {Array.isArray(errors.date_range) ? errors.date_range[0] : errors.date_range}
                                    </div>
                                )}
                            </div>
                        </div>
                        {
                            (formData?.date_range && formData?.date_range?.value === 'custom-range') && (
                                <div className='btn-group me-2 mb-2'>
                                    <div>
                                        <label className='form-label text-secondary mb-0'>Custom Range</label>
                                        <Flatpickr
                                            className="form-control bg-white shadow-sm ring-1 ring-neutral-300"
                                            placeholder="Select Date Range"
                                            options={{
                                                mode: "range", // enables range selection
                                                dateFormat: "Y-m-d", // custom format if needed
                                                enableTime: false, // disable time selection
                                                disableMobile: true, // use desktop version
                                            }}
                                            value={formData?.custom_range}
                                            onChange={(dates, dateStr) => {
                                                // Format dates as simple YYYY-MM-DD strings to avoid timezone issues
                                                if (dates && dates.length === 2) {
                                                    const formattedDates = dates.map(date => {
                                                        const year = date.getFullYear();
                                                        const month = String(date.getMonth() + 1).padStart(2, '0');
                                                        const day = String(date.getDate()).padStart(2, '0');
                                                        return `${year}-${month}-${day}`;
                                                    });
                                                    handleSelectChange('custom_range', formattedDates);
                                                } else {
                                                    handleSelectChange('custom_range', dates);
                                                }
                                            }}
                                        />
                                        {errors?.custom_range && (
                                            <div className="d-block text-danger">
                                                {Array.isArray(errors.custom_range) ? errors.custom_range[0] : errors.custom_range}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className='flex-shrink-1'>
                    <div className='btn-toolbar'>
                        <div className='btn-group me-2 mb-2'>
                            <div>
                                <label className='form-label text-secondary mb-0'>Pipeline User</label>
                                <Select
                                    id="pipeline_user"
                                    classNamePrefix="pipeline-user-select"
                                    placeholder={"Select Pipeline User...."}
                                    closeMenuOnSelect={true}
                                    options={pipelineUserOptions}
                                    value={formData?.pipeline_user}
                                    onChange={(values) => handleSelectChange('pipeline_user', values)}
                                    styles={{
                                        container: (provided) => ({
                                            ...provided,
                                            minWidth: 200,
                                        }),
                                    }}
                                />
                                {errors?.pipeline_user && (
                                    <div className="d-block text-danger">
                                        {Array.isArray(errors.pipeline_user) ? errors.pipeline_user[0] : errors.pipeline_user}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='btn-group me-2 mb-2'>
                            <div>
                                <label className='form-label text-secondary mb-0'>Status</label>
                                <Select
                                    id="report_status"
                                    classNamePrefix="status-select"
                                    placeholder={"Status..."}
                                    closeMenuOnSelect={true}
                                    options={statusOptions}
                                    value={formData?.status}
                                    onChange={(values) => handleSelectChange('status', values)}
                                    styles={{
                                        container: (provided) => ({
                                            ...provided,
                                            minWidth: 150,
                                            maxWidth: 150,
                                        }),
                                    }}
                                />
                                {errors?.status && (
                                    <div className="d-block text-danger">
                                        {Array.isArray(errors.status) ? errors.status[0] : errors.status}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='btn-group mb-2'>
                            <div>
                                <label className='form-label text-secondary mb-0'></label>
                                <div>
                                    <button className='btn btn-primary' style={{lineHeight: '20px'}} disabled={isFetching}>
                                        {isFetching ? 'Fetching...' : 'Fetch'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            <div className='row'>
                <div className='col-12'>
                    <div className='card'>
                        <div className='card-body pb-2'>
                            <div className='row'>
                                <div className="col-xl-6">
                                    <div className='card'>
                                        <div className='card-header' style={{backgroundColor: '#f8f9fa'}}>
                                            <h5 className='card-title'>Total Deals</h5>
                                        </div>
                                        <div className='card-body pb-2'>
                                        {isStatusLoading ? (
                                            <div className="d-flex justify-content-center align-items-center" style={{ height: '425px' }}>
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                                <span className="ms-2">Loading chart data...</span>
                                            </div>
                                            ) : statusReport?.categories && statusReport?.series ? (
                                                <Chart
                                                    options={{
                                                        chart: {
                                                            height: 410,
                                                            type: "bar",
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
                                                            enabled: true,
                                                            style: {
                                                                colors: ['#fff']
                                                            }
                                                        },
                                                        colors: ['#776acf'],
                                                        xaxis: {
                                                            categories: statusReport.categories
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
                                                    series={statusReport.series}
                                                    type="bar"
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

                                <div className="col-xl-6">
                                    <div className='card'>
                                        <div className='card-header' style={{backgroundColor: '#f8f9fa'}}>
                                            <h5 className='card-title'>Total Value For All Deals (₹)</h5>
                                        </div>
                                        <div className='card-body pb-2'>
                                        {isStatusLoading ? (
                                            <div className="d-flex justify-content-center align-items-center" style={{ height: '425px' }}>
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                                <span className="ms-2">Loading chart data...</span>
                                            </div>
                                        ) : amountReport?.categories && amountReport?.series ? (
                                            <Chart
                                                options={{
                                                    chart: {
                                                        height: 410,
                                                        type: "bar",
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
                                                        enabled: true,
                                                        style: {
                                                            colors: ['#fff']
                                                        }
                                                    },
                                                    colors: ['#34c38f'],
                                                    xaxis: {
                                                        categories: amountReport.categories
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
                                                                return "₹" + val.toLocaleString();
                                                            }
                                                        }
                                                    }
                                                }}
                                                series={amountReport.series}
                                                type="bar"
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

                                <div className="col-xl-12">
                                    <DetailedReportTable 
                                        isDetailedReportLoading={isDetailedReportLoading}
                                        detailedReport={detailedReport}
                                        fetchDetailedReportList={fetchDetailedReportList}
                                    />
                                </div>
                            </div>


                            <div className='row'>
                                <div className="col-xl-6">
                                    <div className='card'>
                                        <div className='card-header' style={{backgroundColor: '#f8f9fa'}}>
                                            <h5 className='card-title'>Total Deals Rewarded</h5>
                                        </div>
                                        <div className='card-body pb-2'>
                                        {isStatusLoading ? (
                                            <div className="d-flex justify-content-center align-items-center" style={{ height: '425px' }}>
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                                <span className="ms-2">Loading chart data...</span>
                                            </div>
                                            ) : dealRewardsReport?.categories && dealRewardsReport?.series ? (
                                                <Chart
                                                    options={{
                                                        chart: {
                                                            height: 410,
                                                            type: "bar",
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
                                                            enabled: true,
                                                            style: {
                                                                colors: ['#fff']
                                                            }
                                                        },
                                                        colors: ['#776acf'],
                                                        xaxis: {
                                                            categories: dealRewardsReport.categories
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
                                                    series={dealRewardsReport.series}
                                                    type="bar"
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
                                <div className="col-xl-6">
                                    <RewardedReportTable 
                                        isDetailedReportLoading={isDetailedReportLoading}
                                        detailedReport={totalDealRewards}
                                        fetchDetailedReportList={fetchDetailedReportList}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
const mapStateToProps = (state) => ({
    pipelineList: state.common?.settings?.pipelines,
});
const mapDispatchToProps = {
    fetchPipelineUsers,
    fetchDealStatusReport
};
  
export default connect(mapStateToProps, mapDispatchToProps)(DealStatusReport);