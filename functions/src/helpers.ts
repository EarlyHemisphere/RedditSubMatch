var rp = require('request-promise');

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

export const getAccessToken = async (code: string, clientid: string, secret: string) => {
    // get token
    console.log(code)
    const data = await rp({
        method: 'POST',
        json: true,
        uri: 'https://www.reddit.com/api/v1/access_token',
        form: {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: 'https://reddit-submatch.web.app/success'
        }
    }).auth(clientid, secret)
    console.log(data)
    if (data.error){
        throw `Error: ${data.error}`
    } 
    return data['access_token']
}


const subredditWhiteListKeys = ["display_name", "user_is_banned", "subscribers", "user_is_contributor", "created_utc", "lang"]

const filterKeys = (obj: any, keys: string[]) => {
    const filtered: any = {}
    keys.forEach(key => {
      if (obj.hasOwnProperty(key)) {
        filtered[key] = obj[key]
      }
    })
    return filtered
}

export const formatSubreddits = (subreddits: any) => {
    return subreddits.map((sub: any)=>filterKeys(sub.data, subredditWhiteListKeys))
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
    let response = await getSubredditInfo(accessToken) 
    let subreddits = response.data.children
    while(response.data.after !== null){
        console.log(response.data.after)
        response = await getSubredditInfo(accessToken, response.data.after)
        console.log(response.data.after)
        subreddits = [...subreddits, ...response.data.children]
    }
    return subreddits
}