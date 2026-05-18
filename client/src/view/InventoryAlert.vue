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
      <div v-if="toast.show" class="fixed top-5 right-5 z-50 max-w-sm w-full bg-white shadow-2xl rounded-xl border pointer-events-auto overflow-hidden">
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0 text-emerald-500">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p class="text-sm font-bold text-gray-900">Thành công</p>
              <p class="mt-1 text-xs font-semibold text-gray-500 leading-normal">{{ toast.message }}</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <div>
      <h2 class="text-2xl font-bold text-red-600 sm:text-3xl tracking-tight flex items-center">
        <span class="inline-block w-3 h-3 rounded-full bg-red-500 animate-ping mr-3"></span>
        Trung Tâm Cảnh Báo Cạn Kiệt Kho
      </h2>
      <p class="mt-1 text-sm text-gray-500">
        Hệ thống tự động phát hiện các đầu sách có số lượng tồn kho chạm ngưỡng nguy hiểm (<span class="font-bold text-red-500">&le; 3 cuốn</span>) để Quản lý kho kịp thời lập lệnh tái đặt hàng.
      </p>
    </div>

    <div class="bg-white border border-red-100 rounded-xl shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-red-100 bg-red-50/30 flex justify-between items-center">
        <h3 class="text-xs font-bold text-red-700 uppercase tracking-wider flex items-center">
          ⚠ Danh sách đầu sách cần nhập hàng khẩn cấp
        </h3>
        <span class="px-2.5 py-0.5 bg-red-100 text-red-800 font-black text-[11px] rounded-full">
          {{ alertsList.length }} Đầu sách dính lỗi
        </span>
      </div>

      <div v-if="isLoading" class="p-8 text-center text-xs text-gray-400 animate-pulse font-medium">
        Hệ thống đang truy quét View dữ liệu `v_Kho_CanhBaoHetSach` từ SQL Server...
      </div>

      <div v-else-if="alertsList.length === 0" class="p-12 text-center text-gray-400 font-medium space-y-2">
        <div class="text-emerald-500 text-2xl">✔</div>
        <p class="text-sm text-gray-600 font-bold">Kho hàng tuyệt đối an toàn!</p>
        <p class="text-xs text-gray-400">Không có đầu sách nào có số lượng tồn dưới ngưỡng báo động tối thiểu.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 text-xs text-left">
          <thead class="bg-white text-gray-900 border-b font-semibold">
            <tr>
              <th scope="col" class="py-3 px-4 pl-6">Mã Sách</th>
              <th scope="col" class="py-3 px-4">Thông tin sách</th>
              <th scope="col" class="py-3 px-4">Thể loại</th>
              <th scope="col" class="py-3 px-4 text-center">Vị trí kệ</th>
              <th scope="col" class="py-3 px-4 text-center">Số lượng tồn</th>
              <th scope="col" class="py-3 px-4 text-center">Mức độ nguy cấp</th>
              <th scope="col" class="py-3 px-4 text-center pr-6">Thao tác xử lý</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white font-medium text-gray-600">
            <tr v-for="item in alertsList" :key="item.MaSach" class="hover:bg-red-50/10 transition-colors">
              <td class="py-4 px-4 pl-6 font-mono font-bold text-gray-900">{{ item.MaSach }}</td>
              <td class="py-4 px-4">
                <div class="font-bold text-gray-900">{{ item.TenSach }}</div>
              </td>
              <td class="py-4 px-4 text-gray-500">{{ item.TheLoai }}</td>
              <td class="py-4 px-4 text-center font-semibold text-slate-700">{{ item.ViTriKe || 'Chưa xếp kệ' }}</td>
              <td class="py-4 px-4 text-center font-mono font-black text-sm" :class="item.SoLuongTon === 0 ? 'text-red-600' : 'text-amber-600'">
                {{ item.SoLuongTon }}
              </td>
              <td class="py-4 px-4 text-center">
                <span 
                  :class="item.SoLuongTon === 0 ? 'bg-red-600 text-white animate-pulse':'bg-amber-50 text-amber-700 border-amber-200'"
                  class="px-2 py-0.5 rounded border text-[10px] font-bold"
                >
                  {{ item.MucDoNguyCap }}
                </span>
              </td>
              <td class="py-4 px-4 text-center pr-6">
                <button 
                  @click="openQuickImportModal(item)"
                  class="bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] px-2.5 py-1.5 rounded shadow-sm transition-colors"
                >
                  Tái đặt hàng khẩn cấp
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="isModalOpen && selectedBook" class="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity animate-fade-in">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border">
        
        <div class="bg-red-700 px-5 py-4 text-white flex justify-between items-center">
          <div>
            <h3 class="text-sm font-bold">Lệnh Tái Đặt Hàng Khẩn Cấp</h3>
            <p class="text-[10px] text-red-200 font-medium">Bổ sung số lượng thiếu hụt cho kho lưu trữ</p>
          </div>
          <button @click="closeModal" class="text-red-200 hover:text-white text-xl font-bold transition-colors leading-none">&times;</button>
        </div>

        <div class="p-5 space-y-4">
          <div class="bg-red-50/50 p-3 rounded-lg border border-red-100 text-xs">
            <span class="text-[10px] text-red-500 font-bold uppercase tracking-wider block">Sách chạm ngưỡng báo động</span>
            <p class="font-bold text-gray-900 mt-0.5 truncate">{{ selectedBook.TenSach }}</p>
            <p class="text-[11px] text-gray-500 font-mono mt-0.5">
              Mã sách: {{ selectedBook.MaSach }} | Tồn kho hiện tại: <span class="font-black text-red-600">{{ selectedBook.SoLuongTon }}</span> cuốn
            </p>
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Số lượng bản sao cần mua bổ sung:</label>
            <input 
              type="number" 
              v-model.number="qtyToImport"
              min="1"
              class="block w-full p-2.5 text-sm font-bold text-gray-900 border rounded-md outline-none"
              :class="formError ? 'border-red-400 focus:ring-1 focus:ring-red-500 bg-red-50/10' : 'border-gray-300 focus:ring-1 focus:ring-blue-500'"
              placeholder="Nhập số nguyên, ví dụ: 50"
              @input="formError = ''"
            >
            <p v-if="formError" class="text-[11px] text-red-600 font-semibold flex items-center">
              ⚠ {{ formError }}
            </p>
          </div>
        </div>

        <div class="bg-gray-50 px-5 py-3.5 border-t border-gray-200 flex justify-end space-x-2">
          <button @click="closeModal" :disabled="isSubmitting" class="px-3.5 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">Hủy</button>
          <button 
            @click="submitImportRequest" 
            :disabled="isSubmitting"
            class="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm disabled:bg-gray-400 transition-colors"
          >
            {{ isSubmitting ? 'Đang ghi sổ...' : 'Xác nhận phê duyệt' }}
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

