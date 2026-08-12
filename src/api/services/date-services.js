import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const FORM_DATE_FORMAT = 'DD/MM/YY HH:mm';
const TIME_FORMAT = 'HH:mm';
const DATE_FORMAT = 'MMM D';

export default class DateSevices {
  getFormDate(date) {
    return dayjs(date).format(FORM_DATE_FORMAT);
  }

  getDate(date) {
    return dayjs(date).format(DATE_FORMAT);
  }

  getTime(date) {
    return dayjs(date).format(TIME_FORMAT);
  }

  getDuration(start, end) {
    const totalMinutes = dayjs(end).diff(dayjs(start));
    const {hours, minutes} = dayjs.duration(totalMinutes).$d;

    return `${hours >= 1 ? `${String(hours).padStart(2, '0')}H` : ''} ${String(minutes).padStart(2, '0')}M`;
  }
}
