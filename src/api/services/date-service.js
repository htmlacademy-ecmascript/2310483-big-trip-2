import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';

const FORM_DATE_FORMAT = 'DD/MM/YY HH:mm';
const TIME_FORMAT = 'HH:mm';
const DATE_FORMAT = 'MMM D';
const INFO_FORMAT = 'D MMM';

dayjs.extend(duration);
dayjs.extend(utc);

export default class DateService {
  getFormDate(date) {
    return dayjs(date).format(FORM_DATE_FORMAT);
  }

  getDate(date) {
    return dayjs(date).utc().format(DATE_FORMAT);
  }

  getInfoDate(dates) {
    const end = dayjs(dates.end);
    const start = dayjs(dates.start);

    return `${start.format(INFO_FORMAT)} &mdash; ${end.format(INFO_FORMAT)}`;
  }

  isOneDayTrip({start, end}) {
    return dayjs(start).isSame(dayjs(end), 'day');
  }

  getTime(date) {
    return dayjs(date).format(TIME_FORMAT);
  }

  getDuration(start, end) {
    const totalMinutes = dayjs(end).diff(dayjs(start));
    const calculatedDuration = dayjs.duration(totalMinutes);
    const days = Math.floor(calculatedDuration.as('days'));
    if (days > 0) {
      return `${days < 10 ? `${String(days).padStart(2, '0')}D` : `${days}D`} ${String(calculatedDuration.$d.hours).padStart(2, '0')}H ${String(calculatedDuration.$d.minutes).padStart(2, '0')}M`;
    }

    return `${calculatedDuration.$d.hours >= 1 ? `${String(calculatedDuration.$d.hours).padStart(2, '0')}H` : ''} ${String(calculatedDuration.$d.minutes).padStart(2, '0')}M`;
  }
}
