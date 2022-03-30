import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getPrice = async({_id}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID!) {
                        price(_id: $_id) {
                            _id
                            createdAt
                            name
                            price
                            guid
                          }
                    }`,
            })
        return res.data.price
    } catch(err){
        console.error(err)
    }
}

export const getPrices = async({search, skip}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {search, skip},
                query: gql`
                    query ($search: String, $skip: Int) {
                        prices(search: $search, skip: $skip) {
                            _id
                            name
                            price
                            createdAt
                        }
                    }`,
            })
        return res.data.prices
    } catch(err){
        console.error(err)
    }
}

export const getPricesCount = async({search}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {search},
                query: gql`
                    query($search: String) {
                        pricesCount(search: $search)
                    }`,
            })
        return res.data.pricesCount
    } catch(err){
        console.error(err)
    }
}