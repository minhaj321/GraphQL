const graphql= require('graphql');
const _= require('lodash');
const MongoBooks = require('./../models/book');
const MongoAuthors = require('./../models/author')

const  { 
GraphQLID,
GraphQLInt,
GraphQLObjectType,
GraphQLNonNull,
GraphQLList,
GraphQLSchema,
GraphQLString
} = graphql;

// dummy data
// const Mybooks=[
//     {name: 'Name of the Wind' , genre :'Fantasy' , id : '1' , authorId : '2'},
//     {name: 'The final empire' , genre :'Fantasy' , id : '2' , authorId : '2'},
//     {name: 'The long earth' , genre :'Sci-Fi' , id : '3' , authorId : '1'},
//     {name: 'Gravity' , genre :'Sci-Fi' , id : '4' , authorId : '3'},
// ];

// const Authors=[
//     {name: 'Allama Iqbal' , age : 42 , id : '1'},
//     {name: 'Quintin Decock' , age : 48 , id : '2'},
//     {name: 'Lord MountBatten' , age : 66 , id : '3'},
// ]


const BookType = new GraphQLObjectType({
    name : 'book',
    fields : ()=>({
        id :    {type : GraphQLString},
        name :  {type : GraphQLString},
        genre : {type : GraphQLString},
        author :{
            type : AuthorType,
            resolve(parent,args){
                return MongoAuthors.findById(parent.authorId);
                // return _.find(Authors,{id:parent.authorId})
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name : 'author',
    fields : ()=>({
        id :    {type : GraphQLString},
        name :  {type : GraphQLString},
        age :   {type : GraphQLInt},
        book:   {
            type :new GraphQLList(BookType),
            resolve(parent,args){
                return MongoBooks.find({authorId:parent.id})
                // return _.filter(Mybooks,{authorId:parent.id})
            }
        }
    })
})



const rootQuery = new GraphQLObjectType({
    name : 'MyrootQuery',
    fields:{
        book:{
            type:BookType,
            args:{
                id:{type:GraphQLID}
            },
            resolve(parent,args){
            // return  _.find(Mybooks,{id:args.id});
                return MongoBooks.findById(args.id);
        }
        },
        author:{
            type:AuthorType,
            args:{
                id:{type:GraphQLID}
            },
            resolve(parent,args){
            // return  _.find(Authors,{id:args.id});
            return MongoAuthors.findById(args.id);
            }
        },
        authors:{
            type :new GraphQLList(AuthorType),
            resolve(parent,args){
                // return Authors
                return MongoAuthors.find();
            }
        },
        books:{
            type : new GraphQLList(BookType),
            resolve(parent,args){
                // return Mybooks
                return MongoBooks.find();
            }
        }
    
    }
})

const mutation = new GraphQLObjectType({
    name : 'mutation',
    fields:{
        addAuthor:{
            type:AuthorType,
            args:{
                name : { type:new GraphQLNonNull(GraphQLString) },
                age : { type :new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent,args){
                let author= new MongoAuthors({
                    name : args.name,
                    age  : args.age                    
                });
                return author.save();
            }
        },
        addBook:{
            type:BookType,
            args:{
                name :      { type  : new GraphQLNonNull(GraphQLString) },
                genre :     { type  : new GraphQLNonNull(GraphQLString) },
                authorId  : { type  : new GraphQLNonNull(GraphQLID)  },                    
            },
            resolve(parent,args){
                let book= new MongoBooks({
                    name : args.name,
                    genre  : args.genre,                    
                    authorId  : args.authorId,                    
                });
                return book.save();
            }
        },
        removeBook:{
            type:BookType,
            args:{
                id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent,args){
                return MongoBooks.findByIdAndRemove(args.id)
            }
        },
        updateBook:{
            type:BookType,
            args:{
                id:{        type:GraphQLString},
                name:{    type:GraphQLString}
            },
            resolve(parent,args){
                // console.log(args)
                return MongoBooks.findByIdAndUpdate(args.id,{name:args.name})
            }
        }        
    }
})

module.exports = new GraphQLSchema({
    query:rootQuery,
    mutation:mutation
})