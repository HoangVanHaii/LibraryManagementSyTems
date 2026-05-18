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
      <div v-if="toast.show" class="fixed top-5 right-5 z-[70] max-w-sm w-full bg-white shadow-xl rounded-xl border pointer-events-auto overflow-hidden">
        <div class="p-4 flex items-start">
          <div v-if="toast.type === 'success'" class="flex-shrink-0 text-emerald-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div v-else class="flex-shrink-0 text-red-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-bold text-gray-900">{{ toast.type === 'success' ? 'Thành công' : 'Có lỗi xảy ra' }}</p>
            <p class="mt-1 text-xs font-semibold text-gray-500 leading-normal">{{ toast.message }}</p>
          </div>
        </div>
      </div>
    </Transition>

    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Quản lý Thẻ Độc giả</h2>
        <p class="mt-1 text-sm text-gray-500">Cấp mới và gia hạn thẻ. Quản lý công nợ thuộc bộ phận Kế toán.</p>
      </div>
      <button @click="showCreateModal = true" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center shadow-sm">
        <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Cấp Thẻ Mới
      </button>
    </div>

    <div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div class="px-4 py-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
        
        <div class="flex space-x-2 w-full sm:w-auto flex-1 justify-start">
          <select 
            v-model="currentStatusFilter" 
            @change="fetchReaders" 
            class="block w-1/3 sm:w-44 p-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white font-medium"
          >
            <option value="active">Đang hoạt động</option>
            <option value="expired">Đã hết hạn</option>
            <option value="">Tất cả trạng thái</option>
          </select>
          
          <div class="relative flex-1 sm:w-72">
            <input 
              v-model="searchQuery"
              @keyup.enter="fetchReaders"
              type="text" 
              class="block w-full p-2 pl-3 text-sm text-gray-900 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
              placeholder="Tìm theo Mã ĐG, CCCD, Tên (Enter)..."
            >
          </div>
        </div>

        <button @click="fetchReaders" class="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium border transition">
          Làm mới bảng
        </button>
      </div>

      <div v-if="isLoading" class="p-8 text-center text-gray-500 animate-pulse">Đang tải dữ liệu độc giả...</div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-white">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Mã ĐG</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Họ và Tên</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">CCCD / Email</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Ngày Lập Thẻ</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Ngày Hết Hạn</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Trạng Thái</th>
              <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right text-sm font-semibold text-gray-900">Thao tác</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="reader in readers" :key="reader.MaDG" class="hover:bg-gray-50">
              <td class="py-4 pl-4 pr-3 text-sm font-bold font-mono text-gray-900 whitespace-nowrap sm:pl-6">{{ reader.MaDG }}</td>
              <td class="px-3 py-4 text-sm text-gray-900 font-medium whitespace-nowrap">{{ reader.HoTen }}</td>
              <td class="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                <div class="font-mono">{{ reader.CCCD }}</div>
                <div class="text-xs text-blue-600">{{ reader.Email }}</div>
              </td>
              <td class="px-3 py-4 text-sm text-gray-600 whitespace-nowrap font-medium">
                {{ formatDate(reader.NgayLapThe) }}
              </td>
              <td class="px-3 py-4 text-sm text-gray-900 font-medium whitespace-nowrap">
                <span :class="isExpired(reader.NgayHetHan) ? 'text-red-600 font-bold' : ''">
                  {{ formatDate(reader.NgayHetHan) }}
                </span>
              </td>
              <td class="px-3 py-4 text-sm whitespace-nowrap">
                <span v-if="!isExpired(reader.NgayHetHan)" class="bg-green-100 text-green-800 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold">
                  Hoạt động
                </span>
                <span v-else class="bg-red-100 text-red-800 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold">
                  Hết hạn
                </span>
              </td>
              <td class="px-3 py-4 text-sm text-right whitespace-nowrap sm:pr-6">
                <button 
                  @click="openRenewModal(reader.MaDG)"
                  class="text-blue-600 hover:text-blue-900 hover:underline font-bold bg-blue-50 px-3 py-1.5 rounded-md transition"
                >
                  Gia hạn
                </button>
              </td>
            </tr>
            <tr v-if="readers.length === 0">
              <td colspan="7" class="py-8 text-center text-gray-500">Không tìm thấy độc giả nào khớp điều kiện lọc.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showCreateModal" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden transform transition-all">
        <div class="bg-blue-600 px-6 py-4 flex justify-between items-center">
          <h3 class="text-lg font-bold text-white">Cấp Thẻ Độc Giả Mới</h3>
          <button @click="closeCreateModal" class="text-white hover:text-gray-200">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <form @submit.prevent="submitCreateReader" class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1">Mã Độc Giả (Gợi ý) *</label>
              <input v-model.trim="createForm.maDG" type="text" required placeholder="VD: DG005" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1">Mật khẩu ban đầu *</label>
              <input v-model.trim="createForm.password" type="password" required placeholder="Nhập pass tài khoản" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-bold text-gray-700 mb-1">Họ và Tên *</label>
              <input v-model.trim="createForm.hoTen" type="text" required class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1">Căn cước công dân *</label>
              <input v-model.trim="createForm.cccd" type="text" required placeholder="Đủ 12 chữ số" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1">Ngày sinh *</label>
              <input v-model="createForm.ngaySinh" type="date" required class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-bold text-gray-700 mb-1">Email liên hệ *</label>
              <input v-model.trim="createForm.email" type="email" required placeholder="VD: nguyenvana@gmail.com" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-bold text-gray-700 mb-1">Số điện thoại</label>
              <input v-model.trim="createForm.sdt" type="text" placeholder="Nhập số điện thoại" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
            </div>
          </div>
          
          <div class="mt-6 flex justify-end space-x-3 border-t pt-4">
            <button type="button" @click="closeCreateModal" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-lg transition">Hủy bỏ</button>
            <button type="submit" :disabled="isSubmitting" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition disabled:bg-gray-400">
              {{ isSubmitting ? 'Đang xử lý...' : 'Xác nhận tạo thẻ' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showRenewModal" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden transform transition-all">
        <div class="bg-blue-50 px-6 py-4 border-b border-blue-100 flex justify-between items-center">
          <h3 class="text-lg font-bold text-blue-800">Gia hạn Thẻ Độc giả</h3>
          <button @click="showRenewModal = false" class="text-blue-500 hover:text-blue-800">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div class="p-6">
          <p class="text-sm text-gray-600 mb-4">
            Gia hạn cho mã thẻ: <span class="font-bold font-mono text-gray-900">{{ selectedRenewReader }}</span>
          </p>
          
          <label class="block text-sm font-bold text-gray-700 mb-2">Chọn thời gian gia hạn:</label>
          <select v-model="renewMonths" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-medium">
            <option :value="3">3 tháng</option>
            <option :value="6">6 tháng</option>
            <option :value="12">12 tháng (1 năm)</option>
            <option :value="24">24 tháng (2 năm)</option>
            <option :value="48">48 tháng (Đại học 4 năm)</option>
          </select>

          <div class="mt-6 flex justify-end space-x-3">
            <button @click="showRenewModal = false" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-lg transition">Hủy</button>
            <button @click="submitRenew" :disabled="isSubmitting" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition disabled:bg-gray-400">
              {{ isSubmitting ? 'Đang xử lý...' : 'Xác nhận gia hạn' }}
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

// ============================================================================
// 1. ĐỊNH NGHĨA KIỂU DỮ LIỆU
// ============================================================================
interface Reader {
  MaDG: string;
  HoTen: string;
  CCCD: string;
  Email: string;
  NgayLapThe: string; 
  NgayHetHan: string;
}

// ============================================================================
// 2. KHAI BÁO BIẾN (REFS)
// ============================================================================
const readers = ref<Reader[]>([]);
const isLoading = ref(false);
const isSubmitting = ref(false);
const searchQuery = ref('');
const currentStatusFilter = ref('active');

const showCreateModal = ref(false);
const createForm = ref({
  maDG: '',
  password: '',
  hoTen: '',
  cccd: '',
  ngaySinh: '',
  email: '',
  sdt: ''
});

const showRenewModal = ref(false);
const selectedRenewReader = ref('');
const renewMonths = ref(12);

// Hệ thống Toast linh hoạt (Chỉnh thời gian hiển thị lâu hơn xíu để đọc lỗi)
const toast = ref({ show: false, message: '', type: 'success' as 'success' | 'error' });

const triggerToast = (msg: string, type: 'success' | 'error' = 'success', duration = 5000) => {
  toast.value = { show: true, message: msg, type };
  setTimeout(() => { toast.value.show = false; }, duration);
};

const getAuthHeaders = () => {
  const sessionRaw = localStorage.getItem('user_session'); 
  if (!sessionRaw) return {};
  return { Authorization: `Bearer ${JSON.parse(sessionRaw).token}` };
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('vi-VN');
};

const isExpired = (dateString: string): boolean => {
  if (!dateString) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  const deadline = new Date(dateString);
  return today > deadline;
};

const closeCreateModal = () => {
  showCreateModal.value = false;
  createForm.value = { maDG: '', password: '', hoTen: '', cccd: '', ngaySinh: '', email: '', sdt: '' };
};


const fetchReaders = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('http://localhost:3000/api/reader/list', {
      params: { 
        status: currentStatusFilter.value || undefined,
        search: searchQuery.value || undefined 
      },
      headers: getAuthHeaders()
    });
    readers.value = response.data.data;
  } catch (error: any) {
    triggerToast('Không thể kết nối lấy danh sách thẻ độc giả.', 'error');
  } finally {
    isLoading.value = false;
  }
};


