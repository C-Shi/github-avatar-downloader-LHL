/*
  1. script avatar url - getRepoContributors
  2. push into an array
  3. create a downloadImageByURL function which download image
  4. loop through the array and download each avatar
*/

const request = require('request');
const token = require('./secret');
const fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader! \n');

// script all avatar url
function getRepoContributors(repoOwner, repoName, cb) {
  // define a url with repoOwner and repoName passed in
  const options = {
    url: `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    headers: {
    'User-Agent': 'C-Shi',
    'Authorization': 'token ' + token.GITHUB_TOKEN
    }
  }

  // send http request through request module
  request.get(options, (err, response, body) => {
    if (err) throw err;
    let info = JSON.parse(body)
    contributors = cb(err, info);
  })

}

function downloadImageByURL(url, filePath) {
  request.get(url)
    .on('error', (err) => {
      if (err) throw err;
    })
    .pipe(fs.createWriteStream('./avatars/avatar.jpg'))
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  let avatarList = [];
  result.forEach((person) => {
    avatarList.push(person.avatar_url);
  })

  // create a directory - now ready to download
  let dir = './avatars';
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  };

  avatarList.forEach((avatar) => {
    downloadImageByURL(avatar, dir)
  })

});

