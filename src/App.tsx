import { useState, useEffect } from 'react'
import { Lock, Unlock, AlertCircle } from 'lucide-react'

function App() {
  const [isLocked, setIsLocked] = useState<boolean | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const checkStatus = async () => {
    setError('')
    try {
      const res = await fetch('/api/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setIsLocked(data.isLocked)
      } else {
        setError(data.error || 'فشل في التحقق')
      }
    } catch (err: any) {
      setError('لا يمكن الاتصال بالخادم')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  const toggleLock = async () => {
    if (isLocked === null) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/toggle-lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isLocked: !isLocked })
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setIsLocked(data.isLocked)
      } else {
        setError(data.error || 'فشل في تغيير الحالة')
      }
    } catch (err: any) {
      setError('لا يمكن الاتصال بالخادم')
    } finally {
      setLoading(false)
    }
  }

  if (loading && isLocked === null) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">جاري التحميل...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <Lock size={20} />
            </div>
            <h1 className="text-xl font-bold text-gray-900">لوحة تحكم المزود</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">حالة النظام الحالي</h2>
          <p className="text-gray-500 mb-8">يمكنك قفل النظام عن بُعد لإيقاف التطبيق مؤقتاً في الصيدلية</p>

          <div className="flex flex-col items-center justify-center py-8">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 transition-colors ${
              isLocked ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
            }`}>
              {isLocked ? <Lock size={64} /> : <Unlock size={64} />}
            </div>
            
            <h3 className={`text-3xl font-black mb-2 ${isLocked ? 'text-red-600' : 'text-emerald-600'}`}>
              {isLocked ? 'النظام مقفول' : 'النظام يعمل بشكل طبيعي'}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-12">
              {isLocked 
                ? 'لا يمكن لأي مستخدم (بما في ذلك مدير الصيدلية) الدخول إلى النظام حالياً. التطبيق معطل تماماً.'
                : 'التطبيق متاح للعمل بشكل كامل لجميع المستخدمين والصلاحيات داخل الصيدلية.'}
            </p>

            {error && (
              <div className="flex items-center justify-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm mb-6 w-full max-w-md">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={toggleLock}
              disabled={loading}
              className={`px-8 py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-3 ${
                isLocked 
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' 
                  : 'bg-red-600 hover:bg-red-700 shadow-red-200'
              }`}
            >
              {loading ? (
                <span>جاري التنفيذ...</span>
              ) : isLocked ? (
                <>
                  <Unlock size={24} />
                  <span>فتح النظام وإعادة تفعيله</span>
                </>
              ) : (
                <>
                  <Lock size={24} />
                  <span>قفل النظام وإيقاف التطبيق</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
