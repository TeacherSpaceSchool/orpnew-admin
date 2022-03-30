import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getNakladnayaNaVecherniyVozvrat = async({_id}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID) {
                        nakladnayaNaVecherniyVozvrat(_id: $_id) {
                            _id
                            createdAt
                            dataTable
                            organizator {_id name}
                            region {_id name}
                            guidOrganizator
                            guidRegion
                          }
                    }`,
            })
        return res.data.nakladnayaNaVecherniyVozvrat
    } catch(err){
        console.error(err)
    }
}

export const getNakladnayaNaVecherniyVozvrats = async({date, region, skip, limit}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {date, region, skip, limit},
                query: gql`
                    query ($date: String, $region: ID, $skip: Int, $limit: Int) {
                        nakladnayaNaVecherniyVozvrats(date: $date, region: $region, skip: $skip, limit: $limit) {
                            _id
                            createdAt
                            region {_id name}
                          }
                    }`,
            })
        return res.data.nakladnayaNaVecherniyVozvrats
    } catch(err){
        console.error(err)
    }
}

export const getNakladnayaNaVecherniyVozvratsCount = async({date, region}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {date, region},
                query: gql`
                    query($date: String, $region: ID) {
                        nakladnayaNaVecherniyVozvratsCount(date: $date, region: $region)
                    }`,
            })
        return res.data.nakladnayaNaVecherniyVozvratsCount
    } catch(err){
        console.error(err)
    }
}