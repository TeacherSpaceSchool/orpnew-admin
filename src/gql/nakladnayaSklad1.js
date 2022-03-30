import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getNakladnayaSklad1 = async({_id}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID) {
                        nakladnayaSklad1(_id: $_id) {
                            _id
                            date
                            dataTable
                            organizator {_id name}
                            region {_id name}
                            guidOrganizator
                            guidRegion
                            checkAdmin
                          }
                    }`,
            })
        return res.data.nakladnayaSklad1
    } catch(err){
        console.error(err)
    }
}

export const getNakladnayaSklad1s = async({date, region, skip, limit}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {date, region, skip, limit},
                query: gql`
                    query ($date: String, $region: ID, $skip: Int, $limit: Int) {
                        nakladnayaSklad1s(date: $date, region: $region, skip: $skip, limit: $limit) {
                            _id
                            date
                            region {_id name}
                          }
                    }`,
            })
        return res.data.nakladnayaSklad1s
    } catch(err){
        console.error(err)
    }
}

export const getNakladnayaSklad1sCount = async({date, region}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {date, region},
                query: gql`
                    query($date: String, $region: ID) {
                        nakladnayaSklad1sCount(date: $date, region: $region)
                    }`,
            })
        return res.data.nakladnayaSklad1sCount
    } catch(err){
        console.error(err)
    }
}

export const addNakladnayaSklad1 = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($dataTable: String!) {
                        addNakladnayaSklad1(dataTable: $dataTable)
                    }`})
        return res.data.addNakladnayaSklad1
    } catch(err){
        console.error(err)
    }
}

export const setNakladnayaSklad1 = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $dataTable: String!, $checkAdmin: Boolean) {
                        setNakladnayaSklad1(_id: $_id, dataTable: $dataTable, checkAdmin: $checkAdmin) 
                    }`})
        return res.data.setNakladnayaSklad1
    } catch(err){
        console.error(err)
    }
}