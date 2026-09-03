const STATUS_LABELS = {
  pending: 'รอดำเนินการ',
  'in-progress': 'กำลังดำเนินการ',
  completed: 'เสร็จสิ้น',
};

function StatusBadge({ status }) {
  const label = STATUS_LABELS[status];

  if (!label) {
    return <span className="status-unknown">ไม่ทราบสถานะ</span>;
  }

  return <span className={`badge ${status}`}>{label}</span>;
}

export default StatusBadge;