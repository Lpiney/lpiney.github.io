export type FeaturedReading = {
  title: string;
  source: string;
  url: string;
  summaryZh: string;
  summaryEn: string;
  topics: string[];
};

export const featuredReading: FeaturedReading[] = [
  {
    title: 'Make All Your Tokens (and Your Brainwork) Count',
    source: 'DeepLearning.AI · The Batch',
    url: 'https://www.deeplearning.ai/the-batch/make-all-your-tokens-and-your-brainwork-count',
    summaryZh: '一篇关于如何更有意识地使用 AI、让 token 成本与人的思考都产生价值的文章。',
    summaryEn: 'A note on using AI deliberately, so that both token spend and human thought create real value.',
    topics: ['AI', 'Thinking', 'Workflow'],
  },
];
