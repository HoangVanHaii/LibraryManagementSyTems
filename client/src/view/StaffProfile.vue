<template>
  <div class="max-w-4xl mx-auto space-y-6 p-4">
    <Transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="toast.show" class="fixed top-5 right-5 z-50 max-w-sm w-full bg-white shadow-2xl rounded-xl border pointer-events-auto overflow-hidden">
        <div class="p-4 flex items-start">
          <div v-if="toast.type === 'success'" class="flex-shrink-0 text-emerald-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div v-else class="flex-shrink-0 text-red-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-bold text-gray-900">{{ toast.type === 'success' ? 'Thành công' : 'Lỗi hệ thống' }}</p>
            <p class="mt-1 text-xs font-semibold text-gray-500 leading-normal">{{ toast.message }}</p>
          </div>
        </div>
      </div>
    </Transition>

    <div>
      <h2 class="text-2xl font-bold text-gray-900">Hồ sơ Cá nhân</h2>
      <p class="mt-1 text-sm text-gray-500">Quản lý thông tin định danh và cập nhật phương thức liên lạc của bạn.</p>
    </div>

    <div v-if="isLoading" class="p-12 text-center animate-pulse">
      <div class="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
      <div class="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-2"></div>
      <div class="h-3 bg-gray-200 rounded w-1/4 mx-auto"></div>
    </div>

    <div v-else-if="profileData" class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div class="bg-slate-900 px-6 py-8 sm:p-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div class="relative">
          <div class="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-lg text-blue-600 font-bold text-3xl">
            {{ profileData.HoTen.charAt(0) }}
          </div>
          <div class="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full" title="Đang trực tuyến"></div>
        </div>
        <div class="text-center sm:text-left text-white pt-2">
          <h1 class="text-2xl font-bold">{{ profileData.HoTen }}</h1>
          <p class="text-blue-300 font-medium font-mono text-sm mt-1">Mã NV: {{ profileData.MaNV }} &bull; {{ profileData.TenChucVu }}</p>
        </div>
      </div>

      <div class="p-6 sm:p-10">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div class="space-y-5">
            <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2">Thông tin định danh</h3>
            
            <div>
              <label class="block text-xs font-semibold text-gray-500 mb-1">Ngày Sinh</label>
              <input type="text" :value="formatDate(profileData.NgaySinh)" disabled class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium cursor-not-allowed">
            </div>
            
            <div>
              <label class="block text-xs font-semibold text-gray-500 mb-1">Số Căn Cước Công Dân</label>
              <input type="text" :value="profileData.CCCD" disabled class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-mono font-bold cursor-not-allowed">
            </div>

            <div class="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mt-4">
              <h4 class="text-xs font-bold text-blue-800 uppercase mb-3">Dữ liệu bảo mật (Giải mã)</h4>
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium text-gray-600">Lương cơ bản:</span>
                <span class="font-mono font-bold text-blue-700">{{ profileData.Luong || 'Chưa cập nhật' }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-gray-600">Phụ cấp:</span>
                <span class="font-mono font-bold text-emerald-600">{{ profileData.PhuCap || '0' }}</span>
              </div>
            </div>
          </div>

          <form @submit.prevent="handleUpdateProfile" class="space-y-5">
            <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2 flex justify-between items-center">
              Thông tin liên lạc
              <span class="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Có thể sửa</span>
            </h3>

            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">Số Điện Thoại *</label>
              <input v-model="editForm.sdt" type="text" required class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono font-medium transition-shadow">
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">Địa chỉ Email *</label>
              <input v-model="editForm.email" type="email" required class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-shadow">
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">Địa Chỉ Thường Trú</label>
              <textarea v-model="editForm.diaChi" rows="3" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium resize-none transition-shadow"></textarea>
            </div>

            <div class="pt-4 flex justify-end">
              <button 
                type="submit" 
                :disabled="isSubmitting || !isFormChanged"
                class="px-6 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 disabled:bg-gray-300 shadow-sm transition-colors"
              >
                {{ isSubmitting ? 'Đang lưu...' : 'Lưu Thay Đổi' }}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

interface UserProfile {
  MaNV: string;
  HoTen: string;
  NgaySinh: string;
  CCCD: string;
  SDT: string;
  Email: string;
  DiaChi: string;
  TenChucVu: string;
  Luong: string;
  PhuCap: string;
}

const profileData = ref<UserProfile | null>(null);
const isLoading = ref(true);
const isSubmitting = ref(false);

const editForm = ref({
  sdt: '',
  email: '',
  diaChi: ''
});

const toast = ref({ show: false, message: '', type: 'success' as 'success' | 'error' });

const triggerToast = (msg: string, type: 'success' | 'error' = 'success') => {
  toast.value = { show: true, message: msg, type };
  setTimeout(() => { toast.value.show = false; }, 3500);
};

const getAuthHeaders = () => {
  const sessionRaw = localStorage.getItem('user_session');
  if (!sessionRaw) throw new Error('Vui lòng đăng nhập lại.');
  const session = JSON.parse(sessionRaw);
  return { Authorization: `Bearer ${session.token}` };
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('vi-VN');
};

const loadProfile = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('http://localhost:3000/api/staff/profile', {
      headers: getAuthHeaders()
    });
    profileData.value = response.data;
    
    // Nạp dữ liệu vào form chỉnh sửa
    editForm.value = {
      sdt: profileData.value!.SDT,
      email: profileData.value!.Email,
      diaChi: profileData.value!.DiaChi || ''
    };
  } catch (error: any) {
    triggerToast(error.response?.data?.message || 'Không thể tải hồ sơ cá nhân', 'error');
  } finally {
    isLoading.value = false;
  }
};

// Kiểm tra xem người dùng có gõ thay đổi gì vào form không để bật/tắt nút Lưu
const isFormChanged = computed(() => {
  if (!profileData.value) return false;
  return editForm.value.sdt !== profileData.value.SDT || 
         editForm.value.email !== profileData.value.Email || 
         editForm.value.diaChi !== (profileData.value.DiaChi || '');
});

const handleUpdateProfile = async () => {
  isSubmitting.value = true;
  try {
    const response = await axios.put('http://localhost:3000/api/staff/profile', editForm.value, {
      headers: getAuthHeaders()
    });
    
    triggerToast(response.data.message, 'success');
    await loadProfile(); // Cập nhật lại giao diện sau khi lưu
  } catch (error: any) {
    triggerToast(error.response?.data?.message || 'Có lỗi xảy ra khi lưu thông tin', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  loadProfile();
});
</script>