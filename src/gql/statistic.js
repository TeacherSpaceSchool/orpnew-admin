import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getStatistic = async({region, dateStart, dateType, type}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {region, dateStart, dateType, type},
                query: gql`
                    query ($region: ID, $dateStart: Date, $dateType: String, $type: String) {
                        statistic(region: $region, dateStart: $dateStart, dateType: $dateType, type: $type) {
                            columns
                            row {_id data}
                        }
                    }`,
            })
        return res.data.statistic
    } catch(err){
        console.error(err)
    }
}
