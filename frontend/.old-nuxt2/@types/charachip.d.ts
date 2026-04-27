import Chara from '~/@types/chara'
import Designer from '~/@types/designer'

interface Charachip {
  id: number
  name: string
  designer: Designer
  description_url: string
  chara_list: Chara[]
}

export default Charachip
