# IFC viewer host SDK

Use the compiled ES module without distributing the viewer source:

```ts
import { IfcViewerIframeClient } from "https://viewer.example.com/sdk/ifc-viewer-client.js";
```

The matching TypeScript declaration is `ifc-viewer-client.d.ts`.

## GUI language

```js
await client.setLanguage("fr");
const current = await client.getLanguage();
const supported = await client.getSupportedLanguages();
```

The iframe can show its own language selector when `ui.showLanguageSelector` is true. The host can still own language choice through this SDK. Supported codes are `en`, `es`, `eu` and `fr`; IFC-derived names/classes/properties are not translated.

## Capabilities

```js
await client.setCapabilities({
  selection: true,
  hiding: true,
  isolation: false,
});
```

Use `client.restoreVisibility()` to restore the scene snapshot captured by the viewer's right-click hide/isolate workflow.

## Map location

```js
await client.setLocation(43.263, -2.935, {
  countryCode: "ES",
  nutsId: "ES21",
});
await client.setGroundMode("map");
```

Use `client.setGeoReference(undefined)` to remove the host override and return to coordinates read from the IFC model.

## Iframe endpoint

Embed `viewer.html`, not the demonstration `index.html`:

```html
<iframe
  src="https://viewer.example.com/viewer.html?parentOrigin=https%3A%2F%2Fapp.example.com"
></iframe>
```

The host application owns the file input and transfers files with `loadModelFromBuffer(...)`.

## Contract documentation

The declaration file includes the public method contracts. Internal ownership,
state invariants and extension rules are documented in `docs/CODE_REFERENCE.md`
of the private source project.

## Development workbench

The deployed root `index.html` contains a comprehensive host-side workbench for exercising the SDK. It includes endpoint-specific fields, editable JSON payloads and a live console for responses and viewer events. Third-party applications should continue to embed `viewer.html` directly.

The client also exposes additive `setAnnotations()` / `addAnnotations()`, removal/clear operations, draft-aware `getAnnotations()`, `getAnnotationTypes()`, per-type visibility controls and `getCacheStats()` as typed convenience methods.

## IDS checker and session property completion

Enable the tool with `ui.showIdsChecker: true`, then provide IDS XML from the
host by URL or buffer:

```js
await client.loadIdsFromUrl("https://files.example.com/check.ids");
const result = await client.runIdsCheck();
await client.colourIds(result);
```

When an applicable element is selected in IDS mode, the iframe shows a separate
required-property editor. The host can perform the same operation explicitly:

```js
await client.applyIdsPropertyPatches([
  {
    item: { modelId: "architecture", localId: 245 },
    propertySet: "Pset_WallCommon",
    propertyName: "FireRating",
    value: "EI60",
  },
]);
```

Use `getIdsPropertyPatches()` or the `ids-properties-changed` event to persist
those values in a host-owned IFC editing workflow. The patches affect checking
and colouring immediately, but the standalone viewer does not rewrite the
source IFC file. `clearIdsPropertyPatches()` removes them.

## Configured annotation types

The viewer reads its annotation allow-list from `viewer.config.json`. Inspect it before constructing host annotations:

```js
const types = await client.getAnnotationTypes();
```

Unknown/disabled types and geometry combinations not allowed by the matching definition are silently ignored. The viewer does not create fallback grey annotations. Tenant-specific dictionaries can be selected with the iframe `config` query parameter.

## Grouped element operations

```js
await client.select([{ modelId: "architecture", localIds: [1, 2, 3] }]);
await client.hide(
  [{ modelId: "architecture", localIds: [7, 8] }],
  { cascade: true }, // default: include recursive spatial descendants
);

await client.show(
  [{ modelId: "architecture", localIds: [7] }],
  { cascade: false }, // exact express id only
);
```

The same grouped shape is accepted by `show()` and `isolate()`. Visibility operations resolve recursive spatial descendants unless `cascade` is explicitly false. Disabled capabilities make the corresponding operation a no-op.

## Property auditor

```js
const result = await client.runAudit({
  id: "wall-u-value",
  name: "Wall U-value",
  ifcClass: "IFCWALL",
  includeSubclasses: true, // default: also IFCWALLSTANDARDCASE, etc.
  propertySet: "Pset_WallCommon",
  propertyName: "ThermalTransmittance",
  mode: "auto",
  bucketCount: 5,
});
await client.colourAudit(result);
```

Use `getAuditIndex()` for schema discovery and `clearAuditColouring()` to remove the palette.

## Panel and hierarchy presentation

```js
await client.setUiSettings({
  showLeftPanel: true,
  showRightPanel: true,
  leftPanelTabs: {
    spatial: { visible: true, showProducts: false },
    types: { visible: true, showProducts: true },
    classifications: { visible: false },
    groups: { visible: true, showProducts: false },
  },
});
```

`showProducts: false` trims the spatial tree at storeys and removes occurrence rows from the other hierarchy tabs. Aggregate actions still apply to the complete underlying products. Use `getUiSettings()` to read the effective state.

### IDS constrained values

IDS requirement/result objects may expose `dataType`, `allowedValues`, numeric
bounds and `pattern`. These fields mirror the standalone viewer's datatype-aware
completion editor and can be used by a host to build equivalent controls.


The iframe can also show a circular theme selector when `ui.showThemeSelector` is true. SDK appearance calls remain supported and synchronise the in-viewer selector.

### IDS result navigation

The iframe UI renders pass/fail IDS trees from `itemResults`. Host SDK contracts are unchanged: integrations can continue to read `itemResults`, `passedItems` and `failedItems`, while the built-in UI groups them visually by IFC class and type.
