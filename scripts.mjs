import 'dotenv/config'
import fs from 'fs';
import path from 'path';
import { Octokit } from 'octokit';

const npms = {
  'kktjs/kkt': 'kkt',
  'jaywcjlove/hotkeys': 'hotkeys-js',
  'jaywcjlove/compile-less': 'compile-less-cli',
  'jaywcjlove/store.js': 'storejs',
  'jaywcjlove/cookie.js': 'cookiejs',
  'jaywcjlove/validator.js': 'validator.tool',
  'jaywcjlove/github-rank': '@wcj/github-rank',
  'jaywcjlove/react-hotkeys': 'react-hot-keys',
  'jaywcjlove/iNotify': '@wcjiang/notify',
  'jaywcjlove/FED': '@wcj/fed',
  'jaywcjlove/markdown-to-html': '@wcj/markdown-to-html',
  'jaywcjlove/html-to-markdown-cli': '@wcj/html-to-markdown',
  'jaywcjlove/ginx-editor': 'monaco-editor-nginx',
  'jaywcjlove/react-monacoeditor': '@uiw/react-monacoeditor',
  'jaywcjlove/rollup-plugin-less': '@wcj/rollup-plugin-less',
  'jaywcjlove/table-of-general-standard-chinese-characters': 'togscc',
  'jaywcjlove/webpack-plugin-manifest': 'webpack-manifest',
  'jaywcjlove/websocket': 'websocketjs',
  'jaywcjlove/whereis': '@wcjiang/whereis',
  'jaywcjlove/nginx-editor': 'monaco-editor-nginx',
  'jaywcjlove/generate-password': '@wcj/generate-password',
}

const versionGithubExclude = [
  "jaywcjlove/golang-tutorial",
  "jaywcjlove/sb",
  "jaywcjlove/jaywcjlove.github.io",
  "jaywcjlove/webpack-react-demo",
  "jaywcjlove/jaywcjlove",
  "jaywcjlove/react-native-typescript-example",
  "jaywcjlove/IE6PNG",
  "jaywcjlove/vue-koa-demo",
  "jaywcjlove/appstore",
  "jaywcjlove/outdatedbrowser",
  "jaywcjlove/spec",
  "jaywcjlove/FrontEndBlogCN",
  "jaywcjlove/debugger-terminator",
  "jaywcjlove/react-native",
  "jaywcjlove/ejs2-loader",
  "jaywcjlove/my-repos",
  "jaywcjlove/webpack-multipage-demo",
  "jaywcjlove/online-Tv",
  "jaywcjlove/animate.styl",
  "jaywcjlove/auto-gitee-mirror",
  "jaywcjlove/Proxy",
  "jaywcjlove/BlankTab",
  "jaywcjlove/react-native-macos-amac",
  "jaywcjlove/shouyinji",
];
const npmsExclude = [
  'jaywcjlove/swift-tutorial',
  'jaywcjlove/docs',
  'jaywcjlove/nginx-tutorial',
  'jaywcjlove/mysql-tutorial',
  'jaywcjlove/tools',
  'jaywcjlove/awesome-uikit',
  'jaywcjlove/vim-web',
  'jaywcjlove/action-ejs',
  'jaywcjlove/changelog-generator',
  'jaywcjlove/create-tag-action',
  'jaywcjlove/github-action-contributors',
  'jaywcjlove/amac',
  'jaywcjlove/animate.styl',
  'jaywcjlove/appstore',
  'jaywcjlove/auto-gitee-mirror',
  'jaywcjlove/AutoPrefixCSS',
  'jaywcjlove/BlankTab',
  'jaywcjlove/c-tutorial',
  'jaywcjlove/debugger-terminator',
  'jaywcjlove/doc-static',
  'jaywcjlove/docker-tutorial',
  'jaywcjlove/ejs2-loader',
  'jaywcjlove/FrontEndBlogCN',
  'jaywcjlove/git-tips',
  'jaywcjlove/github-action-package',
  'jaywcjlove/github-actions',
  'jaywcjlove/golang-tutorial',
  'jaywcjlove/google',
  'jaywcjlove/handbook',
  'jaywcjlove/hello-world-npm',
  'jaywcjlove/hexoThemeKacper',
  'jaywcjlove/html-tutorial',
  'jaywcjlove/IE6PNG',
  'jaywcjlove/jaywcjlove',
  'jaywcjlove/my-repos',
  'jaywcjlove/jaywcjlove.github.io',
  'jaywcjlove/loading-cli',
  'jaywcjlove/map-manager-report-location',
  'jaywcjlove/MDEditor',
  'jaywcjlove/nxylene',
  'jaywcjlove/nxylene',
  'jaywcjlove/online-Tv',
  'jaywcjlove/onlinenetwork',
  'jaywcjlove/oscnews',
  'jaywcjlove/outdatedbrowser',
  'jaywcjlove/Proxy',
  'jaywcjlove/react-native',
  'jaywcjlove/react-native-doc',
  'jaywcjlove/react-native-macos-amac',
  'jaywcjlove/react-native-typescript-example',
  'jaywcjlove/regexp-example',
  'jaywcjlove/rollup-demo',
  'jaywcjlove/sb',
  'jaywcjlove/shell-tutorial',
  'jaywcjlove/shouyinji',
  'jaywcjlove/spec',
  'jaywcjlove/swift-tutorial',
  'jaywcjlove/swiftui-example',
  'jaywcjlove/swiftui-markdown',
  'jaywcjlove/url-encode',
  'jaywcjlove/vue-koa-demo',
  'jaywcjlove/webpack-multipage-demo',
  'jaywcjlove/webpack-react-demo',
  'jaywcjlove/wxmp',
]

