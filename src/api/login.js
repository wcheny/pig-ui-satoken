/*
 *    Copyright (c) 2018-2025, lengleng All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * Neither the name of the yifan4cloud.com developer nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 * Author: lengleng (wangiegie@gmail.com)
 */
import request from '@/router/axios'
import store from '@/store'
import qs from 'qs'
import {getStore, setStore} from "@/util/store.js";
import website from "@/const/website.js";

export const loginByUsername = (username, password, code, randomStr) => {
  let dataObj = qs.stringify({'username': username, 'password': password})
  return request({
    url: '/auth/login',
    method: 'post',
    params: {randomStr, code},
    data: dataObj
  })
}

export const loginByMobile = (mobile, code) => {
  let dataObj = qs.stringify({'mobile': mobile, 'code': code})
  return request({
    url: '/auth/smsLogin',
    method: 'post',
    data: dataObj
  })
}

export const getUserInfo = () => {
  return request({
    url: '/admin/user/info',
    method: 'get'
  })
}

export const logout = () => {
  return request({
    url: '/auth/logout',
    method: 'delete'
  })
}


/**
 * 注册用户
 */
export const registerUser = (userInfo) => {
  return request({
    url: '/admin/register/user',
    method: 'post',
    data: userInfo
  })
}