const submitCreateReader = async () => {
  if (createForm.value.cccd.length !== 12 || !/^\d+$/.test(createForm.value.cccd)) {
    triggerToast('CCCD không hợp lệ! Vui lòng nhập đúng 12 chữ số.', 'error');
    return;
  }
  if (createForm.value.password.length < 6) {
    triggerToast('Mật khẩu quá yếu! Vui lòng nhập từ 6 ký tự trở lên.', 'error');
    return;
  }
  if (createForm.value.sdt && !/(0[3|5|7|8|9])+([0-9]{8})\b/.test(createForm.value.sdt)) {
    triggerToast('Số điện thoại không đúng định dạng của Việt Nam!', 'error');
    return;
  }

  isSubmitting.value = true;
  try {
    const response = await axios.post('http://localhost:3000/api/reader/create', createForm.value, { 
      headers: getAuthHeaders() 
    });

    triggerToast(response.data.message || 'Cấp thẻ thành công!', 'success');
    
    closeCreateModal();
    await fetchReaders();
    
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Lỗi hệ thống. Không thể cấp thẻ!';
    triggerToast(errorMessage, 'error', 6000); 
  } finally {
    isSubmitting.value = false;
  }
};

const openRenewModal = (maDG: string) => {
  selectedRenewReader.value = maDG;
  renewMonths.value = 12; 
  showRenewModal.value = true;
};

const submitRenew = async () => {
  if (!selectedRenewReader.value) return;
  isSubmitting.value = true;

  try {
    const response = await axios.put('http://localhost:3000/api/reader/renew', 
      { 
        maDG: selectedRenewReader.value, 
        soThangGiaHan: Number(renewMonths.value) 
      }, 
      { headers: getAuthHeaders() }
    );

    triggerToast(response.data.message || 'Gia hạn thẻ thành công!', 'success');
    
    showRenewModal.value = false;
    await fetchReaders(); 

  } catch (error: any) {
    triggerToast(error.response?.data?.message || 'Lỗi gia hạn thẻ.', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  fetchReaders();
});
</script>