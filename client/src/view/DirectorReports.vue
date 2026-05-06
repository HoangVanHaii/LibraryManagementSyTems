<template>
  <div class="space-y-6">
    <div class="border-b border-gray-200 pb-5">
      <h2 class="text-2xl font-bold text-gray-900">Báo cáo & Phân tích Chiến lược</h2>
      <p class="mt-1 text-sm text-gray-500">Dữ liệu tổng hợp từ toàn bộ các phân hệ: Nhân sự, Kho sách và Tài chính.</p>
    </div>

    <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
      <div v-for="stat in stats" :key="stat.name" class="bg-white px-4 py-5 shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <dt class="text-sm font-medium text-gray-500 truncate">{{ stat.name }}</dt>
        <dd class="mt-1 text-3xl font-semibold text-blue-600">{{ stat.value }}</dd>
        <div class="mt-2 flex items-center text-sm text-green-600 font-medium">
          <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          {{ stat.trend }}
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Lưu lượng Mượn sách theo tháng</h3>
        <div class="h-64 flex items-end justify-between space-x-2 px-2">
          <div v-for="bar in chartData" :key="bar.label" class="flex flex-col items-center flex-1 group">
            <div 
              class="w-full bg-blue-500 rounded-t-sm transition-all duration-500 hover:bg-blue-600 relative cursor-pointer" 
              :style="{ height: bar.height + '%' }"
            >
              <span class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {{ bar.value }}
              </span>
            </div>
            <span class="mt-2 text-xs text-gray-500 font-medium">{{ bar.label }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Top 5 Sách mượn nhiều nhất</h3>
        <ul class="space-y-4">
          <li v-for="(book, index) in topBooks" :key="index" class="flex items-center">
            <span class="w-6 text-sm font-bold text-gray-400">{{ index + 1 }}</span>
            <div class="flex-1 ml-2">
              <div class="flex justify-between mb-1">
                <span class="text-sm font-medium text-gray-700 truncate w-48">{{ book.name }}</span>
                <span class="text-sm font-semibold text-blue-600">{{ book.count }} lượt</span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-1.5">
                <div class="bg-blue-600 h-1.5 rounded-full" :style="{ width: book.percent + '%' }"></div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const stats = ref([
  { name: 'Tổng doanh thu phạt', value: '45.200.000đ', trend: '+12% so với tháng trước' },
  { name: 'Độc giả mới', value: '1.240', trend: '+5.4% tăng trưởng' },
  { name: 'Sách đã nhập kho', value: '856', trend: 'Hoàn thành 95% chỉ tiêu' },
]);

const chartData = ref([
  { label: 'T1', height: 40, value: 400 },
  { label: 'T2', height: 65, value: 650 },
  { label: 'T3', height: 80, value: 800 },
  { label: 'T4', height: 95, value: 950 }, // Hiện tại
  { label: 'T5', height: 0, value: 0 },
  { label: 'T6', height: 0, value: 0 },
]);

const topBooks = ref([
  { name: 'Cơ sở dữ liệu nâng cao', count: 342, percent: 90 },
  { name: 'Clean Code', count: 285, percent: 75 },
  { name: 'Vue.js for Beginners', count: 210, percent: 55 },
  { name: 'SQL Injection Defense', count: 180, percent: 45 },
  { name: 'Node.js Design Patterns', count: 150, percent: 38 },
]);
</script>