// src/utils/formatDate.js
export const formatDateToPST = (isoString) => {
    const date = new Date(isoString);
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      timeZone: 'Asia/Karachi'
    };
    return date.toLocaleString('en-US', options).replace(',', '');
  };
  