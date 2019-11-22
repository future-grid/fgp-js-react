import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './datepickerOverride.css';
import moment from 'moment';
 
export class DatePickerWrapper extends React.Component {
    constructor(props){
        super(props);
    }
   
    render() {
      return (
        <div className={"fixedDatePicked " + this.props.customClasses}>
            <DatePicker
                selected={moment(this.props.date).isValid() === true ? moment(this.props.date).valueOf() : ""}
                onChange={this.props.handleChange}
                dateFormat={this.props.dateFormat ? this.props.dateFormat : "yyyy-MM-dd"}
            />
        </div>
      );
    }
  }
  export default DatePickerWrapper