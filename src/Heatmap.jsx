import React, { useState, useEffect } from 'react';
import { useOutletContext } from "react-router-dom"
import { db, auth } from './firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import CalHeatmap from 'cal-heatmap';
import 'cal-heatmap/cal-heatmap.css';
import Tooltip from 'cal-heatmap/plugins/Tooltip';
import Legend from 'cal-heatmap/plugins/Legend';
import CalendarLabel from 'cal-heatmap/plugins/CalendarLabel';
import { formattedDate } from './utils';

const Heatmap = () => {
  const { isAuth } = useOutletContext();
  const [totalHours, setTotalHours] = useState(0);

  useEffect(() => {
    console.log("Effect running, auth status:", isAuth);
    console.log("Current user:", auth.currentUser);

    let cal = null;
    
    // If not authenticated, don't try to fetch data
    if (!isAuth) {
      console.log("No authenticated user");
      return;
    }

    
    const fetchData = async () => {
      try {
        const sessionsRef = collection(db, 'users', auth.currentUser.uid, 'studySessions');
        const snapshot = await getDocs(sessionsRef);
                
        const data = [];
        let totalMinutes = 0;

        snapshot.forEach(doc => {
          const minutes = doc.data().minutesStudied || 0;
          totalMinutes += minutes;

          data.push({
            date: doc.id,
            value: doc.data().minutesStudied
          });
        });

        setTotalHours((totalMinutes / 60).toFixed(1));

        
        console.log("User Id:", auth.currentUser.uid)
        console.log("Heatmap data:", data);
        if (data.length === 0) {
          console.log("No study sessions found");
          return;
        }
        
        //calculate start date
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11); 
        twelveMonthsAgo.setDate(1); 

        //dynamically set the color scale's domain
        const maxMinutes = data.reduce((max, session) => Math.max(max, session.value), 0);
        const colorDomainMax = maxMinutes > 0 ? maxMinutes + 10 : 60;
        console.log("color scale's max:", colorDomainMax);


        cal = new CalHeatmap();


        cal.paint({
            range: 12, //number of domains
            domain: {
                type: 'month',
                gutter: 3, //space between each domain, in pixel
                padding: [5,0,0,0], //padding inside each domain, in pixel
            },
            subDomain: {
                type: 'day',
                width: 12,
                height: 12,
                radius: 0
            },
            data: {
                source: data,
                x: datum => datum.date,
                y: datum => datum.value,
            },
            scale: {
                color: {
                  // Try some values: Purples, Blues, Turbo, Magma, etc ...
                  scheme: 'Cool',
                  type: 'linear',
                  domain: [0, colorDomainMax],
                },
            
            },
            date: {
              start: twelveMonthsAgo,
              highlight: formattedDate(), //highlight today's date
            },
            theme: 'light'
        },[
            [Legend,{
                enabled: true,
                itemSelector: null, //optional for customizing CSS
                label: 'Minutes studied',
                width: 350,
            },],
            [CalendarLabel,{
                position: 'left',
                key: 'left',
                text: () => ['Mon', '', '', 'Thu', '', '', 'Sun'],
                textAlign: 'end',
                width: 30,
                padding: [0, 5, 0, 0],
            },],
            [Tooltip,{
                enabled: true,
                
            },]
        ]);
      } catch (error) {
        console.error('Error fetching study sessions:', error);
        console.error('Error details:', error.message);
      }
    };

    fetchData(); 

    return () => {
      if (cal) {
        console.log('Destroying CalHeatmap instance.');
        cal.destroy();
      }
    };
  }, [isAuth]);
  
  return (
    <div className="heatmap-container">
      <h1><span>{totalHours}</span>{'hours studied in the past year'}</h1>
      {isAuth ? (
        <div id='cal-heatmap'></div>
      ) : (
        <p>Log in to see your heat map</p>
      )}
    </div>
  );
};

export default Heatmap;