import Skill from '~/@types/skill'
import ComingOut from '~/@types/coming-out'

interface VillageComingOutSituation {
  available_coming_out: boolean
  current_coming_out: ComingOut | null
  selectable_skill_list: Skill[]
}

export default VillageComingOutSituation
