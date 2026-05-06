<template>
  <div class="space-y-8">
    <div class="relative overflow-hidden bg-slate-900 rounded-2xl p-8 text-white shadow-lg">
      <div class="relative z-10">
        <h2 class="text-3xl font-bold tracking-tight">Chào mừng trở lại, Hoàng Văn Hải! 👋</h2>
        <p class="mt-2 text-slate-300 max-w-xl">
          Hôm nay là ngày 15 tháng 04 năm 2026. Bạn có <span class="text-yellow-400 font-bold">2 cuốn sách</span> đang mượn và cần lưu ý hạn trả để tránh phát sinh phí phạt.
        </p>
        <div class="mt-6 flex space-x-3">
          <router-link to="/reader/library" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
            Khám phá sách mới
          </router-link>
          <router-link to="/reader/history" class="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors backdrop-blur-sm">
            Xem lịch sử mượn
          </router-link>
        </div>
      </div>
      <div class="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          Thông báo mới nhất
        </h3>
        <ul class="space-y-4">
          <li class="flex items-start p-3 bg-blue-50 rounded-xl border border-blue-100">
            <span class="bg-blue-500 text-white p-1.5 rounded-lg mr-3 text-xs font-bold uppercase">Mới</span>
            <div>
              <p class="text-sm font-bold text-blue-900">Lịch nghỉ lễ 30/04 & 01/05</p>
              <p class="text-xs text-blue-700 mt-1">Thư viện sẽ đóng cửa từ ngày 30/04 đến hết 03/05. Các bạn lưu ý gia hạn sách nhé!</p>
            </div>
          </li>
          <li class="flex items-start p-3 bg-gray-50 rounded-xl">
            <span class="bg-gray-400 text-white p-1.5 rounded-lg mr-3 text-xs font-bold uppercase">Tin</span>
            <div>
              <p class="text-sm font-bold text-gray-900">Cập nhật kho sách CNTT</p>
              <p class="text-xs text-gray-500 mt-1">Hơn 50 đầu sách mới về AI và Cloud Computing vừa được nhập kho khu A.</p>
            </div>
          </li>
        </ul>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center flex flex-col items-center justify-center">
        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
        </div>
        <h3 class="text-lg font-bold text-gray-900">Chưa biết đọc gì?</h3>
        <p class="text-sm text-gray-500 mt-2">Dựa trên sở thích của bạn về <span class="italic">Cơ sở dữ liệu</span>, chúng tôi có vài gợi ý hấp dẫn.</p>
        <button class="mt-4 text-sm font-bold text-blue-600 hover:underline">Xem danh mục gợi ý &rarr;</button>
      </div>
    </div>
  </div>
</template>