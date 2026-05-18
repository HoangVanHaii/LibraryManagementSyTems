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
      <div v-if="toast.show" class="fixed top-5 right-5 z-50 max-w-sm w-full bg-white shadow-xl rounded-xl border p-4 overflow-hidden pointer-events-auto">
        <div class="flex items-start">
          <div class="flex-shrink-0 text-blue-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-bold text-gray-900">Hệ thống mật mã lõi</p>
            <p class="mt-1 text-xs font-semibold text-gray-500 leading-normal">{{ toast.message }}</p>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button @click="toast.show = false" class="text-gray-400 hover:text-gray-500 text-lg font-bold leading-none">&times;</button>
          </div>
        </div>
      </div>
    </Transition>

    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 sm:text-3xl sm:tracking-tight">
          Tra cứu Nhân sự & Tiền lương
        </h2>
        <p class="mt-1 text-sm text-gray-500">
          Chế độ xem đặc quyền của Kế toán. Các cột dữ liệu tài chính nhạy cảm được tự động giải mã thời gian thực bằng Khóa đối xứng AES_256 (Column-Level Security).
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div class="bg-white overflow-hidden shadow-sm border border-gray-200 rounded-xl p-5">
        <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block">Tổng Quy Mô Nhân Sự</span>
        <div class="mt-2 flex items-baseline justify-between">
          <span class="text-2xl font-black text-slate-900">{{ salaryPool.TongSoNhanVien }} nhân viên</span>
          <span class="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">Lõi Nhân lực</span>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow-sm border border-gray-200 rounded-xl p-5">
        <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block">Quỹ Lương Cơ Bản / Tháng</span>
        <div class="mt-2 flex items-baseline justify-between">
          <span class="text-2xl font-black text-blue-600">{{ salaryPool.TongLuongCoBan.toLocaleString('vi-VN') }}đ</span>
          <span class="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">SymKey decrypted</span>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow-sm border border-gray-200 rounded-xl p-5">
        <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block">Quỹ Phụ Cấp & Đãi Ngộ</span>
        <div class="mt-2 flex items-baseline justify-between">
          <span class="text-2xl font-black text-emerald-600">{{ salaryPool.TongPhuCap.toLocaleString('vi-VN') }}đ</span>
          <span class="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded font-bold">Thực chi quỹ</span>
        </div>
      </div>
    </div>

    <div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div class="px-4 py-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="relative w-full sm:w-72">
          <input 
            type="text" 
            v-model="searchQuery"
            class="block w-full p-2 pl-3 text-sm text-gray-900 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none" 
            placeholder="Tìm theo Mã hoặc Tên nhân viên..."
          >
        </div>
        <span class="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
          Quyền truy cập: FULL_COLUMNS
        </span>
      </div>

      <div v-if="isLoading" class="p-8 text-center text-gray-500 animate-pulse font-medium">
        Đang mở khóa khóa đối xứng SymKey_ThuVien để giải mã bảng lương hệ thống...
      </div>

      <div v-else-if="filteredStaffList.length === 0" class="p-8 text-center text-gray-400 font-medium">
        Không tìm thấy thông tin hồ sơ nhân sự nào khớp với từ khóa tra cứu.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 text-sm text-left">
          <thead class="bg-white text-gray-900 font-semibold border-b">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 sm:pl-6">Nhân Sự</th>
              <th scope="col" class="px-3 py-3.5">Chức Vụ</th>
              <th scope="col" class="px-3 py-3.5">Thông Tin Định Danh (Giải mã)</th>
              <th scope="col" class="px-3 py-3.5 text-right bg-blue-50/50 text-blue-900">Lương Cơ Bản (đ)</th>
              <th scope="col" class="px-3 py-3.5 text-right bg-blue-50/50 text-blue-900">Phụ Cấp (đ)</th>
              <th scope="col" class="px-3 py-3.5 text-right pr-6 text-indigo-900 bg-indigo-50/30">Tổng Thu Nhập</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="staff in filteredStaffList" :key="staff.MaNV" class="hover:bg-gray-50 transition-colors">
              <td class="py-4 pl-4 pr-3 whitespace-nowrap sm:pl-6">
                <div class="font-bold text-gray-900 text-sm">{{ staff.HoTen }}</div>
                <div class="font-mono text-xs text-gray-400 font-semibold">ID: {{ staff.MaNV }}</div>
              </td>
              <td class="px-3 py-4 whitespace-nowrap">
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border">
                  {{ staff.TenChucVu }}
                </span>
              </td>
              <td class="px-3 py-4 whitespace-nowrap text-xs text-gray-600 space-y-0.5">
                <div class="font-mono text-blue-700 font-bold"><span class="text-gray-400 font-sans font-medium">CCCD:</span> {{ staff.CCCD || 'Chưa cập nhật' }}</div>
                <div><span class="text-gray-400 font-medium">SĐT:</span> {{ staff.SDT }}</div>
                <div class="text-gray-400 text-[11px]">{{ staff.Email }}</div>
              </td>
              <td class="px-3 py-4 text-sm text-blue-900 whitespace-nowrap text-right font-mono font-bold bg-blue-50/20">
                {{ staff.Luong.toLocaleString('vi-VN') }}
              </td>
              <td class="px-3 py-4 text-sm text-blue-900 whitespace-nowrap text-right font-mono bg-blue-50/20">
                {{ staff.PhuCap.toLocaleString('vi-VN') }}
              </td>
              <td class="px-3 py-4 text-sm text-indigo-700 whitespace-nowrap text-right font-black bg-indigo-50/10 pr-6">
                {{ (staff.Luong + staff.PhuCap).toLocaleString('vi-VN') }}đ
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="rounded-xl bg-blue-50 p-4 border border-blue-200">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3 flex-1 md:flex md:justify-between">
          <p class="text-sm text-blue-700 font-medium">
            Dữ liệu tiền lương và phụ cấp chỉ hiển thị cho duy nhất vai trò <strong>Kế Toán</strong>. Các phân hệ tài khoản khác (Thủ thư, Độc giả) khi truy vấn sẽ bị hệ thống SQL Server chặn đứng và ẩn giấu hoàn toàn dữ liệu.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

