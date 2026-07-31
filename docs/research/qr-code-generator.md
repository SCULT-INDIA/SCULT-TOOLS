# QR Code Generator — research brief

> **Provenance.** Confirmed against a live search for "qr code generator free
> online" (July 2026). My initial hypothesis was **wrong in two ways** and both
> corrections are recorded below: QR Tiger did not appear in the results at all,
> and the "never expires / no account" angle I had assumed was ours alone is in
> fact advertised explicitly by several competitors. The USP has been narrowed to
> what actually survives.

## Competitors (from the live SERP)

1. QRCode Monkey — https://www.qrcode-monkey.com/
2. Adobe Express — https://www.adobe.com/express/feature/image/qr-code-generator
3. Canva — https://www.canva.com/qr-code-generator/
4. qr-code-generator.com — https://www.qr-code-generator.com/
5. The QR Code Generator (TQRCG) — https://www.the-qrcode-generator.com/

Also surfaced and worth noting: [TEC-IT](https://qrcode.tec-it.com/en),
[QR Planet](https://qrplanet.com/) and
[GuestCam](https://guestcam.co/free-tools/qr-code-generator).

## Common traits — table stakes

- Live preview that updates as you type
- Multiple content types (link, text, WiFi, vCard, email, phone)
- Downloadable PNG **and** a vector format (SVG/EPS/PDF)
- Output size control
- Colour customisation of the modules and background
- Logo or image in the centre
- Error-correction level exposed, at least in an "advanced" panel

### Shipped

| Trait | Status |
|---|---|
| Live preview | Yes — recomputed on every keystroke, no debounce needed (pure string building) |
| Multiple content types | Yes — link, text, WiFi, UPI |
| PNG + SVG download | Yes |
| Size control | Yes — moved next to the PNG button, since it only affects that download |
| Colour customisation | Yes — plus a scannability guard nobody else has (see USP) |
| Error-correction level | Yes — promoted to the toolbar rather than hidden in an advanced panel |

### Deliberately excluded

- **Logo in the centre.** Every competitor offers it and it is the single most
  common cause of a code that scans on the designer's phone and fails in the
  field: the logo occupies modules, and the tools that offer it generally do not
  raise the error-correction level to compensate or check that the overlay stays
  inside what the correction level can actually recover. Shipping it *safely*
  means bounding the overlay against the chosen level's recovery capacity, which
  is real work and belongs in `logic.ts` with tests. Until that exists, offering
  it would contradict the correctness claim this tool is built on. Tracked as a
  follow-up, not a silent omission.
- **vCard / email / phone / SMS modes.** Cheap to add, but each is another mode to
  test and the four shipped modes cover what the tool is actually reached for.
  Worth revisiting on evidence, not on feature-parity instinct.
- **Scan analytics.** Structurally incompatible with the USP — see below.

## Individual standouts

- **QRCode Monkey** — the deepest free styling controls (module shape, eye shape,
  gradient fills) of any of the five.
- **QR Tiger** — dynamic codes with editable destinations and scan analytics.
- **qr-code-generator.com** — the clearest print-ready export options.
- **Canva** — the QR code drops straight into a design you are already making.
- **Adobe Express** — the least cluttered entry path: one field, one button.

## Our USP

**Ours is the only one that refuses to hand you a QR code that will not scan.**

That is the whole claim, and it is narrower than what I first assumed. The
correction is worth recording:

- ❌ **"Never expires" is NOT ours alone.** TEC-IT advertises codes that "last
  forever", Adobe Express says its codes "never expire", and GuestCam leads with
  "no account, no watermarks, no expiration". Claiming this as a differentiator
  would have been false.
- ❌ **"No signup" is NOT ours alone** either — see GuestCam and QRCode Monkey.
- ✅ **The scannability guard appears to be genuinely ours.** Every styling-capable
  generator found lets you choose any two colours and returns an image with no
  warning whatsoever. A decoder does not compare hues; it converts the camera
  frame to luminance and thresholds it. So a mid-blue on mid-green pair looks
  clearly legible to a designer and is unreadable to a phone. `assessQrColors`
  blocks the two failures that actually matter — insufficient luminance contrast,
  and an inverted (light-on-dark) symbol, which many decoders will not attempt —
  and shows the ratio it judged on so the verdict is checkable.

**Still true, but as context rather than a USP:** the code is static by
construction. Canva and TQRCG market *dynamic* codes — a redirect through their
domain that can be re-pointed later, which is a real feature and also a permanent
dependency on their uptime for anything you have printed. Ours encodes the data
itself. That is a deliberate trade-off to state plainly, not a superiority claim:
you lose editability and scan analytics, and you gain a code that cannot be
revoked, metered, or broken by someone else's business decision.

Because there is no redirect and `qrcode` draws the matrix in the tab, a WiFi
password or UPI address typed here never crosses the network.

## Design decisions

- **The preview is the largest element on the page.** It was previously capped at
  280px inside a column that also carried four fieldsets, making the thing you
  came to look at the smallest thing in view.
- **Toolbar holds mode and error correction**; both change the whole output.
- **PNG size sits next to the PNG button**, because it affects nothing else — the
  SVG is vector. Putting it in the toolbar would imply it applies to both.
- **Colour presets before the pickers.** Three pairs that are known to scan, so
  the common case is one click and the free pickers are the escape hatch rather
  than the default path.
- **Blocking reasons are prioritised** — colour first (it invalidates any
  payload), then payload, then capacity — so only one message shows at a time and
  it is always the one to act on.
- **The status bar carries bytes-of-capacity, correction level and the contrast
  ratio**, which is the tool showing its working rather than asserting a verdict.
