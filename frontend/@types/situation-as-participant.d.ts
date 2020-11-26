import VillageSkillRequestSituation from '~/@types/village-skill-request-situation'
import VillageComingOutSituation from '~/@types/village-coming-out-situation'
import VillageParticipateSituation from '~/@types/village-participate-situation'
import VillageRollCallSituation from '~/@types/village-roll-call-situation'
import VillageCommitSituation from '~/@types/village-commit-situation'
import VillageVoteSituation from '~/@types/village-vote-situation'
import VillageAbilitySituations from '~/@types/village-ability-situations'
import VillageCreatorSituation from '~/@types/village-creator-situation'
import VillageSaySituation from '~/@types/village-say-situation'

interface SituationAsParticipant {
  participate: VillageParticipateSituation
  roll_call: VillageRollCallSituation
  skill_request: VillageSkillRequestSituation
  commit: VillageCommitSituation
  coming_out: VillageComingOutSituation
  say: VillageSaySituation
  ability: VillageAbilitySituations
  vote: VillageVoteSituation
  creator: VillageCreatorSituation
}

export default SituationAsParticipant
