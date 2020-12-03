import VillageParticipant from '~/@types/village-participant'
import AbilityType from '~/@types/ability-type'

interface VillageAbilitySituation {
  type: AbilityType
  target_list: VillageParticipant[]
  usable: boolean
  available_no_target: boolean
}

export default VillageAbilitySituation
