import React, { useState } from "react";

import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";


const DateRangePicker = () => {
  const [dateRange, setDateRange] = useState([]);

  return (
    <div>
        <Flatpickr
            className="form-control bg-white shadow-sm ring-1 ring-neutral-300"
            placeholder="Select Date Range"
            options={{
                mode: "range", // enables range selection
                dateFormat: "Y-m-d", // custom format if needed
            }}
            value={dateRange}
            onChange={(selectedDates) => {
                setDateRange(selectedDates);
            }}
        />
        {/* {dateRange.length === 2 && (
            <p>
                Selected From: {dateRange[0].toLocaleDateString()} <br />
                To: {dateRange[1].toLocaleDateString()}
            </p>
        )} */}
    </div>
  );
};

export default DateRangePicker;
