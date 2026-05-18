<template>
  <div class="space-y-6 relative">
    
    <Transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="toast.show" class="fixed top-5 right-5 z-50 max-w-sm w-full bg-white shadow-xl rounded-xl border pointer-events-auto overflow-hidden">
        <div class="p-4 flex items-start">
          <div v-if="toast.type === 'success'" class="flex-shrink-0 text-emerald-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div v-else class="flex-shrink-0 text-red-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-bold text-gray-900">{{ toast.type === 'success' ? 'Thành công' : 'Lỗi nghiệp vụ' }}</p>
            <p class="mt-1 text-xs font-semibold text-gray-500 leading-normal">{{ toast.message }}</p>
          </div>
        </div>
      </div>
    </Transition>

    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Nghiệp vụ Mượn / Trả sách
        </h2>
        <p class="mt-1 text-sm text-gray-500">Quản lý luân chuyển tài liệu. Thu tiền phạt thuộc thẩm quyền của bộ phận Kế toán.</p>
      </div>
    </div>

    <div class="bg-white border border-blue-200 rounded-xl shadow-sm overflow-hidden">
      <div class="bg-blue-50 px-4 py-3 border-b border-blue-200">
        <h3 class="text-sm font-semibold text-blue-800 flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
          Tạo Phiếu Mượn Nhanh
        </h3>
      </div>
      <form class="p-4 sm:p-6 bg-white" @submit.prevent="handleCreateSlip">
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mã Độc giả</label>
            <input v-model="borrowForm.maDG" type="text" required placeholder="VD: DG001" class="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mã Sách</label>
            <input v-model="borrowForm.maSach" type="text" required placeholder="VD: S001" class="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Số Ngày Mượn</label>
            <select v-model="borrowForm.soNgayMuon" class="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <option value="7">7 ngày</option>
              <option value="14">14 ngày</option>
              <option value="30">30 ngày</option>
            </select>
          </div>
          <div>
            <button type="submit" :disabled="isSubmitting" class="w-full bg-blue-600 text-white rounded-md shadow-sm py-2 px-4 inline-flex justify-center items-center text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400">
              {{ isSubmitting ? 'Đang lập...' : 'Ghi nhận mượn sách' }}
            </button>
          </div>
        </div>
      </form>
    </div>

    <div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mt-8">
      <div class="px-4 py-5 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h3 class="text-base font-semibold leading-6 text-gray-900">Danh sách Phiếu mượn</h3>
        
        <div class="flex space-x-2 w-full sm:w-auto">
          <select 
            v-model="currentStatusFilter" 
            @change="fetchBorrowsList" 
            class="block w-1/3 sm:w-40 p-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="active">Đang mượn</option>
            <option value="overdue">Đang trễ hạn</option>
            <option value="returned">Đã trả xong</option>
            <option value="">Tất cả</option>
          </select>
          
          <div class="relative flex-1 sm:w-64">
            <input 
              v-model="searchQuery" 
              @keyup.enter="fetchBorrowsList"
              type="text" 
              class="block w-full p-2 pl-3 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
              placeholder="Gõ mã ĐG/Mã phiếu (Enter để tìm)..."
            >
          </div>
        </div>
      </div>
      
      <div v-if="isLoading" class="p-8 text-center text-gray-500 animate-pulse">Đang tải dữ liệu...</div>
      
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-white">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Mã Phiếu</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Độc giả</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Tên Sách</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Hạn Trả</th>
              <th scope="col" class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Thao tác</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="tx in transactions" :key="`${tx.MaPhieu}-${tx.MaSach}`" class="hover:bg-gray-50">
              <td class="py-4 pl-4 pr-3 text-sm font-mono font-bold text-gray-900">{{ tx.MaPhieu }}</td>
              <td class="px-3 py-4 text-sm text-gray-700">
                <span class="font-bold">{{ tx.TenDocGia }}</span> <br>
                <span class="text-xs text-gray-500 font-mono">{{ tx.MaDG }}</span>
              </td>
              <td class="px-3 py-4 text-sm text-gray-700">
                <span class="truncate block max-w-xs font-semibold" :title="tx.TenSach">{{ tx.TenSach }}</span>
                <span class="text-xs text-gray-500 font-mono">{{ tx.MaSach }}</span>
              </td>
              <td class="px-3 py-4 text-sm">
                <span :class="isOverdue(tx.HanTra) && !tx.NgayTraThucTe ? 'text-red-600 font-bold' : 'text-gray-900'">
                  {{ formatDate(tx.HanTra) }}
                </span>
                <span v-if="isOverdue(tx.HanTra) && !tx.NgayTraThucTe" class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                  Quá hạn
                </span>
                <span v-if="tx.NgayTraThucTe" class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  Đã trả
                </span>
              </td>
              <td class="px-3 py-4 text-sm text-right">
                <button 
                  v-if="!tx.NgayTraThucTe"
                  @click="openReturnModal(tx)" 
                  class="text-white bg-green-600 hover:bg-green-700 font-medium rounded-md text-xs px-3 py-1.5 transition-colors"
                >
                  Nhận trả sách
                </button>
              </td>
            </tr>
            <tr v-if="transactions.length === 0">
              <td colspan="5" class="py-8 text-center text-gray-500">Không có dữ liệu phiếu mượn nào.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="selectedReturn" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border">
        <h3 class="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Xác nhận trả sách</h3>
        
        <div class="space-y-3 text-sm text-gray-700 mb-6 bg-gray-50 p-3 rounded-lg border">
          <p>Mã phiếu: <span class="font-mono font-bold">{{ selectedReturn.MaPhieu }}</span></p>
          <p>Tên sách: <span class="font-semibold">{{ selectedReturn.TenSach }}</span></p>
          <p>Độc giả: <span class="font-semibold">{{ selectedReturn.TenDocGia }}</span></p>
          <p v-if="isOverdue(selectedReturn.HanTra)" class="text-red-600 font-bold">⚠️ Sách này đã nộp trễ hạn!</p>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-bold text-gray-900 mb-2">Tình trạng sách khi thu hồi:</label>
          <select v-model="returnCondition" class="block w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
            <option value="Bình thường">Bình thường (Còn nguyên vẹn)</option>
            <option value="Hỏng nhẹ">Hỏng nhẹ (Rách trang, vẽ bậy)</option>
            <option value="Hỏng nặng">Hỏng nặng (Biến dạng, ướt sũng)</option>
            <option value="Mất">Báo Mất (Không có hiện vật)</option>
          </select>
        </div>

        <div class="flex justify-end space-x-3">
          <button @click="selectedReturn = null" class="px-4 py-2 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Hủy bỏ</button>
          <button @click="submitReturnBook" :disabled="isSubmitting" class="px-4 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:bg-gray-400">
            {{ isSubmitting ? 'Đang xử lý...' : 'Hoàn tất thủ tục' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="showReceiptModal && receiptData" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden transform transition-all">
        <div class="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center justify-between">
          <div class="flex items-center">
            <svg class="w-6 h-6 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 class="text-lg font-bold text-red-800">Biên lai báo phạt</h3>
          </div>
        </div>
        
        <div class="p-6 bg-white">
          <div class="text-center mb-6">
            <p class="text-sm text-gray-500 font-medium uppercase tracking-wider">Hệ thống thư viện</p>
            <p class="text-xs text-gray-400 mt-1">Phiếu ghi nhận nợ tự động</p>
          </div>

          <div class="space-y-4 text-sm">
            <div class="flex justify-between text-gray-700">
              <span>Tình trạng thu hồi:</span>
              <span class="font-bold text-gray-900">{{ receiptData.TinhTrangGhiNhan }}</span>
            </div>
            
            <div class="flex justify-between text-gray-700">
              <span>Số ngày trễ:</span>
              <span class="font-bold text-gray-900">{{ receiptData.SoNgayTre }} ngày</span>
            </div>

            <div class="border-t border-dashed border-gray-300 my-2"></div>

            <div class="flex justify-between text-gray-700">
              <span>Phạt trễ hạn:</span>
              <span class="font-mono">{{ receiptData.TienPhatTreHan.toLocaleString('vi-VN') }} đ</span>
            </div>

            <div class="flex justify-between text-gray-700">
              <span>Tiền đền bù sách:</span>
              <span class="font-mono">{{ receiptData.TienDenBuSach.toLocaleString('vi-VN') }} đ</span>
            </div>

            <div class="border-t-2 border-gray-800 my-2 pt-2">
              <div class="flex justify-between items-center">
                <span class="font-bold text-base uppercase">Tổng phạt:</span>
                <span class="font-bold text-xl text-red-600 font-mono">{{ receiptData.TongTienPhat.toLocaleString('vi-VN') }} đ</span>
              </div>
            </div>
          </div>
          
          <div class="mt-6 bg-yellow-50 rounded-lg p-3 border border-yellow-200">
            <p class="text-xs text-yellow-800 font-medium text-center">
              Vui lòng báo Độc giả sang quầy Kế toán để nộp phạt. Thẻ sẽ bị khóa nếu còn công nợ.
            </p>
          </div>
        </div>

        <div class="bg-gray-50 px-6 py-4 border-t flex justify-end">
          <button @click="closeReceiptModal" class="w-full bg-gray-800 text-white font-bold rounded-lg py-2.5 hover:bg-gray-900 transition-colors">
            Đã hiểu & Đóng lại
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

interface Transaction {
  MaPhieu: string;
  MaDG: string;
  TenDocGia: string;
  MaSach: string;
  TenSach: string;
  HanTra: string;
  NgayTraThucTe: string | null;
}

const transactions = ref<Transaction[]>([]);
const isLoading = ref(false);
const isSubmitting = ref(false);

const searchQuery = ref('');
const currentStatusFilter = ref('active'); 

const borrowForm = ref({
  maDG: '',
  maSach: '',
  soNgayMuon: 14 
});

const selectedReturn = ref<Transaction | null>(null);
const returnCondition = ref('Bình thường');

const toast = ref({ show: false, message: '', type: 'success' as 'success' | 'error' });

const showReceiptModal = ref(false);
const receiptData = ref<any>(null);


const triggerToast = (msg: string, type: 'success' | 'error' = 'success', duration = 4000) => {
  toast.value = { show: true, message: msg, type };
  setTimeout(() => { toast.value.show = false; }, duration);
};

const getAuthHeaders = () => {
  const sessionRaw = localStorage.getItem('user_session'); 
  if (!sessionRaw) return {};
  return { Authorization: `Bearer ${JSON.parse(sessionRaw).token}` };
};

const isOverdue = (dateString: string): boolean => {
  if (!dateString) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  const deadline = new Date(dateString);
  return today > deadline;
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('vi-VN');
};

const closeReceiptModal = () => {
  showReceiptModal.value = false;
  receiptData.value = null;
};

const fetchBorrowsList = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('http://localhost:3000/api/borrow/list', {
      params: {
        status: currentStatusFilter.value || undefined,
        search: searchQuery.value || undefined
      },
      headers: getAuthHeaders()
    });
    transactions.value = response.data.data;
  } catch (error: any) {
    triggerToast('Không thể kết nối CSDL lấy danh sách mượn trả.', 'error');
  } finally {
    isLoading.value = false;
  }
};

