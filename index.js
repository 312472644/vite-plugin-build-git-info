import { formatDate, execShellCommand } from './utils/index.js';

// 字段对应的中文名称
const FIELD_NAME_MAP = new Map();
FIELD_NAME_MAP.set('commit', '提交commitId');
FIELD_NAME_MAP.set('author', '提交作者');
FIELD_NAME_MAP.set('date', '提交时间');
FIELD_NAME_MAP.set('message', '提交消息');
FIELD_NAME_MAP.set('isNewVersion', '是否为最新版本');
FIELD_NAME_MAP.set('branch', '分支名称');

// 所有可展示的字段列表
const ALL_FIELD_LIST = ['commit', 'branch', 'author', 'date', 'message', 'isNewVersion'];
// 默认展示的字段列表
const DEFAULT_SHOW_FIELD_LIST = ['commit', 'branch', 'author', 'date', 'isNewVersion'];

/**
 * @typedef {object} GitFlowInfoOptions
 * @property {string} params.gitOriginName git仓库地址名称
 * @property {boolean} params.defaultShowLog 默认是否显示日志
 * @property {string} params.showLogFunName 默认显示日志的函数名
 * @property {string[]} params.showFieldList 需要显示的字段列表
 * @property {string} params.labelStyle label样式
 * @property {string} params.valueStyle value样式
 */

/**
 * @typedef {object} GitCommitInfo
 * @property {string} commit 提交id
 * @property {string} author 提交作者
 * @property {string} date 提交日期
 * @property {string} message 提交信息
 * @property {boolean} isNewVersion 是否是最新版本
 * @property {string} branch 当前分支
 */

/**
 * 合并配置项
 * @param {GitFlowInfoOptions} options
 */
function mergeOptions(options) {
  // 默认配置
  const configOptions = {
    ...{
      gitOriginName: 'origin',
      defaultShowLog: true,
      showLogFunName: 'showGitLog',
      labelStyle: `font-size:11px;font-family:Microsoft YaHei, Arial;background:#35495e; padding: 3px 0 3px 10px; border-radius: 3px 0 0 3px; color: #fff;`,
      valueStyle: `font-size:11px;font-family:Microsoft YaHei, Arial;background:#41b883; padding: 3px 10px 3px 10px; border-radius: 0 3px 3px 0;  color: #fff;`,
    },
    ...options,
  };
  // 检查showFieldList字段列表中是否存在不支持的字段
  if (options?.showFieldList?.length > 0) {
    const checkFieldList = options.showFieldList.filter(field => !ALL_FIELD_LIST.includes(field));
    if (checkFieldList.length > 0) {
      console.warn('展示字段列表中存在不支持的字段', checkFieldList.join(' '));
      return null;
    }
  }
  configOptions.showFieldList = options?.showFieldList || DEFAULT_SHOW_FIELD_LIST;
  return configOptions;
}

/**
 * 获取git提交信息
 * @returns {Promise<GitCommitInfo>}
 */
function getGitCommitInfo() {
  return new Promise((resolve, reject) => {
    execShellCommand('git log -1').then((stdout, rej) => {
      if (rej) reject(rej);
      const stdoutArr = stdout.split('\n').filter(item => item);
      if (stdoutArr.length === 0) return;
      // 提取提交信息
      const commit = stdoutArr[0].split(' ')[1].trim();
      // 提取作者
      const author = stdoutArr[1].split('Author:')[1].trim();
      // 提取提交日期
      const date = formatDate(stdoutArr[2].split('Date:')[1].toString().trim());
      // 提取提交信息
      const message = stdoutArr[3].trim();
      resolve({
        commit,
        author,
        date,
        message,
      });
    });
  });
}

/**
 * 生成日志
 * @param {GitFlowInfoOptions} config
 */
async function generateLog(config) {
  let functionStr = '';
  try {
    const { gitOriginName, showFieldList, showLogFunName, defaultShowLog, labelStyle, valueStyle } =
      config;
    const branch = (await execShellCommand('git symbolic-ref --short HEAD')).trim();
    const hasDiff = await execShellCommand(`git diff ${branch} ${gitOriginName}/master`);
    const gitLogInfo = {
      ...(await getGitCommitInfo()),
      ...{ branch, isNewVersion: hasDiff ? '否' : '是' },
    };
    const logList = showFieldList.map(field => {
      return {
        label: FIELD_NAME_MAP.get(field),
        value: gitLogInfo[field] || '-',
      };
    });

    // 生成log信息
    const logStr = logList
      .map(item => {
        return `console.log("%c${item.label} %c${item.value}","${labelStyle}","${valueStyle}")`;
      })
      .join(';');
    if (defaultShowLog) {
      functionStr = logStr;
    }
    if (!defaultShowLog && showLogFunName) {
      functionStr = `function ${showLogFunName}(){${logStr}}`;
    }
  } catch (e) {
    console.error('生成log信息失败', e);
  } finally {
    return functionStr;
  }
}

/**
 * /**
 * 用于在浏览器中查看git提交信息
 * @param {GitFlowInfoOptions} config
 * @returns {import('vite').Plugin}
 */
function gitFlowInfo(config) {
  return {
    name: 'vite-git-flow-info',
    apply: 'build',
    transformIndexHtml: async function () {
      // 默认配置
      const configOptions = mergeOptions(config) || {};
      const log = await generateLog(configOptions);
      return [
        {
          tag: 'script',
          attrs: { defer: true },
          children: log,
          injectTo: 'body',
        },
      ];
    },
  };
}

export { gitFlowInfo };
