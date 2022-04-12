import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getChecklistInspector = async({_id}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID!) {
                        checklistInspector(_id: $_id) {
                            _id
                            createdAt
                            score
                            questions
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
        return res.data.checklistInspector
    } catch(err){
        console.error(err)
    }
}

export const getChecklistInspectors = async({date, dateType, inspector, region, point, skip, limit, realizator}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {date, inspector, dateType, region, point, skip, limit, realizator},
                query: gql`
                    query ($date: String, $dateType: String, $inspector: ID, $region: ID, $point: ID, $skip: Int, $limit: Int, $realizator: ID) {
                        checklistInspectors(dateType: $dateType, date: $date, inspector: $inspector, region: $region, point: $point, skip: $skip, limit: $limit, realizator: $realizator) {
                            _id
                            createdAt
                            score
                            realizator {_id name}
                            inspector {_id name}
                          }
                    }`,
            })
        return res.data.checklistInspectors
    } catch(err){
        console.error(err)
    }
}

export const getChecklistInspectorsCount = async({dateType, date, inspector, region, point, realizator}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {dateType, date, inspector, region, point, realizator},
                query: gql`
                    query($dateType: String, $date: String, $inspector: ID, $region: ID, $point: ID, $realizator: ID) {
                        checklistInspectorsCount(dateType: $dateType, date: $date, inspector: $inspector, region: $region, point: $point, realizator: $realizator)
                    }`,
            })
        return res.data.checklistInspectorsCount
    } catch(err){
        console.error(err)
    }
}

export const unloadingChecklistInspectors = async({dateType, date, inspector, region, point, realizator}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {dateType, date, inspector, region, point, realizator},
                query: gql`
                    query($dateType: String, $date: String, $inspector: ID, $region: ID, $point: ID, $realizator: ID) {
                        unloadingChecklistInspectors(dateType: $dateType, date: $date, inspector: $inspector, region: $region, point: $point, realizator: $realizator)
                    }`,
            })
        return res.data.unloadingChecklistInspectors
    } catch(err){
        console.error(err)
    }
}

export const deleteChecklistInspector = async(_id)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteChecklistInspector(_id: $_id)
                    }`})
        return res.data.deleteChecklistInspector
    } catch(err){
        console.error(err)
    }
}

export const addChecklistInspector = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($questions: String!, $score: Float!, $region: ID!, $realizator: ID!, $organizator: ID!, $point: ID!) {
                        addChecklistInspector(questions: $questions, score: $score, region: $region, realizator: $realizator, organizator: $organizator, point: $point)
                    }`})
        return res.data.addChecklistInspector
    } catch(err){
        console.error(err)
    }
}

export const setChecklistInspector = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $checkMainInspector: Boolean, $checkAdmin: Boolean) {
                        setChecklistInspector(_id: $_id, checkMainInspector: $checkMainInspector, checkAdmin: $checkAdmin) 
                    }`})
        return res.data.setChecklistInspector
    } catch(err){
        console.error(err)
    }
}