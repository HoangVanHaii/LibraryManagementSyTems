<template>
  <div class="space-y-6 relative p-2">
    
    <Transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="toast.show" class="fixed top-5 right-5 z-50 max-w-sm w-full bg-white shadow-xl rounded-xl border pointer-events-auto overflow-hidden">
        <div class="p-4">
          <div class="flex items-start">
            <div v-if="toast.type === 'success'" class="flex-shrink-0 text-emerald-500">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div v-else class="flex-shrink-0 text-red-500">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p class="text-sm font-bold text-gray-900">
                {{ toast.type === 'success' ? 'Thành công' : 'Thông báo lỗi' }}
              </p>
              <p class="mt-1 text-xs font-semibold text-gray-500 leading-normal">{{ toast.message }}</p>
            </div>
            <div class="ml-4 flex-shrink-0 flex">
              <button @click="toast.show = false" class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none">
                <span class="sr-only">Close</span>
                <span class="text-lg font-bold leading-none">&times;</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <div>
      <h2 class="text-2xl font-bold text-gray-900 sm:text-3xl tracking-tight">Thống kê Nhập / Xuất & Tồn Kho</h2>
      <p class="mt-1 text-sm text-gray-500">
        Hệ thống giám sát dòng chảy luân chuyển tài liệu, định giá tài sản kho và cảnh báo điểm tái đặt hàng tự động.
      </p>
    </div>

    <div v-if="kpiData" class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block">Tổng số đầu sách</span>
        <div class="mt-2 text-2xl font-black text-slate-800">{{ kpiData.TongSoDauSach }} <span class="text-xs font-bold text-gray-400">loại</span></div>
      </div>

      <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block">Tổng số lượng tồn kho</span>
        <div class="mt-2 text-2xl font-black text-blue-600">{{ kpiData.TongSoLuongTon.toLocaleString('vi-VN') }} <span class="text-xs font-bold text-gray-400">cuốn</span></div>
      </div>

      <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block">Sách đang lưu hành (Xuất)</span>
        <div class="mt-2 text-2xl font-black text-amber-600">{{ kpiData.TongSachDangMuon }} <span class="text-xs font-bold text-gray-400">cuốn</span></div>
      </div>

      <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm border-l-4 border-l-emerald-500 bg-emerald-50/10">
        <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block text-emerald-700">Tổng giá trị tài sản kho</span>
        <div class="mt-2 text-2xl font-black text-emerald-700">{{ kpiData.TongGiaTriKho.toLocaleString('vi-VN') }} <span class="text-xs font-bold">đ</span></div>
      </div>
    </div>

    <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h3 class="text-xs font-bold text-gray-700 uppercase tracking-wider">Danh mục trạng thái luân chuyển chi tiết</h3>
        <div class="relative w-full sm:w-64">
          <input 
            type="text" v-model="filterQuery" 
            placeholder="Lọc mã hoặc tên sách..." 
            class="w-full p-2 text-xs border border-gray-300 rounded-md outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
        </div>
      </div>

      <div v-if="isLoading" class="p-8 text-center text-xs text-gray-400 animate-pulse font-medium">
        Đang đồng bộ báo cáo tài sản từ SQL Server...
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 text-xs text-left">
          <thead class="bg-white text-gray-900 border-b font-semibold">
            <tr>
              <th scope="col" class="py-3 px-4 pl-6">Mã Sách</th>
              <th scope="col" class="py-3 px-4 w-1/3">Thông tin & Bìa sách</th> <th scope="col" class="py-3 px-4 text-center">Tồn vật lý</th>
              <th scope="col" class="py-3 px-4 text-center">Đang mượn (Xuất)</th>
              <th scope="col" class="py-3 px-4 text-center">Tổng lượt mượn</th>
              <th scope="col" class="py-3 px-4 text-center">Trạng thái tồn</th>
              <th scope="col" class="py-3 px-4 text-center pr-6">Hành động nhanh</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white font-medium text-gray-600">
            <tr v-for="book in filteredBooks" :key="book.MaSach" class="hover:bg-gray-50 transition-colors">
              <td class="py-3.5 px-4 pl-6 font-mono font-bold text-gray-900">{{ book.MaSach }}</td>
              
              <td class="py-3.5 px-4">
                <div class="flex items-center space-x-3">
                  <img 
                    :src="book.HinhAnh || 'https://via.placeholder.com/150x200?text=No+Cover'" 
                    class="w-8 h-12 object-cover rounded border border-gray-200 shadow-sm flex-shrink-0 bg-gray-100" 
                    alt="Bìa"
                  >
                  <div class="truncate">
                    <div class="font-bold text-gray-900 truncate" :title="book.TenSach">{{ book.TenSach }}</div>
                    <div class="text-[10px] text-gray-400 truncate">Tác giả: {{ book.TacGia }} | Giá bìa: {{ book.GiaBia.toLocaleString('vi-VN') }}đ</div>
                  </div>
                </div>
              </td>

              <td class="py-3.5 px-4 text-center font-bold text-blue-600 font-mono">{{ book.SoLuongTon }}</td>
              <td class="py-3.5 px-4 text-center font-bold text-amber-600 font-mono">{{ book.SoLuongDangMuon }}</td>
              <td class="py-3.5 px-4 text-center font-bold text-gray-500 font-mono">{{ book.TongLuotMuon }}</td>
              <td class="py-3.5 px-4 text-center">
                <span 
                  :class="book.TrangThaiTonKho === 'An toàn' ? 'bg-green-50 text-green-700 border-green-200':'bg-red-50 text-red-700 border-red-200' + (book.SoLuongTon === 0 ? ' animate-pulse' : '')"
                  class="px-2 py-0.5 rounded border text-[10px] font-bold"
                >
                  {{ book.TrangThaiTonKho }}
                </span>
              </td>
              <td class="py-3.5 px-4 text-center pr-6">
                <button 
                  @click="openImportModal(book)"
                  class="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] px-2.5 py-1.5 rounded shadow-sm transition-colors"
                >
                  Nhập thêm hàng
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="isImportModalOpen && selectedBook" class="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity animate-fade-in">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border">
        
        <div class="bg-slate-900 px-5 py-4 text-white flex justify-between items-center">
          <div>
            <h3 class="text-sm font-bold">Lập lệnh nhập hàng</h3>
            <p class="text-[10px] text-slate-400 font-medium">Cộng dồn số lượng hàng vật chất về kho</p>
          </div>
          <button @click="closeImportModal" class="text-slate-400 hover:text-white text-xl font-bold transition-colors leading-none">&times;</button>
        </div>

        <div class="p-5 space-y-4">
          <div class="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center space-x-3">
            <img :src="selectedBook.HinhAnh || 'https://via.placeholder.com/150x200?text=No+Cover'" class="w-10 h-14 object-cover rounded border shadow-sm bg-gray-200" alt="Bìa">
            <div class="flex-1 min-w-0">
              <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5">Đầu sách kiểm kê</span>
              <p class="font-bold text-gray-900 text-xs truncate">{{ selectedBook.TenSach }}</p>
              <p class="text-[11px] text-gray-500 font-mono mt-0.5">Mã: {{ selectedBook.MaSach }} | Tồn: <span class="font-bold text-blue-600">{{ selectedBook.SoLuongTon }}</span></p>
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Số lượng bản sao nhập thêm:</label>
            <div class="relative rounded-md shadow-sm">
              <input 
                type="number" 
                v-model.number="importQuantity"
                min="1"
                step="1"
                class="block w-full p-2.5 text-sm font-bold text-gray-900 border rounded-md outline-none focus:ring-1"
                :class="validationError ? 'border-red-400 focus:ring-red-500 focus:border-red-500 bg-red-50/10' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'"
                placeholder="Nhập số nguyên dương... ví dụ: 10"
                @input="clearValidationError"
              >
            </div>
            <p v-if="validationError" class="text-[11px] text-red-600 font-semibold flex items-center">
              ⚠ {{ validationError }}
            </p>
          </div>
        </div>

        <div class="bg-gray-50 px-5 py-3.5 border-t border-gray-200 flex justify-end space-x-2">
          <button 
            @click="closeImportModal" 
            :disabled="isSubmitting"
            class="px-3.5 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Hủy bỏ
          </button>
          <button 
            @click="executeImportAPI" 
            :disabled="isSubmitting"
            class="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 shadow-sm disabled:bg-gray-400 transition-colors"
          >
            {{ isSubmitting ? 'Đang ghi sổ...' : 'Xác nhận nhập kho' }}
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

