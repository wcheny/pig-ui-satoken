import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/admin/smstemplate/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/smstemplate',
    method: 'post',
    data: obj
  })
}

export function sendSms(obj) {
  return request({
    url: '/admin/smstemplate/send',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/smstemplate/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/admin/smstemplate/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/smstemplate',
    method: 'put',
    data: obj
  })
}
