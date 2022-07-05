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

const data = [
  {
    github: 'kktjs/kkt',
    homepage: 'https://kktjs.github.io/kkt/',
    npm: 'kkt',
    package: 'core/package.json'
  },
  {
    github: 'jaywcjlove/tsbb'
  },
  { github: 'jaywcjlove/hotkeys' },
  { github: 'jaywcjlove/idoc' },
  { github: 'jaywcjlove/rehype-rewrite' },
  { github: 'jaywcjlove/colors-cli' },
  { github: 'jaywcjlove/rehype-video' },
  { github: 'jaywcjlove/rehype-attr' },
  { github: 'jaywcjlove/rehype-ignore' },
  { github: 'jaywcjlove/compile-less' },
  { github: 'jaywcjlove/svgtofont' },
  { github: 'jaywcjlove/mocker-api' },
  { github: 'jaywcjlove/sgo' },
  { github: 'jaywcjlove/translater.js' },
  { github: 'jaywcjlove/store.js' },
  { github: 'jaywcjlove/cookie.js' },
  { github: 'jaywcjlove/markdown-to-html-cli' },
  { github: 'jaywcjlove/coverage-badges-cli' },
  { github: 'jaywcjlove/validator.js' },
  { github: 'jaywcjlove/github-rank' },
  { github: 'jaywcjlove/react-hotkeys' },
  { github: 'jaywcjlove/docs' },
  { github: 'jaywcjlove/nginx-tutorial' },
  { github: 'jaywcjlove/mysql-tutorial' },
  { github: 'jaywcjlove/dev-site' },
  { github: 'jaywcjlove/tools' },
  { github: 'jaywcjlove/linux-command' },
  { github: 'jaywcjlove/iNotify' },
  { github: 'jaywcjlove/awesome-uikit' },
  { github: 'jaywcjlove/awesome-mac' },
  { github: 'jaywcjlove/vim-web' },
  { github: 'jaywcjlove/action-ejs' },
  { github: 'jaywcjlove/changelog-generator' },
  { github: 'jaywcjlove/create-tag-action' },
  { github: 'jaywcjlove/create-tag-action' },
  { github: 'jaywcjlove/github-action-contributors' },
  { github: 'jaywcjlove/generated-badges' },
];

function getMdTableStr(dt = []) {
  const str = [
    ' project | homepage | stars | last commit | downloads | version ',
    ' :--- | --- | :--- | :--- | :--- | :--- ',
  ];
  
  dt.forEach(item => {
    const dt = [];
    dt[0] = item.github ? `[${item.github}](https://github.com/${item.github})` : '-';
    dt[1] = item.homepage ? `[\`#homepage\`](${item.homepage})` : '-';
    dt[2] = item.github ? `[![GitHub stars](https://img.shields.io/github/stars/${item.github}?style=flat)](https://github.com/${item.github}/stargazers)` : '-';
    dt[3] = item.github ? `[![GitHub last commit](https://img.shields.io/github/last-commit/${item.github}?style=flat&label=last)](https://github.com/${item.github}/commits)` : '-';
    dt[4] = item.npm ? `[![NPM Downloads](https://img.shields.io/npm/dm/${item.npm}.svg?label=&logo=npm&style=flat&labelColor=ffacab&color=dd4e4c)](https://www.npmjs.com/package/${item.npm})` : '-';
  
    const npmVersion = item.npm ? `[![npm version](https://img.shields.io/npm/v/${item.npm}.svg?logo=npm)](https://www.npmjs.com/package/${item.npm})` : '';
    const githubVersion = item.package ? `![GitHub package version](https://img.shields.io/github/package-json/v/${item.github}?style=flat&label=&labelColor=555&logo=github&filename=${item.package})` : '';
    dt[5] = `${npmVersion} ${githubVersion}`
    str.push(dt.join(' | '));
  });
  return str.join('\n');
}

const octokit = new Octokit({
  auth: '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'
});


function formatData(dt= []) {
  dt.forEach((item) => {
    const find = data.findIndex(m => m.github === item.full_name);
    if (find > -1) {
      if (packages[item.full_name]) {
        data[find].package = packages[item.full_name];
      }
      const findName = npmsExclude.findIndex(m => m === item.full_name);
      if (npms[item.full_name]) {
        data[find].npm = npms[item.full_name];
      } else if (findName < 0) {
        // console.log(item)
        data[find].npm = item.name;
      }
      data[find].homepage = item.homepage;
      if (data[find].npm) {
        data[find].package = 'package.json';
      }
    } else if (item.full_name !== 'jaywcjlove/package.json') {
      const newData = {
        github: item.full_name,
        homepage: item.homepage,
      }
      if (packages[item.full_name]) {
        newData.package = packages[item.full_name];
      }

      const findName = npmsExclude.findIndex(m => m === item.full_name);
      if (npms[item.full_name]) {
        newData.npm = npms[item.full_name];
      } else if (findName < 0) {
        newData.npm = item.name;
      }
      data.push({ ...newData });
      if (newData.npm) {
        newData.package = 'package.json';
      }
    }
  });
}

;(async () => {
  const result = await octokit.request('GET /users/{username}/repos?per_page=100&page=1', {
    username: 'jaywcjlove'
  });
  if (result.data && result.data.length) {
    console.log(`\x1b[35;1m page1 data:\x1b[0m \x1b[32;1m${result.data.length}\x1b[0m`)
    formatData(result.data);
  }
  const result2 = await octokit.request('GET /users/{username}/repos?per_page=100&page=2', {
    username: 'jaywcjlove'
  });
  if (result2.data && result2.data.length) {
    console.log(`\x1b[35;1m page2 data:\x1b[0m \x1b[32;1m${result2.data.length}\x1b[0m`);
    formatData(result2.data);
  }

  // [kkt](https://github.com/kktjs/kkt)
  // [`#homepage`](https://kktjs.github.io/kkt/)
  // [![GitHub stars](https://img.shields.io/github/stars/kktjs/kkt?style=flat)](https://github.com/kktjs/kkt/stargazers)
  // [![GitHub last commit](https://img.shields.io/github/last-commit/kktjs/kkt?style=flat&label=last)](https://github.com/kktjs/kkt/commits)
  // [![NPM Downloads](https://img.shields.io/npm/dm/kkt.svg?label=&logo=npm&style=flat&labelColor=ffacab&color=dd4e4c)](https://www.npmjs.com/package/kkt)
  // [![npm version](https://img.shields.io/npm/v/kkt.svg?logo=npm)](https://www.npmjs.com/package/kkt)
  // ![GitHub package version](https://img.shields.io/github/package-json/v/kktjs/kkt?style=flat&label=&labelColor=555&logo=github&filename=core%2Fpackage.json)
  // console.log('str>>>:::', str)
  
  const mdPath = path.resolve(process.cwd(), 'README.md');
  const mdstr = fs.readFileSync(mdPath);
  const mdResult = mdstr.toString().replace(/<!--repos-start--\>(.*)\s+([\s\S]*?)(\s.+)?<!--repos-end-->/, `<!--repos-start-->\n\n${getMdTableStr(data)}\n\n<!--repos-end-->`);
  
  fs.writeFileSync(mdPath, mdResult);

})();

