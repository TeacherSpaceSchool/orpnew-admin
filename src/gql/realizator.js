import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getRealizator = async({_id}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID!) {
                        realizator(_id: $_id) {
                            _id
                            createdAt
                            name
                            phone
                            region {_id name guid}
                            point {_id name guid}
                            user {login role status}
                            guid
                            guidRegion
                            guidPoint
                          }
                    }`,
            })
        return res.data.realizator
    } catch(err){
        console.error(err)
    }
}

export const getRealizators = async({region, search, skip, point, limit}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {region, search, skip, point, limit},
                query: gql`
                    query ($region: ID, $search: String, $skip: Int, $point: ID, $limit: Int) {
                        realizators(region: $region, search: $search, skip: $skip, point: $point, limit: $limit) {
                            _id
                            name
                            createdAt
                            guid
                            region {name}
                            point {name}
                        }
                    }`,
            })
        return res.data.realizators
    } catch(err){
        console.error(err)
    }
}

export const getRealizatorsCount = async({region, search, point}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {region, search, point},
                query: gql`
                    query($region: ID, $search: String, $point: ID) {
                        realizatorsCount(region: $region, search: $search, point: $point)
                    }`,
            })
        return res.data.realizatorsCount
    } catch(err){
        console.error(err)
    }
}

export const setRealizator = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $phone: String, $login: String, $password: String, $region: ID, $guidRegion: String, $point: ID, $guidPoint: String) {
                        setRealizator(_id: $_id, phone: $phone, login: $login, password: $password, region: $region, guidRegion: $guidRegion, point: $point, guidPoint: $guidPoint) 
                    }`})
        return res.data.setRealizator
    } catch(err){
        console.error(err)
    }
}