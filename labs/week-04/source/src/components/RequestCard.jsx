function RequestCard({ request, onDeleteRequest }) {
  const getStatusText = (status) => {
    if (status === 'pending') return 'รอดำเนินการ';
    if (status === 'in-progress') return 'กำลังดำเนินการ';
    if (status === 'completed') return 'เสร็จสิ้น';
    return status;
  };

  return (
    <article className={`request-card ${request.priority === 'urgent' ? 'urgent-card' : ''}`}>
      <div>
        <p className="request-id">
          {request.id}
          <span className={`badge status-${request.status}`}>{getStatusText(request.status)}</span>
        </p>
        <h3>{request.requestType}</h3>
        <p><strong>ชื่อผู้แจ้ง:</strong> {request.requesterName}</p>
        <p><strong>สถานที่:</strong> {request.location}</p>
        <p><strong>รายละเอียด:</strong> {request.details}</p>
        <p>
          <strong>ความเร่งด่วน:</strong>{' '}
          <span className={`priority-${request.priority}`}>
            {request.priority === 'urgent' ? '🚨 ด่วนที่สุด' : 'ปกติ'}
          </span>
        </p>
      </div>
      <button type="button" onClick={() => onDeleteRequest(request.id)}>ลบ</button>
    </article>
  );
}

export default RequestCard;

