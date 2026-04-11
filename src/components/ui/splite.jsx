// src/components/ui/splite.jsx
import { Suspense, lazy } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))

/**
 * Lazy-loaded Spline 3D scene wrapper.
 *
 * Props:
 *   scene     — Spline scene URL (.splinecode)
 *   className — additional classes on the Spline canvas
 */
export function SplineScene({ scene, className }) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <span className="loader" />
        </div>
      }
    >
      <Spline
        scene={scene}
        className={className}
      />
    </Suspense>
  )
}
