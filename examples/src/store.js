import { createQueryStore } from './hooks'

export default createQueryStore({
  auth: {
    token: null,
    user: null,
  }
});