import { GET_POSITION, GET_TITLE } from './queries';

const resolvers = {
  Mutation: {
    setPosition: (_, { position }, { cache }) => {
      const card = cache.readQuery({ query: GET_POSITION })
      cache.writeQuery({
        query: GET_POSITION,
        data: {
          card: {
            ...card,
            position,
            __typename: "Card"
          }
        }
      })
      return null
    },
    setTitle: (_, { title }, { cache }) => {
      const card = cache.readQuery({ query: GET_TITLE })
      cache.writeQuery({
        query: GET_TITLE,
        data: {
          card: {
            ...card,
            title,
            __typename: "Card"
          }
        }
      })
      return null
    }
  }
}

export default resolvers