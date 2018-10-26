import * as types from './action-types';
import * as mappers from './mappers';
import { contentRequest, demandsRequest } from '@/store/services';
import config from '@/app/config';

/**
 * Get content for landing page
 * @param {object} context
 * @param  {object} params
 * @param {string} params.role - ambassador|dermo_advisor|market|showroom|anonymous
 * @returns {Promise.<void>}
 */
const getMainLanding = async ({ commit }, { role }) => {
  try {
    const { data: responseData } = await contentRequest.getMainLanding({ role });

    commit(types.SET_MAIN_LANDING_CONTENT, responseData.data.mainLandingBlocks);
    commit(types.SET_MAIN_LANDING_ADDITIONAL, responseData.additional);
  } catch (error) {
    console.warn('getMainLanding', error);
  }
};

/**
 * Get content for user home page
 * @param {object} context
 * @returns {Promise.<void>}
 */
const getUserHomepage = async ({ commit, dispatch }) => {
  try {
    const [
      homepageData,
      banners
    ] = await Promise.all([
      contentRequest.getHomepage().then(mappers.userHomepageContentMapper),
      contentRequest.getMainLanding({ role: 'ambassador' }).then(mappers.userHomepageBannersMapper)
    ]);

    commit(types.SET_USER_HOME_PAGE_CONTENT, { banners });

    await Promise.all([
      dispatch('teeps/setTeepsFromHomepage', homepageData, { root: true }),
      dispatch('experts/setExpertsFromHomepage', homepageData, { root: true })
    ]);
  } catch (error) {
    console.warn('getUserHomepage', error);
  }
};

/**
 * Refresh content for user home page
 * @param {object} context
 * @returns {Promise.<void>}
 */
const refreshUserHomepageContent = async ({ dispatch }) => {
  try {
    const homepageData = await contentRequest.getHomepage().then(mappers.userHomepageContentMapper);

    await Promise.all([
      dispatch('teeps/setTeepsFromHomepage', homepageData, { root: true }),
      dispatch('experts/setExpertsFromHomepage', homepageData, { root: true })
    ]);
  } catch (error) {
    console.warn('refreshUserHomepageContent', error);
  }
};

/**
 * Get content for expert home page
 * @param {object} context
 * @returns {Promise.<void>}
 */
const getExpertHomepage = async ({ commit }) => {
  try {
    const [
      expertHomepageData,
      assignedExpertHomepageData,
      banner
    ] = await Promise.all([
      demandsRequest.getDemands({ category: 'new_expert', limit: 6 }).then(mappers.expertHomepageDataMapper),
      demandsRequest.getDemands({ category: 'new_assigned_expert', limit: 3 }).then(mappers.expertHomepageDataMapper),
      contentRequest.getMainLanding({ role: 'market' }).then(mappers.expertHomepageBannerMapper)
    ]);

    commit(types.SET_EXPERT_HOME_PAGE_CONTENT, {
      expertHomepageData,
      assignedExpertHomepageData,
      banner
    });
  } catch (error) {
    console.warn('getExpertHomepage', error);
  }
};

/**
 * Get content for mes selections page
 * @param {object} context
 * @returns {Promise.<void>}
 */
const getMesSelections = async ({ commit }) => {
  try {
    const mesSelectionsDataInWork = await demandsRequest.getDemands({
      category: 'in_work',
      limit: 3,
      offset: 0
    }).then(mappers.mesSelections);
    const mesSelectionsDataNew = await demandsRequest.getDemands({
      category: 'new',
      limit: 3,
      offset: 0
    }).then(mappers.mesSelections);
    const mesSelectionsDataDone = await demandsRequest.getDemands({
      category: 'done',
      limit: 3,
      offset: 0
    }).then(mappers.mesSelections);
    commit(types.SET_MESSELECTIONS_DATA, {
      data: {
        inWork: mesSelectionsDataInWork.data,
        new: mesSelectionsDataNew.data,
        done: mesSelectionsDataDone.data
      }
    });
    // console.log(mesSelectionsData);
  } catch (error) {
    console.warn('getMesSelectionsPage', error);
  }
};

