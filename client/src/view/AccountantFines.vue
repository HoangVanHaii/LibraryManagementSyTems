<template>
  <div class="space-y-6 relative">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Quản lý Thu Phạt
        </h2>
        <p class="mt-1 text-sm text-gray-500">
          Nghiệp vụ tất toán công nợ. Số tiền phạt được CSDL tính toán tự động và không thể chỉnh sửa (Anti-tamper).
        </p>
      </div>
    </div>

    <div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div class="px-4 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h3 class="text-base font-semibold leading-6 text-gray-900">Danh sách Độc giả có công nợ</h3>
        <div class="relative w-64">
          <input type="text" class="block w-full p-2 pl-3 text-sm text-gray-900 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Tìm theo Mã ĐG...">
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-white">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Mã Độc Giả</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Họ và Tên</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Lý do phạt</th>
              <th scope="col" class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Tổng Nợ (VNĐ)</th>
              <th scope="col" class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:pr-6">Thao Tác</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="debt in debts" :key="debt.maDG" class="hover:bg-gray-50">
              <td class="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">{{ debt.maDG }}</td>
              <td class="px-3 py-4 text-sm text-gray-700 whitespace-nowrap">{{ debt.hoTen }}</td>
              <td class="px-3 py-4 text-sm text-red-600 whitespace-nowrap">{{ debt.lyDo }}</td>
              <td class="px-3 py-4 text-sm font-bold text-red-600 whitespace-nowrap text-right">
                {{ debt.soTien.toLocaleString('vi-VN') }}
              </td>
              <td class="px-3 py-4 text-sm whitespace-nowrap text-right sm:pr-6">
                <button @click="openPaymentModal(debt)" class="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors">
                  Thu Tiền
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="selectedDebt" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-bold text-gray-900">Phiếu Thu Tiền</h3>
          <button @click="selectedDebt = null" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-500 uppercase">Mã Độc Giả</label>
              <p class="mt-1 text-sm font-semibold text-gray-900">{{ selectedDebt.maDG }}</p>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 uppercase">Họ và Tên</label>
              <p class="mt-1 text-sm font-semibold text-gray-900">{{ selectedDebt.hoTen }}</p>
            </div>
          </div>
          
          <div class="pt-2 border-t border-gray-100">
            <label class="block text-xs font-medium text-gray-500 uppercase">Lý do thu</label>
            <p class="mt-1 text-sm text-gray-900">{{ selectedDebt.lyDo }}</p>
          </div>

          <div class="pt-4">
            <label class="block text-sm font-medium text-gray-900 mb-1">Số tiền thu thực tế (VNĐ)</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>
              <input 
                type="text" 
                readonly 
                disabled
                :value="selectedDebt.soTien.toLocaleString('vi-VN')" 
                class="block w-full p-3 pl-10 text-lg font-bold text-red-700 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed focus:ring-0"
              >
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span class="text-gray-500 text-sm font-medium">Hệ thống tự tính</span>
              </div>
            </div>
            <p class="mt-2 text-xs text-red-500 flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Trường dữ liệu bị khóa để đảm bảo toàn vẹn kế toán.
            </p>
          </div>
        </div>

        <div class="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button @click="selectedDebt = null" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Hủy</button>
          <button @click="confirmPayment" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Xác nhận thanh toán
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Debt {
  maDG: string;
  hoTen: string;
  lyDo: string;
  soTien: number;
}

const debts = ref<Debt[]>([
  { maDG: 'DG2604001', hoTen: 'Hoàng Văn Hải', lyDo: 'Quá hạn trả sách (S002) - 10 ngày', soTien: 150000 },
  { maDG: 'DG2604105', hoTen: 'Trần Văn C', lyDo: 'Làm mất sách (S015)', soTien: 110000 },
]);

const selectedDebt = ref<Debt | null>(null);

const openPaymentModal = (debt: Debt) => {
  selectedDebt.value = debt;
};

const confirmPayment = () => {
  alert('Đã ghi nhận thanh toán thành công!');
  selectedDebt.value = null;
};
</script>