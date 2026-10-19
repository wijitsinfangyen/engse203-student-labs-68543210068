import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  // DOM References
  const form = document.getElementById('request-form');
  const nameInput = document.getElementById('requester-name');
  const typeSelect = document.getElementById('request-type');
  const detailsTextarea = document.getElementById('request-details');

  const nameError = document.getElementById('name-error');
  const typeError = document.getElementById('type-error');
  const detailsError = document.getElementById('details-error');
  const formStatus = document.getElementById('form-status');
  const charCount = document.getElementById('char-count');

  const previewName = document.getElementById('preview-name');
  const previewType = document.getElementById('preview-type');
  const previewDetails = document.getElementById('preview-details');
  const requestList = document.getElementById('request-list');
  const resetBtn = document.getElementById('reset-btn');

  // Default Preview Text
  const DEFAULT_NAME = 'ยังไม่ระบุชื่อ';
  const DEFAULT_TYPE = 'ยังไม่เลือกประเภท';
  const DEFAULT_DETAILS = 'ยังไม่มีรายละเอียด';

  // 1. Live Preview Event Listeners (ใช้ textContent ป้องกัน XSS)
  nameInput.addEventListener('input', (e) => {
    const value = e.target.value.trim();
    previewName.textContent = value.length > 0 ? value : DEFAULT_NAME;
  });

  typeSelect.addEventListener('change', (e) => {
    const value = e.target.value;
    previewType.textContent = value ? value : DEFAULT_TYPE;
  });

  detailsTextarea.addEventListener('input', (e) => {
    const value = e.target.value;
    previewDetails.textContent = value.trim().length > 0 ? value : DEFAULT_DETAILS;
    charCount.textContent = `${value.length} ตัวอักษร`;
  });

  // 2. Clear Errors Function
  function clearErrors() {
    nameError.textContent = '';
    typeError.textContent = '';
    detailsError.textContent = '';
    formStatus.textContent = '';
    formStatus.className = 'status';

    nameInput.classList.remove('is-invalid');
    typeSelect.classList.remove('is-invalid');
    detailsTextarea.classList.remove('is-invalid');
  }

  // 3. Form Validation Logic
  function validateForm() {
    clearErrors();
    let isValid = true;

    // Validate Name (อย่างน้อย 2 ตัวอักษร)
    const nameVal = nameInput.value.trim();
    if (nameVal.length < 2) {
      nameError.textContent = 'กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร';
      nameInput.classList.add('is-invalid');
      isValid = false;
    }

    // Validate Type Selection
    if (!typeSelect.value) {
      typeError.textContent = 'กรุณาเลือกประเภทบริการ';
      typeSelect.classList.add('is-invalid');
      isValid = false;
    }

    // Validate Details (อย่างน้อย 10 ตัวอักษร)
    const detailsVal = detailsTextarea.value.trim();
    if (detailsVal.length < 10) {
      detailsError.textContent = 'กรุณาเขียนรายละเอียดอย่างน้อย 10 ตัวอักษร';
      detailsTextarea.classList.add('is-invalid');
      isValid = false;
    }

    return isValid;
  }

  // 4. Form Submit Handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm()) {
      formStatus.textContent = 'ยังบันทึกไม่ได้ กรุณาตรวจสอบข้อมูล';
      formStatus.className = 'status error';
      return; // ถ้าไม่ผ่าน: ไม่เพิ่มรายการ และไม่ reset ฟอร์ม
    }

    // กรณีผ่าน (Valid): เพิ่มรายการลง Submitted Requests
    const li = document.createElement('li');
    li.className = 'request-item';

    const headerDiv = document.createElement('div');
    headerDiv.className = 'request-item-header';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'request-item-name';
    nameSpan.textContent = nameInput.value.trim();

    const typeSpan = document.createElement('span');
    typeSpan.className = 'request-item-type';
    typeSpan.textContent = typeSelect.value;

    const detailsP = document.createElement('p');
    detailsP.className = 'request-item-details';
    detailsP.textContent = detailsTextarea.value.trim();

    headerDiv.appendChild(nameSpan);
    headerDiv.appendChild(typeSpan);
    li.appendChild(headerDiv);
    li.appendChild(detailsP);

    requestList.appendChild(li);

    // แสดงข้อความ Success และเคลียร์ฟอร์ม
    formStatus.textContent = 'บันทึกคำร้องเรียบร้อยแล้ว!';
    formStatus.className = 'status success';

    form.reset();
    resetPreview();
  });

  // 5. Reset Preview Helper
  function resetPreview() {
    previewName.textContent = DEFAULT_NAME;
    previewType.textContent = DEFAULT_TYPE;
    previewDetails.textContent = DEFAULT_DETAILS;
    charCount.textContent = '0 ตัวอักษร';
  }

  resetBtn.addEventListener('click', () => {
    clearErrors();
    resetPreview();
  });
});