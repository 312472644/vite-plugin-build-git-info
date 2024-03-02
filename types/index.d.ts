import { Plugin } from 'vite';

type ShowFieldList = 'branch' | 'commit' | 'author' | 'date' | 'message' | 'isNewVersion';

type Config = {
  // git仓库地址名称
  gitOriginName: string;
  // 默认是否显示日志
  defaultShowLog: boolean;
  // 默认显示日志的函数名
  showLogFunName: string;
  // 需要显示的字段列表
  showFieldList: Array<ShowFieldList>;
  // label样式
  labelStyle: string;
  // value样式
  valueStyle: string;
};

declare function gitFlowInfo(config?: Config): Plugin;

export { gitFlowInfo };
