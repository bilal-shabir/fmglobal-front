import React, { Component } from "react";
import {URL2,DKEY,URL3} from '../../../src/constants.js';

class updated_at extends Component{
    constructor(props) {
        super(props);
    
        const userIs_logged=localStorage.getItem('is_logged');
        if(userIs_logged != 1){
        this.props.history.push("/login");
        }
    
        const pid = this.props.id
        // alert(pid)
        
        this.state = {
            pid: pid,
            last_updated: null,
            isLoaded: true,
            updated_at: 0
        }
    //
    }

    async componentDidMount() {

        fetch(URL2+'project/get_current', {
            headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            },
            credentials: 'include',
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({ project_id: this.state.pid, n:7})
        }).then(response => response.json())
        .then((json)=>{
            var last_updated= ''
            if(json.production.time.length == 0){
                var date1 = new Date()
                const day = date1.getDate()
                const hour = date1.getHours()
                const month = date1.toLocaleString('en-us', { month: 'short' });
                last_updated = day + " " +month +", " +this.addZero(hour) + ":00"
              }
              else{
                var date = Date.parse(json.production.time[0]);
                var date1 = new Date(date);
                const day = date1.getDate()
                const month = date1.toLocaleString('en-us', { month: 'short' }); 
                last_updated = day + " " +month +", " +this.abc(json.production.time[0])
              }

            this.setState({
                last_updated: last_updated,
                isLoaded: true
            })
            // console.log(this.state.last_updated)
        })
    }
    abc (date)
{
  var time = Date.parse(date);
  var date1 = new Date(time);

  
 let h =this.addZero(date1.getHours())
 let m =this.addZero(date1.getMinutes())
  
  let time1 = h + ":" + m
  return time1

}
addZero(i) {
    if (i < 10) {i = "0" + i}
    return i;
  }
    render() {
        return (
            this.state.isLoaded ? ( <span className="text-semibold">
            <i class="material-icons">update</i> {this.state.last_updated}
      </span>) : (<span></span>)
        )}
} 
export default updated_at