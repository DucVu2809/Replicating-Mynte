     document.addEventListener("DOMContentLoaded", function() {
        const loader = document.querySelector('.page-loader');
        if (loader) {
            setTimeout(() => {
                loader.classList.add('hidden'); 
            }, 100);
        }
        const animatedElements = document.querySelectorAll('.animate-up, .animate-down, .horizontal-fade-banner');
        animatedElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            el.style.visibility = 'visible';
        });

        if (typeof renderHistory === 'function') {
            renderHistory();
        }
    });
// --- CẤU HÌNH & TIỆN ÍCH CHUNG ---
const CART_KEY = 'dreamy_cart';

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Lấy giỏ hàng
function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

// Lưu giỏ hàng & Cập nhật Badge ngay lập tức
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge(); 
}

// --- LOGIC DÙNG CHUNG ---

// 1. Cập nhật số lượng trên Icon Menu
function updateCartBadge() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badgeElement = document.getElementById('cart-badge');
    if (badgeElement) {
        badgeElement.textContent = totalItems;
    }
}

// 2. Hàm Thêm vào giỏ (Dùng ở Trang chủ, Trang chi tiết...)
window.addToCart = function(btn) {
    const product = {
        id: btn.getAttribute('data-id'),
        title: btn.getAttribute('data-title'),
        price: parseInt(btn.getAttribute('data-price')),
        img: btn.getAttribute('data-img'),
        author: btn.getAttribute('data-author'),
        quantity: 1
    };

    let cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(product);
    }

    saveCart(cart);
    alert(`Đã thêm "${product.title}" vào giỏ hàng!`);
};

// Tự động chạy cập nhật Badge khi load bất kỳ trang nào
document.addEventListener("DOMContentLoaded", function() {
    updateCartBadge();
});
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

// Hiệu ứng chuyển trang
document.addEventListener("DOMContentLoaded", function() {
        
        // A. KHI TRANG VỪA TẢI XONG -> LÀM MỜ MÀN CHE (FADE IN)
        const loader = document.querySelector('.page-loader');
        // Thêm chút delay nhỏ để đảm bảo CSS load xong mới hiện
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 100); 

        // B. KHI NGƯỜI DÙNG BẤM LINK -> HIỆN MÀN CHE LẠI (FADE OUT)
        const links = document.querySelectorAll('a');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // KIỂM TRA ĐIỀU KIỆN TRƯỚC KHI CHẠY HIỆU ỨNG:
                // 1. Link rỗng hoặc # (neo trong trang) -> Bỏ qua
                // 2. Link mở tab mới (_blank) -> Bỏ qua
                // 3. Link chứa javascript -> Bỏ qua
                if (!href || href.startsWith('#') || this.target === '_blank' || href.includes('javascript')) {
                    return;
                }

                // Nếu là link nội bộ bình thường:
                e.preventDefault(); // Ngừng chuyển trang ngay lập tức
                loader.classList.remove('hidden'); // Hiện màn che lên

                // Đợi 500ms (bằng thời gian transition trong CSS) rồi mới chuyển trang
                setTimeout(() => {
                    window.location.href = href;
                }, 500);
            });
        });
    });
    
    // C. XỬ LÝ LỖI KHI BẤM NÚT BACK CỦA TRÌNH DUYỆT (Safari/Chrome Cache)
    // Nếu không có đoạn này, khi bấm Back, màn che vẫn hiện và trang bị trắng
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            document.querySelector('.page-loader').classList.add('hidden');
        }
    });

    // --- 1. HÀM LƯU LỊCH SỬ XEM (GỌI KHI BẤM VÀO SÁCH) ---
function addToHistory(book) {
    // Lấy lịch sử cũ ra (nếu có), nếu chưa có thì tạo mảng rỗng
    let history = JSON.parse(localStorage.getItem('viewedBooks')) || [];
    
    // Kiểm tra xem sách này đã có trong lịch sử chưa
    // Nếu có rồi thì xóa đi để lát nữa thêm vào đầu (cập nhật mới nhất)
    history = history.filter(item => item.id !== book.id);
    
    // Thêm sách mới vào đầu danh sách
    history.unshift(book);
    
    // Giới hạn chỉ lưu 10 cuốn gần nhất (cho nhẹ bộ nhớ)
    if (history.length > 10) {
        history.pop();
    }
    
    // Lưu ngược lại vào LocalStorage
    localStorage.setItem('viewedBooks', JSON.stringify(history));
}

// ==========================================
// HỆ THỐNG ĐĂNG KÝ / ĐĂNG NHẬP
// ==========================================

// 1. Kiểm tra trạng thái khi tải trang
document.addEventListener('DOMContentLoaded', () => {
    checkLoginState();
});

// 2. Xử lý Đăng Ký
function handleRegister(e) {
    e.preventDefault();
    
    // Lấy dữ liệu từ form
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const pass = document.getElementById('regPass').value;
    
    // Lấy danh sách user cũ (nếu có)
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Kiểm tra trùng email
    if (users.some(u => u.email === email)) {
        document.getElementById('regError').classList.remove('d-none');
        document.getElementById('regSuccess').classList.add('d-none');
        return;
    }
    
    // Thêm user mới
    users.push({ name, email, pass });
    localStorage.setItem('users', JSON.stringify(users));
    
    // Thông báo thành công
    document.getElementById('regError').classList.add('d-none');
    document.getElementById('regSuccess').classList.remove('d-none');
    
    // Reset form
    e.target.reset();
    
    // Tự động chuyển sang tab đăng nhập sau 1.5s (trải nghiệm UX)
    setTimeout(() => {
        const loginTab = new bootstrap.Tab(document.querySelector('#login-tab'));
        loginTab.show();
        // Điền sẵn email cho người dùng
        document.getElementById('loginEmail').value = email;
    }, 1500);
}

