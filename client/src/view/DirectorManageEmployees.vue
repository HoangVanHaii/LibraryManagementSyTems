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
        <div class="p-4 flex items-start">
          <div :class="toast.type === 'success' ? 'text-emerald-500' : 'text-red-500'" class="flex-shrink-0">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path v-if="toast.type === 'success'" stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-bold text-gray-900">{{ toast.type === 'success' ? 'Thành công' : 'Lỗi hệ thống' }}</p>
            <p class="mt-1 text-xs font-semibold text-gray-500 leading-normal">{{ toast.message }}</p>
          </div>
        </div>
      </div>
    </Transition>

    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 sm:text-3xl tracking-tight">Quản trị Nhân sự</h2>
        <p class="mt-1 text-sm text-gray-500">
          Danh mục điều phối hồ sơ nhân sự, xem chi tiết giải mã và ban hành tài khoản công tác mới.
        </p>
      </div>
      <button 
        @click="openCreateModal"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center"
      >
        <span class="mr-1.5 text-lg leading-none">+</span> Tuyển dụng nhân viên
      </button>
    </div>

    <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b bg-gray-50 flex justify-between items-center">
        <h3 class="text-xs font-bold text-gray-700 uppercase tracking-wider">Danh sách nhân viên vận hành</h3>
        <input 
          type="text" v-model="searchQuery" 
          placeholder="Lọc họ tên nhân sự..." 
          class="p-1.5 border border-gray-300 rounded-md text-xs outline-none focus:border-blue-500 w-48 bg-white"
        >
      </div>

      <div v-if="isLoadingList" class="p-8 text-center text-xs text-gray-400 animate-pulse font-medium">
        Đang đồng bộ danh mục nhân sự từ CSDL...
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 text-xs text-left">
          <thead class="bg-white text-gray-900 border-b font-semibold">
            <tr>
              <th scope="col" class="py-3.5 px-4 pl-6">Mã Số</th>
              <th scope="col" class="py-3.5 px-4">Họ và Tên</th>
              <th scope="col" class="py-3.5 px-4">Liên hệ</th>
              <th scope="col" class="py-3.5 px-4 text-center">Vai trò</th>
              <th scope="col" class="py-3.5 px-4 text-center">Trạng thái</th>
              <th scope="col" class="py-3.5 px-4 text-center pr-6">Hành động an ninh</th> 
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white font-medium text-gray-600">
            <tr v-for="emp in filteredEmployees" :key="emp.MaNV" class="hover:bg-gray-50 transition-colors">
              <td class="py-4 px-4 pl-6 font-mono font-bold text-gray-900">{{ emp.MaNV }}</td>
              <td class="py-4 px-4 font-bold text-gray-800 text-sm">{{ emp.HoTen }}</td>
              <td class="py-4 px-4 font-semibold text-gray-500">
                <div class="text-gray-800">{{ emp.Email }}</div>
                <div class="text-[10px] mt-0.5 text-gray-400">SĐT: {{ emp.SDT }}</div>
              </td>
              <td class="py-4 px-4 text-center">
                <span :class="getRoleClass(emp.Role)" class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border">
                  {{ emp.Role }}
                </span>
              </td>
              
              <td class="py-4 px-4 text-center">
                <span 
                  :class="emp.TrangThai === 1 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'"
                  class="px-2.5 py-0.5 rounded text-[10px] font-bold border"
                >
                  {{ emp.TrangThai === 1 ? 'Đang hoạt động' : 'Bị đóng băng' }}
                </span>
              </td>

              <td class="py-4 px-4 text-center pr-6 space-x-1.5 whitespace-nowrap">
                <button 
                  @click="viewDetails(emp.MaNV)"
                  class="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[10px] px-2.5 py-1.5 rounded transition-colors"
                >
                  Chi tiết 👁
                </button>

                <button 
                  v-if="emp.TrangThai === 1"
                  @click="openConfirmModal(emp.MaNV, 'KHOA')"
                  :disabled="isProcessing"
                  class="bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] px-2.5 py-1.5 rounded shadow-sm transition-colors disabled:opacity-50"
                >
                  Đóng băng 🔒
                </button>

                <button 
                  v-else
                  @click="openConfirmModal(emp.MaNV, 'MO_KHOA')"
                  :disabled="isProcessing"
                  class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-2.5 py-1.5 rounded shadow-sm transition-colors disabled:opacity-50"
                >
                  Kích hoạt 🔓
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="isConfirmModalOpen && confirmPayload" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity animate-fade-in">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border">
        <div class="p-5 text-center">
          <div 
            class="mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4"
            :class="confirmPayload.action === 'KHOA' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'"
          >
            <svg v-if="confirmPayload.action === 'KHOA'" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <svg v-else class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h3 class="text-lg font-bold text-gray-900 mb-2">
            {{ confirmPayload.action === 'KHOA' ? 'Xác nhận Đóng Băng' : 'Xác nhận Kích Hoạt' }}
          </h3>
          
          <p class="text-sm text-gray-500">
            Bạn có chắc chắn muốn <span class="font-bold text-gray-900">{{ confirmPayload.action === 'KHOA' ? 'KHÓA' : 'MỞ KHÓA' }}</span> tài khoản của nhân viên <span class="font-bold text-blue-600">{{ confirmPayload.maNV }}</span>?
            <br>
            <span v-if="confirmPayload.action === 'KHOA'" class="text-xs text-red-500 block mt-2">Hành động này sẽ vô hiệu hóa ngay lập tức phiên đăng nhập của nhân sự này.</span>
            <span v-else class="text-xs text-emerald-500 block mt-2">Hành động này sẽ khôi phục quyền truy cập và làm sạch bộ đếm gõ sai mật khẩu.</span>
          </p>
        </div>

        <div class="bg-gray-50 px-5 py-3 border-t border-gray-200 flex justify-end space-x-2">
          <button @click="isConfirmModalOpen = false" :disabled="isProcessing" class="px-4 py-2 text-xs font-bold text-gray-700 bg-white border rounded-md hover:bg-gray-50">Hủy bỏ</button>
          <button 
            @click="executeToggleStatus" 
            :disabled="isProcessing"
            :class="confirmPayload.action === 'KHOA' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'"
            class="px-5 py-2 text-xs font-bold text-white rounded-md shadow-sm disabled:opacity-50 transition-colors"
          >
            {{ isProcessing ? 'Đang xử lý...' : 'Xác nhận' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="isCreateModalOpen" class="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity animate-fade-in">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border">
        
        <div class="bg-slate-900 px-5 py-4 text-white flex justify-between items-center">
          <div>
            <h3 class="text-sm font-bold">Cấp quyết định nhân sự mới</h3>
            <p class="text-[10px] text-slate-400 font-medium">Khởi tạo lý lịch và tài khoản đăng nhập an toàn</p>
          </div>
          <button @click="closeCreateModal" class="text-slate-400 hover:text-white text-xl font-bold transition-colors leading-none">&times;</button>
        </div>

        <div class="p-5 overflow-y-auto max-h-[70vh]">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-3">
              <h4 class="text-xs font-bold text-gray-900 border-b pb-1">I. Lý lịch cá nhân</h4>
              <div>
                <label class="block text-[11px] font-bold text-gray-500">Họ và tên:</label>
                <input type="text" v-model="form.hoTen" class="w-full p-2 border rounded-md text-xs outline-none focus:border-blue-500" placeholder="Nhập họ tên...">
              </div>
              <div>
                <label class="block text-[11px] font-bold text-gray-500">Ngày sinh:</label>
                <input type="date" v-model="form.ngaySinh" class="w-full p-2 border rounded-md text-xs outline-none focus:border-blue-500 font-mono">
              </div>
              <div>
                <label class="block text-[11px] font-bold text-red-500">Số CCCD (Sẽ được mã hóa):</label>
                <input 
                type="text" 
                v-model="form.cccd" 
                maxlength="12"
                @input="form.cccd = form.cccd.replace(/[^0-9]/g, '')"
                class="w-full p-2 border rounded-md text-xs outline-none focus:border-red-500 font-mono font-bold bg-red-50/20" 
                placeholder="Nhập đúng 12 số CCCD..."
                >             
             </div>
              <div>
                <label class="block text-[11px] font-bold text-gray-500">Địa chỉ:</label>
                <input type="text" v-model="form.diaChi" class="w-full p-2 border rounded-md text-xs outline-none focus:border-blue-500" placeholder="Nhập địa chỉ cư trú...">
              </div>
            </div>

            <div class="space-y-3">
              <h4 class="text-xs font-bold text-gray-900 border-b pb-1">II. Công tác & Bảo mật</h4>
              <div>
                <label class="block text-[11px] font-bold text-gray-500">Số điện thoại:</label>
                <input type="text" v-model="form.sdt" class="w-full p-2 border rounded-md text-xs outline-none focus:border-blue-500 font-mono">
              </div>
              <div>
                <label class="block text-[11px] font-bold text-gray-500">Email công vụ:</label>
                <input type="email" v-model="form.email" class="w-full p-2 border rounded-md text-xs outline-none focus:border-blue-500">
              </div>
              <div>
                <label class="block text-[11px] font-bold text-gray-500">Vai trò phân hệ:</label>
                <select v-model="form.role" class="w-full p-2 border rounded-md text-xs outline-none focus:border-blue-500 font-bold bg-white">
                  <option value="ThuThu">Thủ thư</option>
                  <option value="KeToan">Kế toán</option>
                  <option value="QuanLyKho">Quản lý Kho</option>
                </select>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-blue-600">Mật khẩu cấp phát:</label>
                <input type="password" v-model="form.matKhau" class="w-full p-2 border rounded-md text-xs outline-none focus:border-blue-500 font-mono bg-blue-50/20" placeholder="Nhập mật khẩu...">
              </div>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t space-y-3">
            <h4 class="text-xs font-bold text-gray-900">III. Chế độ đãi ngộ (Dữ liệu mật)</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-[11px] font-bold text-emerald-600">Lương cơ bản (VNĐ):</label>
                <input type="number" v-model.number="form.luong" class="w-full p-2 border rounded-md text-xs outline-none focus:border-emerald-500 font-mono font-bold bg-emerald-50/20">
              </div>
              <div>
                <label class="block text-[11px] font-bold text-indigo-600">Phụ cấp (VNĐ):</label>
                <input type="number" v-model.number="form.phuCap" class="w-full p-2 border rounded-md text-xs outline-none focus:border-indigo-500 font-mono font-bold bg-indigo-50/20">
              </div>
            </div>
          </div>

          <p v-if="validationError" class="text-[11px] text-red-600 font-bold mt-4">⚠ {{ validationError }}</p>
        </div>

        <div class="bg-gray-50 px-5 py-3.5 border-t border-gray-200 flex justify-end space-x-2">
          <button @click="closeCreateModal" :disabled="isSubmitting" class="px-4 py-2 text-xs font-bold text-gray-700 bg-white border rounded-md hover:bg-gray-50">Hủy</button>
          <button 
            @click="submitCreateEmployee" 
            :disabled="isSubmitting"
            class="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm disabled:opacity-50"
          >
            {{ isSubmitting ? 'Đang tạo...' : 'Phê duyệt & Tạo mã' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="isDetailModalOpen && activeDetails" class="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity animate-fade-in">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border">
        <div class="bg-blue-700 px-5 py-4 text-white flex justify-between items-center">
          <div>
            <h3 class="text-sm font-bold">Hồ sơ giải mã thành công</h3>
            <p class="text-[10px] text-blue-200 font-medium">Bản ghi nhân viên: {{ activeDetails.MaNV }}</p>
          </div>
          <button @click="isDetailModalOpen = false" class="text-blue-200 hover:text-white text-xl font-bold leading-none">&times;</button>
        </div>
        <div class="p-5 space-y-3.5 text-xs">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <span class="text-[10px] text-gray-400 font-bold uppercase block">Họ và tên:</span>
              <p class="font-bold text-gray-900 mt-0.5 text-sm">{{ activeDetails.HoTen }}</p>
            </div>
            <div>
              <span class="text-[10px] text-gray-400 font-bold uppercase block">Vai trò:</span>
              <p class="font-bold text-blue-600 mt-0.5 text-sm">{{ activeDetails.Role }}</p>
            </div>
          </div>
          <div class="border-t border-gray-100 pt-3 grid grid-cols-2 gap-4">
            <div>
              <span class="text-[10px] text-red-500 font-bold uppercase block">CCCD (Đã mở khóa):</span>
              <p class="font-mono font-bold text-gray-900 mt-0.5 text-sm bg-red-50 px-2 py-1 rounded border border-red-100 text-center">
                {{ activeDetails.CCCD || 'Trống' }}
              </p>
            </div>
            <div>
              <span class="text-[10px] text-gray-400 font-bold uppercase block">Ngày sinh:</span>
              <p class="font-bold text-gray-700 mt-1">{{ formatDate(activeDetails.NgaySinh) }}</p>
            </div>
          </div>
          <div class="border-t border-gray-100 pt-3">
             <span class="text-[10px] text-gray-400 font-bold uppercase block">Địa chỉ:</span>
             <p class="font-semibold text-gray-700 mt-0.5">{{ activeDetails.DiaChi }}</p>
          </div>
          <div class="border-t border-gray-100 pt-3 bg-slate-50 p-3 rounded-lg border grid grid-cols-2 gap-4">
            <div>
              <span class="text-[10px] text-emerald-700 font-bold uppercase block">Lương cơ bản:</span>
              <p class="font-mono font-black text-emerald-700 text-base mt-0.5">{{ Number(activeDetails.Luong).toLocaleString('vi-VN') }}đ</p>
            </div>
            <div>
              <span class="text-[10px] text-indigo-700 font-bold uppercase block">Phụ cấp:</span>
              <p class="font-mono font-black text-indigo-700 text-base mt-0.5">{{ Number(activeDetails.PhuCap).toLocaleString('vi-VN') }}đ</p>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3 border-t border-gray-200 flex justify-end">
          <button @click="isDetailModalOpen = false" class="px-4 py-1.5 text-xs font-bold text-white bg-slate-800 rounded-md shadow-sm">Đóng cửa sổ</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

interface EmployeeShort {
  MaNV: string;
  HoTen: string;
  SDT: string;
  Email: string;
  Role: string;
  TrangThai: number;
}

interface EmployeeDetails extends EmployeeShort {
  NgaySinh: string;
  CCCD: string;
  DiaChi: string;
  Luong: string;
  PhuCap: string;
}

const employeesList = ref<EmployeeShort[]>([]);
const isLoadingList = ref(true);
const isProcessing = ref(false);
const searchQuery = ref('');

const isCreateModalOpen = ref(false);
const isSubmitting = ref(false);
const validationError = ref('');
const form = ref({
  hoTen: '', ngaySinh: '', cccd: '', sdt: '', email: '', diaChi: '', role: 'ThuThu', matKhau: '', luong: 0, phuCap: 0
});

const isDetailModalOpen = ref(false);
const activeDetails = ref<EmployeeDetails | null>(null);

// 🚀 STATE ĐIỀU KHIỂN MODAL XÁC NHẬN AN NINH
const isConfirmModalOpen = ref(false);
const confirmPayload = ref<{ maNV: string, action: 'KHOA' | 'MO_KHOA' } | null>(null);

const toast = ref({ show: false, message: '', type: 'success' as 'success'|'error' });

const triggerToast = (msg: string, type: 'success'|'error' = 'success') => {
  toast.value = { show: true, message: msg, type };
  setTimeout(() => { toast.value.show = false; }, 3500);
};

const getAuthHeaders = () => {
  const sessionRaw = localStorage.getItem('user_session');
  if (!sessionRaw) return {};
  return { Authorization: `Bearer ${JSON.parse(sessionRaw).token}` };
};

const loadEmployeesList = async () => {
  isLoadingList.value = true;
  try {
    const response = await axios.get('http://localhost:3000/api/director/employees', { headers: getAuthHeaders() });
    employeesList.value = response.data;
  } catch (error) {
    console.error('Lỗi tải danh sách nhân viên:', error);
  } finally { isLoadingList.value = false; }
};

// 🚀 HÀM MỞ MODAL XÁC NHẬN THAY VÌ GỌI CONFIRM()
const openConfirmModal = (maNV: string, action: 'KHOA' | 'MO_KHOA') => {
  confirmPayload.value = { maNV, action };
  isConfirmModalOpen.value = true;
};

// 🚀 HÀM THỰC THI LỆNH TỪ MODAL XÁC NHẬN
const executeToggleStatus = async () => {
  if (!confirmPayload.value) return;
  const { maNV, action } = confirmPayload.value;

  isProcessing.value = true;
  try {
    const response = await axios.post('http://localhost:3000/api/director/employees/toggle-status', {
      maNV,
      hanhDong: action
    }, { headers: getAuthHeaders() });

    triggerToast(response.data.message, 'success');
    await loadEmployeesList(); 
    isConfirmModalOpen.value = false; // Đóng modal sau khi thành công
  } catch (error: any) {
    console.error('Lỗi thay đổi trạng thái:', error);
    triggerToast(error.response?.data?.message || 'Tiến trình điều hướng tài khoản thất bại.', 'error');
  } finally {
    isProcessing.value = false;
  }
};

const openCreateModal = () => {
  form.value = { hoTen: '', ngaySinh: '', cccd: '', sdt: '', email: '', diaChi: '', role: 'ThuThu', matKhau: '', luong: 0, phuCap: 0 };
  validationError.value = '';
  isCreateModalOpen.value = true;
};

const closeCreateModal = () => {
  if (isSubmitting.value) return;
  isCreateModalOpen.value = false;
};

const submitCreateEmployee = async () => {
  if (!form.value.hoTen || !form.value.ngaySinh || !form.value.cccd || !form.value.sdt || !form.value.email || !form.value.matKhau) {
    validationError.value = 'Vui lòng nhập đầy đủ các trường thông tin cơ bản & mật khẩu!';
    return;
  }
  
  if (form.value.cccd.length !== 12) {
    validationError.value = 'Số Căn cước công dân phải bao gồm chính xác 12 chữ số!';
    return;
  }

  isSubmitting.value = true;
  validationError.value = '';
  try {
    const response = await axios.post('http://localhost:3000/api/director/create-employee', {
      hoTen: form.value.hoTen,
      ngaySinh: form.value.ngaySinh,
      cccd: form.value.cccd,
      sdt: form.value.sdt,
      email: form.value.email,
      diaChi: form.value.diaChi,
      role: form.value.role,
      matKhau: form.value.matKhau,
      luong: form.value.luong,
      phuCap: form.value.phuCap
    }, { headers: getAuthHeaders() });

    isCreateModalOpen.value = false;
    triggerToast(response.data.message, 'success');
    await loadEmployeesList();
  } catch (error: any) {
    console.error('Lỗi tạo nhân viên mới:', error);
    validationError.value = error.response?.data?.message || 'Quy trình tạo hồ sơ thất bại.';
  } finally { isSubmitting.value = false; }
};

const viewDetails = async (maNV: string) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/director/employees/${maNV}`, { headers: getAuthHeaders() });
    activeDetails.value = response.data;
    isDetailModalOpen.value = true;
  } catch (error: any) {
    console.error('Lỗi tải chi tiết nhân viên:', error);
    triggerToast(error.response?.data?.message || 'Không thể giải mã bản ghi này.', 'error');
  }
};

const getRoleClass = (role: string) => {
  switch (role) {
    case 'ThuThu': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'KeToan': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'QuanLyKho': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    default: return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

const filteredEmployees = computed(() => {
  return employeesList.value.filter(e => {
    return e.HoTen.toLowerCase().includes(searchQuery.value.toLowerCase().trim());
  });
});

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('vi-VN');
};

onMounted(() => { loadEmployeesList(); });
</script>