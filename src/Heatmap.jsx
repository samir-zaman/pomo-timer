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

  useEffect(() => {
    console.log("Effect running, auth status:", isAuth);
    console.log("Current user:", auth.currentUser);
    
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
        snapshot.forEach(doc => {
          data.push({
            date: doc.id,
            value: doc.data().minutesStudied
          });
        });

        
        console.log("User Id:", auth.currentUser.uid)
        console.log("Heatmap data:", data);
        if (data.length === 0) {
          console.log("No study sessions found");
          return;
        }

        const cal = new CalHeatmap();

        cal.paint({
            range: 12, //number of domains
            domain: {
                type: 'month',
                gutter: 4, //space between each domain, in pixel
                padding: [5,0,0,0], //padding inside each domain, in pixel
            },
            subDomain: {type: 'day'},
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
                  domain: [0, 200],
                },
            date: {
                start: data[0].date,
                highlight: formattedDate(), //highlight today's date
            },
            theme: 'dark'
              },
        },[
            [Legend,{
                enabled: true,
                itemSelector: null, //optional for customizing CSS
                label: 'Hours studied',
                width: 300,
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
      cal.destroy();
    };
  }, [isAuth]); 
  
  return isAuth ? (
    <div id='cal-heatmap'></div>
  ) : (
    <p>Log in to see your heat map</p>
  );
};

export default Heatmap;