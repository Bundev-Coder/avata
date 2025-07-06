// Biến lưu trữ QR code hiện tại
let currentQR = null;

// Danh sách tỉnh/thành phố
const provinces = {
    "001": "Hà Nội",
    "002": "Hà Giang",
    "004": "Cao Bằng",
    "006": "Bắc Kạn",
    "008": "Tuyên Quang",
    "010": "Lào Cai",
    "011": "Điện Biên",
    "012": "Lai Châu",
    "014": "Sơn La",
    "015": "Yên Bái",
    "017": "Hòa Bình",
    "019": "Thái Nguyên",
    "020": "Lạng Sơn",
    "022": "Quảng Ninh",
    "024": "Bắc Giang",
    "025": "Phú Thọ",
    "026": "Vĩnh Phúc",
    "027": "Bắc Ninh",
    "030": "Hải Dương",
    "031": "Hải Phòng",
    "033": "Hưng Yên",
    "034": "Thái Bình",
    "035": "Hà Nam",
    "036": "Nam Định",
    "037": "Ninh Bình",
    "038": "Thanh Hóa",
    "040": "Nghệ An",
    "042": "Hà Tĩnh",
    "044": "Quảng Bình",
    "045": "Quảng Trị",
    "046": "Thừa Thiên Huế",
    "048": "Đà Nẵng",
    "049": "Quảng Nam",
    "051": "Quảng Ngãi",
    "052": "Bình Định",
    "054": "Phú Yên",
    "056": "Khánh Hòa",
    "058": "Ninh Thuận",
    "060": "Bình Thuận",
    "062": "Kon Tum",
    "064": "Gia Lai",
    "066": "Đắk Lắk",
    "067": "Đắk Nông",
    "068": "Lâm Đồng",
    "070": "Bình Phước",
    "072": "Tây Ninh",
    "074": "Bình Dương",
    "075": "Đồng Nai",
    "077": "Bà Rịa - Vũng Tàu",
    "079": "Hồ Chí Minh",
    "080": "Long An",
    "082": "Tiền Giang",
    "083": "Bến Tre",
    "084": "Trà Vinh",
    "086": "Vĩnh Long",
    "087": "Đồng Tháp",
    "089": "An Giang",
    "091": "Kiên Giang",
    "092": "Cần Thơ",
    "093": "Hậu Giang",
    "094": "Sóc Trăng",
    "095": "Bạc Liêu",
    "096": "Cà Mau"
};

// Hàm loại bỏ ký tự không phải số
function sanitizeNumber(input) {
    return input.replace(/\D/g, '');
}

// Hàm kiểm tra định dạng ngày tháng (DDMMYYYY)
function isValidDate(dateString) {
    if (!/^\d{8}$/.test(dateString)) return false;
    
    const day = parseInt(dateString.substring(0, 2), 10);
    const month = parseInt(dateString.substring(2, 4), 10) - 1;
    const year = parseInt(dateString.substring(4, 8), 10);
    
    const date = new Date(year, month, day);
    return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day;
}

// Hàm kiểm tra số CCCD (12 số)
function isValidCCCD(cccd) {
    return /^\d{12}$/.test(cccd);
}

// Hàm hiển thị lỗi
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    return false;
}

// Hàm ẩn lỗi
function hideError(elementId) {
    document.getElementById(elementId).style.display = 'none';
    return true;
}

// Hàm tạo số ngẫu nhiên
function getRandomNumber(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 10);
    }
    return result;
}

// Hàm tạo số CCCD hợp lệ
function generateCCCDNumber() {
    const provinceCode = document.getElementById('province').value;
    const dob = document.getElementById('dob').value.trim();
    const gender = document.getElementById('gender').value;
    
    if (!provinceCode) {
        showNotification('Vui lòng chọn tỉnh/thành phố đăng ký trước');
        return;
    }
    
    if (!dob || !isValidDate(dob)) {
        showNotification('Vui lòng nhập ngày sinh hợp lệ (8 chữ số DDMMYYYY) trước');
        return;
    }
    
    if (!gender) {
        showNotification('Vui lòng chọn giới tính trước');
        return;
    }
    
    // Lấy năm sinh
    const year = parseInt(dob.substring(4, 8), 10);
    const shortYear = dob.substring(6, 8); // 2 số cuối năm sinh
    
    // Xác định thế kỷ và mã giới tính
    let genderCode;
    if (year >= 2000 && year < 2100) {
        // Thế kỷ 21
        genderCode = gender === 'Nam' ? '2' : '3';
    } else if (year >= 2100 && year < 2200) {
        // Thế kỷ 22
        genderCode = gender === 'Nam' ? '4' : '5';
    } else if (year >= 2200 && year < 2300) {
        // Thế kỷ 23
        genderCode = gender === 'Nam' ? '6' : '7';
    } else if (year >= 2300 && year < 2400) {
        // Thế kỷ 24
        genderCode = gender === 'Nam' ? '8' : '9';
    } else {
        // Thế kỷ 20 (mặc định)
        genderCode = gender === 'Nam' ? '0' : '1';
    }
    
    // Tạo 6 số cuối ngẫu nhiên
    const randomPart = getRandomNumber(6);
    
    // Tạo số CCCD hoàn chỉnh
    const cccdNumber = provinceCode + genderCode + shortYear + randomPart;
    
    document.getElementById('cccdNumber').value = cccdNumber;
    hideError('cccdError');
    showNotification('Đã tạo số CCCD thành công!');
}

