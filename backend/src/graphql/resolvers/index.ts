import merge from 'lodash.merge';
import conversationResolvers from './conversation';
import messageResolvers from './message';
import userResolvers from './user';

const resolvers = merge({}, userResolvers, messageResolvers, conversationResolvers);

export default resolvers;