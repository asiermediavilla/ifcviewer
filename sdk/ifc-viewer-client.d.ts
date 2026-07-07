/** Supported viewer-owned GUI languages. */
export type ViewerLanguage = "en" | "es" | "eu" | "fr";

/** Built-in appearance mode; `system` follows the browser preference. */
export type ViewerTheme = "default" | "light" | "dark" | "green" | "tecnalia" | "system";

/** Presentation-only appearance settings accepted by the iframe. */
export interface ViewerAppearanceConfig {
  theme?: ViewerTheme;
  customStylesheetUrl?: string;
  tokens?: Record<string, string>;
}

/** Effective appearance returned by the iframe. */
export interface AppliedViewerAppearance {
  requestedTheme: ViewerTheme;
  resolvedTheme: "default" | "light" | "dark" | "green" | "tecnalia";
  customStylesheetUrl?: string;
  tokens: Record<string, string>;
}

/** Stable serialisable reference to one IFC element in one loaded model. */
export interface IfcElementRef {
  modelId: string;
  localId: number;
  globalId?: string | null;
  category?: string;
  name?: string;
  predefinedType?: string;
}

/** Compact operation payload grouping several local ids under one model. */
export interface IfcElementIdGroup {
  modelId: string;
  localIds: number[];
}

/** Controls how a visibility operation expands its target references. */
export interface VisibilityOperationOptions {
  /** When true or omitted, spatial descendants are included recursively. */
  cascade?: boolean;
}

/** One inspector row returned by getProperties(). */
export interface IfcPropertyRow {
  name: string;
  value: unknown;
  type?: string;
  source?: string;
  depth?: number;
  hierarchyPath?: string[];
}

/** Named group of occurrence/type properties, materials or relations. */
export interface IfcPropertyGroup {
  name: string;
  rows: IfcPropertyRow[];
  scope?: "instance" | "type";
}

/** Loaded model summary returned by listModels(). */
export interface ViewerModelInfo {
  modelId: string;
  fileName?: string;
  elementCount: number;
  categories: Array<{
    modelId: string;
    category: string;
    count: number;
    sampleItems: IfcElementRef[];
  }>;
  cacheKey?: string;
}

/** Host-controlled interaction permissions. */
export interface ViewerCapabilities {
  selection: boolean;
  hiding: boolean;
  isolation: boolean;
}

/** Partial capability update; omitted values remain unchanged. */
export type ViewerCapabilitiesPatch = Partial<ViewerCapabilities>;

/** Left-panel hierarchy tab identifiers. */
export type IfcTreeTab = "spatial" | "types" | "classifications" | "groups";

/** Runtime presentation options for one hierarchy tab. */
export interface ViewerTreeTabSettings {
  visible: boolean;
  showProducts: boolean;
}

/** Complete host-controlled floating-panel presentation policy. */
export interface ViewerUiSettings {
  showLeftPanel: boolean;
  showRightPanel: boolean;
  leftPanelTabs: Record<IfcTreeTab, ViewerTreeTabSettings>;
}

/** Partial UI update; omitted panel/tab values remain unchanged. */
export interface ViewerUiSettingsPatch {
  showLeftPanel?: boolean;
  showRightPanel?: boolean;
  leftPanelTabs?: Partial<Record<IfcTreeTab, Partial<ViewerTreeTabSettings>>>;
}

/** WGS84 location and optional regional metadata used by map mode. */
export interface ProjectGeoReference {
  latitude?: number;
  longitude?: number;
  address?: string;
  nutsId?: string;
  countryCode?: string;
  source?: "manual" | "ifc-site" | "ifc-map-conversion" | "gis-layer";
}

/** Metadata accepted alongside the required latitude/longitude arguments. */
export type ViewerLocationMetadata = Omit<
  ProjectGeoReference,
  "latitude" | "longitude"
>;

/** Comparison sources supported by semantic queries. */
export type IfcQuerySource =
  | "attribute"
  | "property"
  | "material"
  | "category"
  | "name";

