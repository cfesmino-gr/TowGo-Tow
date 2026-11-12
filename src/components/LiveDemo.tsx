import { useState } from 'react'
import { useI18n } from '../i18n'
import type { DispatchRequest } from '../types'
import { CustomerApp } from './CustomerApp'
import { DriverApp } from './DriverApp'

type AppView = 'customer' | 'driver'

export function LiveDemo() {
  const { t } = useI18n()
  const [app, setApp] = useState<AppView>('customer')
  const [request, setRequest] = useState<DispatchRequest>({
    truck: 'Flatbed',
    accident: false,
    note: '',
    earn: 72,
  })

  return (
    <div className="demo-section" id="demo">
      <div className="demo-inner">
        <div className="demo-text">
          <div className="demo-label">{t.demo_label}</div>
          <div className="demo-title" dangerouslySetInnerHTML={{ __html: t.demo_title }} />
          <p className="demo-desc">{t.demo_desc}</p>
          <div className="demo-toggle">
            <button
              type="button"
              className={`demo-tog-btn${app === 'customer' ? ' active' : ''}`}
              onClick={() => setApp('customer')}
            >
              {t.demo_tog_cust}
            </button>
            <button
              type="button"
              className={`demo-tog-btn${app === 'driver' ? ' active' : ''}`}
              onClick={() => setApp('driver')}
            >
              {t.demo_tog_drv}
            </button>
          </div>
          <div className="demo-features">
            <div className="demo-feat">
              <i className="ti ti-map-pin" /> <span>{t.demo_f1}</span>
            </div>
            <div className="demo-feat">
              <i className="ti ti-camera" /> <span>{t.demo_f2}</span>
            </div>
            <div className="demo-feat">
              <i className="ti ti-message-circle" /> <span>{t.demo_f3}</span>
            </div>
            <div className="demo-feat">
              <i className="ti ti-building" /> <span>{t.demo_f4}</span>
            </div>
          </div>
        </div>
        <div className="demo-phone">
          <div className="phone-frame">
            <div className="phone-screen" id="phone-screen">
              <div
                id="app-customer"
                style={{
                  display: app === 'customer' ? 'flex' : 'none',
                  flexDirection: 'column',
                  minHeight: 620,
                }}
              >
                <CustomerApp onRequest={setRequest} />
              </div>
              <div
                id="app-driver"
                style={{
                  display: app === 'driver' ? 'flex' : 'none',
                  flexDirection: 'column',
                  minHeight: 620,
                }}
              >
                <DriverApp request={request} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
