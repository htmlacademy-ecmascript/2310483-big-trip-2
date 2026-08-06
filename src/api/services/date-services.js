export default class DateSevices {

  getISODate(date) {
    return date.toISOString().slice(0, 10);
  }

  getISODateTime(date) {
    return date.toISOString().slice(0, 16);
  }

  getDateTime(date) {
    const year = String(date.getFullYear()).slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  getMonthDay(date) {
    const months = [
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
      'SEP',
      'OCT',
      'NOV',
      'DEC'
    ];
    return `${date.getDate()} ${months[date.getMonth()]}`;
  }

  getHoursMinutes(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${String(minutes).padStart(2, '0')}`;
  }

  getDuration(start, end) {
    const startInMilliseconds = start.getTime();
    const endInMilliseconds = end.getTime();
    const durationHours = Math.floor((endInMilliseconds - startInMilliseconds) / 3600000);
    const durationMinutes = Math.floor((endInMilliseconds - startInMilliseconds) % 3600000 / 60000);

    return `${durationHours >= 1 ? `${String(durationHours).padStart(2, '0')}H` : ''} ${String(durationMinutes).padStart(2, '0')}M`;
  }

  getDurationInMilliseconds(start, end) {
    return end.getTime() - start.getTime();
  }
}
