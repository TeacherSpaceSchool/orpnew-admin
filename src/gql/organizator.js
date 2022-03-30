import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getOrganizator = async({_id}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID!) {
                        organizator(_id: $_id) {
                            _id
                            createdAt
                            name
                            region {_id name guid}
                            user {login role status}
                            guid
                            guidRegion
                          }
                    }`,
            })
        return res.data.organizator
    } catch(err){
        console.error(err)
    }
}

export const getOrganizators = async({region, search, skip, limit}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {region, search, skip, limit},
                query: gql`
                    query ($region: ID, $search: String, $skip: Int, $limit: Int) {
                        organizators(region: $region, search: $search, skip: $skip, limit: $limit) {
                            _id
                            name
                            guid
                            createdAt
                            region {name}
                        }
                    }`,
            })
        return res.data.organizators
    } catch(err){
        console.error(err)
    }
}

export const getOrganizatorsCount = async({region, search}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {region, search},
                query: gql`
                    query($region: ID, $search: String) {
                        organizatorsCount(region: $region, search: $search)
                    }`,
            })
        return res.data.organizatorsCount
    } catch(err){
        console.error(err)
    }
}

export const setOrganizator = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $login: String, $password: String, $region: ID, $guidRegion: String, $status: String) {
                        setOrganizator(_id: $_id, login: $login, password: $password, region: $region, guidRegion: $guidRegion, status: $status) 
                    }`})
        return res.data.setOrganizator
    } catch(err){
        console.error(err)
    }
}