/** Comparison operators supported by semantic queries. */
export type IfcQueryOperator =
  | "exists"
  | "equals"
  | "not-equals"
  | "contains"
  | "not-contains"
  | "starts-with"
  | "not-starts-with"
  | "ends-with"
  | "not-ends-with"
  | "matches"
  | "not-matches"
  | "gt"
  | "gte"
  | "lt"
  | "lte";

/** One semantic query condition. */
export interface IfcQueryClause {
  source: IfcQuerySource;
  name?: string;
  propertySet?: string;
  operator: IfcQueryOperator;
  value?: string | number | boolean;
}

/** Semantic query accepted by runQuery(). */
export interface IfcQueryDefinition {
  id: string;
  name: string;
  categories?: string[];
  /** Includes IFC subclasses of every requested category. Defaults to true. */
  includeSubclasses?: boolean;
  logicalOperator?: "and" | "or";
  clauses: IfcQueryClause[];
}

/** Complete query partition returned by runQuery(). */
export interface IfcQueryResult {
  definition: IfcQueryDefinition;
  scopeItems: IfcElementRef[];
  matchedItems: IfcElementRef[];
  failedItems: IfcElementRef[];
  missingItems: IfcElementRef[];
  checkedItems: number;
  elapsedMs: number;
}

export type IfcAuditorValueMode = "auto" | "numeric" | "textual";
export type IfcAuditorNumericRangeMode = "equal-ranges" | "equal-counts";

export interface IfcAuditorPropertyStats {
  propertyName: string;
  totalValues: number;
  numericValues: number;
  textualValues: number;
  sampleValues: string[];
}

export interface IfcAuditorPropertySetIndex {
  name: string;
  properties: IfcAuditorPropertyStats[];
}

export interface IfcAuditorIndexedElement {
  ref: IfcElementRef;
  values: Record<string, Record<string, unknown>>;
}

export interface IfcAuditorClassIndex {
  ifcClass: string;
  elementCount: number;
  propertySets: IfcAuditorPropertySetIndex[];
  elements?: IfcAuditorIndexedElement[];
}

export interface IfcAuditorIndex {
  generatedAt: string;
  classes: IfcAuditorClassIndex[];
  cacheKind?: "AUDITOR_QUERY_INDEX";
  sourceFileId?: number;
  sourceChecksum?: string;
  sourceVersion?: number;
  sourceOriginalFilename?: string;
}

export interface IfcAuditorDefinition {
  id: string;
  name: string;
  ifcClass: string;
  /** Includes IFC subclasses of ifcClass. Defaults to true. */
  includeSubclasses?: boolean;
  propertySet: string;
  propertyName: string;
  mode?: IfcAuditorValueMode;
  bucketCount?: number;
  startColor?: string;
  endColor?: string;
  numericRangeMode?: IfcAuditorNumericRangeMode;
  maxTextBuckets?: number;
}

export interface IfcAuditorBucket {
  id: string;
  label: string;
  labels?: Partial<Record<ViewerLanguage, string>>;
  color: string;
  refs: IfcElementRef[];
  min?: number;
  max?: number;
  value?: string;
}

export interface IfcAuditorResult {
  definition: IfcAuditorDefinition;
  mode: Exclude<IfcAuditorValueMode, "auto">;
  buckets: IfcAuditorBucket[];
  scopeRefs: IfcElementRef[];
  checkedItems: number;
  colouredItems: number;
  skippedItems: number;
  numericValues: number;
  textualValues: number;
}

/** Host-supplied IDS source accepted by the iframe SDK. */
export type IfcIdsSource =
  | {
      kind: "url";
      url: string;
      fileName?: string;
      idsId?: string;
      headers?: Record<string, string>;
      credentials?: RequestCredentials;
    }
  | { kind: "file"; file: File; fileName?: string; idsId?: string }
  | {
      kind: "buffer";
      buffer: ArrayBuffer | Uint8Array;
      fileName?: string;
      idsId?: string;
    }
  | { kind: "text"; text: string; fileName?: string; idsId?: string };

