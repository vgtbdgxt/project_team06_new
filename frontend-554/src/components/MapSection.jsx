import React, { useRef, useEffect } from 'react'
import '../css/map.css'

const MapSection = () => {
  const mapContainerRef = useRef(null)

  useEffect(() => {
    let isInitialized = false
    let cleanupFunctions = []
    
    const initMapApp = async () => {
      if (isInitialized) {
        console.log('Map already initialized, skipping...')
        return
      }
      
      console.log('Attempting to initialize map...')
      
      // 检查 Leaflet 是否加载
      if (typeof window === 'undefined' || !window.L) {
        console.warn('Leaflet not loaded yet, waiting...')
        return false
      }
      
      // 检查容器是否存在
      if (!mapContainerRef.current) {
        console.warn('Map container ref not available')
        return false
      }
      
      // 检查地图容器元素是否存在
      const mapElement = document.getElementById('map')
      if (!mapElement) {
        console.warn('Map element #map not found')
        return false
      }
      
      // 检查容器是否有尺寸
      const rect = mapElement.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) {
        console.warn('Map container has no size:', rect)
        return false
      }
      
      console.log('All checks passed, initializing map...', {
        containerSize: { width: rect.width, height: rect.height },
        leafletAvailable: !!window.L
      })
      
      try {
        // 动态导入地图初始化代码
        const { initMapApp: init } = await import('../js/main.js')
        init()
        isInitialized = true
        console.log('Map initialized successfully!')
        return true
      } catch (err) {
        console.error('Failed to load map:', err)
        return false
      }
    }
    
    // 尝试初始化的函数
    const tryInit = async () => {
      const success = await initMapApp()
      if (success) {
        // 清理所有定时器
        cleanupFunctions.forEach(cleanup => cleanup())
        cleanupFunctions = []
      }
      return success
    }
    
    // 立即尝试一次
    setTimeout(() => {
      tryInit()
    }, 100)
    
    // 定期重试
    let attempts = 0
    const maxAttempts = 100
    const retryTimer = setInterval(async () => {
      attempts++
      const success = await tryInit()
      if (success || attempts >= maxAttempts) {
        clearInterval(retryTimer)
      }
    }, 200)
    
    cleanupFunctions.push(() => clearInterval(retryTimer))
    
    // 使用 Intersection Observer 作为额外保障
    if (mapContainerRef.current && typeof window !== 'undefined' && window.IntersectionObserver) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            console.log('Map section is now visible, attempting initialization...')
            setTimeout(() => {
              tryInit()
            }, 100)
          }
        })
      }, {
        threshold: 0.1
      })
      
      observer.observe(mapContainerRef.current)
      cleanupFunctions.push(() => observer.disconnect())
    }
    
    // 清理函数
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup())
    }
  }, [])

  return (
    <div 
      ref={mapContainerRef}
      style={{ 
        width: '100%', 
        height: '800px',
        overflow: 'hidden',
        position: 'relative',
        boxSizing: 'border-box'
      }}
    >
      <div id="map-section-app" style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
          <header>
            <h1>Mental Health Clinic Accessibility Dashboard</h1>
          </header>
          <div id="sidebar">
            <button id="locate-me-btn">📍 Locate Me</button>
            
            <div className="filter-group">
              <h2>Maximum Distance</h2>
              <input type="range" id="max-distance" min="1" max="20" value="10" step="1" />
              <div className="small">
                <span id="max-distance-value">10</span> km
              </div>
            </div>

            <div className="filter-group">
              <h3>Clinic Type</h3>
              <div className="checkbox-list">
                <label><input type="checkbox" className="filter-type" value="hospital" /> Hospital</label>
                <label><input type="checkbox" className="filter-type" value="outpatient" /> Outpatient</label>
                <label><input type="checkbox" className="filter-type" value="specialized" /> Specialized</label>
                <label><input type="checkbox" className="filter-type" value="urgent_care" /> Urgent Care</label>
              </div>
            </div>

            <div className="filter-group">
              <h3>Specialty / Focus</h3>
              <div className="checkbox-list">
                <label><input type="checkbox" className="filter-focus" value="anxiety" /> Anxiety</label>
                <label><input type="checkbox" className="filter-focus" value="depression" /> Depression</label>
                <label><input type="checkbox" className="filter-focus" value="cbt" /> CBT</label>
                <label><input type="checkbox" className="filter-focus" value="trauma" /> Trauma</label>
                <label><input type="checkbox" className="filter-focus" value="medication" /> Medication</label>
                <label><input type="checkbox" className="filter-focus" value="family" /> Family / couples</label>
                <label><input type="checkbox" className="filter-focus" value="crisis" /> Crisis</label>
              </div>
            </div>

            <div className="filter-group">
              <h3>Accessibility</h3>
              <div className="checkbox-list">
                <label><input type="checkbox" id="filter-accepts-undiagnosed" /> Accepts undiagnosed</label>
                <label><input type="checkbox" id="filter-online" /> Online available</label>
                <label><input type="checkbox" id="filter-multilingual" /> Multilingual</label>
                <label><input type="checkbox" id="filter-no-guardian" /> No guardian required</label>
              </div>
            </div>
          </div>
          <div id="map"></div>
          <div id="details">
            <div id="no-selection-hint" className="muted">
              Click a clinic marker on the map to view details.
            </div>
            <div id="clinic-details" style={{ display: 'none' }}>
              <h2 id="clinic-name"></h2>
              <div id="clinic-meta"></div>
              
              <div className="detail-section">
                <div className="detail-section-title">Contact</div>
                <div id="clinic-contact" className="muted"></div>
              </div>

              <div className="detail-section">
                <div className="detail-section-title">Hours</div>
                <div id="clinic-hours" className="muted"></div>
              </div>

              <div className="detail-section">
                <div className="detail-section-title">Appointment</div>
                <div id="clinic-appointment" className="muted"></div>
              </div>

              <div className="detail-section">
                <div className="detail-section-title">Focus Areas</div>
                <div id="clinic-focus"></div>
              </div>

              <div className="detail-section">
                <div className="detail-section-title">Accessibility & Info</div>
                <div id="clinic-accessibility"></div>
              </div>

              <div className="detail-section">
                <div id="clinic-distance" className="muted"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default MapSection

