import axios from 'axios';
import querystring from 'querystring';
import { nsfwSubs } from './nsfw_subs';

const userAgent = 'Submatch/0.1 by u/submatch_bot';

export const getAccessToken = async(code: string, clientid: string, secret: string, testing = false): Promise<any> => {
    console.log(code);
    const data = querystring.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: testing ? 'http://localhost:3000/redirect' : 'https://www.submatch.io/redirect'
    });
    const response = await axios.post('https://www.reddit.com/api/v1/access_token', data, { auth: { username: clientid, password: secret }});
    console.log(JSON.stringify(response.data));
    return { accessToken: response.data['access_token'], refreshToken: response.data['refresh_token']};
}

export const getUserInfo = async (accessToken: string): Promise<any> => {
    console.log(accessToken);
    const headers = {
        Authorization: `bearer ${accessToken}`,
        'User-Agent': userAgent
    }
    const response = await axios.get('https://oauth.reddit.com/api/v1/me', { headers });
    return response.data;
}

export const testRefreshToken = async (refreshToken: string, clientid: string, secret: string): Promise<any> => {
    const data = querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
    });
    const headers = {
        'User-Agent': userAgent
    }
    const response = await axios.post('https://www.reddit.com/api/v1/access_token', data, { headers, auth: { username: clientid, password: secret } });
    return response.data;
}

export const revokeRefreshToken = async(refreshToken: string, clientid: string, secret: string): Promise<any> => {
    console.log(refreshToken)
    const data = querystring.stringify({
        token: refreshToken,
        token_type_hint: 'refresh_token'
    });
    const headers = {
        'User-Agent': userAgent
    }
    const response = await axios.post('https://www.reddit.com/api/v1/revoke_token', data, { headers, auth: { username: clientid, password: secret } });
    return response.data;
}

export const getSubreddits = async(accessToken: string, after?: string): Promise<string[]> => {
    let subreddits = [];
    const headers = {
        'User-Agent': userAgent,
        'Authorization': `Bearer ${accessToken}`
    }
    const response = await axios.get(`https://oauth.reddit.com/subreddits/mine/subscriber?limit=100${after ? `&after=${after}` : ''}`, { headers });
    subreddits = response.data.data.children.map((subreddit: any) => subreddit.data.display_name).filter((subredditName: string) => subredditName.slice(0, 2) != 'u_' && !nsfwSubs.includes(subredditName));

    if (response.data.data.after != null) {
        subreddits = [ ...subreddits, ...(await getSubreddits(accessToken, response.data.data.after))];
    }
    console.log(JSON.stringify(subreddits)); 
    return subreddits;
}