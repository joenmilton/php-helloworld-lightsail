import moment from 'moment-timezone';

export const formatDate = (datetime, type = 'datetime') => {
  const timezone = 'Asia/Kolkata';
  const customFormat = "YYYY-MM-DD HH:mm:ss"; // Define custom format for non-ISO inputs

  // Check if datetime is in ISO format or needs a custom format
  const momentDate = moment(datetime, moment.ISO_8601, true).isValid()
    ? moment(datetime) // ISO 8601 format
    : moment(datetime, customFormat); // Custom format

  let formattedDate;
  if (type === 'datetime') {
    formattedDate = momentDate.tz(timezone).format("MMMM DD, YYYY hh:mm A");
  }
  else if (type === 'date') {
    formattedDate = momentDate.tz(timezone).format("MMMM DD, YYYY");
  }
  else if (type === 'time') {
    formattedDate = momentDate.tz(timezone).format("hh:mm A");
  }
  else if (type === 'shortdate') {
    formattedDate = momentDate.tz(timezone).format("MMM DD, YYYY");
  }
  return formattedDate;
}

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const customFieldLabel = (custom_fields, name) => {
  // Check if custom_fields is an array
  if (!Array.isArray(custom_fields)) {
    return '';
  }

  // Find the field object with the matching name
  const field = custom_fields.find(field => field.name === name);

  // Return the label if the field is found, otherwise return undefined
  return field ? field.label : '';
}

export const customFieldValue = (custom_fields, name) => {
  // Check if custom_fields is an array
  if (!Array.isArray(custom_fields)) {
    return '';
  }

  // Find the field object with the matching name
  const field = custom_fields.find(field => field.field_name === name);

  // Return the label if the field is found, otherwise return undefined
  return field ? field.field_value : '';
}

export const updateCustomFields = (fields, newValue) => {
  const index = fields.findIndex(field => field.field_name === newValue.field_name);
  
  if (index !== -1) {
      // Update existing field value
      fields[index].field_value = newValue.field_value;
  } else {
      // Add new field
      fields.push(newValue);
  }
  
  return fields;
};


export const formatString = (str, prefix = '') => {
  return str.replace(/_/g, ' ').replace(/\b\w/g, (char) => prefix+char.toUpperCase());
}

export const paramSerialize = (obj, prefix) => {
  const serialize = (obj, prefix) => {
    const str = [];
    for (const p in obj) {
      if (obj.hasOwnProperty(p)) {
        const k = prefix ? `${prefix}[${p}]` : p;
        const v = obj[p];
        str.push(
          v !== null && typeof v === "object"
            ? serialize(v, k)
            : `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
        );
      }
    }
    return str.join("&");
  };

  return serialize(obj, prefix);
};

export const makeSingular = (word) => {
  if (word.endsWith('ies')) {
      return word.slice(0, -3) + 'y';  // e.g., 'batteries' -> 'battery'
  } else if (word.endsWith('es')) {
      return word.slice(0, -2);  // e.g., 'boxes' -> 'box'
  } else if (word.endsWith('s')) {
      return word.slice(0, -1);  // e.g., 'dogs' -> 'dog'
  } else {
      return word;  // If it doesn't match, return as is
  }
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const rgbToRgba = (rgb, alpha) => {
  const rgbValues = rgb.match(/\d+/g);
  return `rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, ${alpha})`;
}


export const mergeApiDateWithIso = (dateTimeStr) => {
  // Extract the date part from API DateTime
  const apiDate = dateTimeStr.split(' ')[0]; // '2024-10-25'

  // Get the current time in HH:MM:SS format
  const currentTime = new Date().toTimeString().split(' ')[0]; // '18:21:12'

  // Combine the API date with the current time
  const combinedDateTime = `${apiDate}T${currentTime}`;

  // Convert to ISO format
  return new Date(combinedDateTime).toISOString();
};

export const idNameText = (statusList, status) => {
  if(status === '') {
    return '-'
  }

  const statusDetail = statusList.find(l => l.id === status)
  if(!statusDetail) {
    return '-'
  }

  return statusDetail.name;
}

export const idColor = (statusList, status) => {
  if(status === '') {
    return 'rgb(150, 155, 165)'
  }

  const statusDetail = statusList.find(l => l.id === status)
  if(!statusDetail) {
    return 'rgb(150, 155, 165)'
  }

  return statusDetail.color;
}

export const formatTimeAgo = (timestamp) => {
  return moment(timestamp).fromNow();
};