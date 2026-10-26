export type GenerationMode = 'image' | 'video' | 'animation';

export type ResolutionOption = '1080p' | '2K' | '4K' | '8K' | '16K';

export type AspectRatioOption = '16:9' | '2.39:1' | '1:1' | '9:16' | '4:3' | '21:9';

export type RenderEngine =
  | 'aetheris-flow-dit'
  | 'aetheris-cinematix-8k'
  | 'aetheris-temporal-video'
  | 'aetheris-micro-macro';

export type CameraBody =
  | 'ARRI Alexa 65'
  | 'RED V-Raptor 8K VV'
  | 'IMAX 70mm MKIV'
  | 'Hasselblad H6D-100c'
  | 'Sony Venice 2 CineAlta';

export type LensType =
  | 'Cooke Anamorphic /i 35mm T2.3'
  | 'Leica Summilux-C 50mm T1.4'
  | 'Zeiss Master Prime 85mm T1.3'
  | 'Canon MP-E 65mm 1-5x Macro'
  | 'Angénieux Optimo Ultra 12x Zoom';

export type CameraMovement =
  | 'static'
  | 'dolly_in'
  | 'dolly_out'
  | 'crane_up'
  | 'orbit_360'
  | 'fpv_drone'
  | 'tracking_follow'
  | 'handheld_sway'
  | 'hitchcock_vertigo';

export interface CameraOpticsConfig {
  body: CameraBody;
  lens: LensType;
  focalLengthMm: number;
  aperture: string; // e.g., 'f/1.4'
  shutterAngle: string; // e.g., '180°'
  iso: number;
  depthOfField: number; // 0 to 1
  bokehStyle: 'circular' | 'anamorphic_oval' | 'cat_eye' | 'swirly';
  chromaticAberration: number; // 0 to 1
  lensDistortion: number;
  filmGrain: number;
}

export interface LightingAtmosphereConfig {
  preset: string;
  globalIllumination: boolean;
  volumetricFog: number; // 0 to 1
  hdrIntensity: number;
  colorTemperatureK: number; // e.g., 5600 for daylight, 3200 for tungsten
  raytracedReflections: boolean;
  subsurfaceScattering: number; // 0 to 1
}

export interface MaterialDetailsConfig {
  microPoreSkin: boolean;
  individualHairStrands: boolean;
  fabricWeaveDetails: boolean;
  metalMicroScratches: boolean;
  waterCausticsIOR: number;
  subsurfaceDermalDepth: number;
}

export interface MotionPhysicsConfig {
  cameraPath: CameraMovement;
  durationSeconds: number; // 2, 6, 10, 15
  fps: number; // 24, 30, 60
  motionIntensity: number; // 0.1 to 2.0
  cameraSpeedEasing: 'linear' | 'ease_in_out' | 'exponential' | 'slowmo_ramp';
  hairClothPhysics: boolean;
  fluidSmokeParticles: boolean;
  identityPreservationWeight: number; // 0.0 to 1.0 (anti-drift)
}

export interface MotionBrushRegion {
  id: string;
  name: string;
  type: 'hair' | 'water' | 'smoke' | 'cloth' | 'particles';
  color: string;
  velocity: number;
  directionDeg: number;
  turbulence: number;
}

export interface TechnicalDirectives {
  cameraBody: string;
  lens: string;
  aperture: string;
  shutterAngle: string;
  lighting: string;
  materials: string;
  colorGrading: string;
}

export interface MotionDirectives {
  cameraTrajectory: string;
  motionSpeed: number;
  physicsSimulation: string;
  temporalConsistencyScore: number;
}

export interface AestheticScores {
  predictedPhotorealism: number; // 0 to 10
  textureMicroDetail: number;
  lightingCoherence: number;
  compositionRating: number;
  temporalStability?: number; // 0 to 100%
  anatomyIntegrity?: number;
}

export interface EnhancedPromptResponse {
  enhancedPromptEn: string;
  enhancedPromptFa: string;
  negativePrompt: string;
  technicalSpecs: TechnicalDirectives;
  motionSpecs: MotionDirectives;
  aestheticScores: AestheticScores;
  variations: string[];
}

export interface RenderPasses {
  compositeUrl: string;
  depthMapUrl?: string;
  normalMapUrl?: string;
  volumetricPassUrl?: string;
}

export interface GeneratedMediaItem {
  id: string;
  title: string;
  promptEn: string;
  promptFa: string;
  negativePrompt: string;
  mode: GenerationMode;
  engine: RenderEngine;
  resolution: ResolutionOption;
  aspectRatio: AspectRatioOption;
  cameraConfig: CameraOpticsConfig;
  lightingConfig: LightingAtmosphereConfig;
  materialConfig: MaterialDetailsConfig;
  motionConfig: MotionPhysicsConfig;
  passes: RenderPasses;
  aestheticScore: AestheticScores;
  seed: number;
  steps: number;
  cfgScale: number;
  renderTimeSec: number;
  createdAt: string;
  isFavorite?: boolean;
  upscaled8K?: boolean;
  status?: 'draft' | 'published' | 'scheduled';
  scheduledDate?: string; // ISO string or YYYY-MM-DDTHH:mm
  scheduledPlatform?: 'instagram' | 'x' | 'linkedin' | 'youtube' | 'tiktok' | 'telegram' | 'general';
  socialCaption?: string;
  scheduledNotes?: string;
}

export interface EngineBenchmark {
  metric: string;
  aetheris: string;
  midjourneyV6: string;
  klingAI: string;
  lumaDream: string;
  advantage: string;
}

export interface ArchitectureModule {
  id: string;
  titleEn: string;
  titleFa: string;
  category: 'core' | 'motion' | 'render' | 'quality' | 'prompt' | 'interface';
  icon: string;
  headline: string;
  technicalSummary: string;
  hardwareRequirements: string;
  keyInnovations: string[];
  stackComponents: string[];
  latencyBenchmark: string;
}
