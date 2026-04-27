import Skill from '~/@types/skill'
import SkillRequest from '~/@types/skill-request'

interface VillageSkillRequestSituation {
  available_skill_request: boolean
  selectable_skill_list: Skill[]
  skill_request: SkillRequest | null
}

export default VillageSkillRequestSituation
