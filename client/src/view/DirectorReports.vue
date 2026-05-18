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

    <div class="border-b border-gray-200 pb-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Báo cáo & Phân tích Chiến lược</h2>
        <p class="mt-1 text-sm text-gray-500">Dữ liệu tổng hợp từ toàn bộ các phân hệ: Nhân sự, Kho sách và Tài chính.</p>
      </div>
      
      <div class="flex items-center space-x-3 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
        <div class="flex items-center space-x-2">
          <label class="text-sm font-medium text-gray-600">Từ:</label>
          <input type="date" v-model="filters.tuNgay" @change="fetchDashboardData" class="text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-1 border">
        </div>
        <span class="text-gray-300">|</span>
        <div class="flex items-center space-x-2">
          <label class="text-sm font-medium text-gray-600">Đến:</label>
          <input type="date" v-model="filters.denNgay" @change="fetchDashboardData" class="text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-1 border">
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="p-8 text-center text-gray-500 animate-pulse font-medium text-lg">
      Đang phân tích dữ liệu thống kê...
    </div>

    <div v-else>
      
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
        <div v-for="stat in stats" :key="stat.name" class="bg-white px-4 py-5 shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <dt class="text-sm font-medium text-gray-500 truncate">{{ stat.name }}</dt>
          <dd class="mt-1 text-3xl font-semibold text-blue-600">{{ stat.value }}</dd>
          <div class="mt-2 flex items-center text-sm text-green-600 font-medium">
            <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            {{ stat.trend }}
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col min-w-0">
          <h3 class="text-lg font-bold text-gray-900 mb-4 shrink-0">Lưu lượng Mượn sách</h3>
          
          <div v-if="chartData.length > 0">
            <div class="w-full overflow-x-auto pb-2 custom-scrollbar">
              
              <div class="min-w-full w-max px-2 pt-6">
                
                <div class="flex flex-nowrap items-end gap-4 sm:gap-6 border-b border-gray-300 h-48">
                  <div v-for="bar in chartData" :key="'bar-'+bar.label" class="w-8 sm:w-10 h-full flex items-end justify-center flex-shrink-0 group/bar relative">
                    
                    <div 
                      class="w-full rounded-t-md transition-all duration-700 relative cursor-pointer" 
                      :class="bar.value > 0 ? 'bg-gradient-to-t from-blue-600 to-blue-400 hover:from-blue-700 shadow-sm' : 'bg-gray-100 hover:bg-gray-200'"
                      :style="{ height: Math.max(bar.height, 1) + '%' }" 
                    >
                      <span class="absolute -top-9 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2.5 py-1.5 rounded-md opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none shadow-lg font-medium">
                        {{ bar.value }} lượt
                        <svg class="absolute text-gray-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon class="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
                      </span>
                    </div>

                  </div>
                </div>

                <div class="flex flex-nowrap gap-4 sm:gap-6 mt-3">
                  <div v-for="bar in chartData" :key="'label-'+bar.label" class="w-8 sm:w-10 flex justify-center flex-shrink-0">
                    <span class="text-[10px] sm:text-xs font-semibold whitespace-nowrap" :class="bar.value > 0 ? 'text-gray-700' : 'text-gray-400'">
                      {{ bar.label }}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div v-else class="h-56 flex items-center justify-center text-gray-400 italic">
            Không có dữ liệu trong khoảng thời gian này
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Top Sách mượn nhiều nhất</h3>
          <ul v-if="topBooks.length > 0" class="space-y-4">
            <li v-for="(book, index) in topBooks" :key="index" class="flex items-center">
              <span class="w-6 text-sm font-bold text-gray-400">{{ index + 1 }}</span>
              <div class="flex-1 ml-2">
                <div class="flex justify-between mb-1">
                  <span class="text-sm font-medium text-gray-700 truncate w-48" :title="book.name">{{ book.name }}</span>
                  <span class="text-sm font-semibold text-blue-600">{{ book.count }} lượt</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2">
                  <div class="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all duration-1000 shadow-sm" :style="{ width: book.percent + '%' }"></div>
                </div>
              </div>
            </li>
          </ul>
          <div v-else class="h-56 flex items-center justify-center text-gray-400 italic">
            Chưa có sách nào được mượn
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';


