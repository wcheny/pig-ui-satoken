import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/admin/smslog/page',
    method: 'get',
    params: query
  })
}

export function getObj(id) {
  return request({
    url: '/admin/smslog/' + id,
    method: 'get'
  })
}
