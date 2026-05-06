<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 flex items-center">
          <svg class="w-8 h-8 mr-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          Nhật ký Kiểm toán Hệ thống (Audit Log)
        </h2>
        <p class="mt-1 text-sm text-gray-500 italic">
          Ghi lại mọi thao tác làm thay đổi dữ liệu (DML). Dữ liệu này là bất khả xâm phạm và không thể chỉnh sửa.
        </p>
      </div>

      <div class="flex space-x-3">
        <button class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors flex items-center shadow-sm">
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Xuất báo cáo (CSV)
        </button>
      </div>
    </div>

    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label class="block text-xs font-semibold text-gray-500 uppercase mb-1">Bảng tác động</label>
        <select class="block w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
          <option>Tất cả các bảng</option>
          <option>SACH</option>
          <option>NHAN_VIEN</option>
          <option>PHIEU_MUON</option>
        </select>
      </div>
      <div>
        <label class="block text-xs font-semibold text-gray-500 uppercase mb-1">Người thực hiện</label>
        <input type="text" placeholder="Mã nhân viên..." class="block w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
      </div>
      <div>
        <label class="block text-xs font-semibold text-gray-500 uppercase mb-1">Hành động</label>
        <div class="flex space-x-2">
          <span class="px-2 py-1 text-xs font-bold bg-green-100 text-green-700 rounded border border-green-200">INSERT</span>
          <span class="px-2 py-1 text-xs font-bold bg-blue-100 text-blue-700 rounded border border-blue-200">UPDATE</span>
          <span class="px-2 py-1 text-xs font-bold bg-red-100 text-red-700 rounded border border-red-200">DELETE</span>
        </div>
      </div>
      <div class="flex items-end">
        <button class="w-full bg-gray-900 text-white py-2 rounded-md text-sm font-bold hover:bg-black transition-colors">Áp dụng lọc</button>
      </div>
    </div>

    <div class="bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-800 text-white">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-xs font-bold uppercase tracking-wider sm:pl-6">Thời gian</th>
              <th scope="col" class="px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wider">Người dùng (DB User)</th>
              <th scope="col" class="px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wider">Hành động</th>
              <th scope="col" class="px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wider">Bảng tác động</th>
              <th scope="col" class="px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wider">Dữ liệu thay đổi (JSON)</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="log in auditLogs" :key="log.id" class="hover:bg-blue-50 transition-colors cursor-default">
              <td class="py-4 pl-4 pr-3 text-sm font-mono text-gray-600 whitespace-nowrap sm:pl-6 italic">
                {{ log.time }}
              </td>
              <td class="px-3 py-4 text-sm whitespace-nowrap font-bold text-gray-900">
                <div class="flex items-center">
                  <span class="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                  {{ log.user }}
                </div>
              </td>
              <td class="px-3 py-4 text-sm whitespace-nowrap">
                <span :class="getActionClass(log.action)" class="px-2 py-1 rounded text-xs font-black">
                  {{ log.action }}
                </span>
              </td>
              <td class="px-3 py-4 text-sm font-mono text-blue-700 whitespace-nowrap font-bold">
                [{{ log.table }}]
              </td>
              <td class="px-3 py-4 text-xs font-mono text-gray-500 max-w-xs truncate">
                {{ log.data }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const auditLogs = ref([
  { id: 1, time: '2026-04-14 10:15:32', user: 'Librarian_Account', action: 'INSERT', table: 'PHIEU_MUON', data: '{"maPhieu":"PM102", "maDG":"DG001", "maSach":"S005"}' },
  { id: 2, time: '2026-04-14 09:45:10', user: 'Accountant_User', action: 'UPDATE', table: 'DOC_GIA', data: '{"maDG":"DG001", "old_No": 50000, "new_No": 0}' },
  { id: 3, time: '2026-04-13 16:20:05', user: 'Warehouse_Mgr', action: 'UPDATE', table: 'SACH', data: '{"maSach":"S015", "old_Ton": 0, "new_Ton": 50}' },
  { id: 4, time: '2026-04-13 14:05:44', user: 'Admin_Sys', action: 'DELETE', table: 'NHAN_VIEN', data: '{"maNV":"NV088", "name":"Nguyễn Văn X"}' },
]);

const getActionClass = (action: string) => {
  switch (action) {
    case 'INSERT': return 'bg-green-100 text-green-800 border border-green-200';
    case 'UPDATE': return 'bg-blue-100 text-blue-800 border border-blue-200';
    case 'DELETE': return 'bg-red-100 text-red-800 border border-red-200';
    default: return 'bg-gray-100 text-gray-800';
  }
};
</script>