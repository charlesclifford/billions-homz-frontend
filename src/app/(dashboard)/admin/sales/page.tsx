import SalesContent from '@/components/admin/sales/SalesContent'
import SalesHeader from '@/components/admin/sales/SalesHeader'
import React from 'react'

const SalesPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <SalesHeader />

      <SalesContent />
    </div>
  )
}

export default SalesPage