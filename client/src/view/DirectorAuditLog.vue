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
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          Nhật ký Kiểm toán Hệ thống (Audit Log)
        </h2>
        <p class="mt-1 text-sm text-gray-500 italic">
          Ghi lại mọi thao tác làm thay đổi dữ liệu (DML). Dữ liệu này là bất khả xâm phạm và không thể chỉnh sửa.
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
        <label class="block text-xs font-semibold text-gray-500 uppercase mb-1">Bảng tác động</label>
        <select v-model="filters.table" class="block w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 py-2 border px-3">
          <option value="">Tất cả các bảng</option>
          <option value="SACH">SACH</option>
          <option value="NHAN_VIEN">NHAN_VIEN</option>
          <option value="PHIEU_MUON">PHIEU_MUON</option>
          <option value="DOC_GIA">DOC_GIA</option>
          <option value="CT_PHIEU_MUON">CT_PHIEU_MUON</option>
          <option value="PHIEU_THU_TIEN">PHIEU_THU_TIEN</option>
        </select>
      </div>
      <div>
        <label class="block text-xs font-semibold text-gray-500 uppercase mb-1">Người dùng (DB User)</label>
        <input v-model="filters.user" type="text" placeholder="Nhập tên user..." class="block w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 py-2 border px-3">
      </div>
      <div>
        <label class="block text-xs font-semibold text-gray-500 uppercase mb-1">Hành động</label>
        <select v-model="filters.action" class="block w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 py-2 border px-3">
          <option value="">Tất cả thao tác</option>
          <option value="INSERT">INSERT (Thêm)</option>
          <option value="UPDATE">UPDATE (Sửa)</option>
          <option value="DELETE">DELETE (Xóa)</option>
        </select>
      </div>
      <div class="flex items-end">
        <button @click="fetchAuditLogs" class="w-full bg-gray-900 text-white py-2 rounded-md text-sm font-bold hover:bg-black transition-colors shadow-sm">
          Lọc dữ liệu
        </button>
      </div>
    </div>

    <div class="bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden">
      
      <div v-if="isLoading" class="p-10 text-center text-gray-500 animate-pulse font-medium">Đang truy xuất hệ thống lưu trữ...</div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-800 text-white">
            <tr>
              <th scope="col" class="py-3.5 pl-6 pr-3 text-left text-sm font-bold uppercase tracking-wider w-[20%]">Thời gian</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-bold uppercase tracking-wider w-[20%]">User</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-bold uppercase tracking-wider w-[15%]">Hành động</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-bold uppercase tracking-wider w-[20%]">Bảng</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-bold uppercase tracking-wider w-[25%]">Chi tiết dữ liệu</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="log in auditLogs" :key="log.LogID" class="hover:bg-blue-50 transition-colors cursor-default">
              
              <td class="py-4 pl-6 pr-3 text-sm font-mono text-gray-600 whitespace-nowrap italic">
                {{ formatDateTime(log.ThoiGian) }}
              </td>
              
              <td class="px-3 py-4 text-sm whitespace-nowrap font-bold text-gray-900">
                <div class="flex items-center">
                  <span class="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                  {{ log.DatabaseUser }}
                </div>
              </td>
              
              <td class="px-3 py-4 text-sm whitespace-nowrap">
                <span :class="getActionClass(log.HanhDong)" class="px-2 py-1 rounded text-xs font-black shadow-sm">
                  {{ log.HanhDong }}
                </span>
              </td>
              
              <td class="px-3 py-4 text-sm font-mono text-blue-700 whitespace-nowrap font-bold">
                [{{ log.TenBang }}]
              </td>
              
              <td class="px-3 py-4 text-sm">
                <button @click="openJsonModal(log)" class="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded border border-blue-200 transition-colors font-medium text-xs flex items-center w-max">
                  <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                  Xem chi tiết (JSON)
                </button>
              </td>
              
            </tr>
            <tr v-if="auditLogs.length === 0">
              <td colspan="5" class="py-12 text-center text-gray-500 italic font-medium">Không tìm thấy bản ghi Audit Log nào.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="selectedLog" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div class="bg-gray-900 rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[85vh]">
        
        <div class="px-6 py-4 border-b border-gray-700 flex justify-between items-center bg-gray-800">
          <h3 class="text-lg font-bold text-white flex items-center">
            Chi tiết thao tác <span :class="getActionClass(selectedLog.HanhDong)" class="ml-3 px-2 py-0.5 rounded text-xs font-black">{{ selectedLog.HanhDong }}</span>
          </h3>
          <button @click="selectedLog = null" class="text-gray-400 hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div class="p-6 overflow-y-auto flex-1 bg-gray-900 custom-scrollbar">
          <p class="text-gray-400 text-sm mb-3 font-mono">Bảng: <span class="text-blue-400 font-bold">{{ selectedLog.TenBang }}</span> | Thời gian: {{ formatDateTime(selectedLog.ThoiGian) }}</p>
          <pre class="bg-black text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto border border-gray-700 shadow-inner">{{ formatJson(selectedLog.ChiTiet) }}</pre>
        </div>
        
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const auditLogs = ref<any[]>([]);
const isLoading = ref(false);
const selectedLog = ref<any>(null);

