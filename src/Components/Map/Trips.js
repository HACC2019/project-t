import React from 'react'
import { TripsLayer } from "@deck.gl/geo-layers";
import "mapbox-gl/dist/mapbox-gl.css";

const Trips = ({time}) => {
  
  const data = () => {
    fetch('trips.json')
      .then(res => res.json())
      .then(data => console.log(data))
  }

  return (
        <TripsLayer 
          id= "trips"
          data= {data}
          getPath= {d => d.path}
          getTimestamps= {d => d.timestamps}
          getColor= {d => this.choose([[253, 128, 93], [75, 218, 250]])}
          opacity= {0.5}
          widthMinPixels= {2}
          rounded= {true}
          trailLength= {10}
          currentTime= {time}
          shadowEnabled= {false}
    />
  )
};


export default Trips;