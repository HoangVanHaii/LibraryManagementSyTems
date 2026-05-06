<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Tra cứu Kho sách</h2>
        <p class="mt-1 text-sm text-gray-500">Chỉ có quyền xem (Read-only). Nhập/xuất kho thuộc quyền của Quản lý Kho.</p>
      </div>
      
      </div>

    <div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div class="px-4 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <div class="relative w-full max-w-md">
          <input type="text" class="block w-full p-2 pl-3 text-sm text-gray-900 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Nhập tên sách, mã sách, tác giả...">
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-white">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Mã Sách</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Tên Sách</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Thể Loại</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Tồn Kho</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Vị Trí Kệ</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="book in books" :key="book.maSach" class="hover:bg-gray-50">
              <td class="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">{{ book.maSach }}</td>
              <td class="px-3 py-4 text-sm text-gray-700 font-medium">{{ book.tenSach }} <br> <span class="text-xs text-gray-500 font-normal">{{ book.tacGia }}</span></td>
              <td class="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">{{ book.theLoai }}</td>
              <td class="px-3 py-4 text-sm whitespace-nowrap">
                <span :class="book.soLuongTon > 0 ? 'text-green-600 font-bold' : 'text-red-500'">{{ book.soLuongTon }}</span>
              </td>
              <td class="px-3 py-4 text-sm text-gray-700 whitespace-nowrap font-mono">{{ book.viTriKe }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const books = ref([
  { maSach: 'S001', tenSach: 'Giáo trình Cơ sở dữ liệu', tacGia: 'Nhiều tác giả', theLoai: 'Giáo trình', soLuongTon: 15, viTriKe: 'Khu A - Kệ 01' },
  { maSach: 'S002', tenSach: 'Designing Data-Intensive Applications', tacGia: 'Martin Kleppmann', theLoai: 'IT', soLuongTon: 2, viTriKe: 'Khu B - Kệ 05' },
  { maSach: 'S015', tenSach: 'Cấu trúc dữ liệu và giải thuật', tacGia: 'Nguyễn Văn A', theLoai: 'Giáo trình', soLuongTon: 0, viTriKe: 'Khu A - Kệ 02' },
]);
</script>