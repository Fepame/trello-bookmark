import { GET_CARD } from './queries';

const resolvers = {
  Mutation: {
    setCardField: (_, { fieldName, fieldValue }, { cache } ) => {
      const { card } = cache.readQuery({ query: GET_CARD })
      cache.writeQuery({
        query: GET_CARD,
        data: {
          card: {
            ...card,
            [fieldName]: fieldValue
          }
        }
      })
      return null
    }
  }
}

export default resolvers