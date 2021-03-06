/*
  1. script avatar url - getRepoContributors
  2. push into an array
  3. create a downloadImageByURL function which download image
  4. loop through the array and download each avatar
*/

// require all the module
require('dotenv').config();
const request = require('request');
const fs = require('fs');


// collecting info from command line
const repoOwner = process.argv[2];
const repoName = process.argv[3];

// Welcome info for user
console.log('Welcome to the GitHub Avatar Downloader! \n');

// ***************************************** define function ******************************************

// script all avatar url
function getRepoContributors(repoOwner, repoName, cb) {

  // define a url with repoOwner and repoName passed in
  const options = {
    url: `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    headers: {
    'User-Agent': process.env.GITHUB_USER,
    'Authorization': 'token ' + process.env.GITHUB_TOKEN
    }
  };

  // send http request through request module
  request.get(options, (err, response, body) => {
    if (err) throw err;

    // error handling 403 && 404 special, other log general error
    if (response.statusCode === 403){
      console.log('Credential error! Check your User-Agent or token');
      return -1;
    } else if (response.statusCode === 404) {
        if (!repoOwner || !repoName){
          console.log('No info provided. Please enter repoOwer and repoName respectively through command line');
        }else{
          console.log('Sorry, this repo is not exist!');
        }
        return -1;
    } else if (response.statusCode >=  500) {
      console.log('Server side error occurs!');
      return -1;
    } else if (response.statusCode >= 400) {
      console.log('Unforeseen client side error');
      return -1;
    }


    let info = JSON.parse(body); // parse json body into js object

    // when complete, passing the obtained contributors object into callback for further process
    cb(err, info);
  });

}

// this function will download the avatar picture
// this function will be execute by getRepoContributors' callback once all info has been retained
function downloadImageByURL(url, filePath) {
  request.get(url)
    .on('error', (err) => {
      if (err) throw err;
    })
    .pipe(fs.createWriteStream(filePath))
    .on('finish', () => {
      console.log('Avatar download');
    });
}

// ******************************** File execution start here *********************************

// Execute the function
// 1. getRepoContributors executeed, request JSON from the jquery
getRepoContributors(repoOwner, repoName, function(err, result) {

  // when all contributors info has been retained and parsed, callback is executeed!!
  console.log("Errors:", err);

  // this loop will put username/avatar url of contributors into an array for further process
  let avatarList = [];
  result.forEach((person) => {
    let user = [person.login, person.avatar_url];
    avatarList.push(user);
  });

  // create a directory - now ready to download
  let dir = './avatars';
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }

  // for each of the contributor info, execute downloadImageByURL to download the picture
  avatarList.forEach((avatar) => {
    let path = dir + '/' + avatar[0] + '.jpg';
    downloadImageByURL(avatar[1], path);
  });
});

