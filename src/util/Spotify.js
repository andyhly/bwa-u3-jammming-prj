const clientId = '94b89485a42a4294b79295c5e0834c92';
const redirectUri = 'http://got_juice.surge.sh/'


let accessToken = '';
let expiresIn = '';


const Spotify = {
  getAccessToken() {
    // 1st condition - token is there
    if (accessToken) {
      return accessToken;
      // 2nd condition - did it just load in the URL?
    } else if (window.location.href.match(/access_token=([^&]*)/) != null) {
      accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
      expiresIn = window.location.href.match(/expires_in=([^&]*)/)[1];
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
// 3rd condition -no token and not in URL
    } else {
      const sorryBro = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = sorryBro;
    }
  },

  search(term) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => response.json())
      .then(jsonResponse => {
        if (!jsonResponse.tracks) {
          return [];
        } else {
          return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          }))
        }
    })
  },

  savePlaylist(nameOf, trackArrays) {
    if (!nameOf || !trackArrays.length) {
      return;
    }
    // 1. communicates with spotify
    const accessToken = Spotify.getAccessToken();
    // 2. headers with authorization
    const headers = {
      Authorization: `Bearer ${accessToken}`
    };
    // 3. empty userId
    let userId;
    let playlistId;

    return fetch('https://api.spotify.com/v1/me', {headers : headers})
    .then(response => response.json()).then(jsonResponse => {
        userId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({name: nameOf})
        }).then(response => response.json()).then(jsonResponse => {
            playlistId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
              headers: headers,
              method: 'POST',
              body: JSON.stringify({uris: trackArrays})
            })
          })
      })
  }
};

export default Spotify;
