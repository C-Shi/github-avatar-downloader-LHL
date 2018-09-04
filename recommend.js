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

var obj = {};


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

function countStarOnRepos(urlList){
  urlList.forEach(countStarOnRepo); // end of forEach
}

function countStarOnRepo(url){
    const options = {
      url: url,
      headers: {
      'User-Agent': process.env.GITHUB_USER,
      'Authorization': 'token ' + process.env.GITHUB_TOKEN
      }
    };

    request.get(options, (err, response, body) => {
      if (err) throw err;
      let parsedBody = JSON.parse(body);

      parsedBody.forEach((repo) => {
        // console.log(repo.name);
        if(obj[repo.name]){
          obj[repo.name]['count']++;
        }else {
          obj[repo.name] = {
            name: repo.name,
            owner: repo.owner.login,
            count: 1
          };
        }
      });
    });
}

// ******************************** File execution start here *********************************

// Execute the function
// 1. getRepoContributors executeed, request JSON from the jquery
getRepoContributors(repoOwner, repoName, function(err, result) {

  // when all contributors info has been retained and parsed, callback is executeed!!
  // console.log("Errors:", err);

  // this loop will put username/avatar url of contributors into an array for further process
  let starList = [];
  result.forEach((person) => {
    // let login = person.login;
    let url = person.starred_url.split('{')[0]
    starList.push(url);
  });

    countStarOnRepos(starList);

    setTimeout(function(){
      const Arr = Object.keys(obj).map(i => obj[i])
      Arr.sort(function(a,b){
        return b.count - a.count
      });

      for (let i = 0; i < 5; i++){
        console.log(`[ ${Arr[i].count} starts] ${Arr[i].owner} / ${Arr[i].name}`);
      }
    }, 5000);

});

// node recommend.js lighthouse-labs laser_shark