// Hàm định dạng ngày từ DDMMYYYY sang DD/MM/YYYY
function formatDate(dateString) {
    if (dateString.length !== 8) return dateString;
    return `${dateString.substring(0,2)}/${dateString.substring(2,4)}/${dateString.substring(4,8)}`;
}

// Hàm kiểm tra dữ liệu nhập
function validateForm() {
    let isValid = true;
    
    // Kiểm tra số CCCD
    const cccdNumber = document.getElementById('cccdNumber').value.trim();
    if (!isValidCCCD(cccdNumber)) {
        isValid = showError('cccdError', 'Số CCCD phải có đúng 12 chữ số');
    } else {
        hideError('cccdError');
    }
    
    // Kiểm tra họ tên
    const fullName = document.getElementById('fullName').value.trim();
    if (fullName.length < 5) {
        isValid = showError('nameError', 'Họ tên phải có ít nhất 5 ký tự');
    } else {
        hideError('nameError');
    }
    
    // Kiểm tra ngày sinh
    const dob = document.getElementById('dob').value.trim();
    if (!isValidDate(dob)) {
        isValid = showError('dobError', 'Ngày sinh phải có 8 chữ số (DDMMYYYY)');
    } else {
        hideError('dobError');
    }
    
    // Kiểm tra giới tính
    const gender = document.getElementById('gender').value;
    if (!gender) {
        isValid = showError('genderError', 'Vui lòng chọn giới tính');
    } else {
        hideError('genderError');
    }
    
    // Kiểm tra tỉnh/thành phố
    const province = document.getElementById('province').value;
    if (!province) {
        isValid = showError('provinceError', 'Vui lòng chọn tỉnh/thành phố');
    } else {
        hideError('provinceError');
    }
    
    // Kiểm tra địa chỉ
    const address = document.getElementById('address').value.trim();
    if (address.length < 10) {
        isValid = showError('addressError', 'Địa chỉ phải có ít nhất 10 ký tự');
    } else {
        hideError('addressError');
    }
    
    // Kiểm tra ngày hết hạn
    const expiryDate = document.getElementById('expiryDate').value.trim();
    if (!isValidDate(expiryDate)) {
        isValid = showError('expiryError', 'Ngày hết hạn phải có 8 chữ số (DDMMYYYY)');
    } else {
        hideError('expiryError');
    }
    
    return isValid;
}

