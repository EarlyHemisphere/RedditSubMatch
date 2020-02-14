var rp = require('request-promise');

// interface response_i1{
//     error: string
// } 
// interface response_i2{
//     access_token: string
//     refresh_token: string
//     token_type: string
//     expires_in: string
//     scope: string
// }
// interface response_i3{
//     access_token: string
//     token_type: string
//     expires_in: string
//     scope: string
// }
// type response_t = response_i1|response_i2

export const getAccessToken = async (code: string, clientid: string, secret: string) => {
    const data = await rp({
        method: 'POST',
        json: true,
        uri: 'https://www.reddit.com/api/v1/access_token',
        form: {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: 'https://reddit-submatch.firebaseapp.com/success'
        }
    }).auth(clientid, secret)
    console.log(data)
    if (data.error) {
        throw `Error: ${data.error}`
    } 
    return { accessToken: data['access_token'], refreshToken: data['refresh_token']}
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

export const testRefreshToken = async (refreshToken: string, clientid: string, secret: string) => {
    let response = await rp({
        method: 'POST',
        json: true,
        uri: 'https://www.reddit.com/api/v1/access_token',
        headers: {
            'User-Agent': 'Submatch/0.1 by Submatch_bot'
        },
        body: {
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        }
    }).auth(clientid, secret)

    return response['access_token']
}

export const revokeRefreshToken = async(refreshToken: string, clientid: string, secret: string) => {
    let uri = 'https://www.reddit.com/api/v1/revoke_token'
    console.log(uri)
    let response = await rp({
        uri: uri,
        method: 'POST',
        json: true,
        headers: {
            // Authorization: `Basic ${btoa(clientid + ":" + secret)}`,
            'User-Agent': 'Submatch/0.1 by Submatch_bot'
        },
        form: {
            token: refreshToken,
            token_type_hint: 'refresh_token'
        }
    }).auth(clientid, secret)

    return response;
}

export const revokeTempAccessToken = async(accessToken: string, clientid: string, secret: string) => {
    let uri = 'https://www.reddit.com/api/v1/revoke_token'
    console.log(uri)
    let response = await rp({
        uri: uri,
        method: 'POST',
        json: true,
        headers: {
            // Authorization: `Basic ${btoa(clientid + ":" + secret)}`,
            'User-Agent': 'Submatch/0.1 by Submatch_bot'
        },
        form: {
            token: accessToken,
            token_type_hint: 'access_token'
        }
    }).auth(clientid, secret)

    return response;
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
    let response = await getSubredditInfo(accessToken) 
    let subreddits = response.data.children
    while (response.data.after !== null) {
        console.log(response.data.after)
        response = await getSubredditInfo(accessToken, response.data.after)
        console.log(response.data.after)
        subreddits = [...subreddits, ...response.data.children]
    }
    return subreddits
}