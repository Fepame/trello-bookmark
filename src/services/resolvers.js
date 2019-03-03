import { GET_SETTINGS } from './queries'

const resolvers = {
  Mutation: {
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