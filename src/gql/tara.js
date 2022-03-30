import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getTara = async({_id}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID!) {
                        tara(_id: $_id) {
                            _id
                            createdAt
                            name
                            size
                            guid
                          }
                    }`,
            })
        return res.data.tara
    } catch(err){
        console.error(err)
    }
}

export const getTaras = async({tara, search, skip}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {tara, search, skip},
                query: gql`
                    query ($search: String, $skip: Int) {
                        taras(search: $search, skip: $skip) {
                            _id
                            name
                            size
                            guid
                            createdAt
                        }
                    }`,
            })
        return res.data.taras
    } catch(err){
        console.error(err)
    }
}

export const getTarasCount = async({search}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {search},
                query: gql`
                    query($search: String) {
                        tarasCount(search: $search)
                    }`,
            })
        return res.data.tarasCount
    } catch(err){
        console.error(err)
    }
}