interface KPIData {
  TongSoDauSach: number;
  TongSoLuongTon: number;
  TongSachDangMuon: number;
  TongGiaTriKho: number;
}

// BỔ SUNG TRƯỜNG HINHANH VÀO INTERFACE ĐỂ TYPESCRIPT KHÔNG BÁO LỖI
interface InventoryBook {
  MaSach: string;
  TenSach: string;
  TacGia: string;
  GiaBia: number;
  SoLuongTon: number;
  SoLuongDangMuon: number;
  TongLuotMuon: number;
  TrangThaiTonKho: string;
  HinhAnh?: string; 
}

const kpiData = ref<KPIData | null>(null);
const detailBooks = ref<InventoryBook[]>([]);
const isLoading = ref(true);
const filterQuery = ref('');

const isImportModalOpen = ref(false);
const selectedBook = ref<InventoryBook | null>(null);
const importQuantity = ref<number>(10);
const validationError = ref('');
const isSubmitting = ref(false);

const toast = ref({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error'
});

const triggerToast = (msg: string, type: 'success' | 'error' = 'success') => {
  toast.value = { show: true, message: msg, type };
  setTimeout(() => { toast.value.show = false; }, 3500);
};

const getAuthHeaders = () => {
  const sessionRaw = localStorage.getItem('user_session');
  if (!sessionRaw) return {};
  return { Authorization: `Bearer ${JSON.parse(sessionRaw).token}` };
};

