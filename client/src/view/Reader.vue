<template>
  <div class="space-y-6 p-2">
    <div>
      <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        Tổng quan cá nhân
      </h2>
      <p class="mt-1 text-sm text-gray-500">
        Dữ liệu được thống kê trực tiếp từ lõi CSDL thông qua chính sách bảo mật Row-Level Security (RLS).
      </p>
    </div>

    <div v-if="errorMessage" class="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl shadow-sm">
      <div class="flex">
        <p class="text-sm font-semibold text-red-700">{{ errorMessage }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div class="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-blue-50 p-3 rounded-xl text-blue-600">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <div class="w-0 flex-1 ml-5">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Sách đang mượn (Từ DB)</dt>
                <dd class="flex items-baseline text-2xl font-black text-gray-900 mt-0.5">
                  {{ isLoading ? '...' : totalBorrowed }} <span class="ml-1.5 text-xs font-bold text-gray-400">cuốn</span>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div 
        class="overflow-hidden bg-white rounded-xl shadow-sm border transition-all"
        :class="totalDebt > 0 ? 'border-l-4 border-l-red-500 bg-red-50/5 border-gray-200' : 'border-gray-200'"
      >
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0 p-3 rounded-xl" :class="totalDebt > 0 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-500'">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="w-0 flex-1 ml-5">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Tổng nợ phạt (Từ DB)</dt>
                <dd class="flex items-baseline text-2xl font-black mt-0.5" :class="totalDebt > 0 ? 'text-red-600' : 'text-gray-900'">
                  {{ isLoading ? '...' : totalDebt.toLocaleString('vi-VN') }} <span class="ml-1.5 text-xs font-bold" :class="totalDebt > 0 ? 'text-red-400' : 'text-gray-400'">VNĐ</span>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div class="px-4 py-5 border-b border-gray-200 sm:px-6 bg-gray-50 flex justify-between items-center">
        <div>
          <h3 class="text-base font-bold leading-6 text-gray-900">Lịch sử mượn sách của bạn</h3>
          <p class="max-w-2xl mt-1 text-xs text-gray-400 font-medium">
            Chỉ hiển thị các giao dịch thuộc mã độc giả của chính bạn.
          </p>
        </div>
      </div>

      <div v-if="isLoading" class="p-8 text-center text-sm text-gray-500 animate-pulse font-medium">
        Hệ thống RLS đang thiết lập đường truyền cô lập dữ liệu cá nhân...
      </div>

      <div v-else-if="borrowedHistory.length === 0" class="p-8 text-center text-sm text-gray-400 font-medium">
        Bạn chưa có lịch sử mượn trả sách nào tại thư viện.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 text-sm text-left">
          <thead class="bg-white">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 font-semibold text-gray-900 sm:pl-6">Mã Phiếu</th>
              <th scope="col" class="px-3 py-3.5 font-semibold text-gray-900">Tên Sách & Tác Giả</th>
              <th scope="col" class="px-3 py-3.5 font-semibold text-gray-900 text-center">Ngày Mượn</th>
              <th scope="col" class="px-3 py-3.5 font-semibold text-gray-900 text-center">Hạn Trả</th>
              <th scope="col" class="px-3 py-3.5 font-semibold text-red-900 text-right">Phạt tích lũy</th>
              <th scope="col" class="px-3 py-3.5 font-semibold text-gray-900 text-center pr-6">Tình Trạng</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 font-medium text-gray-700">
            <tr v-for="book in borrowedHistory" :key="book.MaPhieu + book.MaSach" class="hover:bg-gray-50 transition-colors">
              <td class="py-4 pl-4 pr-3 font-mono font-bold text-gray-900 whitespace-nowrap sm:pl-6">
                {{ book.MaPhieu }}
              </td>
              <td class="px-3 py-4">
                <span class="text-gray-900 font-bold block">{{ book.TenSach }}</span>
                <span class="text-[11px] text-gray-400 font-medium block">TG: {{ book.TacGia || 'Chưa cập nhật' }}</span>
              </td>
              <td class="px-3 py-4 text-gray-500 whitespace-nowrap text-center">
                {{ formatDate(book.NgayMuon) }}
              </td>
              <td class="px-3 py-4 whitespace-nowrap text-center font-mono font-bold">
                <span :class="isOverdueLogic(book) ? 'text-red-600 font-black animate-pulse' : 'text-gray-500'">
                  {{ formatDate(book.HanTra) }}
                </span>
              </td>
              <td class="px-3 py-4 text-right font-mono font-black whitespace-nowrap" :class="book.TienPhatKyNay > 0 ? 'text-red-600':'text-gray-400'">
                {{ book.TienPhatKyNay.toLocaleString('vi-VN') }}đ
              </td>
              <td class="px-3 py-4 whitespace-nowrap text-center pr-6">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border"
                  :class="getStatusClass(book)"
                >
                  {{ getStatusText(book) }}
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
import { ref, onMounted } from 'vue';
import axios from 'axios';

interface BorrowHistory {
  MaPhieu: string;
  MaSach: string;
  TenSach: string;
  TacGia: string;
  NgayMuon: string;
  HanTra: string;
  NgayTraThucTe: string | null;
  TinhTrangKhiTra: string | null;
  TienPhatKyNay: number; // Đón nhận giá trị phạt động từ v_LichSuMuon
}

const borrowedHistory = ref<BorrowHistory[]>([]);
const totalBorrowed = ref<number>(0);
const totalDebt = ref<number>(0);     
const isLoading = ref(false);
const errorMessage = ref('');

const getAuthHeaders = () => {
  const sessionRaw = localStorage.getItem('user_session');
  if (!sessionRaw) throw new Error('Hết hạn phiên làm việc. Vui lòng đăng nhập lại!');
  const session = JSON.parse(sessionRaw);
  return { Authorization: `Bearer ${session.token}` };
};

// API 1: Tải lịch sử chi tiết từ sp_DocGia_XemLichSuMuon
const loadBorrowHistory = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/reader/history', { headers: getAuthHeaders() });
    borrowedHistory.value = response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Không thể đồng bộ bảng lịch sử.');
  }
};