// Hàm tạo QR code sử dụng API được chọn
async function generateQR() {
    if (!validateForm()) {
        return;
    }
    
    // Lấy giá trị từ form
    const cccdNumber = document.getElementById('cccdNumber').value.trim();
    const fullName = document.getElementById('fullName').value.trim();
    const dob = document.getElementById('dob').value.trim();
    const gender = document.getElementById('gender').value;
    const provinceCode = document.getElementById('province').value;
    const provinceName = provinces[provinceCode];
    const address = document.getElementById('address').value.trim();
    const expiryDate = document.getElementById('expiryDate').value.trim();
    const apiProvider = document.getElementById('apiProvider').value;
    
    // Tạo chuỗi dữ liệu theo định dạng yêu cầu (không có dấu / trong ngày tháng)
    const qrData = `${cccdNumber}||${fullName}|${dob}|${gender}|${address}|${expiryDate}`;
    
    // Hiển thị thông tin CCCD (định dạng ngày tháng có / để dễ đọc)
    document.getElementById('infoNumber').textContent = cccdNumber;
    document.getElementById('infoName').textContent = fullName;
    document.getElementById('infoDob').textContent = formatDate(dob);
    document.getElementById('infoGender').textContent = gender;
    document.getElementById('infoProvince').textContent = provinceName;
    document.getElementById('infoAddress').textContent = address;
    document.getElementById('infoExpiry').textContent = formatDate(expiryDate);
    document.getElementById('cccdInfo').style.display = 'block';
    
    // Hiển thị loading
    document.getElementById('qrcode').innerHTML = '<p class="placeholder-text">Đang tạo QR Code...</p>';
    
    try {
        let apiUrl = '';
        
        // Chọn API dựa trên lựa chọn
        switch(apiProvider) {
            case 'qrserver':
                apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;
                document.getElementById('apiInfo').textContent = 'Đang sử dụng: QR Server API';
                break;
            case 'goqr':
                apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;
                document.getElementById('apiInfo').textContent = 'Đang sử dụng: GoQR.me API';
                break;
            case 'hapi':
                apiUrl = `https://api.hapi.qr/${encodeURIComponent(qrData)}?size=300&margin=10`;
                document.getElementById('apiInfo').textContent = 'Đang sử dụng: HAPI QR Code';
                break;
            default:
                apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;
        }
        
        // Tạo QR code
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error('Không thể tạo QR Code');
        }
        
        // Hiển thị QR code
        const qrCodeElement = document.getElementById('qrcode');
        qrCodeElement.innerHTML = '';
        
        const img = document.createElement('img');
        img.src = apiUrl;
        img.alt = 'QR Code CCCD';
        img.style.maxWidth = '100%';
        
        qrCodeElement.appendChild(img);
        
        // Lưu QR code hiện tại
        currentQR = apiUrl;
        
        // Hiển thị nút tải xuống
        document.getElementById('downloadBtn').style.display = 'block';
        showNotification('QR Code đã được tạo thành công!');
        
    } catch (error) {
        console.error('Lỗi khi tạo QR Code:', error);
        document.getElementById('qrcode').innerHTML = '<p class="placeholder-text" style="color: var(--danger-color);">Có lỗi xảy ra khi tạo QR Code</p>';
        showNotification('Có lỗi xảy ra khi tạo QR Code!', true);
    }
}

// Hàm tải xuống QR code
function downloadQR() {
    if (!currentQR) return;
    
    const cccdNumber = document.getElementById('cccdNumber').value.trim() || 'CCCD';
    const fileName = `QR_${cccdNumber}.png`;
    
    // Tạo link tải xuống
    const link = document.createElement('a');
    link.href = currentQR;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Đang tải xuống QR Code...');
}

// Hàm hiển thị thông báo
function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');
    const notificationIcon = notification.querySelector('.notification-icon');
    
    notificationIcon.innerHTML = isError 
        ? '<i class="fas fa-exclamation-circle"></i>' 
        : '<i class="fas fa-check-circle"></i>';
    
    notification.querySelector('div:last-child').innerHTML = `<strong>${message}</strong>`;
    notification.classList.add('show');
    
    // Ẩn thông báo sau 3 giây
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Thêm sự kiện thay đổi API
document.getElementById('apiProvider').addEventListener('change', function() {
    if (currentQR) {
        generateQR(); // Tạo lại QR code khi thay đổi API
    }
});

// Tự động loại bỏ ký tự không phải số trong các trường số
document.getElementById('cccdNumber').addEventListener('input', function(e) {
    this.value = sanitizeNumber(this.value);
});

document.getElementById('dob').addEventListener('input', function(e) {
    this.value = sanitizeNumber(this.value);
});

document.getElementById('expiryDate').addEventListener('input', function(e) {
    this.value = sanitizeNumber(this.value);
});

// Close notification
document.getElementById('notificationClose').addEventListener('click', function() {
    document.getElementById('notification').classList.remove('show');
});

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const icon = themeToggle.querySelector('i');

// Function to set theme
function setTheme(theme) {
    body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    if (theme === 'dark') {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    } else {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
}

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
});

// Check saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

// Loading screen
window.addEventListener('load', function() {
    setTimeout(function() {
        const loader = document.getElementById('loader');
        const mainContainer = document.getElementById('mainContainer');
        const notification = document.getElementById('notification');
        const homeLoader = document.querySelector('.home-loader');
        
        loader.classList.add('hidden');
        mainContainer.classList.add('show');
        
        // Show notification after page loads
        setTimeout(() => {
            notification.classList.add('show');
            
            // Ẩn thông báo sau 3 giây
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }, 1000);
    }, 800);
});