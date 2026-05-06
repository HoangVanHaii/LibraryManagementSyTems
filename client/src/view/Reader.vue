<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        Tổng quan cá nhân
      </h2>
      <p class="mt-1 text-sm text-gray-500">
        Dữ liệu được lọc tự động bởi chính sách bảo mật Row-Level Security dưới CSDL.
      </p>
    </div>

    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div class="overflow-hidden bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-blue-50 p-3 rounded-full">
              <svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <div class="w-0 flex-1 ml-5">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Sách đang mượn</dt>
                <dd class="flex items-baseline text-2xl font-semibold text-gray-900">
                  {{ totalBorrowed }} <span class="ml-2 text-sm text-gray-500 font-medium">cuốn</span>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="overflow-hidden bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-red-50 p-3 rounded-full">
              <svg class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="w-0 flex-1 ml-5">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Tổng nợ phạt</dt>
                <dd class="flex items-baseline text-2xl font-semibold text-gray-900">
                  {{ totalDebt.toLocaleString('vi-VN') }} <span class="ml-2 text-sm text-gray-500 font-medium">VNĐ</span>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div class="px-4 py-5 border-b border-gray-200 sm:px-6 bg-gray-50 flex justify-between items-center">
        <div>
          <h3 class="text-base font-semibold leading-6 text-gray-900">Lịch sử mượn sách của bạn</h3>
          <p class="max-w-2xl mt-1 text-sm text-gray-500">
            Chỉ hiển thị các giao dịch thuộc mã độc giả của chính bạn.
          </p>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-white">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Mã Phiếu</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Tên Sách</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Ngày Mượn</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Hạn Trả</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Tình Trạng</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="book in borrowedHistory" :key="book.maPhieu" class="hover:bg-gray-50 transition-colors">
              <td class="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">
                {{ book.maPhieu }}
              </td>
              <td class="px-3 py-4 text-sm text-gray-700 whitespace-nowrap">
                {{ book.tenSach }}
              </td>
              <td class="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                {{ book.ngayMuon }}
              </td>
              <td class="px-3 py-4 text-sm whitespace-nowrap">
                <span :class="isOverdue(book.hanTra) ? 'text-red-600 font-bold' : 'text-gray-500'">
                  {{ book.hanTra }}
                </span>
              </td>
              <td class="px-3 py-4 text-sm whitespace-nowrap">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="book.status === 'Đang mượn' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'"
                >
                  {{ book.status }}
                </span>
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

// 1. Định nghĩa kiểu dữ liệu (TypeScript)
interface BorrowHistory {
  maPhieu: string;
  tenSach: string;
  ngayMuon: string;
  hanTra: string;
  status: 'Đang mượn' | 'Đã trả';
}

// 2. Giả lập dữ liệu mượn sách (Mock Data)
// Trong báo cáo, bạn giải thích đây là dữ liệu đã được lọc tự động từ DB trả lên.
const borrowedHistory = ref<BorrowHistory[]>([
  {
    maPhieu: 'PM001',
    tenSach: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    ngayMuon: '2026-04-01',
    hanTra: '2026-04-15',
    status: 'Đang mượn'
  },
  {
    maPhieu: 'PM005',
    tenSach: 'Designing Data-Intensive Applications',
    ngayMuon: '2026-03-20',
    hanTra: '2026-04-05',
    status: 'Đang mượn'
  },
  {
    maPhieu: 'PM012',
    tenSach: 'Vue.js Up and Running',
    ngayMuon: '2026-02-10',
    hanTra: '2026-02-25',
    status: 'Đã trả'
  }
]);

// 3. Các biến thống kê hiển thị trên Dashboard
const totalBorrowed = ref<number>(2);
const totalDebt = ref<number>(150000); // 150k tiền phạt do cuốn PM005 quá hạn

// 4. Logic kiểm tra sách quá hạn (để tô màu đỏ hạn trả)
const isOverdue = (dateString: string): boolean => {
  const dueDate = new Date(dateString);
  // Lấy mốc thời gian tĩnh để test giao diện
  const today = new Date('2026-04-14'); 
  return dueDate < today;
};
</script>