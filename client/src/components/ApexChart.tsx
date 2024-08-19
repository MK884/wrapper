import { ApexOptions } from 'apexcharts';
import { ChartType } from '../interface';
import Chart from 'react-apexcharts';


const ApexChart = ({
    series,
    categories,
    type = 'bar',
    height = 350,
    settings,
}: {
    series: ApexAxisChartSeries | ApexNonAxisChartSeries;
    categories: Array<string>;
    type?: ChartType;
    height?: number | string;
    settings?: ApexOptions;
}) => {
    if (!series && !categories?.length) return;

    const options: ApexOptions = {
        grid: {
            show: false,
        },
        chart: {
            height: height,
            type: type,
            toolbar: {
                show: true,

                tools: {
                    download: true,
                    selection: false,
                    zoom: false,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                    reset: false,
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth',
        },
        xaxis: {
            type: 'category',
            categories: categories,
            labels: {
                style: {
                    colors: 'var(--text-placeholder)',
                },
                show: false,
            },
        },
        yaxis: {
            stepSize: 1,
            forceNiceScale: true,
            labels: {
                style: {
                    colors: 'var(--text-placeholder)',
                },
            },
        },
        ...settings,
    };

    return (
        <>
            <Chart
                options={options}
                series={series}
                type={type}
                height={height}
            />
        </>
    );
};

export default ApexChart