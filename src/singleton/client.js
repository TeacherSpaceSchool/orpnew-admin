/* eslint-disable no-extra-boolean-cast */
import { urlGQL } from '../../redux/constants/other';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import fetch from 'node-fetch';
import { getJWT } from '../lib'
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { ApolloLink  } from 'apollo-link';
import { createUploadLink } from 'apollo-upload-client'
import { SingletonStore } from '../singleton/store';
import {
    showSnackBar
} from '../../redux/actions/snackbar'

export class SingletonApolloClient {
    constructor(req) {
        if (!!SingletonApolloClient.instance) {
            return SingletonApolloClient.instance;
        }
        SingletonApolloClient.instance = this;
        this.jwt = getJWT(req?req.headers.cookie:document&&document.cookie?document.cookie:'')
        const uploadLink = createUploadLink({
            uri: urlGQL,
            fetch: fetch,
            credentials: 'include'
        });
        const authLink = setContext((_, { headers }) => {
            return {
                headers: {
                    ...headers,
                    authorization: this.jwt ? `Bearer ${this.jwt}` : '',
                }
            }
        });
        const linkError = onError((ctx) => {
            if (ctx.graphQLErrors)
                ctx.graphQLErrors.map(({ message, locations, path }) =>{
                    new SingletonStore().getStore().dispatch(showSnackBar('Ошибка'))
                    console.log(
                        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
                    )
                });
            if (ctx.networkError) console.log(`[Network error]: ${ctx.networkError}`);
        });
        let mainLink = uploadLink
        const link = ApolloLink.from([
            linkError,
            authLink,
            mainLink
        ]);
        this.client = new ApolloClient({
            link: link,
            cache: new InMemoryCache(),
            defaultOptions: {
                watchQuery: {
                    fetchPolicy: 'no-cache',
                    errorPolicy: 'ignore',
                },
                query: {
                    fetchPolicy: 'no-cache',
                    errorPolicy: 'all',
                },
                mutate: {
                    errorPolicy: 'all',
                },
            },

        });
        return this;
    }

    getClient() {
        return this.client;
    }
}