import dayjs from 'dayjs'
import 'dayjs/locale/ja'

export default ({ app }, inject) => {
  dayjs.locale('ja')
  inject('dayjs', string => dayjs(string))
}
