import { useNavigate } from 'react-router-dom';
import { addRequest } from '../services/requestService.js';
import RequestForm from '../components/RequestForm.jsx';

function NewRequestPage() {
  const navigate = useNavigate();

  async function handleAdd(input) {
    const newRequest = await addRequest(input);
    navigate(`/requests/${newRequest.id}`);
  }

  return (
    <section data-testid="page-new-request">
      <div className="page-heading"><div><p className="eyebrow dark">CONTROLLED FORM</p><h1>สร้างคำร้องใหม่</h1><p>ตรวจข้อมูลก่อนบันทึก ทุกคำร้องใหม่เริ่มต้นที่ pending</p></div></div>
      <section className="panel form-panel"><RequestForm onAddRequest={handleAdd} /></section>
    </section>
  );
}

export default NewRequestPage;