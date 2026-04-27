import MessageType from '~/@types/message-type'

interface VillageSaySituation {
  available_say: boolean
  selectable_message_type_list: MessageType[]
  default_message_type: MessageType | null
}

export default VillageSaySituation
