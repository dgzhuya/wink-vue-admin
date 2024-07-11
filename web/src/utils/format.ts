import dayjs from 'dayjs'

export const dateHandler = (date?: string, format = 'YYYY-MM-DD HH:mm') => {
	return dayjs(date).format(format)
}
