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
          <div :class="toast.type === 'success' ? 'text-emerald-500' : 'text-red-500'" class="flex-shrink-0">
            <svg v-if="toast.type === 'success'" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-bold text-gray-900">{{ toast.type === 'success' ? 'Thành công' : 'Lỗi nghiệp vụ' }}</p>
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
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Quản lý Danh mục Sách
        </h2>
        <p class="mt-1 text-sm text-gray-500">
          Phân hệ điều phối kho tư liệu. Kiểm soát chặt chẽ giữa luồng khai báo danh mục mới và luồng nhập tăng số lượng cơ học.
        </p>
      </div>
      <button 
        @click="openAddModal"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center shadow-sm"
      >
        <svg class="w-5 h-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Thêm Sách Mới
      </button>
    </div>

    <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div class="px-4 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <div class="relative w-full sm:w-72">
          <input 
            type="text" v-model="searchQuery"
            class="block w-full p-2 pl-3 text-sm text-gray-900 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none" 
            placeholder="Tìm kiếm theo Tên sách hoặc Tác giả..."
          >
        </div>
      </div>

      <div v-if="isLoading" class="p-8 text-center text-gray-500 animate-pulse font-medium">
        Đang triệu hồi Stored Procedure lấy danh mục sách từ SQL Server...
      </div>

      <div v-else-if="filteredBooks.length === 0" class="p-8 text-center text-gray-400 font-medium">
        Không tìm thấy tài liệu sách nào khớp với điều kiện tra cứu kho.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 text-sm text-left">
          <thead class="bg-white">
            <tr>
              <th scope="col" class="py-3.5 pl-6 pr-3 font-semibold text-gray-900">Mã Sách</th>
              <th scope="col" class="px-3 py-3.5 font-semibold text-gray-900">Tên Sách & Thông Tin Bản Quyền</th>
              <th scope="col" class="px-3 py-3.5 font-semibold text-gray-900">Thể Loại</th>
              <th scope="col" class="px-3 py-3.5 text-right font-semibold text-gray-900">Giá Bìa (VNĐ)</th>
              <th scope="col" class="px-3 py-3.5 text-center font-semibold text-gray-900">Tồn Kho</th>
              <th scope="col" class="px-3 py-3.5 font-semibold text-gray-900">Vị Trí Kệ</th>
              <th scope="col" class="px-3 py-3.5 text-center pr-6 font-semibold text-gray-900">Thao Tác</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="book in filteredBooks" :key="book.MaSach" class="hover:bg-gray-50 transition-colors">
              <td class="py-4 pl-6 pr-3 font-mono font-bold text-gray-900 whitespace-nowrap">{{ book.MaSach }}</td>
              <td class="px-3 py-4 text-gray-700">
                <span class="font-bold text-gray-900 block text-sm">{{ book.TenSach }}</span>
                <span class="text-xs text-gray-400 font-medium block">TG: {{ book.TacGia }} | NXB {{ book.NhaXuatBan }} ({{ book.NamXuatBan }})</span>
              </td>
              <td class="px-3 py-4 whitespace-nowrap text-xs text-gray-600 font-semibold">
                {{ book.TheLoai || 'Chưa phân loại' }}
              </td>
              <td class="px-3 py-4 text-right font-mono font-bold text-slate-700 whitespace-nowrap">
                {{ book.GiaBia.toLocaleString('vi-VN') }}
              </td>
              <td class="px-3 py-4 text-center whitespace-nowrap">
                <span :class="book.SoLuongTon > 3 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border">
                  {{ book.SoLuongTon }} cuốn
                </span>
              </td>
              <td class="px-3 py-4 whitespace-nowrap text-xs font-mono font-bold text-gray-500">
                {{ book.ViTriKe || 'Chưa xếp kệ' }}
              </td>
              <td class="px-3 py-4 whitespace-nowrap text-center pr-6 font-medium space-x-2.5">
                <button 
                  @click="openImportModal(book)" 
                  class="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-bold text-xs px-2.5 py-1 rounded-lg transition-colors"
                >
                  Nhập hàng
                </button>
                <button @click="openEditModal(book)" class="text-blue-600 hover:text-blue-900 font-bold text-xs">Sửa</button>
                <button @click="triggerDeleteDialog(book.MaSach)" class="text-red-600 hover:text-red-900 font-bold text-xs">Xóa</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="isFormOpen" class="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-xl border overflow-hidden">
        <div class="bg-slate-900 px-6 py-4 text-white flex justify-between items-center">
          <h3 class="text-base font-bold">{{ isEditMode ? 'Cập nhật tài liệu sách' : 'Khai báo cấu trúc sách mới mua' }}</h3>
          <button @click="isFormOpen = false" class="text-slate-400 hover:text-white text-xl font-bold">&times;</button>
        </div>

        <div class="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto text-xs">
          <div>
            <label class="block font-bold text-gray-500 uppercase mb-1">Mã Sách *</label>
            <input type="text" v-model="formModel.MaSach" :disabled="isEditMode" class="block w-full p-2.5 border rounded-lg font-mono font-bold uppercase outline-none focus:border-blue-500 disabled:bg-gray-100" placeholder="Ví dụ: S001">
          </div>
          <div>
            <label class="block font-bold text-gray-500 uppercase mb-1">Tên Đầu Sách *</label>
            <input type="text" v-model="formModel.TenSach" class="block w-full p-2.5 border rounded-lg font-bold outline-none focus:border-blue-500" placeholder="Nhập tên sách...">
          </div>
          <div>
            <label class="block font-bold text-gray-500 uppercase mb-1">Tác Giả</label>
            <input type="text" v-model="formModel.TacGia" class="block w-full p-2.5 border rounded-lg outline-none focus:border-blue-500">
          </div>
          <div>
            <label class="block font-bold text-gray-500 uppercase mb-1">Thể Loại</label>
            <input type="text" v-model="formModel.TheLoai" class="block w-full p-2.5 border rounded-lg outline-none focus:border-blue-500" placeholder="Kinh tế, CNTT...">
          </div>
          <div>
            <label class="block font-bold text-gray-500 uppercase mb-1">Nhà Xuất Bản</label>
            <input type="text" v-model="formModel.NhaXuatBan" class="block w-full p-2.5 border rounded-lg outline-none focus:border-blue-500">
          </div>
          <div>
            <label class="block font-bold text-gray-500 uppercase mb-1">Năm Xuất Bản</label>
            <input type="number" v-model.number="formModel.NamXuatBan" class="block w-full p-2.5 border rounded-lg outline-none focus:border-blue-500">
          </div>
          <div>
            <label class="block font-bold text-gray-500 uppercase mb-1">Giá Bìa Hệ Thống (VNĐ)</label>
            <input type="number" v-model.number="formModel.GiaBia" class="block w-full p-2.5 border rounded-lg font-mono font-bold text-blue-700 outline-none focus:border-blue-500">
          </div>
          <div>
            <label class="block font-bold text-gray-500 uppercase mb-1">Số Tồn Kho Khởi Tạo</label>
            <input type="number" v-model.number="formModel.SoLuongTon" :disabled="isEditMode" class="block w-full p-2.5 border rounded-lg font-bold确 outline-none focus:border-blue-500 disabled:bg-gray-100">
          </div>
          <div class="sm:col-span-2">
            <label class="block font-bold text-gray-500 uppercase mb-1">Vị Trí Xếp Kệ Kho *</label>
            <input type="text" v-model="formModel.ViTriKe" class="block w-full p-2.5 border rounded-lg font-bold outline-none focus:border-blue-500" placeholder="Ví dụ: Khu A - Kệ 01">
          </div>
        </div>

        <div class="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button @click="isFormOpen = false" class="px-4 py-2 text-xs font-bold text-gray-700 bg-white border rounded-md hover:bg-gray-50">Hủy</button>
          <button @click="submitBookForm" :disabled="isSubmitting" class="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
            {{ isSubmitting ? 'Đang ghi sổ...' : 'Lưu danh mục' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="isImportOpen" class="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-xl shadow-2xl max-w-sm w-full border overflow-hidden animate-scale-up">
        <div class="bg-emerald-900 px-5 py-3.5 text-white flex justify-between items-center">
          <div>
            <h3 class="text-sm font-bold">Phiếu Nhập Thêm Tồn Kho</h3>
            <p class="text-[10px] text-emerald-300">Nghiệp vụ tăng số lượng vật chất thực tế</p>
          </div>
          <button @click="isImportOpen = false" class="text-emerald-300 hover:text-white text-lg font-bold">&times;</button>
        </div>

        <div class="p-5 space-y-4 text-xs" v-if="selectedImportBook">
          <div class="p-3 bg-gray-50 border rounded-lg space-y-1">
            <div class="font-bold text-gray-800 text-sm truncate">{{ selectedImportBook.TenSach }}</div>
            <div class="flex justify-between text-gray-400 font-medium">
              <span>Mã sách: <strong class="font-mono text-gray-600 font-bold">{{ selectedImportBook.MaSach }}</strong></span>
              <span>Số tồn hiện tại: <strong class="text-blue-600 font-bold">{{ selectedImportBook.SoLuongTon }} cuốn</strong></span>
            </div>
          </div>

          <div>
            <label class="block font-bold text-gray-600 uppercase mb-1">Số lượng sách mua bổ sung nhập kho (Cuốn)</label>
            <input 
              type="number" 
              v-model.number="importQuantity" 
              min="1"
              class="block w-full p-3 text-lg font-black font-mono text-center border text-emerald-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
          </div>
        </div>

        <div class="bg-gray-50 px-5 py-3.5 border-t border-gray-200 flex justify-end space-x-2.5">
          <button @click="isImportOpen = false" class="px-3.5 py-2 text-xs font-bold text-gray-700 bg-white border rounded-md hover:bg-gray-50">Hủy</button>
          <button 
            @click="executeImportAPI" 
            :disabled="isSubmitting"
            class="px-4 py-2 text-xs font-bold text-white bg-emerald-600 rounded-md hover:bg-emerald-700 disabled:bg-gray-400"
          >
            {{ isSubmitting ? 'Đang bốc hàng...' : 'Xác nhận nhập kho' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="isConfirmOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 text-center border">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-50 text-red-600 mb-4 border border-red-200">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 class="text-base font-bold text-gray-900 mb-2">Yêu cầu xóa tài liệu</h3>
        <p class="text-xs font-semibold text-gray-500 leading-relaxed mb-6">
          Bạn chắc chắn muốn ra lệnh xóa vĩnh viễn đầu sách mã <span class="font-bold text-red-600 font-mono">[{{ selectedBookId }}]</span> khỏi hệ thống kho?
        </p>
        <div class="flex justify-center space-x-3">
          <button @click="isConfirmOpen = false" class="w-full px-4 py-2 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg border">Hủy bỏ</button>
          <button @click="executeDeleteAPI" class="w-full px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm">Xác nhận xóa</button>
        </div>
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
  GiaBia: number;
  SoLuongTon: number;
  ViTriKe: string;
}

const books = ref<Book[]>([]);
const isLoading = ref(false);
const isSubmitting = ref(false);
const searchQuery = ref('');

const isFormOpen = ref(false);
const isEditMode = ref(false);
const isConfirmOpen = ref(false);
const isImportOpen = ref(false); 

const selectedBookId = ref('');
const selectedImportBook = ref<Book | null>(null); 
const importQuantity = ref(10); 

const formModel = ref<Book>({
  MaSach: '', TenSach: '', TacGia: '', TheLoai: '', NhaXuatBan: '', NamXuatBan: 2026, GiaBia: 0, SoLuongTon: 0, ViTriKe: ''
});

const toast = ref({ show: false, message: '', type: 'success' as 'success' | 'error' });

const triggerToast = (msg: string, type: 'success' | 'error' = 'success') => {
  toast.value = { show: true, message: msg, type };
  setTimeout(() => { toast.value.show = false; }, 3500);
};

const getAuthHeaders = () => {
  const sessionRaw = localStorage.getItem('user_session');
  if (!sessionRaw) return {};
  return { Authorization: `Bearer ${JSON.parse(sessionRaw).token}` };
};


const loadBooksList = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('http://localhost:3000/api/warehouse/books', { headers: getAuthHeaders() });
    books.value = response.data;
  } catch (error: any) {
    triggerToast('Không thể đồng bộ danh mục sách từ máy chủ.', 'error');
  } finally { isLoading.value = false; }
};

const openAddModal = () => {
  isEditMode.value = false;
  formModel.value = { MaSach: '', TenSach: '', TacGia: '', TheLoai: '', NhaXuatBan: '', NamXuatBan: 2026, GiaBia: 0, SoLuongTon: 0, ViTriKe: '' };
  isFormOpen.value = true;
};

const openEditModal = (book: Book) => {
  isEditMode.value = true;
  formModel.value = { ...book };
  isFormOpen.value = true;
};


const openImportModal = (book: Book) => {
  selectedImportBook.value = book;
  importQuantity.value = 10;
  isImportOpen.value = true;
};


const submitBookForm = async () => {
  if (!formModel.value.MaSach || !formModel.value.TenSach) {
    triggerToast('Vui lòng hoàn thành các trường dữ liệu bắt buộc (*)', 'error');
    return;
  }

  isSubmitting.value = true;
  try {
    if (isEditMode.value) {
      const response = await axios.put(`http://localhost:3000/api/warehouse/books/${formModel.value.MaSach}`, formModel.value, { headers: getAuthHeaders() });
      console.log(response.data);
      triggerToast(response.data.message || 'Đã cập nhật thông tin sách thành công!');
    } else {
      const response = await axios.post('http://localhost:3000/api/warehouse/books', formModel.value, { headers: getAuthHeaders() });
      triggerToast(response.data.message || 'Đã khai báo danh mục sách mới thành công!');
    }
    isFormOpen.value = false;
    await loadBooksList();
  } catch (error: any) {
    console.log(error.response.data);
    triggerToast(error.response?.data?.message || 'Xử lý biểu mẫu sách dính lỗi hệ thống.', 'error');
  } finally { isSubmitting.value = false; }
};


const executeImportAPI = async () => {
  if (!selectedImportBook.value || importQuantity.value <= 0) {
    triggerToast('Số lượng nhập kho bổ sung phải lớn hơn 0!', 'error');
    return;
  }

  isSubmitting.value = true;
  try {
    const response = await axios.post('http://localhost:3000/api/warehouse/import', {
      maSach: selectedImportBook.value.MaSach,
      soLuongNhap: importQuantity.value
    }, { headers: getAuthHeaders() });

    triggerToast(response.data.message || 'Cập nhật tăng số lượng tồn kho thành công!');
    isImportOpen.value = false;
    await loadBooksList(); 
  } catch (error: any) {
    triggerToast(error.response?.data?.message || 'Giao dịch nhập kho thất bại.', 'error');
  } finally { isSubmitting.value = false; }
};

const triggerDeleteDialog = (maSach: string) => {
  selectedBookId.value = maSach;
  isConfirmOpen.value = true;
};


const executeDeleteAPI = async () => {
  isConfirmOpen.value = false;
  try {
    const response = await axios.delete(`http://localhost:3000/api/warehouse/books/${selectedBookId.value}`, { headers: getAuthHeaders() });
    triggerToast(response.data.message || 'Đã gạch tên đầu sách khỏi CSDL kho vật lý.');
    await loadBooksList();
  } catch (error: any) {
    
    const serverMessage = error.response?.data?.message || 'Không thể thực thi lệnh xóa sách.';
    triggerToast(serverMessage, 'error');
  }
};

const filteredBooks = computed(() => {
  return books.value.filter(book => {
    const query = searchQuery.value.toLowerCase().trim();
    if (!query) return true;
    return book.MaSach.toLowerCase().includes(query) || 
           book.TenSach.toLowerCase().includes(query) ||
           book.TacGia.toLowerCase().includes(query);
  });
});

onMounted(() => { loadBooksList(); });
</script>