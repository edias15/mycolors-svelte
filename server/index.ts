import { ApolloServer, gql } from 'apollo-server'

const typeDefs = gql`
  type Color {
    hexCode: String,
    colorName: String
  }

  type Query {
    colors: [Color],
  }
`
const colors = [
  {
    hexCode: '#FF0000',
    colorName: 'Red'
  },
  {
    hexCode: '#00FF00',
    colorName: 'Green'
  },
  {
    hexCode: '#0000FF',
    colorName: 'Blue'
  }
]

const resolvers = {
  Query: {
    colors: () => colors,
  }
}
const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})


