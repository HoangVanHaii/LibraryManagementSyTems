<template>
  <div class="space-y-6 relative">
    
    <Transition enter-active-class="transform ease-out duration-300 transition" enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2" enter-to-class="translate-y-0 opacity-100 sm:translate-x-0" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="toast.show" class="fixed top-5 right-5 z-[70] max-w-sm w-full bg-white shadow-xl rounded-xl border pointer-events-auto overflow-hidden">
        <div class="p-4 flex items-start">
          <div v-if="toast.type === 'success'" class="flex-shrink-0 text-emerald-500"><svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
          <div v-else class="flex-shrink-0 text-red-500"><svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-bold text-gray-900">{{ toast.type === 'success' ? 'Thành công' : 'Có lỗi xảy ra' }}</p>
            <p class="mt-1 text-xs font-semibold text-gray-500 leading-normal">{{ toast.message }}</p>
          </div>
        </div>
      </div>
    </Transition>

    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 flex items-center">
          <svg class="w-8 h-8 mr-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          Nhật ký Xác thực & Đăng nhập Hệ thống
        </h2>
        <p class="mt-1 text-sm text-gray-500 italic">
          Giám sát thời gian thực các cổng kết nối và lịch sử đăng nhập. Phát hiện các hành vi dò quét mật mã bất hợp pháp.
        </p>
      </div>
      <div class="flex space-x-3">
        <button @click="exportToExcel" class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors flex items-center shadow-sm">
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Xuất báo cáo (Excel)
        </button>
      </div>
    </div>

    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label class="block text-xs font-semibold text-gray-500 uppercase mb-1">Tài khoản</label>
        <input v-model="filters.username" type="text" placeholder="Nhập tên đăng nhập..." class="block w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 py-2 border px-3">
      </div>
      <div>
        <label class="block text-xs font-semibold text-gray-500 uppercase mb-1">Từ ngày</label>
        <input v-model="filters.tuNgay" type="date" class="block w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 py-2 border px-3">
      </div>
      <div>
        <label class="block text-xs font-semibold text-gray-500 uppercase mb-1">Đến ngày</label>
        <input v-model="filters.denNgay" type="date" class="block w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 py-2 border px-3">
      </div>
      <div class="flex items-end">
        <button @click="fetchLoginHistory" class="w-full bg-gray-900 text-white py-2 rounded-md text-sm font-bold hover:bg-black transition-colors shadow-sm">
          Lọc dữ liệu
        </button>
      </div>
    </div>

    <div class="bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden">
      <div v-if="isLoading" class="p-10 text-center text-gray-500 animate-pulse font-medium">Đang kết nối cơ sở dữ liệu an ninh...</div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-800 text-white">
            <tr>
              <th scope="col" class="py-3.5 pl-6 pr-3 text-left text-sm font-bold uppercase tracking-wider w-[25%]">Thời gian hệ thống</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-bold uppercase tracking-wider w-[25%]">Tên đăng nhập</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-bold uppercase tracking-wider w-[20%]">Địa chỉ IP kết nối</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-bold uppercase tracking-wider w-[30%]">Trạng thái xác thực</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="log in loginHistory" :key="log.MaLichSu" class="hover:bg-blue-50 transition-colors cursor-default">
              
              <td class="py-4 pl-6 pr-3 text-sm font-mono text-gray-600 whitespace-nowrap italic">
                {{ formatDateTime(log.ThoiGian) }}
              </td>
              
              <td class="px-3 py-4 text-sm whitespace-nowrap font-bold text-gray-900">
                <div class="flex items-center">
                  <span class="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                  {{ log.TenDangNhap }}
                </div>
              </td>
              
              <td class="px-3 py-4 text-sm font-mono text-blue-700 whitespace-nowrap">
                {{ log.IP_Address }}
              </td>
              
              <td class="px-3 py-4 text-sm whitespace-nowrap">
                <span :class="getStatusClass(log.TrangThai)" class="px-2.5 py-1 rounded-md text-xs font-bold border shadow-sm">
                  {{ log.TrangThai }}
                </span>
              </td>
              
            </tr>
            <tr v-if="loginHistory.length === 0">
              <td colspan="4" class="py-12 text-center text-gray-500 italic font-medium">Không có bản ghi lịch sử truy cập nào được tìm thấy.</td>
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
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const loginHistory = ref<any[]>([]);
const isLoading = ref(false);

const filters = ref({
  username: '',
  tuNgay: '',
  denNgay: ''
});

const toast = ref({ show: false, message: '', type: 'success' as 'success' | 'error' });
const triggerToast = (msg: string, type: 'success' | 'error' = 'success', duration = 5000) => {
  toast.value = { show: true, message: msg, type };
  setTimeout(() => { toast.value.show = false; }, duration);
};

const getAuthHeaders = () => {
  const sessionRaw = localStorage.getItem('user_session'); 
  if (!sessionRaw) return {};
  try {
    const sessionData = JSON.parse(sessionRaw);
    return { Authorization: `Bearer ${sessionData.token}` };
  } catch (e) {
    return {};
  }
};

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleString('vi-VN', { 
    year: 'numeric', month: '2-digit', day: '2-digit', 
    hour: '2-digit', minute: '2-digit', second: '2-digit' 
  });
};

const getStatusClass = (status: string) => {
  if (!status) return 'bg-gray-100 text-gray-800 border-gray-300';
  if (status === 'Thành công') {
    return 'bg-emerald-50 text-emerald-700 border-emerald-300';
  }
  return 'bg-rose-50 text-rose-700 border-rose-300';
};

const fetchLoginHistory = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('http://localhost:3000/api/director/login-history', {
      params: { 
        username: filters.value.username || undefined,
        tuNgay: filters.value.tuNgay || undefined,
        denNgay: filters.value.denNgay || undefined
      },
      headers: getAuthHeaders()
    });

    if (response.data.success) {
      loginHistory.value = response.data.data;
    }
  } catch (error: any) {
    triggerToast('Không thể tải lịch sử đăng nhập. Hãy kiểm tra lại kết nối!', 'error');
  } finally {
    isLoading.value = false;
  }
};

const exportToExcel = async () => {
  if (loginHistory.value.length === 0) {
    triggerToast('Không có dữ liệu nhật ký truy cập để xuất báo cáo!', 'error');
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Lịch sử truy cập');

  worksheet.columns = [
    { header: 'Thời gian hệ thống', key: 'time', width: 25 },
    { header: 'Tên đăng nhập', key: 'username', width: 25 },
    { header: 'Địa chỉ IP kết nối', key: 'ip', width: 22 },
    { header: 'Trạng thái xác thực', key: 'status', width: 45 }
  ];

  loginHistory.value.forEach(log => {
    worksheet.addRow({
      time: formatDateTime(log.ThoiGian),
      username: log.TenDangNhap,
      ip: log.IP_Address,
      status: log.TrangThai
    });
  });

  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1F2937' }
  };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
      };
      if (rowNumber > 1) {
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      }
    });
  });

  try {
    const buffer = await workbook.xlsx.writeBuffer();
    const dateStr = new Date().toLocaleDateString('vi-VN').replace(/\//g, '-');
    saveAs(new Blob([buffer]), `Nhat_Ky_Truy_Cap_${dateStr}.xlsx`);
    triggerToast('Xuất báo cáo Excel thành công!', 'success');
  } catch (error) {
    triggerToast('Có lỗi xảy ra khi khởi tạo tệp Excel!', 'error');
    console.error(error);
  }
};

onMounted(() => {
  fetchLoginHistory();
});
</script>