<template>
  <div class="max-w-3xl mx-auto space-y-6 p-2">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Hồ sơ Độc giả</h2>
      <p class="mt-1 text-sm text-gray-500">Thông tin định danh được bảo vệ nghiêm ngặt. Bạn chỉ có thể xem trực tuyến.</p>
    </div>

    <div v-if="errorMessage" class="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl">
      <p class="text-sm font-semibold text-red-700">{{ errorMessage }}</p>
    </div>
    <div v-if="successMessage" class="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-xl">
      <p class="text-sm font-semibold text-green-700">{{ successMessage }}</p>
    </div>

    <div v-if="isLoading" class="p-6 bg-white border rounded-xl space-y-4 animate-pulse">
      <div class="h-4 bg-gray-200 rounded w-1/4"></div>
      <div class="grid grid-cols-2 gap-4">
        <div class="h-10 bg-gray-100 rounded"></div>
        <div class="h-10 bg-gray-100 rounded"></div>
      </div>
    </div>

    <div v-else class="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
      <form class="p-6 space-y-6">
        
        <div class="space-y-4">
          <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b pb-2">
            Thông tin định danh cốt lõi (Dữ liệu giải mã - Chỉ đọc)
          </h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Mã Độc giả</label>
              <input type="text" v-model="profile.MaDG" readonly class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-600 shadow-sm sm:text-sm cursor-not-allowed outline-none p-2 border">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Họ và tên</label>
              <input type="text" v-model="profile.HoTen" readonly class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-600 shadow-sm sm:text-sm cursor-not-allowed outline-none p-2 border">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Số Căn cước công dân (CCCD)</label>
              <div class="relative mt-1">
                <input 
                  type="text" 
                  v-model="profile.CCCD" 
                  readonly 
                  class="block w-full rounded-md border-gray-300 bg-gray-50 text-blue-700 font-mono font-bold shadow-sm sm:text-sm cursor-not-allowed outline-none p-2 border pl-9"
                >
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Ngày sinh</label>
              <input type="date" v-model="profile.NgaySinh" readonly class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-600 shadow-sm sm:text-sm cursor-not-allowed outline-none p-2 border">
            </div>
          </div>
        </div>

        <div class="space-y-4 pt-4">
          <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b pb-2">
            Thông tin liên lạc
          </h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Số điện thoại</label>
              <input type="tel" v-model="profile.SDT" readonly class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-600 shadow-sm sm:text-sm cursor-not-allowed outline-none p-2 border">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" v-model="profile.Email" readonly class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-600 shadow-sm sm:text-sm cursor-not-allowed outline-none p-2 border">
            </div>
          </div>
        </div>

        <div class="space-y-4 pt-4">
          <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b pb-2">
            Trạng thái tài khoản & Thẻ thư viện
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
            <div class="p-3 bg-slate-50 border rounded-lg">
              <span class="block text-gray-400 font-medium mb-1">Ngày lập thẻ</span>
              <span class="text-gray-800 font-mono">{{ formatDate(profile.NgayLapThe) }}</span>
            </div>
            <div class="p-3 bg-slate-50 border rounded-lg">
              <span class="block text-gray-400 font-medium mb-1">Ngày hết hạn</span>
              <span class="text-gray-800 font-mono">{{ formatDate(profile.NgayHetHan) }}</span>
            </div>
            <div class="p-3 border rounded-lg" :class="profile.CongNo > 0 ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'">
              <span class="block text-gray-400 font-medium mb-1">Công nợ hiện tại</span>
              <span class="text-sm font-bold">{{ profile.CongNo.toLocaleString('vi-VN') }} VNĐ</span>
            </div>
          </div>
        </div>

        <div class="pt-4 flex justify-end">
          <button 
            type="button" 
            @click="triggerDenyAlert"
            class="bg-gray-400 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-gray-500 focus:outline-none"
          >
            Yêu cầu sửa đổi hồ sơ
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

interface ReaderProfile {
  MaDG: string;
  HoTen: string;
  NgaySinh: string;
  CCCD: string;
  SDT: string;
  Email: string;
  NgayLapThe: string;
  NgayHetHan: string;
  CongNo: number;
}

const profile = ref<ReaderProfile>({
  MaDG: '',
  HoTen: '',
  NgaySinh: '',
  CCCD: '',
  SDT: '',
  Email: '',
  NgayLapThe: '',
  NgayHetHan: '',
  CongNo: 0
});

const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const loadReaderProfile = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  
  try {
    const sessionRaw = localStorage.getItem('user_session');
    if (!sessionRaw) {
      errorMessage.value = 'Hết hạn phiên làm việc bảo mật. Vui lòng đăng nhập lại!';
      return;
    }
    const session = JSON.parse(sessionRaw);

    const response = await axios.get('http://localhost:3000/api/reader/profile', {
      headers: {
        Authorization: `Bearer ${session.token}`
      }
    });

    const data = response.data;
    
    if (data.NgaySinh) {
      data.NgaySinh = data.NgaySinh.substring(0, 10);
    }

    profile.value = data;

  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value = 'Lỗi bất đối xứng hoặc mất quyền kết nối khi giải mã thông tin hồ sơ.';
    }
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('vi-VN');
};

const triggerDenyAlert = () => {
  alert('Thông báo phân hệ bảo mật: Độc giả không được tự ý sửa đổi hồ sơ thông tin định danh cốt lõi. Vui lòng mang CCCD gốc tới quầy Thủ thư để cập nhật và ký biên bản xác minh!');
};

onMounted(() => {
  loadReaderProfile();
});
</script>