/**
 * Load 9 cards for expert demands block
 * @param {object} context
 * @param {object} state
 * @returns {Promise.<void>}
 */
const loadMoreExpertDemands = async ({ commit, state }) => {
  try {
    commit(types.SET_HOMEPAGE_DATA_LOADING, { field: 'expertHomepageData', isLoading: true });
    const expertDemandsData = await demandsRequest.getDemands({
      category: 'new_expert',
      limit: 9,
      offset: state.homepage.expertHomepageData.cards.length
    }).then(mappers.expertHomepageDataMapper);
    commit(types.ADD_EXPERT_DEMANDS, {
      expertDemandsData
    });
  } catch (error) {
    console.warn('loadMoreExpertDemands', error);
  } finally {
    commit(types.SET_HOMEPAGE_DATA_LOADING, { field: 'expertHomepageData', isLoading: false });
  }
};

/**
 * Load 9 cards for assigned expert demands block
 * @param {object} context
 * @param {object} state
 * @returns {Promise.<void>}
 */
const loadMoreAssignedExpertDemands = async ({ commit, state }) => {
  try {
    commit(types.SET_HOMEPAGE_DATA_LOADING, { field: 'assignedExpertHomepageData', isLoading: true });
    const expertAssignedDemandsData = await demandsRequest.getDemands({
      category: 'new_assigned_expert',
      limit: 9,
      offset: state.homepage.assignedExpertHomepageData.cards.length
    }).then(mappers.expertHomepageDataMapper);
    commit(types.ADD_ASSIGNED_EXPERT_DEMANDS, {
      expertAssignedDemandsData
    });
  } catch (error) {
    console.warn('loadMoreAssignedExpertDemands', error);
  } finally {
    commit(types.SET_HOMEPAGE_DATA_LOADING, { field: 'assignedExpertHomepageData', isLoading: false });
  }
};

/**
 * Action for try assign to mission(demand) by current user
 * @param {object} context
 * @param {object} params
 * @param {number} params.id mission(demand) id
 * @returns {Promise.<void>}
 */
const applyExpertToDemand = async ({ commit }, { id }) => {
  try {
    await demandsRequest.applyToDemand({ id });
  } catch (error) {
    console.warn('applyExpertToDemand', error);
    commit(types.SET_ERRORS, error.data && error.data.error);
  }
};

/**
 * Update expert demands cards
 * @param {object} context
 * @param {object} state
 * @returns {Promise.<void>}
 */
const updateExpertDemands = async ({ commit, state }) => {
  try {
    commit(types.SET_HOMEPAGE_DATA_LOADING, { field: 'expertHomepageData', isLoading: true });
    const expertDemandsData = await demandsRequest.getDemands({
      category: 'new_expert',
      limit: state.homepage.expertHomepageData.cards.length
    }).then(mappers.expertHomepageDataMapper);
    commit(types.SET_EXPERT_DEMANDS, {
      expertDemandsData
    });
  } catch (error) {
    console.warn('updateExpertDemands', error);
  } finally {
    commit(types.SET_HOMEPAGE_DATA_LOADING, { field: 'expertHomepageData', isLoading: false });
  }
};

/**
 * Update expert assigned demands cards
 * @param {object} context
 * @param {object} state
 * @returns {Promise.<void>}
 */
const updateAssignedExpertDemands = async ({ commit, state }) => {
  try {
    commit(types.SET_HOMEPAGE_DATA_LOADING, { field: 'assignedExpertHomepageData', isLoading: true });
    const expertAssignedDemandsData = await demandsRequest.getDemands({
      category: 'new_assigned_expert',
      limit: state.homepage.assignedExpertHomepageData.cards.length
    }).then(mappers.expertHomepageDataMapper);
    commit(types.SET_ASSIGNED_EXPERT_DEMANDS, {
      expertAssignedDemandsData
    });
  } catch (error) {
    console.warn('updateAssignedExpertDemands', error);
  } finally {
    commit(types.SET_HOMEPAGE_DATA_LOADING, { field: 'assignedExpertHomepageData', isLoading: false });
  }
};

