'use client'

import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

 interface Hero3DViewerProps {
   scrollProgress?: number
 }

 export default function Hero3DViewer({ scrollProgress = 0 }: Hero3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const modelRef = useRef<THREE.Group | null>(null)
  const mountedRef = useRef(false)

  // Interaction state
  const MIN_ZOOM = 0.6
  const MAX_ZOOM = 2.5
  const isDraggingRef = useRef(false)
  const previousMouseRef = useRef({ x: 0, y: 0 })
  const rotationRef = useRef({ x: 0, y: 0 })
  const targetRotationRef = useRef({ x: 0, y: 0 })
  const zoomRef = useRef(MIN_ZOOM)
  const targetZoomRef = useRef(MIN_ZOOM)
  const initialCameraZRef = useRef(5)

   // Update zoom and rotation based on scroll progress
   useEffect(() => {
     if (scrollProgress > 0) {
       // Map scroll progress (0-1) to zoom (MIN_ZOOM to MAX_ZOOM)
       const newZoom = MIN_ZOOM + (scrollProgress * (MAX_ZOOM - MIN_ZOOM))
       targetZoomRef.current = newZoom
       
       // Also add rotation based on scroll
       targetRotationRef.current.y = scrollProgress * Math.PI * 2 // Full rotation
     }
   }, [scrollProgress])


  useEffect(() => {
    if (!containerRef.current || mountedRef.current) return
    mountedRef.current = true

    // Clear any existing canvas elements
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild)
    }

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = null // Transparent to show gradient
    sceneRef.current = scene

    // Camera setup
    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.set(0, 0, 5)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setClearColor(0x000000, 0) // Transparent background
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.outputColorSpace = THREE.SRGBColorSpace // Ensure proper color space for textures
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    const backLight = new THREE.DirectionalLight(0xffffff, 0.4)
    backLight.position.set(-5, -5, -5)
    scene.add(backLight)

    // Add a subtle grid helper for debugging (optional - can be removed)
    // const gridHelper = new THREE.GridHelper(10, 10, 0xcccccc, 0xeeeeee)
    // scene.add(gridHelper)

    // Loading Manager for better error handling
    const loadingManager = new THREE.LoadingManager()

    loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
      console.log(`Started loading: ${url}`)
    }

    loadingManager.onLoad = () => {
      console.log('All assets loaded successfully')
    }

    loadingManager.onError = (url) => {
      console.error(`Error loading: ${url}`)
    }

    // Load GLTF model
    const loader = new GLTFLoader(loadingManager)

    // Set the resource path for the loader to resolve relative paths correctly
    loader.setPath('/images/')

    loader.load(
      'scene.gltf', // Now relative to the path set above
      (gltf) => {
        const model = gltf.scene
        modelRef.current = model

        // Get bounding box
        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())

        // Log model info for debugging
        console.log('Model loaded - Size:', size, 'Center:', center)

        // Calculate scale to fit the model nicely in viewport
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 4 / maxDim // Scale to fit nicely
        model.scale.set(scale, scale, scale)

        // After scaling, recalculate the bounding box
        box.setFromObject(model)
        const scaledCenter = box.getCenter(new THREE.Vector3())

        // Position model so it's centered in view (x and z) 
        // but slightly lower to account for visual centering
        model.position.x = -scaledCenter.x
        model.position.y = -scaledCenter.y - size.y * scale * 0.1 // Lower it by 10% of height
        model.position.z = -scaledCenter.z

        scene.add(model)

        // Ensure all materials are visible and properly configured
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // Enable shadows if needed
            child.castShadow = true
            child.receiveShadow = true

            // Ensure materials are visible
            if (child.material) {
              child.material.needsUpdate = true
              // Fix potential material issues
              if (Array.isArray(child.material)) {
                child.material.forEach(mat => {
                  mat.needsUpdate = true
                })
              }
            }
          }
        })

        // Position camera to view the model properly
        const fov = camera.fov * (Math.PI / 180)
        let cameraZ = Math.abs((size.y * scale) / Math.tan(fov / 2))
        cameraZ *= 1.2 // Add padding
        camera.position.set(0, 0, cameraZ)
        camera.lookAt(0, 0, 0)
        initialCameraZRef.current = cameraZ

        console.log('3D T-shirt model loaded successfully, Camera Z:', cameraZ)
      },
      (progress) => {
        // Log loading progress
        if (progress.lengthComputable) {
          const percentComplete = (progress.loaded / progress.total) * 100
          console.log(`Loading model: ${percentComplete.toFixed(2)}%`)
        }
      },
      (error) => {
        console.error('Error loading 3D model:', error)
      }
    )

    // Drag to rotate
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true
      previousMouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return

      const deltaX = e.clientX - previousMouseRef.current.x
      const deltaY = e.clientY - previousMouseRef.current.y

      targetRotationRef.current.y += deltaX * 0.005
      targetRotationRef.current.x += deltaY * 0.005

      // Limit vertical rotation to avoid flipping
      targetRotationRef.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRotationRef.current.x))

      previousMouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseUp = () => {
      isDraggingRef.current = false
    }

    // Scroll to zoom and rotate (reversed: scroll down = zoom in, scroll up = zoom out)
    const handleWheel = (_e: WheelEvent) => {
      // Disable custom wheel handling to avoid trapping scroll
      return
    }

    // Touch support for mobile
    let touchStartX = 0
    let touchStartY = 0

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true
        touchStartX = e.touches[0].clientX
        touchStartY = e.touches[0].clientY
        previousMouseRef.current = { x: touchStartX, y: touchStartY }
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return

      const deltaX = e.touches[0].clientX - previousMouseRef.current.x
      const deltaY = e.touches[0].clientY - previousMouseRef.current.y

      targetRotationRef.current.y += deltaX * 0.005
      targetRotationRef.current.x += deltaY * 0.005

      targetRotationRef.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRotationRef.current.x))

      previousMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }

    const handleTouchEnd = () => {
      isDraggingRef.current = false
    }

    // Add event listeners
    const canvas = renderer.domElement
    canvas.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    canvas.addEventListener('wheel', handleWheel, { passive: true })
    canvas.addEventListener('touchstart', handleTouchStart)
    canvas.addEventListener('touchmove', handleTouchMove)
    canvas.addEventListener('touchend', handleTouchEnd)

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return
      const newWidth = containerRef.current.clientWidth
      const newHeight = containerRef.current.clientHeight
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener('resize', handleResize)

    // Animation loop
    let animationId: number
    const animate = () => {
      animationId = requestAnimationFrame(animate)

      if (modelRef.current) {
        // Smooth rotation interpolation
        rotationRef.current.x += (targetRotationRef.current.x - rotationRef.current.x) * 0.1
        rotationRef.current.y += (targetRotationRef.current.y - rotationRef.current.y) * 0.1

        modelRef.current.rotation.x = rotationRef.current.x
        modelRef.current.rotation.y = rotationRef.current.y
      }

      // Smooth zoom interpolation
      if (cameraRef.current) {
        zoomRef.current += (targetZoomRef.current - zoomRef.current) * 0.1
        cameraRef.current.position.z = initialCameraZRef.current / zoomRef.current
      }

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      mountedRef.current = false
      canvas.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      canvas.removeEventListener('wheel', handleWheel)
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)

      // Proper cleanup
      if (rendererRef.current) {
        rendererRef.current.dispose()
        if (containerRef.current && rendererRef.current.domElement.parentNode === containerRef.current) {
          containerRef.current.removeChild(rendererRef.current.domElement)
        }
      }

      // Clean up model
      if (modelRef.current) {
        modelRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry?.dispose()
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(mat => mat.dispose())
              } else {
                child.material.dispose()
              }
            }
          }
        })
      }

      // Clean up scene
      if (sceneRef.current) {
        sceneRef.current.clear()
      }
    }
  }, [])

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background Layer (z-0) - Plain black */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#DCDCDC]" />
      </div>

      {/* T-shirt Model Layer (z-10) */}
      <div ref={containerRef} className="relative w-full h-full z-10 cursor-grab active:cursor-grabbing" />
    </div>
  )
}
