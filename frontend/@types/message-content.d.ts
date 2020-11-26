import MessageType from '~/@types/message-type'

interface MessageContent {
  type: MessageType
  text: string
  strong: boolean
}

export default MessageContent
