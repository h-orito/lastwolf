import Messages from '~/@types/messages'
import VillageAbilities from '~/@types/village-abilities'
import Players from '~/@types/players'
import VillageVotes from '~/@types/village-votes'
import Village from '~/@types/village'

interface DayChange {
  change: boolean
  village: Village
  messages: Messages
  votes: VillageVotes
  abilities: VillageAbilities
  players: Players
}

export default DayChange
