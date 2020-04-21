import { GraphQLServer } from 'graphql-yoga'

// user data
const users = [
    {
        "id": "1",
        "name": "Daniel Boadzie",
        "email": "boadzie@graph.com",
    },
    {
        "id": "2",
        "name": "Sam Smith",
        "email": "samsmith@graph.com",
        "age": 20
    },
    {
        "id": "3",
        "name": "Jollie Marts",
        "email": "jollie@graph.com",
        "age": 19
    }
]

const posts = [
    {
        "id":"10",
        "title":"The way to life",
        "body": "The way to life in a paradise Earth is awesome",
        "published": true,
        "author": "3",
        "comment": "100"
    },
    {
        "id":"11",
        "title":"The best sex position",
        "body": "The best sex position is doggystyle :)",
        "published": true,
        "author": "2",
        "comment": "103"
    },
    {
        "id":"12",
        "title":"The way to her pants",
        "body": "The way to her pants is usually through your personality",
        "published": false,
        "author": "1",
        "comment": "102"
    }
]

const comments = [
    {
        "id": "100",
        "text": "I love this article. keep it up!!",
        "author": "1",
        "post": "10"
    },
    {
        "id": "101",
        "text": "Thank you",
        "author": "2",
        "post":"12"
    },
    {
        "id": "102",
        "text": "Great writing!!",
        "author": "1",
        "post": "11"
    },
    {
        "id": "103",
        "text": "I am glad you like it!!",
        "author": "3",
        "post": "12"
    }
]

// typedefs
const typeDefs = `
   type Query {
       users(query: String): [User!]!
       me: User!
       post: Post!
       posts(query: String): [Post!]! 
       comments: [Comment!]!
   }

   type User{
       id: ID!
       name: String!
       email: String!
       age: Int
       posts: [Post!]!
       comments: [Comment!]!
   }

   type Post{
       id: ID!
       title: String!
       body: String!
       published: Boolean!
       author: User!
       comments: [Comment!]!
   }

   type Comment{
       id: ID!
       text: String!
       author: User!
       post: Post!
   }
`


// resolvers
const resolvers = {
    Query: {
    users(parent, args, ctx, info){
        if (!args.query){
           return users
        }

        return users.filter(user => {
            return user.name.toLowerCase().includes(args.query.toLowerCase())
        })
    },
    me(){
        return {
            id: "122338",
            name: 'Boadzie Daniel',
            email: 'boadzie@graph.com',
            // age: 20
        }
    },
    posts(parent, args, ctx, info){
        if(!args.query){
            return posts
        }

        return posts.filter(post => {
            const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
            const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
            return isTitleMatch || isBodyMatch
        })
    },
    comments(parent, args, ctx, info){
        return comments
    }
 },
 Post: {
     author(parent, args, ctx, info){
       return users.find((user)=> {
           return user.id === parent.author
       })
     },
     comments(parent, args, ctx, info){
       return comments.filter(comment => {
           return comment.post === parent.id
       })
     }
 },
 User: {
     posts(parent, args, ctx, info){
        return posts.filter(post => {
            return post.author === parent.id
        })
     },

     comments(parent, args, ctx, info){
        return comments.filter(comment => {
            return comment.author === parent.id
        })
     }
 },
 Comment: {
     author(parent, args, ctx, info){
         return users.find(user => {
             return user.id === parent.author
         })
     },
     post(parent, args, ctx, info){
        return posts.find(post => {
            return post.id === parent.post
        })
     }
 }
}


const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('The app is up ')
})