interface LowStockItem {
  MaSach: string;
  TenSach: string;
  TheLoai: string;
  SoLuongTon: number;
  ViTriKe: string | null;
  MucDoNguyCap: string;
}

const alertsList = ref<LowStockItem[]>([]);
const isLoading = ref(true);

const isModalOpen = ref(false);
const selectedBook = ref<LowStockItem | null>(null);
const qtyToImport = ref<number>(30); 
const formError = ref('');
const isSubmitting = ref(false);

const toast = ref({ show: false, message: '' });

const triggerToast = (msg: string) => {
  toast.value = { show: true, message: msg };
  setTimeout(() => { toast.value.show = false; }, 3500);
};

const getAuthHeaders = () => {
  const sessionRaw = localStorage.getItem('user_session');
  if (!sessionRaw) return {};
  return { Authorization: `Bearer ${JSON.parse(sessionRaw).token}` };
};

const loadAlertsData = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('http://localhost:3000/api/warehouse/low-stock', { headers: getAuthHeaders() });
    alertsList.value = response.data;
  } catch (error) {
    console.error('Lỗi quét dữ liệu cảnh báo:', error);
  } finally { isLoading.value = false; }
};

const openQuickImportModal = (item: LowStockItem) => {
  selectedBook.value = item;
  qtyToImport.value = 30;
  formError.value = '';
  isModalOpen.value = true;
};

const closeModal = () => {
  if (isSubmitting.value) return;
  isModalOpen.value = false;
  selectedBook.value = null;
};

const submitImportRequest = async () => {
  if (!selectedBook.value) return;

  // Kiểm thử định dạng nghiệp vụ Client-Side Validation
  if (!qtyToImport.value || isNaN(qtyToImport.value) || qtyToImport.value <= 0 || !Number.isInteger(qtyToImport.value)) {
    formError.value = 'Số lượng bản sao nhập bổ sung khẩn cấp bắt buộc phải là số nguyên dương lớn hơn 0!';
    return;
  }

  isSubmitting.value = true;
  try {
    // Tái sử dụng tuyến API /import gộp số lượng cơ học từ nghiệp vụ trước
    const response = await axios.post('http://localhost:3000/api/warehouse/import', {
      maSach: selectedBook.value.MaSach,
      soLuongNhap: qtyToImport.value
    }, { headers: getAuthHeaders() });

    isModalOpen.value = false;
    triggerToast(response.data.message);
    await loadAlertsData(); // Tải lại danh mục, đầu sách nào vừa được nạp hàng > 3 cuốn sẽ tự bay biến mất khỏi bảng!
  } catch (error: any) {
    formError.value = error.response?.data?.message || 'Giao dịch lập lệnh tái đặt hàng thất bại.';
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => { loadAlertsData(); });
</script>