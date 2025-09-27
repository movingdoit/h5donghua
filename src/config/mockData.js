/**
 * 虚拟数据配置文件
 * 统一管理所有模块的虚拟数据
 */

// 专家数据配置 - 支持按期数和彩种区分
export const MOCK_EXPERTS = {
  paisan: {
    shiqibang: [
      {
        id: 1,
        name: '排3大师',
        avatar: '',
        level: '排3专家',
        description: '近10中9，最高连中3',
        isHot: true,
        winRate: 90,
        maxStreak: 9,
        currentStreak: 9
      },
      {
        id: 2,
        name: '三码王',
        avatar: '',
        level: '排3高手',
        description: '近10中9，最高连中3',
        isHot: true,
        winRate: 80,
        maxStreak: 8,
        currentStreak: 5
      }
    ],
    ershiqibang: [
      {
        id: 3,
        name: '定位专家',
        avatar: '',
        level: '定位A',
        description: '近10中9，最高连中3',
        isHot: true,
        winRate: 90,
        maxStreak: 18,
        currentStreak: 15
      },
      {
        id: 4,
        name: '精准预测',
        avatar: '',
        level: '排3分析师',
        description: '近10中9，最高连中3',
        isHot: true,
        winRate: 80,
        maxStreak: 16,
        currentStreak: 8
      }
    ],
    sanshiqibang: [
      {
        id: 5,
        name: '长期稳定',
        avatar: '',
        level: '排3大师',
        description: '近10中9，最高连中3',
        isHot: true,
        winRate: 83,
        maxStreak: 25,
        currentStreak: 12
      },
      {
        id: 6,
        name: '数据分析',
        avatar: '',
        level: '排3专家',
        description: '近10中9，最高连中3',
        isHot: false,
        winRate: 73,
        maxStreak: 22,
        currentStreak: 6
      }
    ],
    lianhongbang: [
      {
        id: 7,
        name: '连红之王',
        avatar: '',
        level: '排3王者',
        description: '近10中9，最高连中3',
        isHot: true,
        winRate: 95,
        maxStreak: 25,
        currentStreak: 20
      },
      {
        id: 8,
        name: '稳定输出',
        avatar: '',
        level: '排3高手',
        description: '近10中9，最高连中3',
        isHot: true,
        winRate: 88,
        maxStreak: 18,
        currentStreak: 15
      }
    ]
  },
  sandi: {
    shiqibang: [
      {
        id: 1,
        name: '3D之王',
        avatar: '',
        level: '3D专家',
        description: '近10中9，最高连中3',
        isHot: true,
        winRate: 80,
        maxStreak: 8,
        currentStreak: 6
      },
      {
        id: 2,
        name: '福彩高手',
        avatar: '',
        level: '3D大师',
        description: '近10中9，最高连中3',
        isHot: true,
        winRate: 90,
        maxStreak: 9,
        currentStreak: 7
      }
    ],
    ershiqibang: [
      {
        id: 3,
        name: '三维预测',
        avatar: '',
        level: '3D分析师',
        description: '近10中9，最高连中3',
        isHot: true,
        winRate: 80,
        maxStreak: 16,
        currentStreak: 10
      },
      {
        id: 4,
        name: '数字达人',
        avatar: '',
        level: '3D高手',
        description: '近10中9，最高连中3',
        isHot: false,
        winRate: 70,
        maxStreak: 14,
        currentStreak: 5
      }
    ],
    sanshiqibang: [
      {
        id: 5,
        name: '3D大师',
        avatar: '',
        level: '3D王者',
        description: '近10中9，最高连中3',
        isHot: true,
        winRate: 80,
        maxStreak: 24,
        currentStreak: 18
      }
    ],
    lianhongbang: [
      {
        id: 6,
        name: '3D连红王',
        avatar: '',
        level: '3D传奇',
        description: '近10中9，最高连中3',
        isHot: true,
        winRate: 92,
        maxStreak: 28,
        currentStreak: 22
      }
    ]
  }
}

// 开奖结果数据配置
export const MOCK_LOTTERY_RESULTS = {
  paisan: [
    {
      id: 1,
      period: '2024001',
      numbers: ['1', '2', '3'],
      drawTime: '2024-01-01 20:30:00',
      prize: '1040元'
    },
    {
      id: 2,
      period: '2024002',
      numbers: ['4', '5', '6'],
      drawTime: '2024-01-02 20:30:00',
      prize: '1040元'
    },
    {
      id: 3,
      period: '2024003',
      numbers: ['7', '8', '9'],
      drawTime: '2024-01-03 20:30:00',
      prize: '1040元'
    }
  ],
  sandi: [
    {
      id: 1,
      period: '2024001',
      numbers: ['3', '1', '5'],
      drawTime: '2024-01-01 21:15:00',
      prize: '1040元'
    },
    {
      id: 2,
      period: '2024002',
      numbers: ['8', '2', '7'],
      drawTime: '2024-01-02 21:15:00',
      prize: '1040元'
    },
    {
      id: 3,
      period: '2024003',
      numbers: ['0', '9', '4'],
      drawTime: '2024-01-03 21:15:00',
      prize: '1040元'
    }
  ],
  kuaile8: [
    {
      id: 1,
      period: '2024001',
      numbers: ['01', '05', '12', '18', '23', '34', '45', '56', '67', '78'],
      drawTime: '2024-01-01 22:00:00',
      prize: '10000元'
    },
    {
      id: 2,
      period: '2024002',
      numbers: ['02', '08', '15', '21', '29', '36', '42', '53', '64', '75'],
      drawTime: '2024-01-02 22:00:00',
      prize: '5000元'
    }
  ]
}

// 彩种信息配置
export const MOCK_LOTTERY_TYPES = [
  {
    id: 1,
    name: '排3',
    code: 'paisan',
    description: '排列三',
    drawTime: '每日20:30',
    minBet: 2,
    maxPrize: 1040
  },
  {
    id: 2,
    name: '3D',
    code: 'sandi',
    description: '福彩3D',
    drawTime: '每日21:15',
    minBet: 2,
    maxPrize: 1040
  },
  {
    id: 3,
    name: '快乐8',
    code: 'kuaile8',
    description: '快乐8',
    drawTime: '每日22:00',
    minBet: 2,
    maxPrize: 10000000
  }
]

// 用户信息配置
export const MOCK_USER_INFO = {
  id: 1,
  username: 'demo_user',
  nickname: '演示用户',
  avatar: '',
  phone: '138****8888',
  balance: 1000.00,
  points: 500,
  level: 'VIP1',
  registerTime: '2024-01-01',
  lastLoginTime: '2024-01-06'
}

// 统计数据配置
export const MOCK_STATISTICS = {
  totalUsers: 10000,
  todayActive: 1500,
  totalBets: 50000,
  todayBets: 800,
  totalPrize: 1000000,
  todayPrize: 15000
}

// 键名映射表 - 用于前端显示和数据转换
export const KEY_MAPPINGS = {
  // 彩种映射
  lottery: {
    paisan: '排3',
    sandi: '3D',
    kuaile8: '快乐8'
  },
  // 期数映射
  period: {
    shiqibang: '10期榜',
    ershiqibang: '20期榜',
    sanshiqibang: '30期榜',
    lianhongbang: '连红榜'
  }
}