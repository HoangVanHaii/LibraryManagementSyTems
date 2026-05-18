<template>
  <div class="flex h-screen bg-gray-100 font-sans text-gray-900">
    
    <aside 
      :class="isSidebarOpen ? 'w-64' : 'w-20'"
      class="bg-white shadow-lg flex flex-col transition-all duration-300 relative z-20"
    >
      <button 
        @click="isSidebarOpen = !isSidebarOpen"
        class="absolute -right-3 top-5 bg-white border border-gray-200 rounded-full p-1 shadow-md text-gray-500 hover:text-blue-600 focus:outline-none transition-colors"
      >
        <svg v-if="isSidebarOpen" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div class="h-16 flex items-center justify-center border-b border-gray-200 overflow-hidden px-4">
        <h1 v-if="isSidebarOpen" class="text-xl font-bold text-blue-600 tracking-wider whitespace-nowrap transition-opacity duration-300">
          HCMUE LIBRARY
        </h1>
        <h1 v-else class="text-xl font-bold text-blue-600 tracking-wider">
          HL
        </h1>
      </div>

      <nav class="flex-1 px-3 py-6 space-y-2 overflow-y-auto overflow-x-hidden">
        
        <router-link 
          v-if="userRole === 'DocGia'" 
          to="/reader/home" 
          class="flex items-center px-3 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
          active-class="bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600"
        >
            <svg class="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <span v-if="isSidebarOpen" class="ml-3 whitespace-nowrap">Trang chủ</span>
        </router-link>

        <template v-if="userRole === 'DocGia'">
          <router-link 
            to="/reader/library" 
            class="flex items-center px-3 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group" 
            :title="!isSidebarOpen ? 'Thư viện sách' : ''"
            active-class="bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600"
          >
            <svg class="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <span v-if="isSidebarOpen" class="ml-3 whitespace-nowrap">Thư viện sách</span>
          </router-link>

          <router-link 
            to="/reader/history" 
            class="flex items-center px-3 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group" 
            :title="!isSidebarOpen ? 'Lịch sử mượn' : ''"
            active-class="bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600"
          >
            <svg class="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <span v-if="isSidebarOpen" class="ml-3 whitespace-nowrap">Lịch sử mượn</span>
          </router-link>

          <router-link 
            to="/reader/profile" 
            class="flex items-center px-3 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group" 
            :title="!isSidebarOpen ? 'Hồ sơ cá nhân' : ''"
            active-class="bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600"
          >
            <svg class="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            <span v-if="isSidebarOpen" class="ml-3 whitespace-nowrap">Hồ sơ cá nhân</span>
          </router-link>
        </template>

        <template v-if="userRole === 'KeToan'">
          <router-link 
            to="/accountant/fines" 
            class="flex items-center px-3 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group" 
            :title="!isSidebarOpen ? 'Quản lý Thu Phạt' : ''"
            active-class="bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600"
          >
            <svg class="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
            </svg>
            <span v-if="isSidebarOpen" class="ml-3 whitespace-nowrap">Quản lý Thu Phạt</span>
          </router-link>

          <router-link 
            to="/accountant/staff" 
            class="flex items-center px-3 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
            active-class="bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600"
          >
            <svg class="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
            <span v-if="isSidebarOpen" class="ml-3 whitespace-nowrap">Tra cứu Nhân sự</span>
          </router-link>
        </template>

        <template v-if="userRole === 'ThuThu'">
          <router-link 
            to="/librarian/transactions" 
            class="flex items-center px-3 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group" 
            :title="!isSidebarOpen ? 'Nghiệp vụ Mượn/Trả' : ''"
            active-class="bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600"
          >
            <svg class="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12" />
            </svg>
            <span v-if="isSidebarOpen" class="ml-3 whitespace-nowrap">Nghiệp vụ Mượn/Trả</span>
          </router-link>

          <router-link 
            to="/librarian/readers" 
            class="flex items-center px-3 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
            active-class="bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600"
          >
            <svg class="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
            <span v-if="isSidebarOpen" class="ml-3 whitespace-nowrap">Cấp thẻ Độc giả</span>
          </router-link>

          <router-link 
            to="/librarian/books" 
            class="flex items-center px-3 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
            active-class="bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600"
          >
            <svg class="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <span v-if="isSidebarOpen" class="ml-3 whitespace-nowrap">Tra cứu Kho sách</span>
          </router-link>
        </template>

        <template v-if="userRole === 'QuanLyKho'">
          <router-link 
            to="/inventory/books" 
            class="flex items-center px-3 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group" 
            :title="!isSidebarOpen ? 'Quản lý Danh mục Sách' : ''"
            active-class="bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600"
          >
            <svg class="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <span v-if="isSidebarOpen" class="ml-3 whitespace-nowrap">Quản lý Danh mục Sách</span>
          </router-link>

          <router-link 
            to="/inventory/statistics" 
            class="flex items-center px-3 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group" 
            :title="!isSidebarOpen ? 'Thống kê nhập/xuất' : ''"
            active-class="bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600"
          >
            <svg class="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
            <span v-if="isSidebarOpen" class="ml-3 whitespace-nowrap">Thống kê Nhập/Xuất</span>
          </router-link>
          <router-link 
            to="/inventory/alerts" 
            class="flex items-center px-3 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors group" 
            :title="!isSidebarOpen ? 'Cảnh báo hết sách' : ''"
            active-class="bg-red-50 text-red-600 font-bold border-l-4 border-l-red-500"
          >
            <svg class="w-6 h-6 flex-shrink-0 text-red-500 group-hover:text-red-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            <span v-if="isSidebarOpen" class="ml-3 whitespace-nowrap flex items-center justify-between w-full">
              <span>Cảnh báo hết sách</span>
              <span class="w-2 h-2 rounded-full bg-red-500 animate-ping mr-1"></span>
            </span>
          </router-link>
        </template>

        <template v-if="userRole === 'GiamDoc'">
          
          <router-link 
            to="/director/employees" 
            class="flex items-center px-3 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
            active-class="bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600"
          >
            <svg class="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
            <span v-if="isSidebarOpen" class="ml-3 whitespace-nowrap">Quản lý Nhân sự</span>
          </router-link>

          <router-link 
            to="/director/audit-log" 
            class="flex items-center px-3 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
            active-class="bg-blue-600 text-white font-bold shadow-md hover:bg-blue-700 hover:text-white"
          >
            <svg class="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span v-if="isSidebarOpen" class="ml-3 whitespace-nowrap">Audit Log (Kiểm toán)</span>
          </router-link>

          <router-link 
            to="/director/login-history" 
            class="flex items-center px-3 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
            active-class="bg-blue-600 text-white font-bold shadow-md hover:bg-blue-700 hover:text-white"
          >
            <svg class="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <span v-if="isSidebarOpen" class="ml-3 whitespace-nowrap">Nhật ký Truy cập</span>
          </router-link>

          <router-link 
            to="/director/reports" 
            class="flex items-center px-3 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
            active-class="bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600"
          >
            <svg class="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14" />
            </svg>
            <span v-if="isSidebarOpen" class="ml-3 whitespace-nowrap">Báo cáo chiến lược</span>
          </router-link>

        </template>

      </nav>

      <div class="p-4 border-t border-gray-200 overflow-hidden">
        <div class="flex items-center" :class="isSidebarOpen ? 'space-x-3' : 'justify-center'">
          <div class="w-10 h-10 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-700 font-bold shadow-sm">
            {{ sessionRaw ? JSON.parse(sessionRaw).username.charAt(0) : 'H' }}
          </div>
          <div v-if="isSidebarOpen" class="flex-1 overflow-hidden transition-opacity duration-300">
            <p class="text-sm font-semibold text-gray-900 truncate">{{ savedUser }} - {{ savedUserId }}</p>
            <p class="text-xs text-gray-500 truncate">Vai trò: <span class="font-bold text-blue-600">{{ userRole }}</span></p>
          </div>
          <button v-if="isSidebarOpen" @click="handleLogout" class="text-gray-400 hover:text-red-500 transition-colors" title="Đăng xuất">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <div class="flex-1 flex flex-col overflow-hidden">
      <header class="h-16 bg-white shadow-sm flex items-center justify-between px-8 border-b border-gray-200 z-10">
        <div class="flex items-center space-x-2 text-sm">
          <span class="text-gray-400">Hệ thống</span>
          <span class="text-gray-400">/</span>
          <span class="text-gray-900 font-semibold uppercase tracking-wider">
            {{ userRole.replace('_', ' ') }} Workspace
          </span>
        </div>

        <div class="flex items-center space-x-6">
          <button class="text-gray-400 hover:text-blue-600 transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <button class="relative text-gray-400 hover:text-blue-600 transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>
        </div>
      </header>
      
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
        <router-view></router-view>
      </main>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

type Role = 'DocGia' | 'ThuThu' | 'QuanLyKho' | 'KeToan' | 'GiamDoc';

const sessionRaw = localStorage.getItem('user_session');
const savedRole = sessionRaw ? JSON.parse(sessionRaw).role : null;
const savedUser = sessionRaw ? JSON.parse(sessionRaw).username : 'Người dùng';
const savedUserId = sessionRaw ? JSON.parse(sessionRaw).maId : 'NVKT01';
const userRole = ref<Role>(savedRole || 'DocGia');
const isSidebarOpen = ref<boolean>(true);
  
const handleLogout = () => {
  console.log('Đang thực hiện đăng xuất hệ thống an toàn...');
  localStorage.removeItem('user_session');
  localStorage.removeItem('role');
  window.location.href = '/login';
};
</script>