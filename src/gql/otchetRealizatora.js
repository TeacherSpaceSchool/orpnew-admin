import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getOtchetRealizatora = async({_id, point}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {_id, point},
                query: gql`
                    query ($_id: ID, $point: ID) {
                        otchetRealizatora(_id: $_id, point: $point) {
                            _id
                            createdAt
                            dataTable
                            organizator {_id name}
                            guidOrganizator
                            region {_id name}
                            guidRegion
                            point {_id name}
                            guidPoint
                            realizator {_id name}
                            guidRealizator
                            checkAdmin
                            checkOrganizator
                          }
                    }`,
            })
        return res.data.otchetRealizatora
    } catch(err){
        console.error(err)
    }
}

export const getOtchetRealizatoras = async({date, region, point, skip, limit}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {date, region, point, skip, limit},
                query: gql`
                    query ($date: String, $region: ID, $point: ID, $skip: Int, $limit: Int) {
                        otchetRealizatoras(date: $date, region: $region, point: $point, skip: $skip, limit: $limit) {
                            _id
                            createdAt
                            region {_id name}
                            point {_id name}
                          }
                    }`,
            })
        return res.data.otchetRealizatoras
    } catch(err){
        console.error(err)
    }
}

export const getOtchetRealizatorasCount = async({date, region, point}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {date, region, point},
                query: gql`
                    query($date: String, $region: ID, $point: ID) {
                        otchetRealizatorasCount(date: $date, region: $region, point: $point)
                    }`,
            })
        return res.data.otchetRealizatorasCount
    } catch(err){
        console.error(err)
    }
}

export const deleteOtchetRealizatora = async(ids)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: {_id: ids},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteOtchetRealizatora(_id: $_id)
                    }`})
        return res.data.deleteOtchetRealizatora
    } catch(err){
        console.error(err)
    }
}

export const addOtchetRealizatora = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($dataTable: String!, $organizator: ID!, $realizator: ID!, $point: ID!, $guidRealizator: String!, $guidPoint: String!, $region: ID!, $guidOrganizator: String!, $guidRegion: String!) {
                        addOtchetRealizatora(dataTable: $dataTable, realizator: $realizator, point: $point, guidRealizator: $guidRealizator, guidPoint: $guidPoint, organizator: $organizator, region: $region, guidOrganizator: $guidOrganizator, guidRegion: $guidRegion)
                    }`})
        return res.data.addOtchetRealizatora
    } catch(err){
        console.error(err)
    }
}

export const setOtchetRealizatora = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $dataTable: String!, $checkAdmin: Boolean, $checkOrganizator: Boolean) {
                        setOtchetRealizatora(_id: $_id, dataTable: $dataTable, checkAdmin: $checkAdmin, checkOrganizator: $checkOrganizator) 
                    }`})
        return res.data.setOtchetRealizatora
    } catch(err){
        console.error(err)
    }
}