/**
 * Action for remove all errors
 * @param {object} context
 * @returns {Promise.<void>}
 */
const clearErrors = async ({ commit }) => {
  commit(types.CLEAR_ERRORS);
};

/**
 * @param {object} context
 * @param {object} params
 * @param {number} params.id - current teep id
 * @returns {Promise.<void>}
 */
const fetchSectionsPageContent = async ({ dispatch }, { id }) => {
  try {
    await Promise.all([
      dispatch('teeps/fetchTeep', { id }, { root: true }),
      dispatch('teeps/fetchSimilarTeeps', { id }, { root: true })
    ]);
  } catch (error) {
    console.warn('fetchSectionsPageContent', error);
  }
};

async function fetchProfilePageContent({ commit, dispatch, rootGetters, rootState }, userId) {
  await dispatch('user/fetchBeautyProfile', {
    userId: userId
  }, {
    root: true
  });
  await dispatch('user/fetchById', userId, {
    root: true
  });
  await dispatch('partner/fetchById', config.partnerID, {
    root: true
  });

  const user = rootGetters['user/getUserData'](userId).user;
  const isUserExpert = rootGetters['user/isUserExpert'](user);

  if (isUserExpert) {
    await dispatch('user/fetchTeeps', {
      userId: userId,
      limit: rootGetters['user/isItMe'](user) ? 5 : 6
    }, {
      root: true
    });
  }

  if (!isUserExpert) {
    await Promise.all([
      dispatch('top/fetchTopList', {
        expert: userId,
        type: 'teep',
        limit: 6,
        partner: config.partnerID
      }, {
        root: true
      }),
      dispatch('top/fetchTopList', {
        expert: userId,
        type: 'expert',
        limit: 6,
        partner: config.partnerID
      }, {
        root: true
      })
    ]);
  }
}

async function fetchTopEntitiesPageContent({ commit, rootGetters, dispatch }, { expertId }) {
  await Promise.all([
    dispatch('partner/fetchById', config.partnerID, {
      root: true
    }),
    dispatch('top/fetchTopList', {
      type: 'expert',
      expert: expertId,
      limit: 6
    }, {
      root: true
    }),
    dispatch('top/fetchTopList', {
      type: 'teep',
      expert: expertId,
      limit: 6
    }, {
      root: true
    }),
    dispatch('user/fetchById', expertId, {
      root: true
    })
  ]);
}

async function fetchEntitiesPageContent({ commit, dispatch, rootGetters, getters }, params) {
  const fetchTeepsParams = {
    ...params,
    sorting: getters.getEntitiesPageSorting('teeps')
  };

  const fetchExpertsParams = {
    ...params,
    sorting: getters.getEntitiesPageSorting('experts')
  };


  await Promise.all([
    dispatch('partner/fetchById', config.partnerID, {
      root: true
    }),
    dispatch('teeps/fetchTeeps', fetchTeepsParams, {
      root: true
    }),
    dispatch('experts/fetchExperts', fetchExpertsParams, {
      root: true
    })
  ]);
}

function setEntitiesSorting({ commit }, { type, field, direction = 'ASC' }) {
  commit('setSortingEntitiesPage', { type, field, direction });
}

function resetEntitiesSorting({ commit }, { type }) {
  commit('resetSortingEntitiesPage', { type });
}

export default {
  applyExpertToDemand,
  clearErrors,
  getExpertHomepage,
  getMainLanding,
  getUserHomepage,
  refreshUserHomepageContent,
  loadMoreAssignedExpertDemands,
  loadMoreExpertDemands,
  updateAssignedExpertDemands,
  updateExpertDemands,
  fetchSectionsPageContent,
  fetchProfilePageContent,
  fetchTopEntitiesPageContent,
  fetchEntitiesPageContent,
  setEntitiesSorting,
  resetEntitiesSorting,
  getMesSelections
};
