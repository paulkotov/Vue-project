import Vue from 'vue';
import * as types from './action-types';

export default {
  [types.SET_ERRORS](state, data = {}) {
    state.errors = data;
  },
  [types.CLEAR_ERRORS](state) {
    state.errors = {};
  },
  [types.SET_MAIN_LANDING_CONTENT](state, data) {
    state.mainLanding.blocks = data;
  },
  [types.SET_MAIN_LANDING_ADDITIONAL](state, data) {
    state.mainLanding.additional = data;
  },
  [types.SET_USER_HOME_PAGE_CONTENT](state, { banners }) {
    state.homepage.userBanners = banners;
  },
  [types.SET_EXPERT_HOME_PAGE_CONTENT](state, {
    expertHomepageData,
    assignedExpertHomepageData,
    banner
  }) {
    state.homepage.expertBanner = banner;
    state.homepage.expertHomepageData = expertHomepageData;
    state.homepage.assignedExpertHomepageData = assignedExpertHomepageData;
  },
  [types.ADD_EXPERT_DEMANDS](state, { expertDemandsData }) {
    state.homepage.expertHomepageData = {
      ...state.homepage.expertHomepageData,
      cards: [...state.homepage.expertHomepageData.cards, ...expertDemandsData.cards],
      isLastPage: expertDemandsData.isLastPage,
      cardCount: expertDemandsData.cardCount
    };
  },
  [types.ADD_ASSIGNED_EXPERT_DEMANDS](state, { expertAssignedDemandsData }) {
    state.homepage.assignedExpertHomepageData = {
      ...state.homepage.assignedExpertHomepageData,
      cards: [...state.homepage.assignedExpertHomepageData.cards, ...expertAssignedDemandsData.cards],
      isLastPage: expertAssignedDemandsData.isLastPage,
      cardCount: expertAssignedDemandsData.cardCount
    };
  },
  [types.SET_EXPERT_DEMANDS](state, { expertDemandsData }) {
    state.homepage.expertHomepageData = {
      cards: expertDemandsData.cards,
      isLastPage: expertDemandsData.isLastPage,
      cardCount: expertDemandsData.cardCount
    };
  },
  [types.SET_ASSIGNED_EXPERT_DEMANDS](state, { expertAssignedDemandsData }) {
    state.homepage.assignedExpertHomepageData = {
      cards: expertAssignedDemandsData.cards,
      isLastPage: expertAssignedDemandsData.isLastPage,
      cardCount: expertAssignedDemandsData.cardCount
    };
  },
  [types.SET_HOMEPAGE_DATA_LOADING](state, { field, isLoading }) {
    state.homepage[field].isLoading = isLoading;
  },
  [types.SET_MESSELECTIONS_DATA](state, mesSelectionsData) {
    state.mesSelectionsPage = mesSelectionsData.data;
  },
  setSortingEntitiesPage(state, { type, field, direction }) {
    Vue.set(state.entitiesPage.sorting[type], field, direction);
  },
  resetSortingEntitiesPage(state, { type }) {
    state.entitiesPage.sorting[type] = {};
  }
};
