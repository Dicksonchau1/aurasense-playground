// COCO 80-class labels
export const COCO_CLASSES = [
  'person','bicycle','car','motorcycle','airplane','bus','train','truck','boat',
  'traffic light','fire hydrant','stop sign','parking meter','bench','bird','cat',
  'dog','horse','sheep','cow','elephant','bear','zebra','giraffe','backpack',
  'umbrella','handbag','tie','suitcase','frisbee','skis','snowboard','sports ball',
  'kite','baseball bat','baseball glove','skateboard','surfboard','tennis racket',
  'bottle','wine glass','cup','fork','knife','spoon','bowl','banana','apple',
  'sandwich','orange','broccoli','carrot','hot dog','pizza','donut','cake','chair',
  'couch','potted plant','bed','dining table','toilet','tv','laptop','mouse',
  'remote','keyboard','cell phone','microwave','oven','toaster','sink',
  'refrigerator','book','clock','vase','scissors','teddy bear','hair drier',
  'toothbrush',
]

export interface BBox {
  x1: number; y1: number; x2: number; y2: number
  classId: number; className: string; confidence: number
}

const MODEL_INPUT = 640

// Dynamically imported to avoid SSR issues
let ortSession: unknown = null

export async function initYolo(): Promise<void> {
  if (ortSession) return
  const ort = await import('onnxruntime-web')
  ort.env.wasm.numThreads = 4
  ort.env.wasm.wasmPaths = '/_next/static/chunks/'
  ortSession = await ort.InferenceSession.create('/models/yolov8n.onnx', {
    executionProviders: ['webgpu', 'wasm'],
  })
}

export async function runYoloInference(
  source: HTMLVideoElement | HTMLCanvasElement,
  confThreshold = 0.4,
  iouThreshold = 0.45,
): Promise<BBox[]> {
  if (!ortSession) throw new Error('YOLO not initialized')
  const ort = await import('onnxruntime-web')

  // Pre-process: draw to 640×640 canvas and extract pixel data
  const canvas = document.createElement('canvas')
  canvas.width = MODEL_INPUT
  canvas.height = MODEL_INPUT
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(source, 0, 0, MODEL_INPUT, MODEL_INPUT)
  const imageData = ctx.getImageData(0, 0, MODEL_INPUT, MODEL_INPUT)

  // Build [1, 3, 640, 640] float32 tensor (RGB, normalised 0-1)
  const input = new Float32Array(3 * MODEL_INPUT * MODEL_INPUT)
  for (let i = 0; i < MODEL_INPUT * MODEL_INPUT; i++) {
    input[i] = imageData.data[i * 4] / 255                       // R
    input[i + MODEL_INPUT * MODEL_INPUT] = imageData.data[i * 4 + 1] / 255  // G
    input[i + 2 * MODEL_INPUT * MODEL_INPUT] = imageData.data[i * 4 + 2] / 255 // B
  }
  const tensor = new ort.Tensor('float32', input, [1, 3, MODEL_INPUT, MODEL_INPUT])
  const feeds: Record<string, unknown> = { images: tensor }
  const results = await (ortSession as { run: (f: Record<string, unknown>) => Promise<Record<string, { data: Float32Array; dims: number[] }>> }).run(feeds)

  // YOLOv8 output: [1, 84, 8400] — cx, cy, w, h, class0..79
  const output = results['output0']
  const data = output.data
  const [, numAttrs, numBoxes] = output.dims  // [1, 84, 8400]

  const srcW = source instanceof HTMLVideoElement ? source.videoWidth : source.width
  const srcH = source instanceof HTMLVideoElement ? source.videoHeight : source.height
  const scaleX = srcW / MODEL_INPUT
  const scaleY = srcH / MODEL_INPUT

  const rawBoxes: BBox[] = []
  for (let i = 0; i < numBoxes; i++) {
    const cx = data[0 * numBoxes + i]
    const cy = data[1 * numBoxes + i]
    const w = data[2 * numBoxes + i]
    const h = data[3 * numBoxes + i]

    let maxConf = 0; let classId = 0
    for (let c = 0; c < 80; c++) {
      const conf = data[(4 + c) * numBoxes + i]
      if (conf > maxConf) { maxConf = conf; classId = c }
    }
    if (maxConf < confThreshold) continue

    rawBoxes.push({
      x1: (cx - w / 2) * scaleX,
      y1: (cy - h / 2) * scaleY,
      x2: (cx + w / 2) * scaleX,
      y2: (cy + h / 2) * scaleY,
      classId, className: COCO_CLASSES[classId] ?? 'unknown', confidence: maxConf,
    })
  }

  return nms(rawBoxes, iouThreshold)
}

function iou(a: BBox, b: BBox): number {
  const ix1 = Math.max(a.x1, b.x1), iy1 = Math.max(a.y1, b.y1)
  const ix2 = Math.min(a.x2, b.x2), iy2 = Math.min(a.y2, b.y2)
  const inter = Math.max(0, ix2 - ix1) * Math.max(0, iy2 - iy1)
  const aA = (a.x2 - a.x1) * (a.y2 - a.y1)
  const bA = (b.x2 - b.x1) * (b.y2 - b.y1)
  return inter / (aA + bA - inter + 1e-6)
}

function nms(boxes: BBox[], threshold: number): BBox[] {
  boxes.sort((a, b) => b.confidence - a.confidence)
  const keep: BBox[] = []
  const suppressed = new Uint8Array(boxes.length)
  for (let i = 0; i < boxes.length; i++) {
    if (suppressed[i]) continue
    keep.push(boxes[i])
    for (let j = i + 1; j < boxes.length; j++) {
      if (boxes[i].classId === boxes[j].classId && iou(boxes[i], boxes[j]) > threshold) {
        suppressed[j] = 1
      }
    }
  }
  return keep
}