export interface IfcIdsPropertyRequirement {
  propertySet?: string;
  name: string;
  /** IFC IDS property data type, for example IFCBOOLEAN or IFCLENGTHMEASURE. */
  dataType?: string;
  value?: string;
  allowedValues?: string[];
  minInclusive?: number;
  maxInclusive?: number;
  minExclusive?: number;
  maxExclusive?: number;
  pattern?: string;
}

export interface IfcIdsSpecification {
  id: string;
  name: string;
  ifcClasses: string[];
  propertyRequirements: IfcIdsPropertyRequirement[];
}

export interface IfcIdsLoadedDocument {
  idsId: string;
  fileName?: string;
  title: string;
  specificationCount: number;
  loadedAt: string;
  specifications: IfcIdsSpecification[];
}

export interface IfcIdsRequirementResult {
  specificationId: string;
  specificationName: string;
  propertySet?: string;
  propertyName: string;
  expectedValue?: string;
  actualValue?: string;
  dataType?: string;
  allowedValues?: string[];
  minInclusive?: number;
  maxInclusive?: number;
  minExclusive?: number;
  maxExclusive?: number;
  pattern?: string;
  status: "pass" | "fail";
}

export interface IfcIdsItemResult {
  item: IfcElementRef;
  status: "pass" | "fail";
  requirements: IfcIdsRequirementResult[];
}

/** Session-local value used by checking and emitted to the host for persistence. */
export interface IfcIdsPropertyPatch {
  item: IfcElementRef;
  propertySet?: string;
  propertyName: string;
  value: string;
}

export interface IfcIdsCheckResult {
  ids: IfcIdsLoadedDocument;
  specifications: IfcIdsSpecification[];
  itemResults: IfcIdsItemResult[];
  relevantItems: IfcElementRef[];
  passedItems: IfcElementRef[];
  failedItems: IfcElementRef[];
  /** Deprecated compatibility field; always empty. */
  missingItems: IfcElementRef[];
  totalItems: number;
  notRelevantItems: number;
  checkedItems: number;
  elapsedMs: number;
}

export interface IfcIdsPropertyPatchResult {
  patches: IfcIdsPropertyPatch[];
  result?: IfcIdsCheckResult;
}

/** Generic Cartesian point used by annotations. */
export interface IfcCoordinateTriplet {
  x: number;
  y: number;
  z: number;
}

/** One annotation vertex in scene and IFC coordinate systems. */
export interface IfcAnnotationVertex {
  modelId: string;
  localId: number;
  ifcGlobalId?: string | null;
  ifcType?: string | null;
  scene: IfcCoordinateTriplet;
  ifc: IfcCoordinateTriplet;
}

/** One allowed annotation type loaded from viewer.config.json. */
export interface IfcAnnotationTypeDefinition {
  id: string;
  label: string;
  labels?: Partial<Record<ViewerLanguage, string>>;
  color: string;
  geometryTypes: Array<"POINT" | "POLYLINE" | "POLYGON">;
  defaultGeometryType?: "POINT" | "POLYLINE" | "POLYGON";
  visibleByDefault?: boolean;
  enabled?: boolean;
  editorEnabled?: boolean;
  description?: string;
}

/** Host-managed annotation snapshot item. */
export interface IfcAnnotationMarker {
  id: string;
  kind: "ifc-annotation";
  annotationType: string;
  geometryType: "POINT" | "POLYLINE" | "POLYGON";
  status?: string;
  active?: boolean;
  label: string;
  description?: string;
  modelId: string;
  localId: number;
  ifcGlobalId?: string | null;
  ifcType?: string | null;
  scene: IfcCoordinateTriplet;
  ifc: IfcCoordinateTriplet;
  points?: IfcAnnotationVertex[];
  createdAt: string;
  updatedAt?: string;
  source?: "saved" | "draft" | "host" | "cached";
  imageOverlay?: unknown;
}

