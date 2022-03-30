import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getCars = async({search, skip}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {search, skip},
                query: gql`
                    query ($search: String, $skip: Int) {
                        cars(search: $search, skip: $skip) {
                            _id
                            createdAt
                            number
                          }
                    }`,
            })
        return res.data.cars
    } catch(err){
        console.error(err)
    }
}

export const getCar = async({_id}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID!) {
                        car(_id: $_id) {
                            _id
                            createdAt
                            number
                          }
                    }`,
            })
        return res.data.car
    } catch(err){
        console.error(err)
    }
}

export const getCarsCount = async({search}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {search},
                query: gql`
                    query($search: String) {
                        carsCount(search: $search)
                    }`,
            })
        return res.data.carsCount
    } catch(err){
        console.error(err)
    }
}

export const deleteCar = async(ids)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: {_id: ids},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteCar(_id: $_id)
                    }`})
        return res.data.deleteCar
    } catch(err){
        console.error(err)
    }
}

export const addCar = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($number: String!) {
                        addCar(number: $number) {
                            _id
                            createdAt
                            number
                        }
                    }`})
        return res.data.addCar
    } catch(err){
        console.error(err)
    }
}