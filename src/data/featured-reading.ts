export type FeaturedReading = {
  title: string;
  source: string;
  url: string;
  summaryZh: string;
  summaryEn: string;
  editorNoteZh: string;
  editorNoteEn: string;
  readerZh: string;
  readerEn: string;
  topics: string[];
};

export const featuredReading: FeaturedReading[] = [
  {
    title: 'Make All Your Tokens (and Your Brainwork) Count',
    source: 'DeepLearning.AI · The Batch',
    url: 'https://www.deeplearning.ai/the-batch/make-all-your-tokens-and-your-brainwork-count',
    summaryZh: '一篇关于如何更有意识地使用 AI：把模型的 token 和自己的注意力，都投入真正值得解决的问题。',
    summaryEn: 'A note on using AI deliberately: put both model tokens and human attention toward problems that are worth solving.',
    editorNoteZh: '别把 AI 当成替你思考的机器；把它用在扩展检索、生成备选方案与压缩重复劳动，把判断和问题定义留给自己。',
    editorNoteEn: 'Use AI to widen research, generate alternatives, and reduce repetition—while keeping judgment and problem framing human.',
    readerZh: '适合：正在把 AI 加入学习、写作或开发流程的人。',
    readerEn: 'For: people bringing AI into learning, writing, or development workflows.',
    topics: ['AI', 'Thinking', 'Workflow'],
  },
];