const filters = ref({
  table: '',
  user: '',
  action: ''
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

const getActionClass = (action: string) => {
  switch (action) {
    case 'INSERT': return 'bg-green-100 text-green-800 border-green-300';
    case 'UPDATE': return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'DELETE': return 'bg-red-100 text-red-800 border-red-300';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const formatJson = (jsonString: string) => {
  if (!jsonString) return 'Không có dữ liệu';
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed, null, 4);
  } catch (e) {
    return jsonString;
  }
};

const fetchAuditLogs = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('http://localhost:3000/api/director/audit-logs', {
      params: { 
        table: filters.value.table || undefined,
        user: filters.value.user || undefined,
        action: filters.value.action || undefined
      },
      headers: getAuthHeaders()
    });

    if (response.data.success) {
      auditLogs.value = response.data.data;
    }
  } catch (error: any) {
    triggerToast('Không thể tải nhật ký hệ thống. Kiểm tra quyền truy cập!', 'error');
  } finally {
    isLoading.value = false;
  }
};

const openJsonModal = (log: any) => {
  selectedLog.value = log;
};

const exportToExcel = async () => {
  if (auditLogs.value.length === 0) {
    triggerToast('Không có dữ liệu nhật ký để xuất báo cáo!', 'error');
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Nhật ký Audit');

  worksheet.columns = [
    { header: 'Thời gian', key: 'time', width: 22 },
    { header: 'Tài khoản (DB User)', key: 'user', width: 25 },
    { header: 'Hành động', key: 'action', width: 15 },
    { header: 'Bảng hệ thống', key: 'table', width: 18 },
    { header: 'Chi tiết dữ liệu (JSON)', key: 'data', width: 85 }
  ];

  auditLogs.value.forEach(log => {
    worksheet.addRow({
      time: formatDateTime(log.ThoiGian),
      user: log.DatabaseUser,
      action: log.HanhDong,
      table: log.TenBang,
      data: log.ChiTiet
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
    row.eachCell((cell, colNumber) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
      };
      if (rowNumber > 1) {
        cell.alignment = { vertical: 'top', wrapText: colNumber === 5 };
      }
    });
  });

  try {
    const buffer = await workbook.xlsx.writeBuffer();
    const dateStr = new Date().toLocaleDateString('vi-VN').replace(/\//g, '-');
    saveAs(new Blob([buffer]), `Nhat_Ky_Audit_Log_${dateStr}.xlsx`);
    
    triggerToast('Xuất báo cáo Excel thành công!', 'success');
  } catch (error) {
    triggerToast('Có lỗi khi tạo file Excel!', 'error');
    console.error(error);
  }
};

onMounted(() => {
  fetchAuditLogs();
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #1f2937;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>