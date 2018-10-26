import { get } from 'lodash';
import { getString } from '@/utils';

export const userHomepageBannersMapper = ({ data: { data: responseData } }) => {
  const { mainLandingBlocks } = responseData;
  const blocks = mainLandingBlocks.sort(({ wegiht: leftWegiht }, { wegiht: rightWegiht }) => leftWegiht - rightWegiht);
  return {
    topBanner: {
      image: getString(blocks[0], 'picture.file'),
      title: getString(blocks[0], 'title'),
      subtitle: getString(blocks[0], 'subtitle'),
      description: getString(blocks[0], 'description'),
      blockButton: getString(blocks[0], 'blockButton'),
      blockEnabled: get(blocks[0], 'blockEnabled', false)
    },
    expertFeaturesBanner: {
      items: get(blocks[1], 'mainLandingItems', []),
      blockEnabled: get(blocks[1], 'blockEnabled', false)
    },
    shoppersBanner: {
      image: getString(blocks[2], 'picture.file'),
      title: getString(blocks[2], 'title'),
      description: getString(blocks[2], 'description'),
      items: get(blocks[2], 'mainLandingItems', []),
      blockButton: getString(blocks[2], 'blockButton'),
      blockEnabled: get(blocks[2], 'blockEnabled', false)
    },
    quizBanner: {
      image: getString(blocks[3], 'picture.file'),
      title: getString(blocks[3], 'title'),
      description: getString(blocks[3], 'description'),
      blockButton: getString(blocks[3], 'blockButton'),
      blockEnabled: get(blocks[3], 'blockEnabled', false)
    }
  };
};

export const userHomepageContentMapper = ({ data: { data: { lastTeeps, experts, topTeeps } } }) => ({
  lastTeeps,
  experts,
  topTeeps
});

export const expertHomepageBannerMapper = ({ data: { data: { mainLandingBlocks } } }) => ({
  image: getString(mainLandingBlocks[0], 'picture.file'),
  title: getString(mainLandingBlocks[0], 'title'),
  blockEnabled: get(mainLandingBlocks[0], 'blockEnabled', false)
});

export const expertHomepageDataMapper = ({ data: { data, additional } }) => ({
  cards: data.map(({
    id, user: { firstname, lastname }, createdAt, description, points, type, images, dateClosed, mission, status
  }) => ({
    createdAt,
    dateClosed,
    description,
    id,
    images,
    mission,
    points,
    status,
    type,
    username: lastname ? `${firstname} ${lastname[0]}.` : firstname || ''
  })),
  cardCount: additional.pagination.total,
  isLastPage: additional.pagination.isLastPage,
  isLoading: false
});

// export const mesSelections = ({ data: { data } }) => ({
//   data: data.map(({
//     createdAt,
//     countUnreadMessages,
//     lastTeepBuilderMessage,
//     mission,
//     minPrice,
//     maxPrice,
//     points,
//     teeps,
//     type,
//     user
//   }) => ({
//     createdAt,
//     countUnreadMessages,
//     lastTeepBuilderMessage: { author: { firstname, lastname, isOnline, pictureFull }, text, type },
//     mission,
//     minPrice,
//     maxPrice,
//     points,
//     teeps,
//     type,
//     user: { firstname: user.firstname, lastname: user.lastname, isOnline: user.isOnline, pictureFull: user.pictureFull }
//   }))
// });

export const mesSelections = ({ data: { data } }) => {
  let mesSelectionsData = { data: [] };
  // let lastTeepBuilderMessage = null;
  let lastTeepBuilderMessageDefault = {
    author: {
      firstname: 'John',
      lastname: 'Smith',
      isOnline: false,
      isExpert: false,
      pictureFull: ''
    },
    text: null,
    type: null
  };
  // console.log(data);
  data.map(item => {
    // console.log(item.lastTeepBuilderMessage);
    let user = {
      firstname: item.user.firstname,
      lastname: item.user.lastname,
      isOnline: item.user.isOnline,
      isExpert: item.user.isExpert,
      pictureFull: item.user.pictureFull
    };
    let lastTeepBuilderMessage = item.lastTeepBuilderMessage
      ? {
        author: {
          firstname: item.lastTeepBuilderMessage.author.firstname,
          lastname: item.lastTeepBuilderMessage.author.lastname,
          isOnline: item.lastTeepBuilderMessage.author.isOnline,
          isExpert: item.lastTeepBuilderMessage.author.isExpert,
          pictureFull: item.lastTeepBuilderMessage.author.pictureFull
        },
        type: item.lastTeepBuilderMessage.type,
        text: item.lastTeepBuilderMessage.text
      }
      : lastTeepBuilderMessageDefault;
    let props = {
      createdAt: item.createdAt,
      countUnreadMessages: item.countUnreadMessages,
      mission: item.mission,
      minPrice: item.minPrice,
      maxPrice: item.maxPrice,
      points: item.points,
      teeps: item.teeps,
      type: item.type
    };
    mesSelectionsData.data.push(Object.assign({},
      { ...props },
      { user: { ...user } },
      { lastTeepBuilderMessage: { ...lastTeepBuilderMessage } }));
  });
  return mesSelectionsData;
};
