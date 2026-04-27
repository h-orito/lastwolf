import Player from '~/@types/player'
import VillageParticipants from '~/@types/village-participants'
import VillageStatus from '~/@types/village-status'
import VillageSettings from '~/@types/village-settings'
import VillageDays from '~/@types/village-days'

interface DebugVillage {
  id: number
  name: string
  creator_player: Player
  status: VillageStatus
  setting: VillageSettings
  participants: VillageParticipants
  days: VillageDays
}

export default DebugVillage