// Định nghĩa Interface cấu trúc dữ liệu Nhân viên giải mã nhận về từ Backend
interface StaffSalary {
  MaNV: string;
  HoTen: string;
  NgaySinh: string;
  CCCD: string;
  SDT: string;
  Email: string;
  DiaChi: string;
  TenChucVu: string;
  Luong: number;
  PhuCap: number;
}

// Định nghĩa Interface cấu trúc dữ liệu Tổng quỹ lương thống kê
interface SalaryPoolSummary {
  TongSoNhanVien: number;
  TongLuongCoBan: number;
  TongPhuCap: number;
}

const staffList = ref<StaffSalary[]>([]);
const salaryPool = ref<SalaryPoolSummary>({ TongSoNhanVien: 0, TongLuongCoBan: 0, TongPhuCap: 0 });

const isLoading = ref(false);
const searchQuery = ref('');

const toast = ref({
  show: false,
  message: ''
});

// Hàm phát nổ Toast thông báo kiểm toán bảo mật mật mã
const triggerToast = (msg: string) => {
  toast.value.show = true;
  toast.value.message = msg;
  setTimeout(() => {
    toast.value.show = false;
  }, 3500); // 3.5 giây tự đóng
};

// Trích xuất mã Token JWT hợp pháp lưu trong bộ nhớ trình duyệt của phiên đăng nhập
const getAuthHeaders = () => {
  const sessionRaw = localStorage.getItem('user_session');
  if (!sessionRaw) return {};
  return { Authorization: `Bearer ${JSON.parse(sessionRaw).token}` };
};

// Thực thi triệu hồi đồng thời cả 2 API nạp bảng dữ liệu tổng quan và chi tiết (Tối ưu hóa hiệu năng mạng 🚀)
const loadStaffPayrollData = async () => {
  isLoading.value = true;
  try {
    const [poolResponse, listResponse] = await Promise.all([
      axios.get('http://localhost:3000/api/staff/accountant/staff/salary-pool', { headers: getAuthHeaders() }),
      axios.get('http://localhost:3000/api/staff/accountant/staff', { headers: getAuthHeaders() })
    ]);

    salaryPool.value = poolResponse.data;
    staffList.value = listResponse.data;

    triggerToast('Khóa đối xứng SymKey_ThuVien đã được kích hoạt thành công. Toàn bộ hồ sơ lương nhân sự đã được giải mã minh bạch.');
  } catch (error: any) {
    console.error('💥 Thất bại khi giải mã dữ liệu nhân sự:', error);
    triggerToast('Lỗi bảo mật nghiêm trọng: Không thể kết nối hạ tầng mật mã hoặc tài khoản bị từ chối đặc quyền.');
  } finally {
    isLoading.value = false;
  }
};

// Bộ lọc tìm kiếm động (Client-side Search) hỗ trợ tra cứu nhanh theo ID hoặc Tên nhân viên
const filteredStaffList = computed(() => {
  return staffList.value.filter(staff => {
    const query = searchQuery.value.toLowerCase().trim();
    if (!query) return true;
    return staff.MaNV.toLowerCase().includes(query) || 
           staff.HoTen.toLowerCase().includes(query);
  });
});

onMounted(() => {
  loadStaffPayrollData();
});
</script>