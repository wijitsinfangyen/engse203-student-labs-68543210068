import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRequestById } from '../services/requestService.js';
import LoadingState from '../components/LoadingState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import useManualReload from '../hooks/useManualReload.js';

function RequestDetailPage() {
  const { requestId } = useParams();
  const [request, setRequest] = useState(null);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [reloadKey, reload] = useManualReload();

  useEffect(() => {
    let isCancelled = false;

    setStatus('loading');
    getRequestById(requestId)
      .then((result) => {
        if (isCancelled) return;
        setRequest(result);
        setStatus(result ? 'found' : 'not-found');
      })
      .catch((error) => {
        if (isCancelled) return;
        setErrorMessage(error.message);
        setStatus('error');
      });

    return () => {
      isCancelled = true;
    };
  }, [requestId, reloadKey]);

  return (
    <section data-testid="page-request-detail">
      <div className="page-heading"><div><p className="eyebrow dark">REQUEST DETAIL</p><h1>รายละเอียดคำร้อง</h1><p>อ่านรหัสจาก URL แล้วโหลดผ่าน Service · แยกกรณีพบและไม่พบให้ชัด</p></div></div>

      {status === 'loading' && <LoadingState />}

      {status === 'error' && <ErrorState message={errorMessage} onRetry={reload} />}

      {status === 'not-found' && (
        <section className="state-card" data-testid="request-not-found">
          <h2>ไม่พบคำร้อง</h2>
          <p>ไม่พบคำร้องรหัส {requestId} ในระบบ</p>
        </section>
      )}

      {status === 'found' && request && (
        <article className="panel detail-card" data-testid="request-found">
          <dl>
  <div><dt>รหัส</dt><dd>{request.id}</dd></div>
  <div><dt>ผู้แจ้ง</dt><dd>{request.requesterName}</dd></div>
  <div><dt>ประเภทคำร้อง</dt><dd>{request.requestType}</dd></div>
  <div><dt>สถานที่</dt><dd>{request.location}</dd></div>
  <div><dt>รายละเอียด</dt><dd>{request.details}</dd></div>
  <div><dt>ความเร่งด่วน</dt><dd>{request.priority}</dd></div>
  <div><dt>สถานะ</dt><dd>{request.status}</dd></div>
</dl>
        </article>
      )}
    </section>
  );
}

export default RequestDetailPage;