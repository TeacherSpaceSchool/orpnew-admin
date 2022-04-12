import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getInspector = async({_id}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID!) {
                        inspector(_id: $_id) {
                            _id
                            createdAt
                            user {login role status}
                            name
                            phone
                        }
                    }`,
            })
        return res.data.inspector
    } catch(err){
        console.error(err)
    }
}

export const getInspectors = async({search, skip, limit}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {search, skip, limit},
                query: gql`
                    query ($search: String, $skip: Int, $limit: Int) {
                        inspectors(search: $search, skip: $skip, limit: $limit) {
                            _id
                            createdAt
                            user {login role status}
                            name
                            phone
                          }
                    }`,
            })
        return res.data.inspectors
    } catch(err){
        console.error(err)
    }
}

export const getInspectorsCount = async({search}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {search},
                query: gql`
                    query($search: String) {
                        inspectorsCount(search: $search)
                    }`,
            })
        return res.data.inspectorsCount
    } catch(err){
        console.error(err)
    }
}

export const deleteInspector = async(_id)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteInspector(_id: $_id)
                    }`})
        return res.data.deleteInspector
    } catch(err){
        console.error(err)
    }
}

export const addInspector = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($login: String!, $password: String!, $phone: String!, $name: String!) {
                        addInspector(login: $login, password: $password, phone: $phone, name: $name)
                    }`})
        return res.data.addInspector
    } catch(err){
        console.error(err)
    }
}

export const setInspector = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $login: String, $password: String, $phone: String, $name: String) {
                        setInspector(_id: $_id, login: $login, password: $password, phone: $phone, name: $name) 
                    }`})
        return res.data.setInspector
    } catch(err){
        console.error(err)
    }
}