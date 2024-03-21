import { createQueryDispatcher } from '../hooks'

export default createQueryDispatcher({
  name: "auth", // !IMPORTANT Must match with store key object name
  actions: {
    login: (state, payload) => {
      state.token = payload.token;
      state.user = payload.user;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
    }
  }
});