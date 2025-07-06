import GalleryList from '@/components/admin/gallery/GalleryList'
import React from 'react'

const GalleryPage = () => {
  return (
    <div className="w-full">
      {/* <GalleryHeader /> */}

      <div className="space-y-8">
        {/* <GalleryFilter /> */}

        <div className="w-full">
          <GalleryList />
        </div>
      </div>
    </div>
  )
}

export default GalleryPage