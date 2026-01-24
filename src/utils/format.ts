import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export function formatDate(value: string) {
  if (!value) return ''
  return dayjs.utc(value).format('YYYY-MM-DD HH:mm')
}
