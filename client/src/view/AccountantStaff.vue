<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Tra cứu Nhân sự & Tiền lương</h2>
        <p class="mt-1 text-sm text-gray-500">
          Chế độ xem đặc quyền của Kế toán. Các cột dữ liệu tài chính được bảo mật mức độ cao (Column-Level Security).
        </p>
      </div>
    </div>

    <div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div class="px-4 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <div class="relative w-72">
          <input type="text" class="block w-full p-2 pl-3 text-sm text-gray-900 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Tìm kiếm nhân viên...">
        </div>
        <span class="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded">
          Quyền truy cập: FULL_COLUMNS
        </span>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-white">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Mã NV</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Họ và Tên</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Chức vụ</th>
              <th scope="col" class="px-3 py-3.5 text-right text-sm font-semibold text-blue-700 bg-blue-50">Lương Cơ Bản</th>
              <th scope="col" class="px-3 py-3.5 text-right text-sm font-semibold text-blue-700 bg-blue-50">Phụ Cấp</th>
              <th scope="col" class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Ngày vào làm</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="staff in staffList" :key="staff.maNV" class="hover:bg-gray-50 transition-colors">
              <td class="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">{{ staff.maNV }}</td>
              <td class="px-3 py-4 text-sm text-gray-700 whitespace-nowrap font-medium">{{ staff.hoTen }}</td>
              <td class="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                <span class="px-2 py-1 rounded-md bg-gray-100 text-gray-800 text-xs italic">{{ staff.chucVu }}</span>
              </td>
              <td class="px-3 py-4 text-sm text-blue-800 whitespace-nowrap text-right font-mono font-bold bg-blue-50/30">
                {{ staff.luong.toLocaleString('vi-VN') }}
              </td>
              <td class="px-3 py-4 text-sm text-blue-800 whitespace-nowrap text-right font-mono bg-blue-50/30">
                {{ staff.phuCap.toLocaleString('vi-VN') }}
              </td>
              <td class="px-3 py-4 text-sm text-gray-500 whitespace-nowrap text-center">{{ staff.ngayVaoLam }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="rounded-md bg-blue-50 p-4 border border-blue-200">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3 flex-1 md:flex md:justify-between">
          <p class="text-sm text-blue-700">
            Dữ liệu lương và phụ cấp chỉ hiển thị cho Role <strong>Kế Toán</strong>. Các Role khác sẽ bị CSDL chặn truy cập vào hai cột này.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const staffList = ref([
  { maNV: 'NV001', hoTen: 'Nguyễn Minh Anh', chucVu: 'Thủ thư', luong: 8500000, phuCap: 500000, ngayVaoLam: '2023-01-15' },
  { maNV: 'NV002', hoTen: 'Lê Quang Bình', chucVu: 'Quản lý kho', luong: 9200000, phuCap: 1000000, ngayVaoLam: '2022-11-20' },
  { maNV: 'NV003', hoTen: 'Phạm Thị Lan', chucVu: 'Thủ thư', luong: 8500000, phuCap: 500000, ngayVaoLam: '2023-05-10' },
  { maNV: 'NV004', hoTen: 'Đỗ Hoàng Long', chucVu: 'Kế toán', luong: 12000000, phuCap: 1500000, ngayVaoLam: '2021-03-05' },
]);
</script>