/** Controls how an annotation array mutates the viewer collection. */
export interface IfcAnnotationSetOptions {
  mode?: "append" | "upsert" | "replace";
}

/** Optional filters for retrieving temporary/cached viewer annotations. */
export interface IfcAnnotationQuery {
  includeDrafts?: boolean;
  annotationTypes?: string[];
  activeOnly?: boolean;
  sources?: Array<"saved" | "draft" | "host" | "cached">;
}

/** Per-type display policy; missing keys are treated as visible. */
export type IfcAnnotationTypeVisibility = Record<string, boolean>;

/** Aggregate diagnostics for the IndexedDB acceleration cache. */
export interface ViewerCacheStats {
  entries: number;
  totalBytes: number;
  oldestEntryAt?: number;
  newestEntryAt?: number;
}

/** Connection settings for the parent-side iframe client. */
export interface IfcViewerIframeClientOptions {
  /** Exact origin serving viewer.html. */
  targetOrigin: string;
  /** Optional value matching the iframe `token` query parameter. */
  token?: string;
  /** Request timeout in milliseconds; defaults to 30 seconds. */
  requestTimeoutMs?: number;
}

/** Per-load cache/replacement behaviour. */
export interface LoadModelOptions {
  cacheStrategy?: "prefer-cache" | "network-first" | "bypass";
  replaceModelWithSameId?: boolean;
}

/** Model-load result returned by URL and buffer operations. */
export interface LoadModelResult {
  modelId: string;
  fileName: string;
  elementCount: number;
  fromCache: boolean;
  cacheKey?: string;
}

/**
 * Parent-side SDK for the versioned standalone viewer postMessage protocol.
 * Call dispose() when the host removes the iframe.
 */
