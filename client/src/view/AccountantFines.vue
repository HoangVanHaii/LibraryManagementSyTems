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

    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Quản lý Thu Phạt Công Nợ
        </h2>
        <p class="mt-1 text-sm text-gray-500">
          Nghiệp vụ tất toán công nợ độc giả. Hệ thống áp dụng quy tắc gác cổng kế toán: Chỉ cho phép đóng tiền phạt đối với các đầu sách đã hoàn trả xong về kho vật lý.
        </p>
      </div>
    </div>

    <div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div class="px-4 py-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h3 class="text-base font-semibold leading-6 text-gray-900">Danh sách Độc giả đang có công nợ phạt</h3>
        <div class="relative w-full sm:w-64">
          <input 
            type="text" 
            v-model="searchQuery"
            class="block w-full p-2 pl-3 text-sm text-gray-900 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none" 
            placeholder="Tìm theo Mã ĐG hoặc Tên..."
          >
        </div>
      </div>

      <div v-if="isLoading" class="p-6 text-center text-gray-500 animate-pulse font-medium">
        Đang đồng bộ danh sách dữ liệu tài chính từ phân hệ Kế toán...
      </div>

      <div v-else-if="filteredReaders.length === 0" class="p-8 text-center text-gray-400 font-medium">
        Không tìm thấy độc giả nào khớp với điều kiện tra cứu hoặc hệ thống sạch công nợ.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 text-left text-sm">
          <thead class="bg-white">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 font-semibold text-gray-900 sm:pl-6">Mã Độc Giả</th>
              <th scope="col" class="px-3 py-3.5 font-semibold text-gray-900">Họ và Tên</th>
              <th scope="col" class="px-3 py-3.5 font-semibold text-gray-900">Thông tin liên lạc</th>
              <th scope="col" class="px-3 py-3.5 text-right font-semibold text-gray-900">Tổng Nợ Phạt</th>
              <th scope="col" class="px-3 py-3.5 text-center font-semibold text-gray-900 sm:pr-6">Thao Tác</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="reader in filteredReaders" :key="reader.MaDG" class="hover:bg-gray-50 transition-colors">
              <td class="py-4 pl-4 pr-3 font-mono font-bold text-gray-900 whitespace-nowrap sm:pl-6">{{ reader.MaDG }}</td>
              <td class="px-3 py-4 font-semibold text-gray-700 whitespace-nowrap">{{ reader.HoTen }}</td>
              <td class="px-3 py-4 text-gray-500 whitespace-nowrap">
                <span class="block text-xs font-medium">{{ reader.SDT }}</span>
                <span class="block text-[11px] text-gray-400">{{ reader.Email }}</span>
              </td>
              <td class="px-3 py-4 font-black text-red-600 whitespace-nowrap text-right">
                {{ reader.CongNo.toLocaleString('vi-VN') }} VNĐ
              </td>
              <td class="px-3 py-4 whitespace-nowrap text-center sm:pr-6">
                <button 
                  @click="openPaymentModal(reader)" 
                  class="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm"
                >
                  Thu Tiền & Chi Tiết
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="selectedReader" class="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border">
        
        <div class="bg-slate-900 px-6 py-4 text-white flex justify-between items-center">
          <div>
            <h3 class="text-base font-bold">Phiếu Thu Tiền Vi Phạm</h3>
            <p class="text-[11px] text-slate-400 font-medium">Hóa đơn chứng từ kiểm soát chi tiết từng đầu sách</p>
          </div>
          <button @click="selectedReader = null" class="text-slate-400 hover:text-white text-xl font-bold transition-colors">&times;</button>
        </div>
        
        <div class="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div class="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border">
            <div>
              <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mã Độc Giả</label>
              <p class="mt-0.5 text-sm font-bold text-gray-900 font-mono">{{ selectedReader.MaDG }}</p>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Họ và Tên</label>
              <p class="mt-0.5 text-sm font-bold text-gray-700">{{ selectedReader.HoTen }}</p>
            </div>
          </div>
          
          <div class="space-y-2">
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider">Chi tiết danh mục sách phạt của độc giả:</label>
            
            <div v-if="isModalLoading" class="text-center py-4 text-xs text-gray-400 animate-pulse font-medium">
              Đang truy quét danh mục phiếu phạt từ hệ thống SQL Server...
            </div>
            
            <div v-else class="space-y-2">
              <div 
                v-for="item in fineDetails" 
                :key="item.MaPhieu + item.MaSach" 
                class="p-3 border border-gray-100 rounded-lg bg-slate-50/50 text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
              >
                <div class="space-y-0.5 max-w-[75%]">
                  <h4 class="font-bold text-gray-800 truncate">{{ item.TenSach }}</h4>
                  <p class="text-[10px] text-gray-400">
                    Mã phiếu mượn: <span class="font-mono font-semibold">{{ item.MaPhieu }}</span> | Mã sách: <span class="font-mono font-semibold">{{ item.MaSach }}</span>
                  </p>
                  <p class="font-semibold flex items-center pt-0.5" :class="item.ChoPhepThanhToan === 1 ? 'text-amber-600' : 'text-red-600'">
                    <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="item.ChoPhepThanhToan === 1 ? 'bg-amber-500' : 'bg-red-500'"></span>
                    Lý do: {{ item.LyDoPhat }}
                  </p>
                </div>

                <div class="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end flex-shrink-0">
                  <span class="font-black text-red-600 text-right text-sm whitespace-nowrap">
                    {{ item.TienPhatKyNay.toLocaleString('vi-VN') }}đ
                  </span>
                  
                  <button 
                    v-if="item.ChoPhepThanhToan === 1"
                    @click="paySingleBookFine(item)"
                    :disabled="isCollecting"
                    class="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-colors shadow-sm disabled:bg-gray-400 whitespace-nowrap"
                  >
                    Thanh toán lẻ
                  </button>
                  <span 
                    v-else 
                    class="text-[10px] text-gray-400 font-bold bg-gray-100 px-2 py-1 rounded border whitespace-nowrap block"
                    title="Độc giả bắt buộc phải hoàn trả cuốn sách này về kho mới có thể tất toán tiền phạt"
                  >
                    Chờ trả sách
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="pt-2 border-t">
            <label class="block text-sm font-bold text-gray-900 mb-1">Tổng số tiền thu thực tế tất toán (VNĐ)</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg class="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                </svg>
              </div>
              <input 
                type="text" readonly disabled :value="selectedReader.CongNo.toLocaleString('vi-VN')" 
                class="block w-full p-3 pl-10 text-xl font-black text-emerald-700 bg-gray-50 border border-gray-300 rounded-lg cursor-not-allowed focus:ring-0"
              >
            </div>
            <p v-if="!canPayAll && fineDetails.length > 0" class="mt-1.5 text-[11px] text-amber-600 font-semibold flex items-center">
              ⚠ Chức năng thu tiền toàn bộ đang khóa vì hồ sơ độc giả có đầu sách chưa được hoàn trả.
            </p>
          </div>
        </div>

        <div class="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button @click="selectedReader = null" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Hủy phiếu</button>
          <button 
            @click="isConfirmOpen = true" 
            :disabled="isCollecting || isModalLoading || !canPayAll"
            class="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            {{ isCollecting ? 'Đang lập biên lai...' : 'Xác nhận thanh toán toàn bộ' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="isConfirmOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 text-center border">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-amber-50 text-amber-600 mb-4 border border-amber-200">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 class="text-base font-bold text-gray-900 mb-2">Xác nhận giao dịch</h3>
        <p class="text-xs font-semibold text-gray-500 leading-relaxed mb-6">
          Hệ thống sẽ lập biên lai thu tổng số tiền <span class="text-emerald-600 font-bold">{{ selectedReader?.CongNo.toLocaleString('vi-VN') }}đ</span> và xóa sạch công nợ phạt cho độc giả <span class="font-bold text-gray-800">{{ selectedReader?.HoTen }}</span>. Thao tác này ghi nhận vào Audit Log kiểm toán và không thể hoàn tác.
        </p>
        <div class="flex justify-center space-x-3">
          <button 
            @click="isConfirmOpen = false"
            class="w-full px-4 py-2 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border"
          >
            Hủy bỏ
          </button>
          <button 
            @click="executePaymentAPI"
            class="w-full px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm"
          >
            Đồng ý thu
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

