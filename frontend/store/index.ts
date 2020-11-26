import Vuex from 'vuex'
import auth from './modules/auth'
import messages from './modules/messages'
import village from './modules/village'

const store = () =>
  new Vuex.Store({
    modules: {
      auth,
      messages,
      village
    }
  })
export default store
