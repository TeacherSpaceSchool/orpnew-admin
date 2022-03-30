import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getPoint = async({_id}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID!) {
                        point(_id: $_id) {
                            _id
                            createdAt
                            name
                            region {_id name guid}
                            guid
                            guidRegion
                          }
                    }`,
            })
        return res.data.point
    } catch(err){
        console.error(err)
    }
}

export const getPoints = async({region, search, skip, free}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {region, search, skip, free},
                query: gql`
                    query ($region: ID, $search: String, $skip: Int, $free: Boolean) {
                        points(region: $region, search: $search, skip: $skip, free: $free) {
                            _id
                            name
                            guid
                            createdAt
                            region {name _id}
                        }
                    }`,
            })
        return res.data.points
    } catch(err){
        console.error(err)
    }
}

export const getPointsCount = async({region, search}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {region, search},
                query: gql`
                    query($region: ID, $search: String) {
                        pointsCount(region: $region, search: $search)
                    }`,
            })
        return res.data.pointsCount
    } catch(err){
        console.error(err)
    }
}