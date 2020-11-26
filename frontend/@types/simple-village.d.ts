import Camp from '~/@types/camp'
import VillageParticipants from '~/@types/village-participants'
import VillageStatus from '~/@types/village-status'
import VillageSettings from '~/@types/village-settings'
import VillageDays from '~/@types/village-days'
import Player from '~/@types/player'

interface SimpleVillage {
  id: number
  name: string
  creator_player: Player
  status: VillageStatus
  win_camp: Camp | null
  setting: VillageSettings
  participants: VillageParticipants
  days: VillageDays
}

export default SimpleVillage