const filters = ref({ tuNgay: '', denNgay: '' });
const stats = ref<any[]>([]);
const chartData = ref<any[]>([]);
const topBooks = ref<any[]>([]);
const isLoading = ref(false);

const toast = ref({ show: false, message: '', type: 'success' as 'success' | 'error' });
const triggerToast = (msg: string, type: 'success' | 'error' = 'success', duration = 5000) => {
  toast.value = { show: true, message: msg, type };
  setTimeout(() => { toast.value.show = false; }, duration);
};


const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
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


const generateContinuousChartData = (apiData: any[], startDateStr: string, endDateStr: string) => {
  const start = startDateStr ? new Date(startDateStr) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const end = endDateStr ? new Date(endDateStr) : new Date();
  
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const continuousData: { label: string, value: number, height?: number }[] = [];

  if (diffDays <= 31) {
    let curr = new Date(start);
    while (curr <= end) {
      let day = String(curr.getDate()).padStart(2, '0');
      let month = String(curr.getMonth() + 1).padStart(2, '0');
      continuousData.push({ label: `${day}/${month}`, value: 0 });
      curr.setDate(curr.getDate() + 1);
    }
  } else if (diffDays <= 366) {
    let curr = new Date(start);
    curr.setDate(1); 
    let endMonth = new Date(end);
    endMonth.setDate(1);
    while (curr <= endMonth) {
      let month = curr.getMonth() + 1;
      let year = curr.getFullYear();
      continuousData.push({ label: `T${month}/${year}`, value: 0 });
      curr.setMonth(curr.getMonth() + 1);
    }
  } else {
    let startYear = start.getFullYear();
    let endYear = end.getFullYear();
    for (let y = startYear; y <= endYear; y++) {
      continuousData.push({ label: String(y), value: 0 });
    }
  }

  continuousData.forEach(item => {
    const found = apiData.find(d => d.Thang === item.label);
    if (found) item.value = found.SoLuotMuon;
  });

  const maxChartValue = Math.max(...continuousData.map(item => item.value), 1); 
  return continuousData.map(item => ({
    ...item,
    height: Math.floor((item.value / maxChartValue) * 100)
  }));
};

const fetchDashboardData = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('http://localhost:3000/api/director/dashboard', {
      params: { 
        tuNgay: filters.value.tuNgay || undefined, 
        denNgay: filters.value.denNgay || undefined 
      },
      headers: getAuthHeaders()
    });

    if (response.data.success) {
      const { tongQuan, topSach, luuLuong } = response.data.data;

      stats.value = [
        { name: 'Tổng doanh thu phạt', value: formatCurrency(tongQuan.TongTienPhat), trend: 'Dữ liệu thực tế' },
        { name: 'Độc giả mới lập thẻ', value: tongQuan.DocGiaMoi.toLocaleString(), trend: 'Dữ liệu thực tế' },
        { name: 'Sách đang tồn kho', value: tongQuan.SoSachNhapKho.toLocaleString(), trend: 'Dữ liệu thực tế' },
      ];

      chartData.value = generateContinuousChartData(luuLuong, filters.value.tuNgay, filters.value.denNgay);

      const maxBookValue = Math.max(...topSach.map((item: any) => item.SoLuotMuon), 1);
      topBooks.value = topSach.map((item: any) => ({
        name: item.TenSach,
        count: item.SoLuotMuon,
        percent: Math.floor((item.SoLuotMuon / maxBookValue) * 100)
      }));
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Lỗi tải dữ liệu. Vui lòng kiểm tra quyền truy cập!';
    triggerToast(errorMessage, 'error');
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>

.custom-scrollbar::-webkit-scrollbar {
  height: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>