const packages = {
  'kktjs/kkt': 'core/package.json',
  'jaywcjlove/tsbb': 'packages/tsbb/package.json',
  'jaywcjlove/mocker-api': 'packages/core/package.json',
  'jaywcjlove/markdown-to-html-cli': 'packages/cli/package.json',
  'jaywcjlove/validator.js': 'packages/core/package.json',
  'jaywcjlove/tools': 'website/package.json',
}

/** category */
const handbookInclued = [
  'nginx-tutorial',
  'mysql-tutorial',
  'awesome-uikit',
  'awesome-mac',
  'c-tutorial',
  'docker-tutorial',
  'git-tips',
  'github-actions',
  'golang-tutorial',
  'handbook',
  'html-tutorial',
  'react-native',
  'regexp-example',
  'shell-tutorial',
  'swift-tutorial',
  'swiftui-example',
];
const handbook = [];
/**
 * [{
 *   github: 'kktjs/kkt',
 *   homepage: 'https://kktjs.github.io/kkt/',
 *   npm: 'kkt',
 *   package: 'core/package.json'
 * },]
 */
function getMdTableStr(dt = []) {
  const str = [
    'project | homepage | stars | last commit | downloads | version ',
    ':--- | --- | :--- | :--- | :--- | :--- ',
  ];
  
  dt.forEach(item => {
    const dt = [];
    dt[0] = item.github ? `[${item.github.replace(/^jaywcjlove\//, '')}](https://github.com/${item.github})` : '-';
    dt[1] = item.homepage ? `[\`#homepage\`](${item.homepage})` : '-';
    dt[2] = item.github ? `[![GitHub stars](https://img.shields.io/github/stars/${item.github}?style=flat)](https://github.com/${item.github}/stargazers)` : '-';
    dt[3] = item.github ? `[![GitHub last commit](https://img.shields.io/github/last-commit/${item.github}?style=flat&label=last)](https://github.com/${item.github}/commits)` : '-';
    dt[4] = item.npm ? `[![NPM Downloads](https://img.shields.io/npm/dm/${item.npm}.svg?label=&logo=npm&style=flat&labelColor=ffacab&color=dd4e4c)](https://www.npmjs.com/package/${item.npm})` : '-';
    // https://img.shields.io/github/v/release/jaywcjlove/awesome-mac
    const npmVersion = item.npm ? `[![npm version](https://img.shields.io/npm/v/${item.npm}.svg?logo=npm)](https://www.npmjs.com/package/${item.npm})` : '';
    const githubVersion = item.package ? `![GitHub package version](https://img.shields.io/github/v/tag/${item.github}?style=flat&label=&labelColor=555&logo=github)` : '';
    dt[5] = npmVersion ? npmVersion : githubVersion;
    str.push(dt.join(' | '));
  });
  return str.join('\n');
}

function compare(a, b) {
  if (a < b ) {
    return 1;
  }
  if (a > b ) {
    return -1;
  }
  return 0;
}

const octokit = new Octokit({ auth: process.env.AUTH || '' });
const reposData = [];

;(async () => {
  const result = await octokit.request('GET /users/{username}/repos?per_page=100&page=1', {
    username: 'jaywcjlove'
  });
  if (result.data && result.data.length) {
    reposData.push(result.data);
    console.log(`\x1b[35;1m page1 data:\x1b[0m \x1b[32;1m${result.data.length}\x1b[0m`);
  }
  const result2 = await octokit.request('GET /users/{username}/repos?per_page=100&page=2', {
    username: 'jaywcjlove'
  });
  if (result2.data && result2.data.length) {
    reposData.push(result2.data);
    console.log(`\x1b[35;1m page2 data:\x1b[0m \x1b[32;1m${result2.data.length}\x1b[0m`);
  }
  const baseData = reposData.flat()
    .map(({ name, full_name, homepage, watchers_count, forks_count, stargazers_count }) => {
      if (name === 'package.json') return;
      let pkg, npm = undefined;
      if (packages[full_name]) {
        pkg = packages[full_name];
      } else if (!versionGithubExclude.includes(full_name)) {
        pkg = 'package.json';
      }
      if (npms[full_name]) {
        npm = npms[full_name];
      } else if (!npmsExclude.includes(full_name)) {
        npm = name;
      }
      return {
        name, github: full_name, package: pkg, npm, homepage, watchers_count, forks_count, stargazers_count
      };
    })
    .filter(Boolean)
    .sort((a, b) => compare(a.stargazers_count, b.stargazers_count))
    .filter(repo => {
      if (handbookInclued.includes(repo.name)) {
        handbook.push(repo);
        return null;
      }
      return repo;

    })
    .filter(Boolean);

  const dataPath = path.relative(process.cwd(), 'data.json');
  await fs.writeFileSync(dataPath, JSON.stringify(baseData, null, 2));

  const mdPath = path.resolve(process.cwd(), 'README.md');
  const mdstr = fs.readFileSync(mdPath);

  let innerMarkdown = mdstr.toString().replace(/<!--repos-start--\>(.*)\s+([\s\S]*?)(\s.+)?<!--repos-end-->/, `<!--repos-start-->\n\n${getMdTableStr(baseData)}\n\n<!--repos-end-->`);
  innerMarkdown = innerMarkdown.replace(/<!--repos-handbook-start-->(.*)\s+([\s\S]*?)(\s.+)?<!--repos-handbook-end-->/, `<!--repos-handbook-start-->\n\n${getMdTableStr(handbook)}\n\n<!--repos-handbook-end-->`)

  fs.writeFileSync(mdPath, innerMarkdown);

})();

