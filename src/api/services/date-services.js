import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const FORM_DATE_FORMAT = 'DD/MM/YY HH:mm';
const TIME_FORMAT = 'HH:mm';
const DATE_FORMAT = 'MMM D';
const INFO_FORMAT = 'D MMM';

export default class DateSevices {
  getFormDate(date) {
    return dayjs(date).format(FORM_DATE_FORMAT);
  }

  getDate(date) {
    return dayjs(date).format(DATE_FORMAT);
  }

  getInfoDate(dates) {
    const start = dayjs(dates.start);
    const end = dayjs(dates.end);

    if (start.isSame(end, 'month')) {
      return `${start.date()} &mdash; ${end.format(INFO_FORMAT)}`;
    }

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
    const durationObj = dayjs.duration(totalMinutes);
    const hours = Math.floor(durationObj.as('hour'));

    return `${hours >= 1 ? `${String(hours).padStart(2, '0')}H` : ''} ${String(durationObj.$d.minutes).padStart(2, '0')}M`;
  }
}
