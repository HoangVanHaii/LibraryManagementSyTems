<template>
  <div class="min-h-screen flex bg-white font-sans overflow-hidden">
    
    <div class="hidden md:flex md:w-1/2 lg:w-3/5 bg-slate-950 p-12 lg:p-16 flex-col justify-between relative">
      <div class="absolute inset-0 opacity-10" style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
      
      <div class="z-10 flex items-center space-x-3">
        <div class="bg-blue-600 p-2 rounded-lg shadow-xl">
          <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <span class="text-2xl font-black text-white tracking-tighter uppercase">SecureLib <span class="text-blue-500 italic">Pro</span></span>
      </div>

      <div class="z-10 max-w-lg">
        <h2 class="text-6xl font-extrabold text-white leading-tight mb-6 tracking-tighter">
          Hệ quản trị <br/> <span class="text-blue-500">Thư viện số</span>
        </h2>
        <p class="text-xl text-slate-400 font-medium leading-relaxed">
          Ứng dụng các giải pháp bảo mật nâng cao: RLS, CLS và cơ chế Audit Logging thời gian thực.
        </p>
      </div>

      <div class="z-10 text-slate-500 text-sm border-t border-slate-800 pt-6">
        &copy; 2026 Hoàng Văn Hải - Đồ án HCMUE.
      </div>
    </div>

    <div class="w-full md:w-1/2 lg:w-2/5 flex flex-col justify-center p-8 sm:p-16 lg:p-24 bg-white">
      <div class="mb-10">
        <h3 class="text-4xl font-black text-slate-900 tracking-tight">Đăng nhập</h3>
        <p class="text-slate-500 mt-2 font-medium">Nhập tài khoản để truy cập không gian làm việc.</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div class="space-y-2">
          <label class="text-sm font-bold text-slate-700 uppercase tracking-wide">Tài khoản</label>
          <input 
            v-model="username"
            type="text" 
            required 
            placeholder="Nhập mã nhân viên hoặc độc giả" 
            class="w-full p-4 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
          >
        </div>

        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <label class="text-sm font-bold text-slate-700 uppercase tracking-wide">Mật khẩu</label>
          </div>
          <input 
            v-model="password"
            type="password" 
            required 
            placeholder="••••••••" 
            class="w-full p-4 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
          >
        </div>

        <button type="submit" class="w-full bg-slate-900 text-white p-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-slate-200 flex justify-center items-center group">
          Vào hệ thống
          <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </button>
      </form>

      <div class="mt-12">
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Tài khoản Demo (Tự động điền)</p>
        <div class="flex flex-wrap gap-2">
          <button @click="fillData('DG2604001', 'DOC_GIA')" class="px-3 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors">Độc Giả</button>
          <button @click="fillData('TT_001', 'THU_THU')" class="px-3 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg hover:bg-emerald-100 hover:text-emerald-700 transition-colors">Thủ Thư</button>
          <button @click="fillData('KHO_01', 'QUAN_LY_KHO')" class="px-3 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg hover:bg-orange-100 hover:text-orange-700 transition-colors">Kho</button>
          <button @click="fillData('KT_001', 'KE_TOAN')" class="px-3 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg hover:bg-purple-100 hover:text-purple-700 transition-colors">Kế Toán</button>
          <button @click="fillData('AD_001', 'GIAM_DOC')" class="px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded-lg hover:bg-black transition-colors">Giám Đốc</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const username = ref('');
const password = ref('');
const tempRole = ref('DOC_GIA'); // Dùng để giả lập Role sau khi đăng nhập

// Hàm tự động điền để Hải demo nhanh
const fillData = (user: string, role: string) => {
  username.value = user;
  password.value = 'password123';
  tempRole.value = role;
};

const handleLogin = () => {
  // Logic Redirect:
  // 1. Lưu Role được xác định vào localStorage
  localStorage.setItem('role', tempRole.value);

  // 2. Chuyển hướng về trang chủ
  // Tùy vào Role, MainLayout sẽ hiển thị menu khác nhau
  // Và Router sẽ đá về trang con tương ứng
  let targetPath = '/';
  
  if (tempRole.value === 'DOC_GIA') targetPath = '/reader/history';
  if (tempRole.value === 'THU_THU') targetPath = '/librarian/transactions';
  if (tempRole.value === 'QUAN_LY_KHO') targetPath = '/inventory/books';
  if (tempRole.value === 'KE_TOAN') targetPath = '/accountant/fines';
  if (tempRole.value === 'GIAM_DOC') targetPath = '/director/audit-log';

  // Dùng window.location để reload lại app với Role mới
  window.location.href = targetPath;
};
</script>