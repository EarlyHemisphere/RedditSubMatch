var rp = require('request-promise');
import * as functions from 'firebase-functions';


const config = functions.config()


// interface response_i1{
//     error: string
// } 
// interface response_i2{
//     access_token: string
//     token_type: string
//     expires_in: string
//     scope: string
// }
// type response_t = response_i1|response_i2

export const getAccessToken = async (code: string) => {
    // get token
    const data = await rp({
        method: 'POST',
        json: true,
        uri: 'https://www.reddit.com/api/v1/access_token',
        form: {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: 'https://reddit-submatch.web.app/success'
        }
    }).auth(config.reddit.clientid, config.reddit.secret)

    if (data.error){
        throw `Error: ${data.error}`
    } 
    return data['access_token']
}

export const formatSubreddits = (subreddits: any) => {
    return subreddits
}

export const formatUserInfo = (userInfo: any) => {
    return userInfo
}


export const getUserInfo = async (accessToken: string) => {
    let uri = `https://oauth.reddit.com/api/v1/me`
    let response = await rp({
        uri: uri,
        json: true,
        headers: {
            Authorization: `bearer ${accessToken}`,
            'User-Agent': 'Submatch/0.1 by Submatch_bot'
        }
    })

    return response
}


export const getSubredditInfo = async (accessToken: string, after?:string) => {
    let uri = `https://oauth.reddit.com/subreddits/mine/subscriber?limit=100`
    if(after){
        uri = `https://oauth.reddit.com/subreddits/mine/subscriber?limit=100&after=${after}`
    }
    let response = await rp({
        uri: uri,
        json: true,
        headers: {
            Authorization: `bearer ${accessToken}`,
            'User-Agent': 'Submatch/0.1 by Submatch_bot'
        }
    })

    return response
}

export const getSubreddits = async (accessToken: string) => {
    let subreddits = []
    let response = await getSubredditInfo(accessToken) 
    subreddits.push(response.data.children)
    while(response.data.after !== null){
        console.log(response.data.after)
        response = await getSubredditInfo(accessToken, response.data.after)
        console.log(response.data.after)
        subreddits = [...subreddits, ...response.data.children]
    }
    return subreddits
}