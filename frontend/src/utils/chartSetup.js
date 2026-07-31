import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler);

export const chartTooltipStyle = {
  backgroundColor: '#1A1A1A',
  titleColor: '#fff',
  bodyColor: '#ccc',
  borderColor: 'rgba(255,255,255,0.08)',
  borderWidth: 1,
  padding: 10,
  titleFont: { family: 'Inter', size: 12 },
  bodyFont: { family: 'Inter', size: 12 },
};

export const chartGridStyle = { color: 'rgba(255,255,255,0.05)' };
export const chartTickStyle = { color: 'rgba(255,255,255,0.4)', font: { family: 'Inter', size: 11 } };
