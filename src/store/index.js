import actions from './actions';
import mutations from './mutations';
import getters from './getters';
import { defaultState } from './const';

// initial state
const state = () => ({
  ...defaultState
});

export default {
  state,
  actions,
  mutations,
  getters
};
