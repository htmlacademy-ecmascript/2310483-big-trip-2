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
    const startInMinutes = start.getHours() * 60 + start.getMinutes();
    const endInMinutes = end.getHours() * 60 + end.getMinutes();
    const durationHours = Math.floor((endInMinutes - startInMinutes) / 60);
    const durationMinutes = (endInMinutes - startInMinutes) % 60;

    return `${durationHours >= 1 ? `${String(durationHours).padStart(2, '0')}H` : ''} ${String(durationMinutes).padStart(2, '0')}M`;
  }
}
