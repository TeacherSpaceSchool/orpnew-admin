import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getGeoPoints = async({point, region}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {point, region},
                query: gql`
                    query ($point: ID, $region: ID) {
                        geoPoints(point: $point, region: $region) {
                            _id
                            createdAt
                            point {_id name}
                            region {_id name}
                            geo
                          }
                    }`,
            })
        return res.data.geoPoints
    } catch(err){
        console.geoPoint(err)
    }
}

export const getGeoPointsCount = async({point, region}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {point, region},
                query: gql`
                    query($point: ID, $region: ID) {
                        geoPointsCount(point: $point, region: $region)
                    }`,
            })
        return res.data.geoPointsCount
    } catch(err){
        console.geoPoint(err)
    }
}

export const saveGeoPoint = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($point: ID!, $region: ID!, $geo: [Float]!) {
                        saveGeoPoint(point: $point, region: $region, geo: $geo) {
                            _id
                            createdAt
                            point {_id name}
                            region {_id name}
                            geo
                        }
                    }`})
        return res.data.saveGeoPoint
    } catch(err){
        console.geoPoint(err)
    }
}