import VillageParticipant from '~/@types/village-participant'

interface VillageVoteSituation {
  available_vote: boolean
  target_list: VillageParticipant[]
  target: VillageParticipant | null
}

export default VillageVoteSituation
