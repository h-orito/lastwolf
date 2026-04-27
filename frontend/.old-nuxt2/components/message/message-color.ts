import Village from '~/@types/village'
import VillageParticipant from '~/@types/village-participant'

const getColorClass = (
  village: Village,
  participant: VillageParticipant
): string | null => {
  const index: number | null = village.participants.member_list.findIndex(
    m => m.id === participant.id
  )
  if (index == null) return null
  return `message-color-${index % 10}`
}

export { getColorClass }
