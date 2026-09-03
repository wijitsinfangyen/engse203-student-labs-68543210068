import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { addRequest, deleteRequest, getRequests, resetRequests } from '../services/requestService.js';
import useManualReload from '../hooks/useManualReload.js';
import LoadingState from '../components/LoadingState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import FilterBar from '../components/FilterBar.jsx';
import RequestForm from '../components/RequestForm.jsx';
import RequestList from '../components/RequestList.jsx';
import SummaryPanel from '../components/SummaryPanel.jsx';

function DashboardPage() {
  const [searchParams] = useSearchParams();
  const scenario = searchParams.get('scenario');

  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [notice, setNotice] = useState('');
  const [reloadKey, reload] = useManualReload();

  useEffect(() => {
    let isCancelled = false;

    setStatus('loading');
    getRequests({ scenario: scenario ?? undefined })
      .then((data) => {
        if (isCancelled) return;
        setRequests(data);
        setStatus(data.length === 0 ? 'empty' : 'success');
      })
      .catch((error) => {
        if (isCancelled) return;
        setErrorMessage(error.message);
        setStatus('error');
      });

    return () => {
      isCancelled = true;
    };
  }, [scenario, reloadKey]);

  const summary = useMemo(() => ({
    total: requests.length,
    pending: requests.filter((request) => request.status === 'pending').length,
    inProgress: requests.filter((request) => request.status === 'in-progress').length,
    completed: requests.filter((request) => request.status === 'completed').length,
  }), [requests]);
  const filteredRequests = statusFilter === 'all' ? requests : requests.filter((request) => request.status === statusFilter);

    async function handleAdd(input) {
    await addRequest(input);
    reload();
  }

    async function handleDelete(requestId) {
    await deleteRequest(requestId);
    reload();
  }

  async function handleReset() {
    await resetRequests();
    reload();
  }

  return (
    <section data-testid="page-dashboard">
      <div className="page-heading"><div><p className="eyebrow dark">CP00 · WEEK04 REGRESSION</p><h1>Campus Service Request</h1><p>ตรวจ add, filter, delete และ validation ก่อน refactor</p></div></div>

      {status === 'loading' && <LoadingState />}

      {status === 'error' && <ErrorState message={errorMessage} onRetry={reload} />}

      {status === 'empty' && (
        <section className="state-card" data-testid="empty-state">
          <h2>ยังไม่มีคำร้อง</h2>
          <p>ไม่พบข้อมูลคำร้องในระบบตอนนี้</p>
          <button className="button primary" type="button" onClick={reload}>ลองอีกครั้ง</button>
        </section>
      )}

      {status === 'success' && (
        <>
          {notice && <p className="notice" role="status">{notice}</p>}
          <SummaryPanel summary={summary} />
          <div className="workspace-grid">
                      <section className="panel form-panel">
              <button className="button secondary" type="button" data-testid="reset-button" onClick={handleReset}>Reset Demo Data</button>
              <RequestForm onAddRequest={handleAdd} />
            </section>
            <section className="panel" aria-labelledby="request-list-title">
              <div className="section-heading"><h2 id="request-list-title">รายการคำร้อง</h2><FilterBar value={statusFilter} onFilterChange={setStatusFilter} /></div>
              <RequestList requests={filteredRequests} onDeleteRequest={handleDelete} />
            </section>
          </div>
        </>
      )}
    </section>
  );
}

export default DashboardPage;