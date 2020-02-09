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