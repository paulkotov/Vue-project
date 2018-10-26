export const defaultState = {
  mainLanding: {
    blocks: null,
    additional: null
  },
  homepage: {
    expertHomepageData: {
      cards: [],
      totalCardsCount: 0,
      isLoading: false
    },
    assignedExpertHomepageData: {
      cards: [],
      totalCardsCount: 0,
      isLoading: false
    },
    expertBanner: {
      image: '',
      title: '',
      blockEnabled: false
    },
    userBanners: {
      topBanner: {
        image: '',
        description: '',
        title: '',
        subtitle: '',
        blockButton: '',
        blockEnabled: false
      },
      expertFeaturesBanner: {
        items: [],
        blockEnabled: false
      },
      shoppersBanner: {
        image: '',
        title: '',
        description: '',
        items: [],
        blockEnabled: false
      },
      quizBanner: {
        image: '',
        title: '',
        description: '',
        blockButton: '',
        blockEnabled: false
      }
    }
  },
  mesSelectionsPage: {
    inWork: [],
    new: [],
    done: []
  },
  errors: {},
  entitiesPage: {
    sorting: {
      teeps: {},
      experts: {}
    }
  }
};