export declare class IfcViewerIframeClient {
  constructor(iframe: HTMLIFrameElement, options: IfcViewerIframeClientOptions);
  dispose(): void;
  on<T = unknown>(event: string, listener: (payload: T) => void): () => void;
  ping(): Promise<{ ready: boolean; version: number }>;
  setCapabilities(
    capabilities: ViewerCapabilitiesPatch,
  ): Promise<ViewerCapabilities>;
  getCapabilities(): Promise<ViewerCapabilities>;
  /** Changes GUI labels only; IFC-derived data remains untouched. */
  setLanguage(language: ViewerLanguage): Promise<ViewerLanguage>;
  /** Reads the active viewer GUI language. */
  getLanguage(): Promise<ViewerLanguage>;
  /** Lists languages bundled with the viewer. */
  getSupportedLanguages(): Promise<ViewerLanguage[]>;
  /** Applies neutral presentation tokens without changing semantic colours or layout. */
  setAppearance(
    appearance: ViewerAppearanceConfig,
  ): Promise<AppliedViewerAppearance>;
  /** Reads the active presentation settings. */
  getAppearance(): Promise<AppliedViewerAppearance>;
  setUiSettings(settings: ViewerUiSettingsPatch): Promise<ViewerUiSettings>;
  getUiSettings(): Promise<ViewerUiSettings>;
  loadModelFromUrl(
    url: string,
    options?: LoadModelOptions & {
      modelId?: string;
      fileName?: string;
      cacheKey?: string;
      format?: "ifc" | "fragments";
      headers?: Record<string, string>;
      credentials?: RequestCredentials;
    },
  ): Promise<LoadModelResult>;
  loadModelFromBuffer(
    buffer: ArrayBuffer,
    fileName: string,
    options?: LoadModelOptions & {
      modelId?: string;
      cacheKey?: string;
      format?: "ifc" | "fragments";
    },
  ): Promise<LoadModelResult>;
  listModels(): Promise<ViewerModelInfo[]>;
  unloadModel(modelId: string): Promise<void>;
  select(items: IfcElementIdGroup[], additive?: boolean): Promise<void>;
  clearSelection(): Promise<void>;
  getSelection(): Promise<IfcElementRef[]>;
  getProperties(item: IfcElementRef): Promise<IfcPropertyGroup[]>;
  hide(
    items: IfcElementIdGroup[],
    options?: VisibilityOperationOptions,
  ): Promise<void>;
  show(
    items: IfcElementIdGroup[],
    options?: VisibilityOperationOptions,
  ): Promise<void>;
  isolate(
    items: IfcElementIdGroup[],
    options?: VisibilityOperationOptions,
  ): Promise<void>;
  showAll(): Promise<void>;
  restoreVisibility(): Promise<void>;
  fitView(): Promise<void>;
  setEdges(visible: boolean): Promise<void>;
  setGroundMode(mode: "grid" | "map" | "none"): Promise<void>;
  setLocation(
    latitude: number,
    longitude: number,
    metadata?: ViewerLocationMetadata,
  ): Promise<void>;
  setGeoReference(reference?: ProjectGeoReference): Promise<void>;
  getGeoReference(): Promise<ProjectGeoReference | undefined>;
  runQuery(definition: IfcQueryDefinition): Promise<IfcQueryResult>;
  colourQuery(result: IfcQueryResult): Promise<void>;
  clearQueryColouring(): Promise<void>;
  getAuditIndex(): Promise<IfcAuditorIndex>;
  runAudit(definition: IfcAuditorDefinition): Promise<IfcAuditorResult>;
  colourAudit(result: IfcAuditorResult): Promise<void>;
  clearAuditColouring(): Promise<void>;
  loadIds(source: IfcIdsSource): Promise<IfcIdsLoadedDocument>;
  loadIdsFromBuffer(
    buffer: ArrayBuffer,
    fileName?: string,
    idsId?: string,
  ): Promise<IfcIdsLoadedDocument>;
  loadIdsFromUrl(
    url: string,
    options?: {
      fileName?: string;
      idsId?: string;
      headers?: Record<string, string>;
      credentials?: RequestCredentials;
    },
  ): Promise<IfcIdsLoadedDocument>;
  getIds(): Promise<IfcIdsLoadedDocument | undefined>;
  runIdsCheck(): Promise<IfcIdsCheckResult>;
  colourIds(result: IfcIdsCheckResult): Promise<void>;
  clearIdsColouring(): Promise<void>;
  /** Applies session-local IDS values and immediately reruns the loaded IDS. */
  applyIdsPropertyPatches(
    patches: IfcIdsPropertyPatch[],
  ): Promise<IfcIdsPropertyPatchResult>;
  getIdsPropertyPatches(): Promise<IfcIdsPropertyPatch[]>;
  clearIdsPropertyPatches(): Promise<IfcIdsPropertyPatchResult>;
  clearIds(): Promise<void>;
  setAnnotations(
    annotations: IfcAnnotationMarker[],
    options?: IfcAnnotationSetOptions,
  ): Promise<IfcAnnotationMarker[]>;
  addAnnotations(
    annotations: IfcAnnotationMarker[],
  ): Promise<IfcAnnotationMarker[]>;
  removeAnnotations(annotationIds: string[]): Promise<void>;
  clearAnnotations(): Promise<void>;
  getAnnotations(query?: IfcAnnotationQuery): Promise<IfcAnnotationMarker[]>;
  /** Reads the configured annotation-type allow-list. */
  getAnnotationTypes(): Promise<IfcAnnotationTypeDefinition[]>;
  setAnnotationTypeVisibility(
    visibility: IfcAnnotationTypeVisibility,
  ): Promise<IfcAnnotationTypeVisibility>;
  getAnnotationTypeVisibility(): Promise<IfcAnnotationTypeVisibility>;
  getCacheStats(): Promise<ViewerCacheStats>;
  clearCache(): Promise<void>;
  /** Low-level escape hatch for additive future protocol commands. */
  request<TResult>(
    command: string,
    payload?: unknown,
    transfer?: Transferable[],
  ): Promise<TResult>;
}
