import * as actionType from '~/store/action-types'
import firebase from '~/plugins/firebase'
import Message from '~/@types/message'

const database = firebase.database()
let nightRef: any = null
let noonRef: any = null

const state: {
  villageId: number
  nightMessages: Message[]
  noonMessages: Message[]
} = {
  villageId: 0,
  nightMessages: [],
  noonMessages: []
}

const mutations = {
  initNightMessages(state, { villageId, nightMessages }) {
    state.villageId = villageId
    state.nightMessages = nightMessages
  },
  initNoonMessages(state, { villageId, noonMessages }) {
    state.villageId = villageId
    state.noonMessages = noonMessages
  },
  terminateMessages(state) {
    state.villageId = 0
    state.nightMessages = []
    state.noonMessages = []
  }
}

const actions = {
  async [actionType.INIT_MESSAGE]({ commit }, { villageId, uid }) {
    if (nightRef || noonRef) commit('terminateMessages')
    if (nightRef) nightRef.off()
    if (noonRef) noonRef.off()

    nightRef = nightReference(villageId, uid)
    noonRef = noonReference(villageId)

    const self = <any>this
    // 夜
    const nightMessages: Message[] = []
    let from: number = 0
    await nightRef.on('value', async snapshot => {
      const messages = await self.$axios.$get(
        `/village/${villageId}/message-list`,
        {
          params: {
            from
          }
        }
      )
      if (messages.list.length > 0) {
        from = messages.list[messages.list.length - 1].time.unix_time_milli
      }
      messages.list.forEach(message => nightMessages.unshift(message))
    })
    await commit('initNightMessages', {
      villageId,
      nightMessages
    })
    // 昼
    const noonMessages: Message[] = []
    await noonRef.on('child_added', snapshot => {
      noonMessages.unshift(snapshot.val())
    })
    await commit('initNoonMessages', {
      villageId,
      noonMessages
    })
  },
  async [actionType.DELETE_MESSAGE]({ commit }, { villageId }) {
    const vid = ('00000' + villageId).slice(-5)
    await database.ref(`v${vid}/`).remove()
    await commit('terminateMessages')
  },
  async [actionType.TERMINATE_MESSAGE]({ commit }) {
    await commit('terminateMessages')
    if (nightRef) nightRef.off()
    if (noonRef) noonRef.off()
  }
}

const getters = {
  nightMessages: state => state.nightMessages,
  noonMessages: state => state.noonMessages
}

const nightReference: any = (villageId, uid) => {
  const vid = ('00000' + villageId).slice(-5)
  return database.ref(`v${vid}/message_latest/${uid || 'not_login'}`)
}

const noonReference: any = villageId => {
  const vid = ('00000' + villageId).slice(-5)
  return database.ref(`v${vid}/messages/`)
}

export default {
  state,
  mutations,
  actions,
  getters
}
