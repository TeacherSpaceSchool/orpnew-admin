import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getNakladnayaSklad2 = async({_id}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID!) {
                        nakladnayaSklad2(_id: $_id) {
                            _id
                            createdAt
                            dataTable
                            organizator {_id name}
                            region {_id name}
                            guidOrganizator
                            guidRegion
                            checkAdmin
                          }
                    }`,
            })
        return res.data.nakladnayaSklad2
    } catch(err){
        console.error(err)
    }
}

export const getNakladnayaSklad2s = async({date, region, skip, limit}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {date, region, skip, limit},
                query: gql`
                    query ($date: String, $region: ID, $skip: Int, $limit: Int) {
                        nakladnayaSklad2s(date: $date, region: $region, skip: $skip, limit: $limit) {
                            _id
                            createdAt
                            region {_id name}
                          }
                    }`,
            })
        return res.data.nakladnayaSklad2s
    } catch(err){
        console.error(err)
    }
}

export const getNakladnayaSklad2sCount = async({date, region}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {date, region},
                query: gql`
                    query($date: String, $region: ID) {
                        nakladnayaSklad2sCount(date: $date, region: $region)
                    }`,
            })
        return res.data.nakladnayaSklad2sCount
    } catch(err){
        console.error(err)
    }
}

export const addNakladnayaSklad2 = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($dataTable: String!) {
                        addNakladnayaSklad2(dataTable: $dataTable)
                    }`})
        return res.data.addNakladnayaSklad2
    } catch(err){
        console.error(err)
    }
}

export const setNakladnayaSklad2 = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $dataTable: String!, $checkAdmin: Boolean) {
                        setNakladnayaSklad2(_id: $_id, dataTable: $dataTable, checkAdmin: $checkAdmin) 
                    }`})
        return res.data.setNakladnayaSklad2
    } catch(err){
        console.error(err)
    }
}