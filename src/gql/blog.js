import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getBlogs = async({search, skip}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {search, skip},
                query: gql`
                    query ($search: String, $skip: Int) {
                        blogs(search: $search, skip: $skip) {
                            _id
                            image
                            text
                            title
                            createdAt
                            url
                          }
                    }`,
            })
        return res.data.blogs
    } catch(err){
        console.error(err)
    }
}

export const deleteBlog = async(ids)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: {_id: ids},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteBlog(_id: $_id) 
                    }`})
        return res.data.deleteBlog
    } catch(err){
        console.error(err)
    }
}

export const addBlog = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($image: Upload!, $text: String!, $title: String!, $url: String) {
                        addBlog(image: $image, text: $text, title: $title, url: $url) {
                            _id
                            image
                            text
                            title
                            createdAt
                            url
                        }
                    }`})
        return res.data.addBlog
    } catch(err){
        console.error(err)
    }
}