// 3. Xử lý Đăng Nhập
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPass').value;
    
    // Lấy danh sách user
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Tìm user khớp email và pass
    const user = users.find(u => u.email === email && u.pass === pass);
    
    if (user) {
        // Đăng nhập thành công -> Lưu session
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Ẩn modal
        const modalEl = document.getElementById('authModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();
        
        // Cập nhật giao diện
        checkLoginState();
        
        // Reset form
        e.target.reset();
        document.getElementById('loginError').classList.add('d-none');
    } else {
        // Sai thông tin
        document.getElementById('loginError').classList.remove('d-none');
    }
}

// 4. Xử lý Đăng Xuất
function handleLogout() {
    localStorage.removeItem('currentUser');
    checkLoginState();
    // Có thể reload trang nếu cần: location.reload();
}

// 5. Cập nhật giao diện theo trạng thái đăng nhập
function checkLoginState() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loginBtn = document.getElementById('loginBtn');
    const loggedInMenu = document.getElementById('loggedInMenu');
    
    if (!loginBtn || !loggedInMenu) return; // Tránh lỗi nếu không tìm thấy element

    if (currentUser) {
        // Đã đăng nhập
        loginBtn.classList.add('d-none'); // Ẩn nút icon người
        loggedInMenu.classList.remove('d-none'); // Hiện menu avatar
        
        // Cập nhật tên và avatar (Lấy chữ cái đầu của tên)
        document.getElementById('userNameDisplay').innerText = "Xin chào, " + currentUser.name;
        document.getElementById('userAvatar').innerText = currentUser.name.charAt(0).toUpperCase();
        
    } else {
        // Chưa đăng nhập
        loginBtn.classList.remove('d-none');
        loggedInMenu.classList.add('d-none');
    }
}
let recoveryEmail = "";

// 6. Xử lý Quên mật khẩu (Đã sửa đổi: Chuyển sang màn hình Reset)
function handleForgot(e) {
    e.preventDefault();
    
    const email = document.getElementById('forgotEmail').value;
    const msgDiv = document.getElementById('forgotSuccess');
    
    // Kiểm tra email trong localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some(u => u.email === email);
    
    if (userExists) {
        // Lưu email lại để dùng cho bước sau
        recoveryEmail = email;
        
        // Hiển thị email lên form reset cho chuyên nghiệp
        document.getElementById('resetEmailDisplay').innerText = email;

        // Giả lập đang gửi mail... đợi 1 giây rồi chuyển tab
        msgDiv.classList.remove('d-none', 'text-danger');
        msgDiv.classList.add('text-success');
        msgDiv.innerHTML = `<i class="bi bi-hourglass-split me-1"></i> Đang xác thực...`;

        setTimeout(() => {
            msgDiv.classList.add('d-none'); // Ẩn thông báo cũ
            switchAuthTab('reset-panel');   // Chuyển sang tab nhập mật khẩu mới
        }, 1000);

    } else {
        // Báo lỗi nếu email không tồn tại
        msgDiv.classList.remove('d-none', 'text-success');
        msgDiv.classList.add('text-danger');
        msgDiv.innerHTML = `<i class="bi bi-exclamation-circle me-1"></i> Email này chưa đăng ký!`;
    }
}
// 7. Hàm chuyển đổi Tab thủ công (Dùng cho nút Quên mật khẩu)
function switchAuthTab(tabId) {
    // Bước 1: Ẩn tất cả các nội dung tab hiện tại
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('show', 'active');
    });

    // Bước 2: Xóa trạng thái "active" của các nút trên menu (Đăng nhập/Đăng ký)
    document.querySelectorAll('#authTab .nav-link').forEach(nav => {
        nav.classList.remove('active');
    });

    // Bước 3: Hiện tab mục tiêu
    const targetPane = document.getElementById(tabId);
    if (targetPane) {
        targetPane.classList.add('show', 'active');
    }

    // Bước 4: Nếu quay lại tab Đăng nhập, hãy làm sáng nút "Đăng nhập" trên menu
    if (tabId === 'login-panel') {
        const loginBtn = document.getElementById('login-tab');
        if (loginBtn) loginBtn.classList.add('active');
    }
}
// 8. Xử lý Đổi mật khẩu mới
function handleResetPassword(e) {
    e.preventDefault();

    const newPass = document.getElementById('newPass').value;
    const confirmPass = document.getElementById('newPassConfirm').value;
    const errorDiv = document.getElementById('resetError');
    const successDiv = document.getElementById('resetSuccess');

    // Kiểm tra khớp mật khẩu
    if (newPass !== confirmPass) {
        errorDiv.classList.remove('d-none');
        return;
    }

    errorDiv.classList.add('d-none');

    // Cập nhật mật khẩu trong LocalStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === recoveryEmail);

    if (userIndex !== -1) {
        // Đổi mật khẩu
        users[userIndex].pass = newPass;
        localStorage.setItem('users', JSON.stringify(users));

        // Thông báo thành công
        successDiv.classList.remove('d-none');
        
        // Sau 1.5s thì chuyển về trang đăng nhập
        setTimeout(() => {
            successDiv.classList.add('d-none');
            document.getElementById('resetForm').reset();
            document.getElementById('forgotForm').reset();
            
            // Chuyển về tab đăng nhập & điền sẵn thông tin
            switchAuthTab('login-panel');
            document.getElementById('loginEmail').value = recoveryEmail;
            document.getElementById('loginPass').focus();
        }, 1500);
    }
}
