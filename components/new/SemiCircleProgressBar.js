
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const SemiCircleProgressBar = ({washingDashboardData}) => {
    let complet=washingDashboardData.complet||0;
    let simple=washingDashboardData.simple||0;

    const percentage = Math.floor((complet*40+simple*20)/(8*60)*100);
return(
<CircularProgressbar value={percentage} text={`${percentage}%`} />)
};

export default SemiCircleProgressBar;