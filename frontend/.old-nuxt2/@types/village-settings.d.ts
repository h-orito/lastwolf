import VillageTime from '~/@types/village-time'
import VillageRules from '~/@types/village-rules'
import VillagePassword from '~/@types/village-password'
import VillageCharachip from '~/@types/village-charachip'
import PersonCapacity from '~/@types/person-capacity'
import VillageOrganizations from '~/@types/village-organizations'

interface VillageSettings {
  capacity: PersonCapacity
  time: VillageTime
  charachip: VillageCharachip
  organizations: VillageOrganizations
  rules: VillageRules
  password: VillagePassword
}

export default VillageSettings
