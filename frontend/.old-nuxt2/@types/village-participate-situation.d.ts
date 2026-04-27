import Chara from '~/@types/chara'
import VillageParticipant from '~/@types/village-participant'

interface VillageParticipateSituation {
  participating: boolean
  available_participate: boolean
  selectable_chara_list: Chara[]
  available_leave: boolean
  myself: VillageParticipant | null
}

export default VillageParticipateSituation
