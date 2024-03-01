import { exec } from 'child_process';

/**
 * 时间格式化
 * @param {*} date
 * @returns {String} yyyy-MM-dd hh:mm:ss
 */
export function formatDate(date = new Date()) {
  const y = date.getFullYear();
  const m = padStart(date.getMonth() + 1, 2, '0');
  const d = padStart(date.getDate(), 2, '0');
  const h = padStart(date.getHours(), 2, 0);
  const min = padStart(date.getMinutes(), 2, 0);
  const s = padStart(date.getSeconds(), 2, 0);
  return `${y}-${m}-${d} ${h}:${min}:${s}`;
}

/**
 * 字符串填充
 * @param {string} str 目标字符串
 * @param {number} length 补充后的长度
 * @param {string} char 补充的字符
 * @returns {string}
 */
export function padStart(str, length, char) {
  return str.toString().padStart(length, char);
}

/**
 * shell命令执行执行
 * @param {string} cmd shell命令
 * @returns {Promise<string>} 执行结果
 */
export function execShellCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout) => {
      if (error) reject(error);
      resolve(stdout);
    });
  });
}