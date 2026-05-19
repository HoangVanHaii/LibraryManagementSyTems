<template>
  <div class="space-y-6 p-2">
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
          <div v-if="toast.type === 'success'" class="flex-shrink-0 text-emerald-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div v-else class="flex-shrink-0 text-red-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-bold text-gray-900">{{ toast.type === 'success' ? 'Thành công' : 'Lỗi nghiệp vụ' }}</p>
            <p class="mt-1 text-xs font-semibold text-gray-500 leading-normal">{{ toast.message }}</p>
          </div>
        </div>
      </div>
    </Transition>

    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Nghiệp vụ Tư vấn & Lập phiếu</h2>
        <p class="mt-1 text-sm text-gray-500">Tra cứu đầu sách cho Độc giả và khởi tạo lệnh mượn nhanh.</p>
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
        class="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all flex flex-col overflow-hidden group"
      >
        <div class="h-56 bg-gray-100 flex flex-col items-center justify-center border-b border-gray-200 relative overflow-hidden">
          <span class="absolute top-3 left-3 font-mono text-[10px] font-bold text-gray-600 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded border border-gray-200 shadow-sm z-10">
            ID: {{ book.MaSach }}
          </span>
          
          <img 
            :src="book.HinhAnh || 'https://via.placeholder.com/300x400?text=No+Cover'" 
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            :alt="book.TenSach"
          >
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
          
          <h3 class="text-base font-bold text-gray-900 line-clamp-2 mb-1 min-h-[3rem] leading-snug" :title="book.TenSach">
            {{ book.TenSach }}
          </h3>
          <p class="text-xs font-semibold text-gray-500 mb-3">{{ book.TacGia }}</p>
          
          <div class="border-t border-gray-100 pt-3 mt-1 mb-4 space-y-1 text-[11px] font-medium text-gray-400">
            <div class="flex justify-between">
              <span>Nhà xuất bản:</span>
              <span class="text-gray-600 font-semibold truncate ml-2" :title="book.NhaXuatBan">{{ book.NhaXuatBan || 'N/A' }}</span>
            </div>
            <div class="flex justify-between">
              <span>Giá bìa:</span>
              <span class="text-red-600 font-bold font-mono">{{ book.GiaBia ? book.GiaBia.toLocaleString('vi-VN') + 'đ' : 'N/A' }}</span>
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
            <button 
              @click="openBorrowModal(book)"
              :disabled="book.SoLuongTon <= 0"
              class="w-full font-bold rounded-lg text-xs px-4 py-2.5 text-center transition-colors shadow-sm"
              :class="book.SoLuongTon > 0 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-400 border cursor-not-allowed'"
            >
              {{ book.SoLuongTon > 0 ? 'Cấp Phiếu Mượn Nhanh' : 'Tạm thời hết sách' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isBorrowModalOpen && selectedBook" class="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity animate-fade-in">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border">
        
        <div class="bg-blue-700 px-5 py-4 text-white flex justify-between items-center">
          <div>
            <h3 class="text-sm font-bold">Khởi tạo Phiếu Mượn</h3>
            <p class="text-[10px] text-blue-200 font-medium">Lệnh xuất kho luân chuyển tài liệu</p>
          </div>
          <button @click="closeBorrowModal" class="text-blue-200 hover:text-white text-xl font-bold transition-colors leading-none">&times;</button>
        </div>

        <form @submit.prevent="submitBorrowRequest" class="p-5 space-y-4">
          <div class="bg-blue-50/50 p-3 rounded-lg border border-blue-100 flex items-center space-x-3">
            <img :src="selectedBook.HinhAnh || 'https://via.placeholder.com/150x200?text=No+Cover'" class="w-12 h-16 object-cover rounded border shadow-sm bg-white flex-shrink-0" alt="Bìa sách">
            <div class="flex-1 min-w-0">
              <span class="text-[10px] text-blue-600 font-bold uppercase tracking-wider block mb-0.5">Sách chọn mượn</span>
              <p class="font-bold text-gray-900 text-xs truncate" :title="selectedBook.TenSach">{{ selectedBook.TenSach }}</p>
              <p class="text-[11px] text-gray-500 font-mono mt-0.5">Mã: {{ selectedBook.MaSach }} | Tồn: <span class="font-bold text-blue-700">{{ selectedBook.SoLuongTon }}</span></p>
            </div>
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Mã Độc Giả (Khách Hàng) *</label>
              <input 
                type="text" 
                v-model="borrowForm.maDG"
                required
                class="block w-full p-2.5 text-sm font-bold text-gray-900 border border-gray-300 rounded-md outline-none focus:ring-1 focus:ring-blue-500 uppercase"
                placeholder="Ví dụ: DG001"
              >
            </div>
            
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Thời hạn mượn *</label>
              <select v-model.number="borrowForm.soNgayMuon" class="block w-full p-2.5 text-sm font-bold text-gray-900 border border-gray-300 rounded-md outline-none focus:ring-1 focus:ring-blue-500">
                <option value="7">Ngắn hạn (7 Ngày)</option>
                <option value="14">Tiêu chuẩn (14 Ngày)</option>
                <option value="30">Dài hạn (30 Ngày)</option>
              </select>
            </div>
          </div>

          <div class="pt-2">
            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="w-full px-4 py-2.5 text-xs font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 shadow-sm disabled:bg-gray-400 transition-colors"
            >
              {{ isSubmitting ? 'Đang thiết lập hồ sơ...' : 'Xác nhận tạo phiếu mượn' }}
            </button>
          </div>
        </form>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios'; 

interface Book {
  MaSach: string;
  TenSach: string;
  TacGia: string;
  TheLoai: string;
  NhaXuatBan: string;
  NamXuatBan: number;
  GiaBia: number; // Đã bổ sung biến GiaBia vào đây
  SoLuongTon: number;
  ViTriKe: string;
  HinhAnh?: string;
}

const books = ref<Book[]>([]);
const searchQuery = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

const isBorrowModalOpen = ref(false);
const selectedBook = ref<Book | null>(null);
const isSubmitting = ref(false);
const borrowForm = ref({
  maDG: '',
  soNgayMuon: 14
});

const toast = ref({ show: false, message: '', type: 'success' as 'success' | 'error' });

const triggerToast = (msg: string, type: 'success' | 'error' = 'success') => {
  toast.value = { show: true, message: msg, type };
  setTimeout(() => { toast.value.show = false; }, 3500);
};

const getAuthHeaders = () => {
  const sessionRaw = localStorage.getItem('user_session');
  if (!sessionRaw) throw new Error('Hết hạn phiên làm việc');
  const session = JSON.parse(sessionRaw);
  return { Authorization: `Bearer ${session.token}` };
};

const loadLibraryData = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    // ĐÃ SỬA API: Gọi thẳng vào /api/warehouse/books (API hiển thị toàn bộ thuộc tính, bao gồm GiaBia)
    const response = await axios.get('http://localhost:3000/api/warehouse/books', {
      headers: getAuthHeaders()
    });
    books.value = response.data;
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Lỗi đồng bộ kho sách.';
  } finally {
    isLoading.value = false;
  }
};

