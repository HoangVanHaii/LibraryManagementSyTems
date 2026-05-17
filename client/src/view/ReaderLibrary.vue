<template>
  <div class="space-y-6 p-2">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Tra cứu Thư viện</h2>
        <p class="mt-1 text-sm text-gray-500">Tìm kiếm và xem trạng thái sách trong kho trực tuyến.</p>
      </div>
      
      <div class="relative w-full sm:w-72">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input 
          v-model="searchQuery"
          type="text" 
          class="block w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
          placeholder="Tìm tên sách, tác giả..."
        >
      </div>
    </div>

    <div v-if="errorMessage" class="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl">
      <div class="flex">
        <p class="text-sm font-semibold text-red-700">{{ errorMessage }}</p>
      </div>
    </div>

    <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="i in 4" :key="i" class="bg-gray-50 border border-gray-200 rounded-xl h-80 animate-pulse"></div>
    </div>

    <div v-else-if="filteredBooks.length === 0" class="text-center py-12 bg-gray-50 border border-dashed rounded-xl text-gray-400">
      <p class="text-sm font-medium">Không tìm thấy tài liệu nào phù hợp với từ khóa.</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div 
        v-for="book in filteredBooks" 
        :key="book.MaSach" 
        class="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group"
      >
        <div class="h-40 bg-gray-50 flex flex-col items-center justify-center border-b border-gray-200 relative">
          <span class="absolute top-3 left-3 font-mono text-[10px] font-bold text-gray-400 bg-white px-2 py-0.5 rounded border border-gray-100">
            ID: {{ book.MaSach }}
          </span>
          <svg class="w-10 h-10 text-gray-300 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
        </div>
        
        <div class="p-5 flex-1 flex flex-col">
          <div class="flex justify-between items-center mb-2">
            <span class="bg-blue-50 text-blue-700 text-[11px] font-bold px-2.5 py-0.5 rounded-md border border-blue-100">
              {{ book.TheLoai }}
            </span>
            <span 
              class="text-xs font-bold px-2 py-0.5 rounded-full"
              :class="book.SoLuongTon > 0 ? 'text-emerald-700 bg-emerald-50' : 'text-red-600 bg-red-50'"
            >
              Còn: {{ book.SoLuongTon }}
            </span>
          </div>
          
          <h3 class="text-base font-bold text-gray-900 line-clamp-2 mb-1 min-h-[3rem] leading-snug">
            {{ book.TenSach }}
          </h3>
          <p class="text-xs font-semibold text-gray-500 mb-3">{{ book.TacGia }}</p>
          
          <div class="border-t border-gray-100 pt-3 mt-1 mb-4 space-y-1 text-[11px] font-medium text-gray-400">
            <div class="flex justify-between">
              <span>Nhà xuất bản:</span>
              <span class="text-gray-600 font-semibold">{{ book.NhaXuatBan || 'N/A' }}</span>
            </div>
            <div class="flex justify-between">
              <span>Năm xuất bản:</span>
              <span class="text-gray-600 font-semibold font-mono">{{ book.NamXuatBan || 'N/A' }}</span>
            </div>
            <div class="flex justify-between">
              <span>Vị trí trên kệ:</span>
              <span class="text-blue-600 font-bold font-mono">{{ book.ViTriKe || 'Chưa xếp' }}</span>
            </div>
          </div>
          
          <div class="mt-auto">
            <button disabled class="w-full text-gray-400 bg-gray-50 font-semibold rounded-lg text-xs px-4 py-2.5 text-center border border-gray-200 cursor-not-allowed">
              Chỉ Thủ thư mới được tạo phiếu mượn
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios'; // Hãy đảm bảo đã chạy: npm install axios

// Khai báo Interface tương thích 100% với các cột thuộc tính của View v_Sach
interface Book {
  MaSach: string;
  TenSach: string;
  TacGia: string;
  TheLoai: string;
  NhaXuatBan: string;
  NamXuatBan: number;
  SoLuongTon: number;
  ViTriKe: string;
}

const books = ref<Book[]>([]);
const searchQuery = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

// --------------------------------------------------------------------------
// HÀM GỌI API ĐỌC DỮ LIỆU TỪ BACKEND NODE.JS
// --------------------------------------------------------------------------
const loadLibraryData = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    // 1. Trích xuất Token từ chuỗi phiên session đã được lưu ở trang Login
    const sessionRaw = localStorage.getItem('user_session');
    if (!sessionRaw) {
      errorMessage.value = 'Hết hạn phiên làm việc bảo mật. Vui lòng quay lại đăng nhập!';
      return;
    }
    const session = JSON.parse(sessionRaw);

    // 2. Gửi yêu cầu HTTP kèm mã Bearer Token phân hệ bảo mật lên máy chủ
    // alert(session.token);
    const response = await axios.get('http://localhost:3000/api/book/reader', {
      headers: {
        Authorization: `Bearer ${session.token}`
      }
    });

    // Gán dữ liệu mảng sạch nhận về từ SQL Server thông qua API
    books.value = response.data;

  } catch (error: any) {
    // Trích xuất các lỗi bảo mật hoặc từ chối kết nối nếu có vi phạm
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value = 'Lỗi bảo mật hệ thống hoặc mất kết nối mạng khi đồng bộ kho sách.';
    }
  } finally {
    isLoading.value = false;
  }
};

// --------------------------------------------------------------------------
// BỘ LỌC TÌM KIẾM ĐỘNG TRÊN TRÌNH DUYỆT (COMPUTED PROPERTY)
// --------------------------------------------------------------------------
const filteredBooks = computed(() => {
  return books.value.filter(book => {
    return (
      book.TenSach.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      book.TacGia.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
});

// Tự động tải kho sách ngay khi màn hình vừa mở
onMounted(() => {
  loadLibraryData();
});
</script>