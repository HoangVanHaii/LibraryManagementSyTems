<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Tra cứu Thư viện</h2>
        <p class="mt-1 text-sm text-gray-500">Tìm kiếm và xem trạng thái sách trong kho.</p>
      </div>
      
      <div class="relative w-full sm:w-72">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input type="text" class="block w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500" placeholder="Tìm tên sách, tác giả...">
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="book in books" :key="book.maSach" class="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col">
        <div class="h-48 bg-gray-100 rounded-t-xl flex items-center justify-center border-b border-gray-200">
          <svg class="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
        </div>
        
        <div class="p-5 flex-1 flex flex-col">
          <div class="flex justify-between items-start mb-2">
            <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">{{ book.theLoai }}</span>
            <span class="text-xs font-medium text-gray-500">Kho: {{ book.soLuongTon }}</span>
          </div>
          <h3 class="text-lg font-bold text-gray-900 line-clamp-2 mb-1">{{ book.tenSach }}</h3>
          <p class="text-sm text-gray-500 mb-4">{{ book.tacGia }}</p>
          
          <div class="mt-auto">
            <button disabled class="w-full text-gray-400 bg-gray-100 cursor-not-allowed font-medium rounded-lg text-sm px-5 py-2.5 text-center border border-gray-200">
              Chỉ Thủ thư mới được tạo phiếu
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const books = ref([
  { maSach: 'S001', tenSach: 'Giáo trình Cơ sở dữ liệu', tacGia: 'Nhiều tác giả', theLoai: 'Giáo trình', soLuongTon: 15 },
  { maSach: 'S002', tenSach: 'Clean Architecture', tacGia: 'Robert C. Martin', theLoai: 'IT', soLuongTon: 3 },
  { maSach: 'S003', tenSach: 'Nhập môn Trí tuệ nhân tạo', tacGia: 'Stuart Russell', theLoai: 'Giáo trình', soLuongTon: 0 },
  { maSach: 'S004', tenSach: 'Vue.js 3 Design Patterns', tacGia: 'Pablo', theLoai: 'IT', soLuongTon: 5 },
]);
</script>