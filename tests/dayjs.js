import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';

dayjs.extend(customParseFormat);
dayjs.extend(weekday);

export { dayjs };
