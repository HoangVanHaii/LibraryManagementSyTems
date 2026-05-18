import { createRouter, createWebHistory } from 'vue-router'
// Import các component chúng ta đã tạo
import LoginView from '../view/Login.vue'
import MainLayout from '../components/MainLayout.vue'
import ReaderView from '../view/Reader.vue'
import ReaderLibraryView from '../view/ReaderLibrary.vue'
import ReaderProfileView from '../view/ReaderProfile.vue'
import LibrarianTransactionsView from '../view/LibrarianTransaction.vue'
import LibrarianReaderManageView from '../view/LibrarianReaderManage.vue'
import LibrarianBookSearchView from '../view/LibrarianBookSearch.vue'
import InventoryBookManageView from '../view/InventoryBookManage.vue'
import AccountantFinesView from '../view/AccountantFines.vue'
import AccountantStaffView from '../view/AccountantStaff.vue'
import DirectorAuditLogView from '../view/DirectorAuditLog.vue'
import DirectorReportsView from '../view/DirectorReports.vue'
import DirectorManageEmployees from '../view/DirectorManageEmployees.vue'
import ReaderHomeView from '../view/ReaderHome.vue'
import InventoryStat from '../view/InventoryStat.vue'
import InventoryAlert from '../view/InventoryAlert.vue'
import LoginHistory from '../view/DirectorLoginHistory.vue'
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            // 1. Cổng gác: Trang đăng nhập
            path: '/login',
            name: 'login',
            component: LoginView
        },
        {
            // 2. Khu vực bên trong (Sau khi đăng nhập)
            path: '/',
            component: MainLayout,
            // Khi truy cập '/', tự động chuyển hướng vào trang lịch sử của Độc giả để test
            redirect: '/reader/history',
            children: [
                { path: 'reader/history', name: 'reader-history', component: ReaderView },
                { path: 'reader/library', name: 'reader-library', component: ReaderLibraryView },
                { path: 'reader/profile', name: 'reader-profile', component: ReaderProfileView },
                { path: 'librarian/transactions', name: 'librarian-transactions', component: LibrarianTransactionsView },
                { path: 'librarian/readers', name: 'librarian-readers', component: LibrarianReaderManageView },
                { path: 'librarian/books', name: 'librarian-books', component: LibrarianBookSearchView },
                { path: 'inventory/books', name: 'inventory-books', component: InventoryBookManageView },
                { path: 'accountant/fines', name: 'accountant-fines', component: AccountantFinesView },
                { path: 'accountant/staff', name: 'accountant-staff', component: AccountantStaffView },
                { path: 'director/audit-log', name: 'director-audit-log', component: DirectorAuditLogView },
                { path: 'director/reports', name: 'director-reports', component: DirectorReportsView },
                { path: 'director/employees', name: 'director-employees', component: DirectorManageEmployees },
                { path: 'reader/home', name: 'reader-home', component: ReaderHomeView },
                { path: 'inventory/statistics', name: 'inventory-statistics', component: InventoryStat },
                { path: 'inventory/alerts', name: 'inventory-alerts', component: InventoryAlert },
                { path: 'director/login-history', name: 'director-login-history', component: LoginHistory }
            ]
        }
    ]
})

export default router