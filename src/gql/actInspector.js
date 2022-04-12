import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getActInspector = async({_id}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID!) {
                        actInspector(_id: $_id) {
                            _id
                            createdAt
                            type
                            inspector {_id name}
                            organizator {_id name}
                            region {_id name}
                            realizator {_id name}
                            point {_id name}
                            checkMainInspector
                            checkAdmin
                        }
                    }`,
            })
        return res.data.actInspector
    } catch(err){
        console.error(err)
    }
}

export const getActInspectors = async({date, dateType, inspector, region, point, skip, limit, realizator}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {date, dateType, inspector, region, point, skip, limit, realizator},
                query: gql`
                    query ($date: String, $dateType: String, $inspector: ID, $region: ID, $point: ID, $skip: Int, $limit: Int, $realizator: ID) {
                        actInspectors(date: $date, dateType: $dateType, inspector: $inspector, region: $region, point: $point, skip: $skip, limit: $limit, realizator: $realizator) {
                            _id
                            createdAt
                            type
                            realizator {_id name}
                            inspector {_id name}
                          }
                    }`,
            })
        return res.data.actInspectors
    } catch(err){
        console.error(err)
    }
}

export const getActInspectorsCount = async({date, dateType, inspector, region, point, realizator}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {date, dateType, inspector, region, point, realizator},
                query: gql`
                    query ($date: String, $dateType: String, $inspector: ID, $region: ID, $point: ID, $realizator: ID) {
                        actInspectorsCount (date: $date, dateType: $dateType, inspector: $inspector, region: $region, point: $point, realizator: $realizator)
                    }`,
            })
        return res.data.actInspectorsCount
    } catch(err){
        console.error(err)
    }
}

export const unloadingActInspectors = async({date, dateType, inspector, region, point, realizator}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {date, dateType, inspector, region, point, realizator},
                query: gql`
                    query ($date: String, $dateType: String, $inspector: ID, $region: ID, $point: ID, $realizator: ID) {
                        unloadingActInspectors (date: $date, dateType: $dateType, inspector: $inspector, region: $region, point: $point, realizator: $realizator)
                    }`,
            })
        return res.data.unloadingActInspectors
    } catch(err){
        console.error(err)
    }
}

export const deleteActInspector = async(_id)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteActInspector(_id: $_id)
                    }`})
        return res.data.deleteActInspector
    } catch(err){
        console.error(err)
    }
}

export const addActInspector = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($type: String!, $region: ID!, $realizator: ID!, $organizator: ID!, $point: ID!) {
                        addActInspector(type: $type, region: $region, realizator: $realizator, organizator: $organizator, point: $point)
                    }`})
        return res.data.addActInspector
    } catch(err){
        console.error(err)
    }
}

export const setActInspector = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $checkMainInspector: Boolean, $checkAdmin: Boolean) {
                        setActInspector(_id: $_id, checkMainInspector: $checkMainInspector, checkAdmin: $checkAdmin) 
                    }`})
        return res.data.setActInspector
    } catch(err){
        console.error(err)
    }
}