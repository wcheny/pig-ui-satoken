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

export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuWidth:100,
  menuAlign: 'center',
  align: 'center',
  searchMenuSpan: 6,
  viewBtn: false,
  addBtn: false,
  editBtn: false,
  column: [{
    label: '用户名',
    prop: 'userName',
    align: 'center'
  }, {
    label: "用户类型",
    prop: "userType",
    align: "center",
    overHidden: true
  },
    {
      label: "浏览器",
      prop: "browser",
      align: "center",
      overHidden: true
    }, {
      label: "操作系统",
      prop: "os",
      align: "center",
      overHidden: true
    }, {
      label: "IP",
      prop: "ipaddr",
      align: "center",
      overHidden: true
    }, {
      label: '令牌',
      prop: 'tokenId',
      align: 'center',
      overHidden: true,
      width:200
    }, {
      label: '创建时间',
      prop: 'loginTime',
      align: 'center',
      overHidden: true,
      width:170
    }, {
      label: '剩余时长(秒)',
      prop: 'tokenTimeout',
      align: 'center',
      overHidden: true
    }]
}
