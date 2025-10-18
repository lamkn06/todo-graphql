import { makeExecutableSchema } from '@graphql-tools/schema';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { TodoResolvers } from '../todo/todo.resolver';

const typeSources = loadFilesSync('src/**/*.graphql'); // example: src/modules/**.graphql
const typeDefs = mergeTypeDefs(typeSources);

const resolvers = [TodoResolvers];

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
