import { createServer } from '@graphql-yoga/node'

const spamWords = ['Акции',
    'Банкротство',
    'Без вложений',
    'Без обязательств',
    'Без опыта', 
    'Без риска',
    'Безлимитный',
    'Беспроцентный кредит',
    'Безрисковый',
    'Бесплатная консультация',
    'Бесплатная установка',
    'Бесплатно',
    'Избавьтесь',
    'Излечени',
    'Инструкции',
    'Информация по вашему запросу',
    'Ипотека',
    'Казино',
    'Карта',]

const messages = []

const typeDefs = `
    type Message{
        id:ID!,
        author: String!,
        text: String!,
        spam: Boolean!,
    }

    type Query {
        messages: [Message!]
    }

    type Mutation{
        postMessage(author: String!, text: String!): ID!
    }
`

const resolvers = {
    Query: {
        messages: () => messages,
    },
    Mutation: {
        postMessage: (parents, {author, text}) =>{
            const id = messages.length
            let spam = false
            spamWords.forEach(spamWord => {
                if(text.includes(spamWord)) {
                    spam = true
                }
            })
            messages.push({
                id, 
                author,
                text,
                spam,
            })
            return id;
        }
    }
}

const app = createServer ({
    schema: {
        typeDefs,
        resolvers
    },
    port: 5000
})

app.start()


