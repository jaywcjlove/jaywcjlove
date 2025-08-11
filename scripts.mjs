import 'dotenv/config'
import fs from 'fs';
import path from 'path';
import { Octokit } from 'octokit';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// Configuration
const CONFIG = {
  USERNAME: 'jaywcjlove',
  PER_PAGE: 100,
  MAX_PAGES: 3, // 可配置最大页数
  REPO_JSON_PATH: './repo.json',
  DATA_JSON_PATH: './data.json',
  README_PATH: './README.md'
};

// Color constants for console output
const COLORS = {
  PURPLE: '\x1b[35;1m',
  GREEN: '\x1b[32;1m',
  RED: '\x1b[31;1m',
  RESET: '\x1b[0m'
};

/**
 * Load repository configuration data
 */
function loadRepoData() {
  try {
    return require(CONFIG.REPO_JSON_PATH);
  } catch (error) {
    console.warn(`${COLORS.RED}Warning: Could not load repo.json, using empty data${COLORS.RESET}`);
    return {};
  }
}

/**
 * Generate markdown table row for a project
 */
function getProjectLineString(item) {
  const cells = [
    item.github ? `[${item.github.replace(/^jaywcjlove\//, '')}](https://github.com/${item.github})` : '-',
    item.homepage ? `[\`#homepage\`](${item.homepage})` : '-',
    item.github && item.stars !== false 
      ? `[![GitHub stars](https://badgen.net/github/stars/${item.github}?style=flat&label=)](https://github.com/${item.github}/stargazers)` 
      : '  ',
    item.npm && item.lastCommit !== false
      ? `[![NPM Downloads](https://img.shields.io/npm/dm/${item.npm}.svg?label=&logo=npm&style=flat&labelColor=ffacab&color=dd4e4c)](https://www.npmjs.com/package/${item.npm})`
      : '  '
  ];
  
  return cells.join(' | ');
}

/**
 * Initialize Octokit client
 */
function createOctokitClient() {
  return new Octokit({ auth: process.env.AUTH || '' });
}

/**
 * Fetch repositories for a specific page
 */
async function fetchReposPage(octokit, page) {
  try {
    const result = await octokit.request('GET /users/{username}/repos', {
      username: CONFIG.USERNAME,
      per_page: CONFIG.PER_PAGE,
      page
    });
    
    console.log(`${COLORS.PURPLE}Page ${page} data:${COLORS.RESET} ${COLORS.GREEN}${result.data.length}${COLORS.RESET}`);
    return result.data;
  } catch (error) {
    console.error(`${COLORS.RED}Error fetching page ${page}:${COLORS.RESET}`, error.message);
    return [];
  }
}

/**
 * Fetch all repositories from GitHub API
 */
async function fetchAllRepos(octokit) {
  const allRepos = [];
  const promises = [];
  
  // 并行获取多个页面的数据
  for (let page = 1; page <= CONFIG.MAX_PAGES; page++) {
    promises.push(fetchReposPage(octokit, page));
  }
  
  const results = await Promise.all(promises);
  results.forEach(repos => allRepos.push(...repos));
  
  return allRepos.filter(Boolean);
}

/**
 * Comparator function for sorting by star count (descending)
 */
function compareByStars(a, b) {
  return b.stargazers_count - a.stargazers_count;
}

/**
 * Process repository data and merge with configuration
 */
function processRepoData(repos, repoData) {
  const processedRepos = {};
  
  repos.forEach(({ full_name, archived, ...rest }) => {
    if (!archived) {
      if (!repoData[full_name]) {
        processedRepos[full_name] = {};
      } else {
        processedRepos[full_name] = repoData[full_name];
      }
    } else {
      console.log(`${COLORS.PURPLE}Archived:${COLORS.RESET} https://github.com/${COLORS.GREEN}${full_name}${COLORS.RESET}`);
    }
  });
  
  return { ...repoData, ...processedRepos };
}

/**
 * Transform repository data for display
 */
