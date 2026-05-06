<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Quản lý Thẻ Độc giả</h2>
        <p class="mt-1 text-sm text-gray-500">Cấp mới và gia hạn thẻ. Quản lý công nợ thuộc bộ phận Kế toán.</p>
      </div>
      <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Cấp Thẻ Mới
      </button>
    </div>

    <div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div class="px-4 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <div class="relative w-72">
          <input type="text" class="block w-full p-2 pl-3 text-sm text-gray-900 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Tìm kiếm theo Mã ĐG, CCCD, Tên...">
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-white">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Mã ĐG</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Họ và Tên</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">CCCD</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Ngày Hết Hạn</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Trạng Thái Thẻ</th>
              <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span class="sr-only">Thao tác</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="reader in readers" :key="reader.maDG" class="hover:bg-gray-50">
              <td class="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">{{ reader.maDG }}</td>
              <td class="px-3 py-4 text-sm text-gray-700 whitespace-nowrap">{{ reader.hoTen }}</td>
              <td class="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">{{ reader.cccd }}</td>
              <td class="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">{{ reader.ngayHetHan }}</td>
              <td class="px-3 py-4 text-sm whitespace-nowrap">
                <span :class="reader.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {{ reader.isActive ? 'Đang hoạt động' : 'Hết hạn' }}
                </span>
              </td>
              <td class="px-3 py-4 text-sm text-right whitespace-nowrap sm:pr-6">
                <button class="text-blue-600 hover:text-blue-900 font-medium">Gia hạn</button>
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

const readers = ref([
  { maDG: 'DG2604001', hoTen: 'Hoàng Văn Hải', cccd: '066205XXXXXX', ngayHetHan: '2027-04-14', isActive: true },
  { maDG: 'DG2604088', hoTen: 'Nguyễn Thị B', cccd: '079199YYYYYY', ngayHetHan: '2025-12-30', isActive: false },
  { maDG: 'DG2604105', hoTen: 'Trần Văn C', cccd: '001202ZZZZZZ', ngayHetHan: '2026-10-10', isActive: true },
]);
</script>