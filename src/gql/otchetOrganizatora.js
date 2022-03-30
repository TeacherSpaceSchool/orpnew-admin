import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getOtchetOrganizatora = async({_id}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID) {
                        otchetOrganizatora(_id: $_id) {
                            _id
                            createdAt
                            dataTable
                            organizator {_id name guid}
                            region {_id name guid}
                            guidOrganizator
                            guidRegion
                            checkAdmin
                          }
                    }`,
            })
        return res.data.otchetOrganizatora
    } catch(err){
        console.error(err)
    }
}

export const getOtchetOrganizatoras = async({date, search, skip, region}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {date, search, skip, region},
                query: gql`
                    query ($date: String, $region: ID, $skip: Int, $limit: Int) {
                        otchetOrganizatoras(date: $date, region: $region, limit: $limit, skip: $skip) {
                            _id
                            createdAt
                            region {_id name guid}
                          }
                    }`,
            })
        return res.data.otchetOrganizatoras
    } catch(err){
        console.error(err)
    }
}

export const getOtchetOrganizatorasCount = async({date, region}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {date, region},
                query: gql`
                    query($date: String, $region: ID) {
                        otchetOrganizatorasCount(date: $date, region: $region)
                    }`,
            })
        return res.data.otchetOrganizatorasCount
    } catch(err){
        console.error(err)
    }
}

export const addOtchetOrganizatora = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($dataTable: String!) {
                        addOtchetOrganizatora(dataTable: $dataTable)
                    }`})
        return res.data.addOtchetOrganizatora
    } catch(err){
        console.error(err)
    }
}

export const setOtchetOrganizatora = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $dataTable: String!, $checkAdmin: Boolean) {
                        setOtchetOrganizatora(_id: $_id, dataTable: $dataTable, checkAdmin: $checkAdmin) 
                    }`})
        return res.data.setOtchetOrganizatora
    } catch(err){
        console.error(err)
    }
}