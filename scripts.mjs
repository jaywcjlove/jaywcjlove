import 'dotenv/config'
import fs from 'fs';
import path from 'path';
import { Octokit } from 'octokit';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const repoData = require('./repo.json');

function getProjectLineString(item) {
  const dt = [];
  dt[0] = item.github ? `[${item.github.replace(/^jaywcjlove\//, '')}](https://github.com/${item.github})` : '-';
  dt[1] = item.homepage ? `[\`#homepage\`](${item.homepage})` : '-';
  dt[2] = item.github ? `[![GitHub stars](https://badgen.net/github/stars/${item.github}?style=flat&label=)](https://github.com/${item.github}/stargazers)` : ' ';
  dt[3] = item.github ? `[![GitHub last commit](https://img.shields.io/github/last-commit/${item.github}?style=flat&label=last)](https://github.com/${item.github}/commits)` : ' ';
  dt[4] = item.npm ? `[![NPM Downloads](https://img.shields.io/npm/dm/${item.npm}.svg?label=&logo=npm&style=flat&labelColor=ffacab&color=dd4e4c)](https://www.npmjs.com/package/${item.npm})` : ' ';

  // const npmVersion = item.npm ? `[![npm version](https://img.shields.io/npm/v/${item.npm}.svg?label=&logo=npm)](https://www.npmjs.com/package/${item.npm})` : '';
  // const githubVersion = item.version ? `![GitHub package version](https://img.shields.io/github/v/tag/${item.github}?style=flat&label=&labelColor=555&logo=github)` : '';
  // dt[5] = npmVersion ? npmVersion : githubVersion;
  if (item.stars === false) {
    dt[2] = '  '
  }
  if (item.lastCommit === false) {
    dt[3] = '  '
  }
  return dt.join(' | ');
}

const octokit = new Octokit({ auth: process.env.AUTH || '' });
const reposData = [];

function compare(a, b) {
  if (a < b ) {
    return 1;
  }
  if (a > b ) {
    return -1;
  }
  return 0;
}

;(async () => {
  const result = await octokit.request('GET /users/{username}/repos?per_page=100&page=1', {
    username: 'jaywcjlove'
  });
  if (result.data && result.data.length) {
    reposData.push(result.data);
    console.log(`\x1b[35;1m Page 1 data:\x1b[0m \x1b[32;1m${result.data.length}\x1b[0m`);
  }
  const result2 = await octokit.request('GET /users/{username}/repos?per_page=100&page=2', {
    username: 'jaywcjlove'
  });
  if (result2.data && result2.data.length) {
    reposData.push(result2.data);
    console.log(`\x1b[35;1m Page 2 data:\x1b[0m \x1b[32;1m${result2.data.length}\x1b[0m`);
  }
  reposData.flat().forEach(({ full_name, ...rest }) => {
    if (!repoData[full_name] && rest.archived === false) {
      repoData[full_name] = {};
    }
    if (rest.archived === true) {
      console.log(`\x1b[35;1m Archived:\x1b[0m https://github.com/\x1b[32;1m${full_name}\x1b[0m`);
    }
  });

  const repoDataPath = path.relative(process.cwd(), 'repo.json');
  await fs.writeFileSync(repoDataPath, JSON.stringify(repoData, null, 2));

  
  const baseData = reposData.flat()
    .map(({ name, full_name, homepage, archived, watchers_count, forks_count, stargazers_count }) => {
      if (archived) return;
      const result = {
        name, github: full_name, homepage, watchers_count, forks_count, stargazers_count
      }
      if (repoData[full_name]) {
        if (repoData[full_name].npm) {
          result.npm = repoData[full_name].npm_name || name;
        }
        result.version = repoData[full_name].version;
        result.category = repoData[full_name].category;
        result.stars = repoData[full_name].stars;
        result.lastCommit = repoData[full_name].lastCommit;
      }
      return result;
    })
    .filter(Boolean)
    .sort((a, b) => compare(a.stargazers_count, b.stargazers_count));

  const dataPath = path.relative(process.cwd(), 'data.json');
  await fs.writeFileSync(dataPath, JSON.stringify(baseData, null, 2));

  const mdPath = path.resolve(process.cwd(), 'README.md');
  const mdstr = fs.readFileSync(mdPath);

  const markdownTable = [
    '**Handbook** | **Homepage** | **Stars** | **Last Commit** | **Downloads** ',
    ':--- | --- | :--- | :--- | :--- ',
    [], // 2
    '**Github Actions** | **Homepage** | **Stars** | **Last Commit** | **Downloads** ',
    [], // 4
    '**Rehype Plugins** | **Homepage** | **Stars** | **Last Commit** | **Downloads** ',
    [], // 6
    '**SwiftUI Plugins** | **Homepage** | **Stars** | **Last Commit** | **Downloads** ',
    [], // 8
    '**macOS App** | **Homepage** | **Stars** | **Last Commit** | **Downloads** ',
    [], // 10
    '**Other Project** | **Homepage** | **Stars** | **Last Commit** | **Downloads** ',
    [], // 12
  ];
  baseData.forEach((item) => {
    if (item.category === 'handbook') {
      markdownTable[2].push(getProjectLineString(item));
    } else if (item.category === 'action') {
      markdownTable[4].push(getProjectLineString(item));
    } else if (item.category === 'rehype') {
      markdownTable[6].push(getProjectLineString(item));
    } else if (item.category === 'swift') {
      markdownTable[8].push(getProjectLineString(item));
    } else if (item.category === 'macos') {
      markdownTable[10].push(getProjectLineString(item));
    } else {
      markdownTable[12].push(getProjectLineString(item));
    }
  });

  let markdown = mdstr.toString().replace(/<!--repos-start--\>(.*)\s+([\s\S]*?)(\s.+)?<!--repos-end-->/, `<!--repos-start-->\n\n${markdownTable.flat().join('\n')}\n\n<!--repos-end-->`);
  // //innerMarkdown = innerMarkdown.replace(/<!--repos-handbook-start-->(.*)\s+([\s\S]*?)(\s.+)?<!--repos-handbook-end-->/, `<!--repos-handbook-start-->\n\n${getMdTableStr(handbook)}\n\n<!--repos-handbook-end-->`)

  console.log(`\x1b[35;1m baseData data:\x1b[0m \x1b[32;1m${baseData.length}\x1b[0m`);
  fs.writeFileSync(mdPath, markdown);

})();