// API 2: Tải tổng nợ phạt real-time từ sp_DocGia_LayTongNoPhat
const loadDashboardStats = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/reader/dashboard-stats', { headers: getAuthHeaders() });
    // Đồng bộ khớp với cấu trúc gộp dữ liệu từ Controller Backend của nhóm bạn
    totalBorrowed.value = response.data.SoSachDangMuon || 0;
    totalDebt.value = response.data.TongTienPhat || 0;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Không thể đồng bộ số liệu Dashboard.');
  }
};

const initPageData = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    await Promise.all([loadBorrowHistory(), loadDashboardStats()]);
  } catch (error: any) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
};

// Hàm nội bộ kiểm tra trạng thái quá hạn
const isOverdueLogic = (book: BorrowHistory): boolean => {
  if (book.NgayTraThucTe) return false;
  return new Date(book.HanTra) < new Date();
};

// Hàm bóc chuỗi nhãn văn bản trạng thái hiển thị
const getStatusText = (book: BorrowHistory): string => {
  if (book.NgayTraThucTe) {
    return book.TienPhatKyNay > 0 ? 'Đã trả (Có phạt)' : 'Đã hoàn trả';
  }
  return isOverdueLogic(book) ? 'Quá hạn trả' : 'Đang mượn';
};

// Hàm kết xuất Class CSS màu sắc tương thích nhãn trạng thái
const getStatusClass = (book: BorrowHistory): string => {
  if (book.NgayTraThucTe) {
    return book.TienPhatKyNay > 0 
      ? 'bg-amber-50 text-amber-800 border-amber-200' 
      : 'bg-green-50 text-green-800 border-green-200';
  }
  return isOverdueLogic(book) 
    ? 'bg-red-100 text-red-700 border-red-300 animate-pulse' 
    : 'bg-yellow-50 text-yellow-800 border border-yellow-200';
};

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('vi-VN');
};

onMounted(() => {
  initPageData();
});
</script>