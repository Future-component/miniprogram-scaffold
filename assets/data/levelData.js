var levelData = [{
    l: "Level 1",
    t: "引导并培养图书认知，培养阅读习惯",
    d: "激发兴趣、英语启蒙",
    ccss: 'Pre-K',
    cefr: 'PreA1',
    lexile: 'BR'
  },
  {
    l: "Level 2",
    t: "运用短句表达 意愿、情绪等，初步涉及学科知识",
    d: "自我表达、扩充视野",
    ccss: 'Pre-K',
    cefr: 'PreA1',
    lexile: 'BR'
  },
  {
    l: "Level 3",
    t: "培养语音语调、书写习惯、团队合作能力",
    d: "日常对话、语音培养",
    ccss: 'Pre-K',
    cefr: 'PreA1',
    lexile: '0-50L'
  },

  {
    l: "Level 3.5",
    t: "提升口语能力，能听懂英文小故事，培养阅读习惯",
    d: "积累词汇、培养阅读习惯",
    ccss: 'K',
    cefr: 'A1',
    lexile: '50-100L'
  },
  {
    l: "Level 4",
    t: "着重培养基础写作和对语句的严谨度和得体度的把控",
    d: "基础提升、习惯养成",
    ccss: 'K',
    cefr: 'A1',
    lexile: '50-150L'
  },
  {
    l: "Level 5",
    t: "提高孩子的语言习惯和逻辑思维，思考力的阅读",
    d: "听说读写、全面启动",
    ccss: 'K',
    cefr: 'A1',
    lexile: '150-290L'
  },

  {
    l: "Level 6",
    t: "通过输出场景的丰富度，提升写作技能",
    d: "提升写作技能",
    ccss: 'G1',
    cefr: 'A2',
    lexile: '290-390L'
  },
  {
    l: "Level 7",
    t: "建立语言逻辑思维，阅读习惯，口语日常交流",
    d: "真正建立起受益一生的阅读习惯",
    ccss: 'G1',
    cefr: 'A2',
    lexile: '390-500L'
  },
]

var matchData = {
  AAA: 'Level 1',
  AAB: 'Level 1',
  AAC: 'Level 1',
  ABA: 'Level 1',
  ABB: 'Level 1',
  ABC: 'Level 1',
  ACA: 'Level 1',
  ACB: 'Level 1',
  ACC: 'Level 1',
  BAA: 'Level 2',
  BAB: 'Level 2',
  BAC: 'Level 2',
  BBA: 'Level 2',
  BBB: 'Level 2',
  BBC: 'Level 3',
  BCA: 'Level 3',
  BCB: 'Level 3',
  BCC: 'Level 3',
  CAA: 'Level 3.5',
  CAB: 'Level 3',
  CAC: 'Level 3.5',
  CBA: 'Level 3.5',
  CBB: 'Level 3',
  CBC: 'Level 4',
  CCA: 'Level 4',
  CCB: 'Level 4',
  CCC: 'Level 5',
}

var processData = [
  {
    name:"填写报名信息",
    img:"/assets/images/test.jpg"
  }
]

module.exports = {
  levelData: levelData,
  matchData: matchData,
  processData: processData
}