import * as actionType from '~/store/action-types'
import firebase from '~/plugins/firebase'
import Village from '~/@types/village'
import SituationAsParticipant from '~/@types/situation-as-participant'
import CharaImage from '~/@types/chara-image'

const database = firebase.database()
let villageRef: any = null
let abilityRef: any = null

const state: {
  villageId: number
  village: Village | null
  situation: SituationAsParticipant | null
  participantIdImgMap: Map<number, CharaImage>
} = {
  villageId: 0,
  village: null,
  situation: null,
  participantIdImgMap: new Map<number, CharaImage>()
}

const mutations = {
  initVillage(state, { villageId, village }) {
    state.villageId = villageId
    state.village = village
    state.participantIdImgMap = new Map(
      village.participants.member_list.map(p => [p.id, p.chara.image])
    )
  },
  initSituation(state, { situation }) {
    state.situation = situation
  },
  terminateVillage(state) {
    state.villageId = 0
    state.village = null
    state.situation = null
  }
}

const actions = {
  async [actionType.INIT_VILLAGE](
    { state, commit },
    { villageId, uid, dayChangeCallback }
  ) {
    if (villageRef) {
      villageRef.off()
      await commit('terminateVillage')
    }
    villageRef = dbvillageReference(villageId)
    abilityRef = dbAbilityReference(villageId, uid)

    const self = <any>this
    await villageRef.on('value', async snapshot => {
      await Promise.all([
        fetchVillage(villageId, self, state, commit, dayChangeCallback),
        fetchSituation(villageId, self, commit)
      ])
    })
    await abilityRef.on('value', snapshot => {
      fetchSituation(villageId, self, commit)
    })
  },
  async [actionType.TERMINATE_VILLAGE]({ commit }) {
    if (villageRef) villageRef.off()
    if (abilityRef) abilityRef.off()
    await commit('terminateVillage')
  }
}

const getters = {
  villageId: state => state.villageId,
  village: state => state.village,
  latestDay: state =>
    state.village
      ? state.village.days.list[state.village.days.list.length - 1]
      : null,
  situation: state => state.situation,
  participantIdImgMap: state => state.participantIdImgMap
}

const dbvillageReference: any = villageId => {
  const vid = ('00000' + villageId).slice(-5)
  return database.ref(`v${vid}/village_latest/`)
}

const dbAbilityReference: any = (villageId, uid) => {
  const vid = ('00000' + villageId).slice(-5)
  return database.ref(`v${vid}/situation_latest/${uid || 'not_login'}`)
}

const fetchVillage: any = async (
  villageId,
  app,
  state,
  commit,
  dayChangeCallback
) => {
  const before: Village | null = state.village
  const after: Village = await app.$axios.$get(`/village/${villageId}`)
  await commit('initVillage', {
    villageId,
    village: after
  })
  if (!before || before.days.list.length < after.days.list.length) {
    dayChangeCallback()
  }
}

const fetchSituation: any = async (villageId, app, commit) => {
  await commit('initSituation', {
    situation: await app.$axios.$get(`/village/${villageId}/situation`)
  })
}

export default {
  state,
  mutations,
  actions,
  getters
}
