document.addEventListener('DOMContentLoaded', () => {
    // 1. Logic lấy tên khách mời từ URL param
    // Lấy URL hiện tại
    const urlParams = new URLSearchParams(window.location.search);
    // Lấy giá trị của biến 'guest'
    const guestName = urlParams.get('guest');

    // Phần tử HTML để hiển thị tên
    const guestNameElement = document.getElementById('guest-name');

    if (guestName) {
        // Nếu có tên trên URL, cập nhật vào HTML
        guestNameElement.textContent = guestName;
    } else {
        // Nếu không có, để mặc định (có thể đổi thành 'Bạn' hoặc 'Quý khách')
        guestNameElement.textContent = 'Quý khách';
    }

    // 2. Hiệu ứng bắn pháo giấy (Confetti) khi tải trang
    // Delay một chút để hiệu ứng đẹp hơn sau khi trang đã tải lên
    setTimeout(() => {
        // Định nghĩa màu sắc pháo giấy (đỏ và vàng/bạc cho sang trọng)
        const colors = ['#a40026', '#ffffff', '#ffd700'];

        // Bắn từ bên trái
        confetti({
            particleCount: 80,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
        });

        // Bắn từ bên phải
        confetti({
            particleCount: 80,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
        });
    }, 500); // Đợi 0.5 giây

    // 3. Logic xử lý Modal "Gửi lời chúc"
    const btnWish = document.getElementById('btn-wish');
    const modal = document.getElementById('wish-modal');
    const closeBtn = document.querySelector('.close-btn');
    const wishForm = document.getElementById('wish-form');
    const successMessage = document.getElementById('success-message');

    // Mở modal
    btnWish.addEventListener('click', () => {
        modal.classList.add('active');
        // Reset form và ẩn thông báo thành công mỗi khi mở lại
        wishForm.reset();
        wishForm.classList.remove('hidden');
        successMessage.classList.add('hidden');
    });

    // Đóng modal khi bấm nút X
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Đóng modal khi click ra ngoài vùng xám
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Xử lý khi bấm nút Gửi
    wishForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Ngăn trang bị reload

        // Lấy dữ liệu (sau này có thể gửi lên Google Form hoặc backend)
        const name = document.getElementById('sender-name').value;
        const message = document.getElementById('wish-message').value;

        // Thay URL_CỦA_BẠN bằng link Formspree thật của bạn (VD: https://formspree.io/f/xabcd123)
        const formspreeUrl = "https://formspree.io/f/mjgnrezy";

        const submitBtn = wishForm.querySelector('.btn-submit-wish');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Đang gửi...';
        submitBtn.disabled = true;

        try {
            if (formspreeUrl !== "URL_CỦA_BẠN") {
                await fetch(formspreeUrl, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        Tên: name,
                        Lời_chúc: message
                    })
                });
            } else {
                // Giả lập delay nếu chưa có link thật để test UI
                await new Promise(resolve => setTimeout(resolve, 800));
            }

            // Ẩn form, hiện thông báo thành công
            wishForm.classList.add('hidden');
            successMessage.classList.remove('hidden');

            // Bắn pháo giấy nhẹ ăn mừng
            confetti({
                particleCount: 50,
                spread: 40,
                origin: { y: 0.6 }
            });

            // Tự động đóng modal sau 3 giây
            setTimeout(() => {
                modal.classList.remove('active');
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }, 3000);
        } catch (error) {
            alert('Có lỗi xảy ra khi gửi lời chúc, vui lòng thử lại sau nhé!');
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }
    });

    // 4. Logic xử lý Modal Xem Ảnh
    const avatarImg = document.getElementById('avatar-img');
    const imageModal = document.getElementById('image-modal');
    const fullSizeImg = document.getElementById('full-size-img');
    const imageCloseBtn = document.querySelector('.image-close-btn');

    // Mở modal xem ảnh
    avatarImg.addEventListener('click', () => {
        // Lấy đường dẫn ảnh hiện tại của avatar và gán vào ảnh phóng to
        fullSizeImg.src = avatarImg.src;
        imageModal.classList.add('active');
        
        // Thêm hiệu ứng trượt mượt mà
        setTimeout(() => {
            fullSizeImg.style.transform = 'translateY(0)';
        }, 10);
    });

    // Đóng modal xem ảnh khi bấm nút X
    imageCloseBtn.addEventListener('click', () => {
        imageModal.classList.remove('active');
        fullSizeImg.style.transform = 'translateY(-20px)';
    });

    // Đóng modal xem ảnh khi click ra ngoài vùng ảnh
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            imageModal.classList.remove('active');
            fullSizeImg.style.transform = 'translateY(-20px)';
        }
    });
});
