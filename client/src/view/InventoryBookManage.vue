<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Quản lý Danh mục Sách
        </h2>
        <p class="mt-1 text-sm text-gray-500">
          Quyền Thêm/Sửa/Xóa tài liệu. Lưu ý: Không thể xóa sách đang trong quy trình mượn.
        </p>
      </div>
      <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-md text-sm font-medium transition-colors flex items-center shadow-sm">
        <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Nhập Sách Mới
      </button>
    </div>

    <div v-if="showDbError" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm flex justify-between items-start">
      <div class="flex">
        <svg class="h-5 w-5 text-red-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
        </svg>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Lỗi Ràng buộc toàn vẹn CSDL (Foreign Key Constraint)</h3>
          <p class="text-sm text-red-700 mt-1">
            Không thể thực thi lệnh <code class="bg-red-100 px-1 rounded">DELETE</code>. Cuốn sách mã <strong>S002</strong> đang tồn tại trong bảng chi tiết phiếu mượn (đang có người mượn). Hệ quản trị CSDL đã tự động Rollback giao dịch.
          </p>
        </div>
      </div>
      <button @click="showDbError = false" class="text-red-500 hover:text-red-700">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>

    <div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div class="px-4 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <div class="relative w-72">
          <input type="text" class="block w-full p-2 pl-3 text-sm text-gray-900 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Tìm kiếm sách...">
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-white">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Mã Sách</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Tên Sách & Tác giả</th>
              <th scope="col" class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Giá Bìa (VNĐ)</th>
              <th scope="col" class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Tồn Kho</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Vị Trí Kệ</th>
              <th scope="col" class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:pr-6">Thao Tác</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="book in books" :key="book.maSach" class="hover:bg-gray-50">
              <td class="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">{{ book.maSach }}</td>
              <td class="px-3 py-4 text-sm text-gray-700 whitespace-nowrap">
                <span class="font-medium text-gray-900">{{ book.tenSach }}</span><br>
                <span class="text-xs text-gray-500">{{ book.tacGia }}</span>
              </td>
              <td class="px-3 py-4 text-sm text-gray-700 whitespace-nowrap text-right font-mono">
                {{ book.giaBia.toLocaleString('vi-VN') }}
              </td>
              <td class="px-3 py-4 text-sm whitespace-nowrap text-center">
                <span :class="book.soLuongTon > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold">
                  {{ book.soLuongTon }}
                </span>
              </td>
              <td class="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">{{ book.viTriKe }}</td>
              <td class="px-3 py-4 text-sm text-right whitespace-nowrap sm:pr-6">
                <button class="text-blue-600 hover:text-blue-900 font-medium mr-4">Sửa</button>
                <button @click="handleDelete(book.maSach)" class="text-red-600 hover:text-red-900 font-medium">Xóa</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const showDbError = ref(false);

const books = ref([
  { maSach: 'S001', tenSach: 'Giáo trình Cơ sở dữ liệu', tacGia: 'Nhiều tác giả', giaBia: 125000, soLuongTon: 15, viTriKe: 'Khu A - Kệ 01' },
  { maSach: 'S002', tenSach: 'Designing Data-Intensive Applications', tacGia: 'Martin Kleppmann', giaBia: 450000, soLuongTon: 2, viTriKe: 'Khu B - Kệ 05' },
  { maSach: 'S015', tenSach: 'Cấu trúc dữ liệu và giải thuật', tacGia: 'Nguyễn Văn A', giaBia: 110000, soLuongTon: 0, viTriKe: 'Khu A - Kệ 02' },
]);

const handleDelete = (maSach: string) => {
  // Giả lập cố tình xóa cuốn S002 để DB quăng lỗi khóa ngoại (do đang có người mượn)
  if (maSach === 'S002') {
    showDbError.value = true;
  } else {
    alert(`Đã gửi lệnh DELETE sách ${maSach} xuống cơ sở dữ liệu!`);
  }
};
</script>