import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getNakladnayaNaPustuyTaru = async({_id}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID) {
                        nakladnayaNaPustuyTaru(_id: $_id) {
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
        return res.data.nakladnayaNaPustuyTaru
    } catch(err){
        console.error(err)
    }
}

export const getNakladnayaNaPustuyTarus = async({date, region, limit, skip}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {date, region, limit, skip},
                query: gql`
                    query ($date: String, $region: ID, $limit: Int, $skip: Int) {
                        nakladnayaNaPustuyTarus(date: $date, region: $region, limit: $limit, skip: $skip) {
                            _id
                            createdAt
                            region {_id name}
                          }
                    }`,
            })
        return res.data.nakladnayaNaPustuyTarus
    } catch(err){
        console.error(err)
    }
}

export const getNakladnayaNaPustuyTarusCount = async({date, region}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {date, region},
                query: gql`
                    query($date: String, $region: ID) {
                        nakladnayaNaPustuyTarusCount(date: $date, region: $region)
                    }`,
            })
        return res.data.nakladnayaNaPustuyTarusCount
    } catch(err){
        console.error(err)
    }
}

export const addNakladnayaNaPustuyTaru = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($dataTable: String!) {
                        addNakladnayaNaPustuyTaru(dataTable: $dataTable)
                    }`})
        return res.data.addNakladnayaNaPustuyTaru
    } catch(err){
        console.error(err)
    }
}

export const setNakladnayaNaPustuyTaru = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $dataTable: String!, $checkAdmin: Boolean) {
                        setNakladnayaNaPustuyTaru(_id: $_id, dataTable: $dataTable, checkAdmin: $checkAdmin) 
                    }`})
        return res.data.setNakladnayaNaPustuyTaru
    } catch(err){
        console.error(err)
    }
}