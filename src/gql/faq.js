import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getFaqs = async({search, skip}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {search, skip},
                query: gql`
                    query ($search: String, $skip: Int) {
                        faqs(search: $search, skip: $skip) {
                            _id
                            createdAt
                            url
                            title
                            video
                            typex
                          }
                    }`,
            })
        return res.data.faqs
    } catch(err){
        console.error(err)
    }
}

export const deleteFaq = async(ids)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: {_id: ids},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteFaq(_id: $_id)
                    }`})
        return res.data.deleteFaq
    } catch(err){
        console.error(err)
    }
}

export const addFaq = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($file: Upload, $title: String!, $typex: [String]!, $video: String) {
                        addFaq(file: $file, title: $title, typex: $typex, video: $video) {
                            _id
                            createdAt
                            url
                            title
                            video
                            typex
                        }
                    }`})
        return res.data.addFaq
    } catch(err){
        console.error(err)
    }
}

export const setFaq = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $file: Upload, $title: String, $typex: [String], $video: String) {
                        setFaq(_id: $_id, file: $file, title: $title, typex: $typex, video: $video) 
                    }`})
        return res.data.setFaq
    } catch(err){
        console.error(err)
    }
}