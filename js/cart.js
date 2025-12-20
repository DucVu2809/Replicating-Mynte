function renderCartPage() {
    const container = document.getElementById('cart-items-container');
    if (!container) return; // Nếu không có khung chứa thì dừng

    const cart = getCart(); // Gọi hàm từ common.js
    const countInfo = document.getElementById('cart-count-info');
    
    // Cập nhật text thông báo
    if(countInfo) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        countInfo.textContent = `Bạn đang có ${totalItems} sản phẩm trong túi.`;
    }

    container.innerHTML = ''; 

    // Header bảng
    container.innerHTML += `
        <div class="d-none d-md-flex row border-bottom pb-3 mb-4 text-uppercase small text-muted spacing-wide">
            <div class="col-6">Sản phẩm</div>
            <div class="col-2 text-center">Số lượng</div>
            <div class="col-2 text-end">Giá</div>
            <div class="col-2 text-end">Tổng</div>
        </div>
    `;

    // Giỏ trống
    if (cart.length === 0) {
        container.innerHTML += `
            <div class="text-center py-5 text-muted">
                <i class="bi bi-cart-x fs-1 mb-3 d-block"></i>
                <p>Giỏ hàng chưa có sản phẩm nào.</p>
                <a href="book.html" class="btn btn-dark rounded-0 mt-2">Đi mua sách ngay</a>
            </div>`;
        updateOrderSummary(0);
        return;
    }

    // Vẽ sản phẩm
    cart.forEach((item, index) => {
        const html = `
        <div class="row align-items-center border-bottom py-4 cart-item">
            <div class="col-md-6 d-flex align-items-center gap-3">
                <div class="ratio ratio-1x1 bg-light" style="width: 80px; flex-shrink: 0;">
                    <img src="${item.img}" alt="${item.title}" class="object-fit-cover w-100 h-100">
                </div>
                <div>
                    <h5 class="brand-font mb-1 fs-6">${item.title}</h5>
                    <p class="text-muted small mb-0">${item.author || 'Tác giả'}</p>
                    <a href="javascript:void(0)" onclick="removeItem(${index})" class="text-danger small text-decoration-none mt-1 d-inline-block">Xóa</a>
                </div>
            </div>
            
            <div class="col-md-2 mt-3 mt-md-0 text-center">
                <div class="input-group input-group-sm w-75 mx-auto">
                    <button class="btn btn-outline-secondary border-0" onclick="updateQuantity(${index}, -1)">-</button>
                    <input type="text" class="form-control text-center border-0 bg-transparent" value="${item.quantity}" readonly>
                    <button class="btn btn-outline-secondary border-0" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
            </div>

            <div class="col-md-2 text-md-end mt-2 mt-md-0 text-muted small">
                ${formatCurrency(item.price)}
            </div>

            <div class="col-md-2 text-md-end mt-2 mt-md-0 fw-bold">
                ${formatCurrency(item.price * item.quantity)}
            </div>
        </div>`;
        container.innerHTML += html;
    });

    // Nút tiếp tục
    container.innerHTML += `
        <div class="mt-4">
            <a href="book.html" class="text-decoration-none text-dark small fw-bold">
                <i class="bi bi-arrow-left me-2"></i> TIẾP TỤC MUA SẮM
            </a>
        </div>
    `;

    // Tính tổng
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    updateOrderSummary(total);
}

function updateOrderSummary(total) {
    const subTotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');
    if (subTotalEl) subTotalEl.textContent = formatCurrency(total);
    if (totalEl) totalEl.textContent = formatCurrency(total);
}

// Hàm Xóa (Chỉ trang Cart mới dùng)
window.removeItem = function(index) {
    if(confirm("Bạn chắc chắn muốn xóa sách này?")) {
        let cart = getCart(); // Gọi từ common.js
        cart.splice(index, 1);
        saveCart(cart); // Gọi từ common.js (nó sẽ tự update Badge luôn)
        renderCartPage(); // Vẽ lại bảng
    }
};

// Hàm Sửa số lượng
window.updateQuantity = function(index, change) {
    let cart = getCart();
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity < 1) {
            if(confirm("Xóa sản phẩm này?")) {
                cart.splice(index, 1);
            } else {
                cart[index].quantity = 1;
            }
        }
    }
    saveCart(cart);
    renderCartPage();
};

// Chỉ chạy render khi vào trang Cart
document.addEventListener("DOMContentLoaded", function() {
    renderCartPage();
});