interface FineReader {
  MaDG: string;
  HoTen: string;
  SDT: string;
  Email: string;
  CongNo: number;
}

interface FineBookDetail {
  MaPhieu: string;
  MaSach: string;
  TenSach: string;
  NgayMuon: string;
  HanTra: string;
  NgayTraThucTe: string | null;
  TienPhatKyNay: number;
  ChoPhepThanhToan: number; 
  LyDoPhat: string;
}

const fineReaders = ref<FineReader[]>([]);
const fineDetails = ref<FineBookDetail[]>([]);
const selectedReader = ref<FineReader | null>(null);

const isLoading = ref(false);
const isModalLoading = ref(false);
const isCollecting = ref(false);
const isConfirmOpen = ref(false);

const searchQuery = ref('');

const toast = ref({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error'
});

const triggerToast = (msg: string, type: 'success' | 'error' = 'success') => {
  toast.value = { show: true, message: msg, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 3500);
};

const getAuthHeaders = () => {
  const sessionRaw = localStorage.getItem('user_session');
  if (!sessionRaw) return {};
  return { Authorization: `Bearer ${JSON.parse(sessionRaw).token}` };
};

const loadFineReadersList = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('http://localhost:3000/api/fine/accountant/fines', { headers: getAuthHeaders() });
    fineReaders.value = response.data;
  } catch (error: any) {
    triggerToast('Hệ thống không thể tải danh sách công nợ tài chính.', 'error');
  } finally {
    isLoading.value = false;
  }
};

