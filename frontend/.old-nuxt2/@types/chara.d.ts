import CharaName from '~/@types/chara-name'
import CharaImage from '~/@types/chara-image'

interface Chara {
  id: number
  name: CharaName
  charachip_id: number
  image: CharaImage
}

export default Chara
