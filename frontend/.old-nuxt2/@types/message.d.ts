import VillageParticipant from '~/@types/village-participant'
import MessageTime from '~/@types/message-time'
import MessageContent from '~/@types/message-content'

interface Message {
  from: VillageParticipant | null
  time: MessageTime
  content: MessageContent
}

export default Message
