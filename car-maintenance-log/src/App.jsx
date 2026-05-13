import { useState, useEffect } from 'react'
import './App.css'

const MAINTENANCE_INTERVAL_MONTHS = 6
const MAINTENANCE_INTERVAL_KM = 10000

function App() {
  const [records, setRecords] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    date: '',
    project: '',
    mileage: ''
  })

  useEffect(() => {
    const savedRecords = localStorage.getItem('carMaintenanceRecords')
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('carMaintenanceRecords', JSON.stringify(records))
  }, [records])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.date || !formData.project || !formData.mileage) {
      alert('请填写完整信息')
      return
    }

    const newRecord = {
      id: Date.now(),
      date: formData.date,
      project: formData.project,
      mileage: parseInt(formData.mileage)
    }

    setRecords(prev => [newRecord, ...prev])
    setFormData({ date: '', project: '', mileage: '' })
    setIsModalOpen(false)
  }

  const deleteRecord = (id) => {
    if (window.confirm('确定要删除这条记录吗？')) {
      setRecords(prev => prev.filter(record => record.id !== id))
    }
  }

  const calculateNextMaintenance = () => {
    if (records.length === 0) return null

    const lastRecord = records[0]
    const lastDate = new Date(lastRecord.date)
    const lastMileage = lastRecord.mileage

    const nextDateByTime = new Date(lastDate)
    nextDateByTime.setMonth(nextDateByTime.getMonth() + MAINTENANCE_INTERVAL_MONTHS)

    const nextMileage = lastMileage + MAINTENANCE_INTERVAL_KM

    const today = new Date()
    const daysUntilNextMaintenance = Math.ceil((nextDateByTime - today) / (1000 * 60 * 60 * 24))

    return {
      nextDate: nextDateByTime.toISOString().split('T')[0],
      nextMileage,
      daysUntilNextMaintenance,
      isUrgent: daysUntilNextMaintenance <= 30
    }
  }

  const nextMaintenance = calculateNextMaintenance()

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => {
    setIsModalOpen(false)
    setFormData({ date: '', project: '', mileage: '' })
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="header-text">
            <h1>🚗 汽车保养记录</h1>
            <p>记录您的爱车保养历史，智能提醒下次保养时间</p>
          </div>
          <button className="add-btn-header" onClick={openModal}>
            ➕ 添加记录
          </button>
        </div>
      </header>

      {nextMaintenance && (
        <div className={`reminder ${nextMaintenance.isUrgent ? 'urgent' : ''}`}>
          <h3>📅 下次保养提醒</h3>
          <p>建议保养日期：<strong>{nextMaintenance.nextDate}</strong></p>
          <p>建议保养里程：<strong>{nextMaintenance.nextMileage.toLocaleString()} km</strong></p>
          {nextMaintenance.daysUntilNextMaintenance > 0 ? (
            <p className="countdown">距离下次保养还有 <span>{nextMaintenance.daysUntilNextMaintenance}</span> 天</p>
          ) : (
            <p className="overdue">⚠️ 已超过建议保养日期 {Math.abs(nextMaintenance.daysUntilNextMaintenance)} 天，请尽快保养！</p>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>➕ 添加保养记录</h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>保养日期</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>保养项目</label>
                <input
                  type="text"
                  name="project"
                  value={formData.project}
                  onChange={handleInputChange}
                  placeholder="例如：更换机油、更换滤芯..."
                />
              </div>
              <div className="form-group">
                <label>当前里程 (km)</label>
                <input
                  type="number"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleInputChange}
                  placeholder="请输入当前里程数"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={closeModal}>取消</button>
                <button type="submit" className="submit-btn">添加记录</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="records-container">
        <h2>📋 保养记录 ({records.length})</h2>
        {records.length === 0 ? (
          <div className="empty-state">
            <p>暂无保养记录</p>
            <p>添加第一条记录开始追踪您的爱车保养情况吧！</p>
          </div>
        ) : (
          <div className="records-list">
            {records.map((record, index) => (
              <div key={record.id} className="record-card">
                <div className="record-header">
                  <span className="record-number">#{records.length - index}</span>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteRecord(record.id)}
                  >
                    删除
                  </button>
                </div>
                <div className="record-content">
                  <div className="record-item">
                    <span className="label">📅 日期</span>
                    <span className="value">{record.date}</span>
                  </div>
                  <div className="record-item">
                    <span className="label">🔧 项目</span>
                    <span className="value">{record.project}</span>
                  </div>
                  <div className="record-item">
                    <span className="label">📍 里程</span>
                    <span className="value">{record.mileage.toLocaleString()} km</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="footer">
        <p>💡 提示：建议每6个月或每10000公里进行一次保养</p>
      </footer>
    </div>
  )
}

export default App
