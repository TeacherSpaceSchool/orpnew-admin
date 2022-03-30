export let urlGQL
export let urlGQLws
export let urlMain
export let urlSubscribe
export let applicationKey
if(process.env.URL==='orp-shoro.site') {
    urlGQL = `https://${process.env.URL}:3000/graphql`
    urlGQLws = `wss://${process.env.URL}:3000/graphql`
    urlSubscribe = `https://${process.env.URL}:3000/subscribe`
    urlMain = `https://${process.env.URL}`
    applicationKey = 'BJyxQu8kI7H1pqVp3ZiVo63TkD8ZZTlLU0mv-98xFyHziuAeEG_yAnRICOhJpc3IXq99cEB2PprHiHx8Co5qCqE'
}
else {
    urlGQL = `http://${process.env.URL}:3000/graphql`
    urlGQLws = `ws://${process.env.URL}:3000/graphql`
    urlMain = `http://${process.env.URL}`
    urlSubscribe = `http://${process.env.URL}:3000/subscribe`
    applicationKey = 'BDfAA4adaWjNYN_hqefqppyvKbOGXj7dw8A4e97d-UVUz9k-9ndm-iImZnda1iTCtCgNaekT6I-6pHTDlhHjjLs'
}

export const validMail = (mail) =>
{
    return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/.test(mail);
}
export const validPhone = (phone) =>
{
    return /^[+]{1}996[0-9]{9}$/.test(phone);
}
export const checkInt = (int) => {
    return isNaN(parseInt(int))?0:parseInt(int)
}
