import { GET_CARD, GET_SETTINGS } from './queries';

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
    },
    setSetting: (_, { fieldName, fieldValue }, { cache } ) => {
      const { settings } = cache.readQuery({ query: GET_SETTINGS })
      cache.writeQuery({
        query: GET_SETTINGS,
        data: {
          settings: {
            ...settings,
            [fieldName]: fieldValue
          }
        }
      })
      return null
    }
  }
}

export default resolvers