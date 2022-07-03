import React from "react";
import { NavItem, NavLink, Badge, Collapse, DropdownItem } from "shards-react";
import { URL } from "../../../../constants";
import audio from "../../../../sound.mp3";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import useSound from "use-sound";
// import boopSfx from 'sounds/boop.mp3';

export default class Notifications extends React.Component {
  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     error: false,
  //     error_count: 0,
  //     // visible: false,
  //     last_count: 0,
  //   };

  //   this.toggleNotifications = this.toggleNotifications.bind(this);
  // }

  // async componentDidMount() {
  //   this.getData()
  //   this.refreshData()

  // }

  // async refreshData(){
  //   this.updateTimer = setInterval(async () => {
  //     this.getData()
  //   }, 5000);
  // }

  // async getData(){
  //   const response = await fetch(URL + "Users/getMesseges", {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //     },
  //     method: "GET",
  //   });
  //   const json = await response.json();
  //   const data_count = json.count;
  //   const res = json.data;

  //   // reset the count to avoid count stacking up
  //   var count = 0;
  //   // Count number of errors received from API
  //   if (res) {
  //     {
  //       data_count.map((type) => {
  //         if (type.type !== "normal") {
  //           count = parseInt(count) + parseInt(type.count);
  //         }
  //       });
  //     }
  //   }
  //   //check if page is loading for the first time
  //   if (this.state.error_count == 0) {
  //     this.setState({ error_count: count });
  //   } else if (this.state.error_count < count) { // if its not the first load, check if the error count of last api result is samller than the count of THIS api result  
  //     NotificationManager.error("Error message", "Click me!", 5000, () => {
  //       alert("This will take you to notification page");
  //     });
  //     this.playAudio();
  //   }

  //   this.setState({ error_count: count });
  // }


  // toggleNotifications() {
  //   this.setState({
  //     // visible: !this.state.visible,
  //   });
  // }
  // playAudio = () => {
  //   new Audio(audio).play();
  // };

  render() {
    return (
      <NavItem className="border-right dropdown notifications">
        {/* <NavLink
          className="nav-link-icon text-center"
          onClick={this.toggleNotifications}
        >
          <div className="nav-link-icon__wrapper">
            <i className="material-icons">&#xE7F4;</i>
            <Badge pill theme="danger">
              {this.state.error_count}
            </Badge>
          </div>
        </NavLink> */}
        {/* <Collapse
          open={this.state.visible}
          className="dropdown-menu dropdown-menu-small"
        >
          <DropdownItem>
            <div className="notification__icon-wrapper">
              <div className="notification__icon">
                <i className="material-icons">&#xE6E1;</i>
              </div>
            </div>
            <div className="notification__content">
              <span className="notification__category">Analytics</span>
              <p>
                Your Data for Aldur Site has been Updated{" "}
                <span className="text-success text-semibold">
                  6th January 2021
                </span>
              </p>
            </div>
          </DropdownItem>
          <DropdownItem>
            <div className="notification__icon-wrapper">
              <div className="notification__icon">
                <i className="material-icons">&#xE6E1;</i>
              </div>
            </div>
            <div className="notification__content">
              <span className="notification__category">Analytics</span>
              <p>
                Your Data for Salman City Site has been Updated{" "}
                <span className="text-danger text-semibold">
                  6th January 2021
                </span>
              </p>
            </div>
          </DropdownItem>
          <DropdownItem className="notification__all text-center">
            View all Notifications
          </DropdownItem>
        </Collapse> */}

        {/* <button className='btn btn-danger'
          onClick={this.createNotification('error')}>Error
        </button> */}
        <NotificationContainer />
      </NavItem>
    );
  }
}
