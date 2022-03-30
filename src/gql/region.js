import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getRegion = async({_id}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID!) {
                        region(_id: $_id) {
                            _id
                            createdAt
                            name
                            guid
                          }
                    }`,
            })
        return res.data.region
    } catch(err){
        console.error(err)
    }
}

export const getRegions = async({search, skip, free}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {search, skip, free},
                query: gql`
                    query ($search: String, $skip: Int, $free: Boolean) {
                        regions(search: $search, skip: $skip, free: $free) {
                            _id
                            name
                            guid
                            createdAt
                        }
                    }`,
            })
        return res.data.regions
    } catch(err){
        console.error(err)
    }
}

export const getRegionsCount = async({search}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {search},
                query: gql`
                    query($search: String) {
                        regionsCount(search: $search)
                    }`,
            })
        return res.data.regionsCount
    } catch(err){
        console.error(err)
    }
}