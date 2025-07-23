export const GRID_SIZE = 10
export const MAJOR_GRID_SIZE = 100

export const FURNITURE_SIZES = {
  base_cabinet: {
    small: { width: 40, depth: 60, height: 85 },
    medium: { width: 60, depth: 60, height: 85 },
    large: { width: 80, depth: 60, height: 85 }
  },
  wall_cabinet: {
    small: { width: 40, depth: 35, height: 70 },
    medium: { width: 60, depth: 35, height: 70 },
    large: { width: 80, depth: 35, height: 70 }
  },
  tall_cabinet: {
    small: { width: 40, depth: 60, height: 200 },
    medium: { width: 60, depth: 60, height: 200 },
    large: { width: 80, depth: 60, height: 200 }
  }
}

export const CANVAS_SETTINGS = {
  minZoom: 0.5,
  maxZoom: 2,
  zoomSpeed: 0.1
}