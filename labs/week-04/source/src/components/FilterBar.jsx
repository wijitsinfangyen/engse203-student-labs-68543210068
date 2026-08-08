
export default function FilterBar({ currentFilter, onFilterChange }) {
  const filters = [
    { key: 'all', label: 'ทั้งหมด' },
    { key: 'pending', label: 'รอดำเนินการ' },
    { key: 'in-progress', label: 'กำลังดำเนินการ' },
    { key: 'completed', label: 'เสร็จสิ้น' }
  ];

  return (
    <div className="filter-bar">
      <span className="filter-label">กรองตามสถานะ: </span>
      <div className="filter-buttons">
        {filters.map(f => (
          <button
            key={f.key}
            type="button"
            className={`btn-filter ${currentFilter === f.key ? 'active' : ''}`}
            onClick={() => onFilterChange(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const filters = [
  ['all', 'ทั้งหมด'],
  ['todo', 'ต้องทำ'],
  ['doing', 'กำลังทำ'],
  ['done', 'เสร็จแล้ว'],
];

function FilterBar({ value, onFilterChange }) {
  return (
    <div className="filter-bar" role="group" aria-label="กรองสถานะงาน">
      {filters.map(([filterValue, label]) => (
        <button
          className={value === filterValue ? 'filter-active' : 'filter-button'}
          key={filterValue}
          type="button"
          onClick={() => onFilterChange(filterValue)}
          aria-pressed={value === filterValue}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;

