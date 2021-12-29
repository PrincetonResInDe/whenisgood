import React from 'react';
import StandardCalendar from './StandardCalendar';

export default class Respond extends React.Component {
   constructor(props) {
     super(props);
     this.state = {
       eventUUID: "d4c1e321-4b18-11ec-9e15-12f59f6291df",
       eventName: "Event Name",
       eventDescription: "Event Description"
     }
   }


   render() {
  	 let renderCalendar = (
        	<div>
			<StandardCalendar eventUUID={this.state.eventUUID}/>
		</div>
 	 );
   

     return (
       <div>
          <div>
                <h1>{this.state.eventName}</h1>
                <h3>{this.state.eventDescription}</h3>
          </div>
          <div>
                {renderCalendar}
          </div>
       </div>
	 );
   }
}