const openPaymentModal = async (reader: FineReader) => {
  selectedReader.value = reader;
  isModalLoading.value = true;
  fineDetails.value = [];
  
  try {
    const response = await axios.get(`http://localhost:3000/api/fine/accountant/fines/${reader.MaDG}`, { headers: getAuthHeaders() });
    fineDetails.value = response.data;
  } catch (error: any) {
    triggerToast('Không thể truy quét danh mục phiếu phạt từ SQL Server.', 'error');
    selectedReader.value = null;
  } finally {
    isModalLoading.value = false;
  }
};

const paySingleBookFine = async (item: FineBookDetail) => {
  isCollecting.value = true;
  try {
    const response = await axios.post('http://localhost:3000/api/fine/collect-fine/detail-item', {
      maPhieu: item.MaPhieu,
      maSach: item.MaSach
    }, { headers: getAuthHeaders() });
    console.log("thành công ",response.data);
    triggerToast(response.data.message, 'success');
    
    await loadFineReadersList();

    if (selectedReader.value) {
      const checkReaderStillOwes = fineReaders.value.find(r => r.MaDG === selectedReader.value?.MaDG);
      
      if (checkReaderStillOwes) {
        selectedReader.value.CongNo = checkReaderStillOwes.CongNo;
        const refreshDetails = await axios.get(`http://localhost:3000/api/fine/accountant/fines/${selectedReader.value.MaDG}`, { headers: getAuthHeaders() });
        fineDetails.value = refreshDetails.data;
      } else {
        selectedReader.value = null;
      }
    }
  } catch (error: any) {
    console.log("lỗi ",error);
    triggerToast(error.response?.data?.message || 'Giao dịch thanh toán lẻ đầu sách thất bại.', 'error');
  } finally {
    isCollecting.value = false;
  }
};

const executePaymentAPI = async () => {
  if (!selectedReader.value) return;

  isConfirmOpen.value = false;
  isCollecting.value = true;
  
  try {
    const response = await axios.post('http://localhost:3000/api/fine/accountant/collect-fine', {
      maDG: selectedReader.value.MaDG,
      soTienThu: selectedReader.value.CongNo
    }, { headers: getAuthHeaders() });

    triggerToast(response.data.message, 'success');
    selectedReader.value = null;
    await loadFineReadersList();
  } catch (error: any) {
    triggerToast(error.response?.data?.message || 'Giao dịch khấu trừ thất bại.', 'error');
  } finally {
    isCollecting.value = false;
  }
};

const canPayAll = computed(() => {
  if (fineDetails.value.length === 0) return false;
  return fineDetails.value.every(item => item.ChoPhepThanhToan === 1);
});

const filteredReaders = computed(() => {
  return fineReaders.value.filter(reader => {
    const query = searchQuery.value.toLowerCase().trim();
    if (!query) return true;
    return reader.MaDG.toLowerCase().includes(query) || reader.HoTen.toLowerCase().includes(query);
  });
});

onMounted(() => {
  loadFineReadersList();
});
</script>