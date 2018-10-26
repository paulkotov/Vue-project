export default {
  mainLanding: state => state.mainLanding,
  mainLandingAdditional: state => state.mainLanding.additional,
  homepage: state => state.homepage,
  expertHomepage: state => ({
    banner: state.homepage.expertBanner,
    expertHomepageCards: state.homepage.expertHomepageData.cards,
    expertCardsCount: state.homepage.expertHomepageData.cardCount,
    isLastExpertCards: state.homepage.expertHomepageData.isLastPage,
    isExpertCardsLoading: state.homepage.expertHomepageData.isLoading,
    assignedExpertHomepageCards: state.homepage.assignedExpertHomepageData.cards,
    assignedExpertCardsCount: state.homepage.assignedExpertHomepageData.cardCount,
    isLastAssignedExpertCards: state.homepage.assignedExpertHomepageData.isLastPage,
    isAssignedExpertCardsLoading: state.homepage.assignedExpertHomepageData.isLoading
  }),
  userHomepage: (state, _, __, rootGetters) => ({
    banners: state.homepage.userBanners,
    topTeeps: rootGetters['teeps/topTeeps'],
    lastTeeps: rootGetters['teeps/lastTeeps'],
    experts: rootGetters['experts/experts']
  }),
  errors: state => state.errors,
  getTopEntitiesPage: (state, getters, rootState, rootGetters) => (expertId) => ({
    teeps: rootGetters['top/getTopList'](expertId, 'teep').map(teep => teep.entity),
    experts: rootGetters['top/getTopList'](expertId, 'expert').map(expert => expert.expert)
  }),
  mesSelectionsPage: state => ({
    inWork: state.mesSelectionsPage.inWork,
    new: state.mesSelectionsPage.new,
    done: state.mesSelectionsPage.done
  }),
  getEntitiesPage: (state, getters, rootState, rootGetters) => ({
    teeps: rootGetters['teeps/teeps'],
    experts: rootGetters['experts/experts']
  }),
  getEntitiesPageSorting: state => (entityType) => {
    return state.entitiesPage.sorting[entityType];
  }
};
