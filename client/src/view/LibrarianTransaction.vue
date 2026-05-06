<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Nghiệp vụ Mượn / Trả sách
        </h2>
        <p class="mt-1 text-sm text-gray-500">
          Quản lý luân chuyển tài liệu. Thu tiền phạt thuộc thẩm quyền của bộ phận Kế toán.
        </p>
      </div>
    </div>

    <div class="bg-white border border-blue-200 rounded-xl shadow-sm overflow-hidden">
      <div class="bg-blue-50 px-4 py-3 border-b border-blue-200">
        <h3 class="text-sm font-semibold text-blue-800 flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          Tạo Phiếu Mượn Nhanh
        </h3>
      </div>
      <form class="p-4 sm:p-6 bg-white" @submit.prevent="handleCreateSlip">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mã Độc giả</label>
            <input type="text" required placeholder="VD: DG2604001" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mã Sách</label>
            <input type="text" required placeholder="Quét mã vạch hoặc nhập mã" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
          </div>
          <div>
            <button type="submit" class="w-full bg-blue-600 text-white border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center items-center text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
              Ghi nhận mượn sách
            </button>
          </div>
        </div>
      </form>
    </div>

    <div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mt-8">
      <div class="px-4 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h3 class="text-base font-semibold leading-6 text-gray-900">Phiếu mượn đang lưu thông</h3>
        
        <div class="relative w-64">
          <input type="text" class="block w-full p-2 pl-3 text-sm text-gray-900 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Tìm theo Mã phiếu / Mã ĐG...">
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-white">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Mã Phiếu</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Độc giả</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Tên Sách</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Hạn Trả</th>
              <th scope="col" class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:pr-6">Thao tác</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="tx in transactions" :key="tx.maPhieu" class="hover:bg-gray-50">
              <td class="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">
                {{ tx.maPhieu }}
              </td>
              <td class="px-3 py-4 text-sm text-gray-700 whitespace-nowrap">
                {{ tx.tenDocGia }} <br>
                <span class="text-xs text-gray-500">{{ tx.maDG }}</span>
              </td>
              <td class="px-3 py-4 text-sm text-gray-700 whitespace-nowrap">
                <span class="truncate block max-w-xs" :title="tx.tenSach">{{ tx.tenSach }}</span>
                <span class="text-xs text-gray-500">{{ tx.maSach }}</span>
              </td>
              <td class="px-3 py-4 text-sm whitespace-nowrap">
                <span :class="isOverdue(tx.hanTra) ? 'text-red-600 font-bold' : 'text-gray-900'">
                  {{ tx.hanTra }}
                </span>
                <span v-if="isOverdue(tx.hanTra)" class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                  Quá hạn
                </span>
              </td>
              <td class="px-3 py-4 text-sm whitespace-nowrap text-right sm:pr-6">
                <button class="text-white bg-green-600 hover:bg-green-700 font-medium rounded-md text-xs px-3 py-1.5 transition-colors">
                  Nhận trả sách
                </button>
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

// 1. Mock Data: Danh sách phiếu mượn toàn hệ thống (Không bị lọc RLS như độc giả)
const transactions = ref([
  {
    maPhieu: 'PM005',
    maDG: 'DG2604001',
    tenDocGia: 'Hoàng Văn Hải',
    maSach: 'S002',
    tenSach: 'Designing Data-Intensive Applications',
    hanTra: '2026-04-05', // Quá hạn
  },
  {
    maPhieu: 'PM018',
    maDG: 'DG2604088',
    tenDocGia: 'Nguyễn Thị B',
    maSach: 'S015',
    tenSach: 'Cấu trúc dữ liệu và giải thuật',
    hanTra: '2026-04-20',
  },
  {
    maPhieu: 'PM022',
    maDG: 'DG2604105',
    tenDocGia: 'Trần Văn C',
    maSach: 'S001',
    tenSach: 'Giáo trình Cơ sở dữ liệu',
    hanTra: '2026-04-25',
  }
]);

const isOverdue = (dateString: string): boolean => {
  return new Date(dateString) < new Date('2026-04-14'); 
};

const handleCreateSlip = () => {
  alert('Đã gửi yêu cầu INSERT dữ liệu xuống bảng PHIEU_MUON!');
};
</script>