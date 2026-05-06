<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Hồ sơ Độc giả</h2>
      <p class="mt-1 text-sm text-gray-500">Thông tin định danh được bảo vệ. Bạn chỉ có thể cập nhật thông tin liên lạc.</p>
    </div>

    <div class="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
      <form class="p-6 space-y-6">
        <div class="space-y-4">
          <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b pb-2">Thông tin định danh cốt lõi (Chỉ đọc)</h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Họ và tên</label>
              <input type="text" v-model="profile.hoTen" readonly class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-600 shadow-sm sm:text-sm cursor-not-allowed">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Mã Độc giả</label>
              <input type="text" v-model="profile.maDG" readonly class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-600 shadow-sm sm:text-sm cursor-not-allowed">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Số Căn cước công dân (CCCD)</label>
              <input type="text" v-model="profile.cccd" readonly class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-600 shadow-sm sm:text-sm cursor-not-allowed">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Ngày sinh</label>
              <input type="date" v-model="profile.ngaySinh" readonly class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-600 shadow-sm sm:text-sm cursor-not-allowed">
            </div>
          </div>
        </div>

        <div class="space-y-4 pt-4">
          <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b pb-2">Thông tin liên lạc (Có thể cập nhật)</h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Số điện thoại</label>
              <input type="tel" v-model="profile.sdt" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" v-model="profile.email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white">
            </div>
          </div>
        </div>

        <div class="pt-4 flex justify-end">
          <button type="button" class="bg-blue-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const profile = ref({
  maDG: 'DG2604001',
  hoTen: 'Hoàng Văn Hải',
  cccd: '066205XXXXXX',
  ngaySinh: '2005-01-01',
  sdt: '0987654321',
  email: 'hai.hoang@hcmue.edu.vn'
});
</script>