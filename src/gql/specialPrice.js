import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getSpecialPrice = async({_id}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID!) {
                        specialPrice(_id: $_id) {
                            _id
                            createdAt
                            point {_id name}
                            prices
                          }
                    }`,
            })
        return res.data.specialPrice
    } catch(err){
        console.error(err)
    }
}

export const getSpecialPrices = async({point, skip, limit}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {point, skip, limit},
                query: gql`
                    query ($skip: Int, $point: ID, $limit: Int) {
                        specialPrices(skip: $skip, point: $point, limit: $limit) {
                            _id
                            createdAt
                            point {name}
                        }
                    }`,
            })
        return res.data.specialPrices
    } catch(err){
        console.error(err)
    }
}

export const getFreePointsForSpecialPrice = async({region}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {region},
                query: gql`
                    query ($region: ID) {
                        freePointsForSpecialPrice(region: $region) {
                            _id
                            name
                        }
                    }`,
            })
        return res.data.freePointsForSpecialPrice
    } catch(err){
        console.error(err)
    }
}

export const getSpecialPricesCount = async({point}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {point},
                query: gql`
                    query($point: ID) {
                        specialPricesCount(point: $point)
                    }`,
            })
        return res.data.specialPricesCount
    } catch(err){
        console.error(err)
    }
}

export const setSpecialPrice = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $prices: String!) {
                        setSpecialPrice(_id: $_id, prices: $prices) 
                    }`})
        return res.data.setSpecialPrice
    } catch(err){
        console.error(err)
    }
}

export const deleteSpecialPrice = async(_id)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteSpecialPrice(_id: $_id) 
                    }`})
        return res.data.deleteSpecialPrice
    } catch(err){
        console.error(err)
    }
}

export const addSpecialPrice = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($point: ID!, $prices: String!) {
                        addSpecialPrice(point: $point, prices: $prices) 
                    }`})
        return res.data.addSpecialPrice
    } catch(err){
        console.error(err)
    }
}