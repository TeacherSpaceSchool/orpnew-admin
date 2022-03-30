import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getPlan = async({_id}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID!) {
                        plan(_id: $_id) {
                            _id
                            createdAt
                            date
                            norma
                            normaRegions
                            current
                            currentRegions
                          }
                    }`,
            })
        return res.data.plan
    } catch(err){
        console.error(err)
    }
}

export const getPlans = async({skip}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {skip},
                query: gql`
                    query ($skip: Int) {
                        plans(skip: $skip) {
                            _id
                            date
                          }
                    }`,
            })
        return res.data.plans
    } catch(err){
        console.error(err)
    }
}

export const getPlansCount = async(client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                query: gql`
                    query {
                        plansCount
                    }`,
            })
        return res.data.plansCount
    } catch(err){
        console.error(err)
    }
}

export const deletePlan = async(_id)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deletePlan(_id: $_id)
                    }`})
        return res.data.deletePlan
    } catch(err){
        console.error(err)
    }
}

export const addPlan = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($normaRegions: String!, $norma: Int!, $date: String!) {
                        addPlan(normaRegions: $normaRegions, norma: $norma, date: $date)
                    }`})
        return res.data.addPlan
    } catch(err){
        console.error(err)
    }
}

export const setPlan = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $normaRegions: String!, $norma: Int!) {
                        setPlan(_id: $_id, normaRegions: $normaRegions, norma: $norma) 
                    }`})
        return res.data.setPlan
    } catch(err){
        console.error(err)
    }
}