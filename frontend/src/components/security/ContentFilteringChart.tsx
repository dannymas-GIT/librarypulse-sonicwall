import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { ContentFilteringCategory } from '../../types/security';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ContentFilteringChartProps {
  data: ContentFilteringCategory[];
}

export const ContentFilteringChart: React.FC<ContentFilteringChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(category => category.name),
    datasets: [
      {
        label: 'Hits Today',
        data: data.map(category => category.hits_today),
        backgroundColor: data.map(category => 
          category.status === 'Blocked' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(34, 197, 94, 0.5)'
        ),
        borderColor: data.map(category => 
          category.status === 'Blocked' ? 'rgb(239, 68, 68)' : 'rgb(34, 197, 94)'
        ),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Content Filtering Activity',
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <Bar data={chartData} options={options} />
    </div>
  );
}; 