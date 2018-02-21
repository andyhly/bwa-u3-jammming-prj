const clientID = '94b89485a42a4294b79295c5e0834c92';
const redirectURI = "http://GOT_JUICE.surge.sh/";

let accessToken;
let expiresIn;


const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    const newToken = window.location.href.match(/access_token=([^&]*)/);
    const willExpire = window.location.href.match(/expires_in=([^&]*)/);
    if (newToken && willExpire) {
      accessToken = newToken[1];
      expiresIn = willExpire[1];
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
    } else {
      const spotifyURL = `https://accounts.spotify.com/authorize?response_type=token&scope=playlist-modify-public&client_id=${clientID}&redirect_uri=${redirectURI}`;
      window.location = spotifyURL;
    }
  },

  search(thing) {
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${thing}`,
      {
        headers: {Authorization: `Bearer ${accessToken}`}
      }
    ).then(response => response.json()).then(jsonResponse => {
      if (!jsonResponse.tracks) return [];

      return jsonResponse.tracks.items.map(track => {
        return {
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }
      })
    })
  },

  savePlaylist(playlistName, trackURI) {
    if (!playlistName || !trackURI.length) {
      return;
    }

    const accessToken = Spotify.getAccessToken();
    //why spotify?
    const headers = {Authorization: `Bearer ${accessToken}`};
    let userId;

    return fetch('https://api.spotify.com/v1/me', {
      headers: headers
    }).then(response => {
      if(response.ok) {
        return response.json();
      }
    }).then(jsonResponse => {
      userId = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({name: playlistName})
      })
    }).then(response => response.json()).then(jsonResponse => {
      const playlistId = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({uris: trackURI})
      });
    })
  }
}

export default Spotify;
