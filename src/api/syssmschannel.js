import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/admin/smschannel/page',
    method: 'get',
    params: query
  })
}

export function fetchSimpleList() {
  return request({
    url: '/admin/smschannel/all_simple',
    method: 'get'
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/smschannel',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/smschannel/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/admin/smschannel/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/smschannel',
    method: 'put',
    data: obj
  })
}
