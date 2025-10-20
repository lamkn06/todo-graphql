import { PubSub } from 'graphql-subscriptions';

export const pubsub = new PubSub();

export const TODO_EVENTS = {
  TODO_FINISHED: 'TODO_FINISHED',
} as const;
