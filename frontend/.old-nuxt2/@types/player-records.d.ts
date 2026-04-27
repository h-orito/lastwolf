import Player from '~/@types/player'
import CampRecord from '~/@types/camp-record'
import Record from '~/@types/record'
import SkillRecord from '~/@types/skill-record'
import ParticipateVillage from '~/@types/participate-village'

interface PlayerRecords {
  player: Player
  whole_record: Record
  camp_record_list: CampRecord[]
  skill_record_list: SkillRecord[]
  participate_village_list: ParticipateVillage[]
}

export default PlayerRecords