const loadStatsData = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('http://localhost:3000/api/warehouse/stats', { headers: getAuthHeaders() });
    kpiData.value = response.data.kpi;
    detailBooks.value = response.data.details;
  } catch (error) {
    console.error('Lỗi nạp báo cáo kiểm kê:', error);
    triggerToast('Không thể đồng bộ dữ liệu thống kê từ SQL Server.', 'error');
  } finally { isLoading.value = false; }
};

const openImportModal = (book: InventoryBook) => {
  selectedBook.value = book;
  importQuantity.value = 10; 
  validationError.value = '';
  isImportModalOpen.value = true;
};

const closeImportModal = () => {
  if (isSubmitting.value) return;
  isImportModalOpen.value = false;
  selectedBook.value = null;
};

const clearValidationError = () => {
  validationError.value = '';
};

const executeImportAPI = async () => {
  if (!selectedBook.value) return;

  if (!importQuantity.value || isNaN(importQuantity.value) || importQuantity.value <= 0 || !Number.isInteger(importQuantity.value)) {
    validationError.value = 'Số lượng sách nhập kho bắt buộc phải là số nguyên dương lớn hơn 0!';
    return;
  }

  isSubmitting.value = true;
  try {
    const response = await axios.post('http://localhost:3000/api/warehouse/import', {
      maSach: selectedBook.value.MaSach,
      soLuongNhap: importQuantity.value
    }, { headers: getAuthHeaders() });

    isImportModalOpen.value = false;
    triggerToast(response.data.message, 'success');
    await loadStatsData();
  } catch (error: any) {
    validationError.value = error.response?.data?.message || 'Tiến trình nhập hàng thất bại từ hệ thống.';
  } finally {
    isSubmitting.value = false;
  }
};

const filteredBooks = computed(() => {
  return detailBooks.value.filter(b => {
    const q = filterQuery.value.toLowerCase().trim();
    if (!q) return true;
    return b.MaSach.toLowerCase().includes(q) || b.TenSach.toLowerCase().includes(q);
  });
});

onMounted(() => { loadStatsData(); });
</script>