const openBorrowModal = (book: Book) => {
  selectedBook.value = book;
  borrowForm.value.maDG = '';
  borrowForm.value.soNgayMuon = 14;
  isBorrowModalOpen.value = true;
};

const closeBorrowModal = () => {
  if (isSubmitting.value) return;
  isBorrowModalOpen.value = false;
  selectedBook.value = null;
};

const submitBorrowRequest = async () => {
  if (!selectedBook.value || !borrowForm.value.maDG) return;

  isSubmitting.value = true;
  try {
    const autoGenMaPhieu = `PM${Date.now().toString().slice(-6)}`;
    
    const response = await axios.post('http://localhost:3000/api/borrow/create', {
      maPhieu: autoGenMaPhieu,
      maDG: borrowForm.value.maDG.toUpperCase(),
      maSach: selectedBook.value.MaSach,
      soNgayMuon: borrowForm.value.soNgayMuon
    }, { headers: getAuthHeaders() });

    triggerToast(response.data.message, 'success');
    closeBorrowModal();
    await loadLibraryData(); 

  } catch (error: any) {
    triggerToast(error.response?.data?.message || 'Lập phiếu mượn thất bại do lỗi hệ thống.', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const filteredBooks = computed(() => {
  return books.value.filter(book => {
    return (
      book.TenSach.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      book.TacGia.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
});

onMounted(() => {
  loadLibraryData();
});
</script>