const handleCreateSlip = async () => {
  if (!borrowForm.value.maDG || !borrowForm.value.maSach) return;
  
  isSubmitting.value = true;
  try {
    const autoGenMaPhieu = `PM${Date.now().toString().slice(-6)}`;
    const response = await axios.post('http://localhost:3000/api/borrow/create', {
      maPhieu: autoGenMaPhieu,
      maDG: borrowForm.value.maDG,
      maSach: borrowForm.value.maSach,
      soNgayMuon: Number(borrowForm.value.soNgayMuon)
    }, { headers: getAuthHeaders() });

    triggerToast(response.data.message, 'success');
    
    borrowForm.value.maDG = '';
    borrowForm.value.maSach = '';
    await fetchBorrowsList();
    
  } catch (error: any) {
    triggerToast(error.response?.data?.message || 'Lỗi lập phiếu.', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const openReturnModal = (tx: Transaction) => {
  selectedReturn.value = tx;
  returnCondition.value = 'Bình thường'; 
};

const submitReturnBook = async () => {
  if (!selectedReturn.value) return;
  isSubmitting.value = true;

  try {
    const response = await axios.put('http://localhost:3000/api/borrow/return', {
      maPhieu: selectedReturn.value.MaPhieu,
      maSach: selectedReturn.value.MaSach,
      tinhTrang: returnCondition.value
    }, { headers: getAuthHeaders() });

    const breakdown = response.data.data; 
    selectedReturn.value = null; 
    
    if (breakdown && breakdown.TongTienPhat > 0) {
      receiptData.value = breakdown;
      showReceiptModal.value = true;
    } else {
      triggerToast('Nhận trả sách thành công! Không phát sinh tiền phạt.', 'success');
    }
    
    await fetchBorrowsList(); 
    
  } catch (error: any) {
    triggerToast(error.response?.data?.message || 'Lỗi ghi nhận trả sách.', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  fetchBorrowsList();
});
</script>