import request from './request'

// 获取专家列表
export function getExperts(params) {
  return request({
    url: '/experts',
    method: 'get',
    params,
    silentError: true // 静默错误，使用fallback机制
  })
}

// 获取彩种信息
export function getLotteryTypes() {
  return request({
    url: '/lottery-types',
    method: 'get'
  })
}

// 获取开奖结果
export function getLotteryResults(params) {
  return request({
    url: '/lottery-results',
    method: 'get',
    params
  })
}