function transformRepoData(repos, repoData) {
  return repos
    .filter(repo => !repo.archived)
    .map(({ name, full_name, homepage, watchers_count, forks_count, stargazers_count, description }) => {
      const result = {
        name,
        github: full_name,
        homepage,
        watchers_count,
        forks_count,
        stargazers_count
      };
      
      const repoConfig = repoData[full_name];
      if (repoConfig) {
        if (repoConfig.npm) {
          result.npm = repoConfig.npm_name || name;
        }
        Object.assign(result, {
          version: repoConfig.version,
          category: repoConfig.category,
          stars: repoConfig.stars,
          lastCommit: repoConfig.lastCommit
        });
      }
      return result;
    })
    .sort(compareByStars);
}

/**
 * Write data to file safely
 */
function writeFileSync(filePath, data) {
  try {
    const content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, content);
    console.log(`${COLORS.GREEN}✓ Written:${COLORS.RESET} ${filePath}`);
  } catch (error) {
    console.error(`${COLORS.RED}Error writing file ${filePath}:${COLORS.RESET}`, error.message);
    throw error;
  }
}

/**
 * Generate markdown table structure
 */
function generateMarkdownTable(baseData) {
  const categories = [
    { key: 'handbook', name: 'Handbook' },
    { key: 'action', name: 'Github Actions' },
    { key: 'rehype', name: 'Rehype Plugins' },
    { key: 'swift', name: 'SwiftUI Packages' },
    { key: 'macos', name: 'macOS App' },
    { key: 'other', name: 'Other Project' }
  ];
  
  const markdownSections = [];
  
  categories.forEach(category => {
    const items = baseData.filter(item => 
      category.key === 'other' 
        ? !item.category || !categories.slice(0, -1).some(c => c.key === item.category)
        : item.category === category.key
    );
    
    if (items.length > 0 || category.key === 'other') {
      markdownSections.push(`**${category.name}** | **Homepage** | **Stars** | **Downloads**`);
      markdownSections.push(':--- | --- | :--- | :---');
      items.forEach(item => {
        markdownSections.push(getProjectLineString(item));
      });
      markdownSections.push(''); // Empty line between sections
    }
  });
  
  return markdownSections.join('\n');
}

/**
 * Update README.md file with new content
 */
function updateReadmeFile(markdownContent) {
  try {
    const mdPath = path.resolve(process.cwd(), CONFIG.README_PATH);
    const mdstr = fs.readFileSync(mdPath, 'utf8');
    
    const updatedMarkdown = mdstr.replace(
      /<!--repos-start-->(.*?)<!--repos-end-->/s,
      `<!--repos-start-->\n\n${markdownContent}\n<!--repos-end-->`
    );
    
    writeFileSync(mdPath, updatedMarkdown);
  } catch (error) {
    console.error(`${COLORS.RED}Error updating README file:${COLORS.RESET}`, error.message);
    throw error;
  }
}

;(async () => {
  try {
    console.log(`${COLORS.PURPLE}Starting repository data collection...${COLORS.RESET}`);
    
    // Initialize
    const octokit = createOctokitClient();
    const repoData = loadRepoData();
    
    // Fetch all repositories
    const allRepos = await fetchAllRepos(octokit);
    console.log(`${COLORS.PURPLE}Total repositories fetched:${COLORS.RESET} ${COLORS.GREEN}${allRepos.length}${COLORS.RESET}`);
    
    // Process and save repository configuration
    const updatedRepoData = processRepoData(allRepos, repoData);
    writeFileSync(CONFIG.REPO_JSON_PATH, updatedRepoData);
    
    // Transform data for display
    const baseData = transformRepoData(allRepos, updatedRepoData);
    writeFileSync(CONFIG.DATA_JSON_PATH, baseData);
    
    // Generate markdown table
    const markdownContent = generateMarkdownTable(baseData);
    updateReadmeFile(markdownContent);
    
    console.log(`${COLORS.GREEN}✓ Process completed successfully!${COLORS.RESET}`);
    console.log(`${COLORS.PURPLE}Total processed repositories:${COLORS.RESET} ${COLORS.GREEN}${baseData.length}${COLORS.RESET}`);
    
  } catch (error) {
    console.error(`${COLORS.RED}Script execution failed:${COLORS.RESET}`, error.message);
    process.exit(1);
  }

})();

