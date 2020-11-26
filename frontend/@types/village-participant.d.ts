import Player from '~/@types/player'
import WinLose from '~/@types/win-lose'
import Chara from '~/@types/chara'
import Dead from '~/@types/dead'
import Skill from '~/@types/skill'
import SkillRequest from '~/@types/skill-request'
import ComingOut from '~/@types/coming-out'

interface VillageParticipant {
  id: number
  chara: Chara
  player: Player | null
  dead: Dead | null
  skill: Skill | null
  skill_request: SkillRequest | null
  winlose: WinLose | null
  coming_out: ComingOut | null
  done_roll_call: boolean
}

export default VillageParticipant
