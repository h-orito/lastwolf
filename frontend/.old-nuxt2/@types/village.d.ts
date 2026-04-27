import Player from '~/@types/player'
import Camp from '~/@types/camp'
import VillageParticipants from '~/@types/village-participants'
import VillageStatus from '~/@types/village-status'
import VillageSettings from '~/@types/village-settings'
import VillageDays from '~/@types/village-days'

interface Village {
  id: number
  name: string
  creator_player: Player
  status: VillageStatus
  win_camp: Camp | null
  setting: VillageSettings
  participants: VillageParticipants
  days: VillageDays
}

export default Village
