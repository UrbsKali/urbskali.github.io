<script lang="ts">
  const hexFragments = [
    "23",
    "ee",
    "c4",
    "18",
    "de",
    "e5",
    "c0",
    "10",
    "e5",
    "e6",
    "bc",
    "84",
    "11",
    "75",
    "fa",
    "d7",
    "8e",
    "7a",
    "3e",
    "09",
    "f1",
    "5f",
    "72",
    "b9",
    "33",
  ];
  const encryptedAddress = [
    "26",
    "f2",
    "87",
    "d2",
    "d6",
    "89",
    "18",
    "2e",
    "f8",
    "39",
    "a9",
    "69",
    "91",
    "d5",
  ];

  const mazePath = [
    20, 15, 10, 5, 0, 1, 2, 7, 12, 11, 16, 17, 22, 23, 18, 13, 8, 3, 4, 9, 14,
  ];
  const dots = Array.from({ length: 25 }, (_, index) => ({
    index,
    row: Math.floor(index / 5),
    column: index % 5,
    x: 10 + (index % 5) * 20,
    y: 10 + Math.floor(index / 5) * 20,
  }));
  const corridorEdges = new Set(
    mazePath.slice(1).map((dotIndex, pathIndex) => {
      const previousIndex = mazePath[pathIndex];
      return `${Math.min(previousIndex, dotIndex)}-${Math.max(previousIndex, dotIndex)}`;
    }),
  );
  const connections: { from: number; to: number }[] = [];

  for (const dot of dots) {
    if (dot.column < 4)
      connections.push({ from: dot.index, to: dot.index + 1 });
    if (dot.row < 4) connections.push({ from: dot.index, to: dot.index + 5 });
  }

  const barriers = connections
    .filter(({ from, to }) => !corridorEdges.has(`${from}-${to}`))
    .map(({ from, to }) => {
      const start = dots[from];
      const end = dots[to];
      const middleX = (start.x + end.x) / 2;
      const middleY = (start.y + end.y) / 2;
      const isHorizontal = start.y === end.y;

      return {
        x1: isHorizontal ? middleX : middleX - 3,
        y1: isHorizontal ? middleY - 3 : middleY,
        x2: isHorizontal ? middleX : middleX + 3,
        y2: isHorizontal ? middleY + 3 : middleY,
      };
    });

  type ChallengeSlide = "maze" | "result";
  type DotHitTarget = { index: number; x: number; y: number; radius: number };
  const scrambleCharacters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789#$%&";

  let dialogElement: HTMLDialogElement;
  let mazeBoard: HTMLDivElement;
  let currentSlide = $state<ChallengeSlide>("maze");
  let selectedDots = $state<number[]>([]);
  let decodedAddress = $state("");
  let revealedAddress = $state("");
  let copyStatus = $state("");
  let isDecrypting = $state(false);
  let isDecoding = false;
  let isDrawing = false;
  let previousPointerPosition: { x: number; y: number } | null = null;
  let dragTargets: DotHitTarget[] = [];
  let revealTimer: number | undefined;

  function appendDot(index: number) {
    if (selectedDots.includes(index)) return;
    selectedDots = [...selectedDots, index];
    decodedAddress = "";
  }

  function startDrawing(event: PointerEvent, index: number) {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    event.preventDefault();
    isDrawing = true;
    dragTargets = dots
      .map((dot) => {
        const button = mazeBoard.querySelector<HTMLButtonElement>(
          `[data-dot-index="${dot.index}"]`,
        );
        const bounds = button?.getBoundingClientRect();
        if (!bounds) return null;

        return {
          index: dot.index,
          x: bounds.left + bounds.width / 2,
          y: bounds.top + bounds.height / 2,
          radius: Math.min(bounds.width, bounds.height) / 2,
        };
      })
      .filter((target): target is DotHitTarget => target !== null);
    previousPointerPosition = { x: event.clientX, y: event.clientY };
    appendDot(index);
    mazeBoard.setPointerCapture(event.pointerId);
  }

  function continueDrawing(event: PointerEvent) {
    if (!isDrawing) return;

    const from = previousPointerPosition;
    const to = { x: event.clientX, y: event.clientY };
    if (!from) {
      previousPointerPosition = to;
      return;
    }

    const deltaX = to.x - from.x;
    const deltaY = to.y - from.y;
    const segmentLengthSquared = deltaX * deltaX + deltaY * deltaY;
    const unvisitedDots = new Set(selectedDots);
    const crossedDots = dragTargets
      .map((dot) => {
        const progress =
          segmentLengthSquared === 0
            ? 0
            : Math.max(
                0,
                Math.min(
                  1,
                  ((dot.x - from.x) * deltaX + (dot.y - from.y) * deltaY) /
                    segmentLengthSquared,
                ),
              );
        const closestX = from.x + progress * deltaX;
        const closestY = from.y + progress * deltaY;

        return {
          index: dot.index,
          progress,
          intersects:
            Math.hypot(dot.x - closestX, dot.y - closestY) <= dot.radius,
        };
      })
      .filter((dot) => dot.intersects && !unvisitedDots.has(dot.index))
      .sort((first, second) => first.progress - second.progress);

    for (const dot of crossedDots) {
      appendDot(dot.index);
      unvisitedDots.add(dot.index);
    }

    previousPointerPosition = to;
  }

  function resetPath() {
    stopRevealAnimation();
    selectedDots = [];
    decodedAddress = "";
    revealedAddress = "";
    copyStatus = "";
    currentSlide = "maze";
  }

  function returnToMaze() {
    stopRevealAnimation();
    copyStatus = "";
    currentSlide = "maze";
  }

  function stopRevealAnimation() {
    if (revealTimer !== undefined) {
      window.clearInterval(revealTimer);
      revealTimer = undefined;
    }
    isDecrypting = false;
  }

  function scrambleAddress(address: string, settledCount: number) {
    return [...address]
      .map((character, index) => {
        if (index < settledCount || !/[a-z0-9]/i.test(character))
          return character;
        return scrambleCharacters[
          Math.floor(Math.random() * scrambleCharacters.length)
        ];
      })
      .join("");
  }

  function animateReveal(address: string) {
    stopRevealAnimation();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealedAddress = address;
      return;
    }

    let frame = 0;
    isDecrypting = true;
    revealedAddress = scrambleAddress(address, 0);
    revealTimer = window.setInterval(() => {
      frame += 1;
      const settledCount = Math.floor(frame / 2);
      revealedAddress = scrambleAddress(address, settledCount);

      if (settledCount >= address.length) {
        stopRevealAnimation();
        revealedAddress = address;
      }
    }, 35);
  }

  async function finishPath() {
    const lastDot = selectedDots[selectedDots.length - 1];
    if (
      isDecoding ||
      currentSlide !== "maze" ||
      selectedDots[0] !== 20 ||
      lastDot !== 14
    )
      return;

    isDecoding = true;
    try {
      const keyMaterial = new Uint8Array(
        selectedDots.flatMap((index) => {
          const fragment = hexFragments[index];
          return [Number.parseInt(fragment.slice(0, 2), 16)];
        }),
      );
      const hashedKey = new Uint8Array(
        await crypto.subtle.digest("SHA-256", keyMaterial),
      );
      const cipherBytes = encryptedAddress.map((byte) =>
        Number.parseInt(byte, 16),
      );
      const plainBytes = cipherBytes.map(
        (byte, index) => byte ^ hashedKey[index],
      );

      decodedAddress = new TextDecoder().decode(new Uint8Array(plainBytes));
      copyStatus = "";
      currentSlide = "result";
      animateReveal(decodedAddress);
    } finally {
      isDecoding = false;
    }
  }

  function stopDrawing() {
    const reachedEnd =
      isDrawing &&
      selectedDots[0] === 20 &&
      selectedDots[selectedDots.length - 1] === 14;
    isDrawing = false;
    previousPointerPosition = null;
    dragTargets = [];
    if (reachedEnd) void finishPath();
  }

  function selectDotWithKeyboard(index: number) {
    appendDot(index);
    if (index === 14 && selectedDots[0] === 20) void finishPath();
  }

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(decodedAddress);
      copyStatus = "copied";
    } catch {
      copyStatus = "failed";
    }
  }
</script>

<button
  type="button"
  aria-label="Reveal email address"
  title="Reveal email address"
  class="hover:text-accent transition-colors"
  onclick={() => dialogElement.showModal()}
>
  <svg
    aria-hidden="true"
    viewBox="0 0 20 20"
    class="size-4 fill-none stroke-current"
    stroke-width="1.5"
  >
    <rect x="2.5" y="4" width="15" height="12" rx="1" />
    <path d="m3 5 7 5.5L17 5" />
  </svg>
</button>

<dialog
  bind:this={dialogElement}
  aria-labelledby={currentSlide === "maze" ? "maze-title" : "result-title"}
  class="email-challenge m-auto w-[min(92vw,34rem)] max-w-none border border-border bg-surface p-0 text-primary shadow-2xl backdrop:bg-primary/40"
>
  <div class="slide-viewport">
    <div class:show-result={currentSlide === "result"} class="slide-track">
      <section
        class="slide-panel"
        aria-hidden={currentSlide !== "maze"}
        inert={currentSlide !== "maze"}
      >
        <div class="p-5 sm:p-7">
          <div class="mb-5 flex items-start justify-between gap-4">
            <div>
              <p class="font-mono text-[10px] uppercase text-secondary">
                Contact access / visual challenge
              </p>
              <h2 id="maze-title" class="mt-2 text-xl font-semibold">
                Trace the open route
              </h2>
            </div>
            <button
              type="button"
              aria-label="Close email challenge"
              title="Close"
              class="p-1 text-secondary hover:text-accent transition-colors"
              onclick={() => dialogElement.close()}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                class="size-4 stroke-current"
                stroke-width="1.5"
              >
                <path d="m4 4 12 12M16 4 4 16" />
              </svg>
            </button>
          </div>

          <p class="text-sm leading-6 text-secondary">
            Click and drag from bottom-left, through top-center, to
            middle-right. On touchscreens, tap and drag. Each dot holds a hex
            fragment; in order, they form the key that decrypts the contact
            string. The route is not checked, so a different sequence decodes to
            unreadable text. Keyboard: focus a dot and press Enter to add it.
          </p>

          <div
            class="mt-5 flex justify-between font-mono text-[10px] uppercase text-secondary"
          >
            <span>Start / bottom-left</span>
            <span>Finish / middle-right</span>
          </div>

          <div
            class="maze-board relative mx-auto mt-2 aspect-square w-full max-w-[18rem] cursor-crosshair touch-none select-none sm:max-w-[22rem]"
            role="group"
            aria-label="Dot grid challenge"
            bind:this={mazeBoard}
            onpointermove={continueDrawing}
            onpointerup={stopDrawing}
            onpointercancel={stopDrawing}
            onlostpointercapture={stopDrawing}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              class="pointer-events-none absolute inset-0 size-full overflow-visible"
            >
              {#each barriers as barrier}
                <line
                  x1={barrier.x1}
                  y1={barrier.y1}
                  x2={barrier.x2}
                  y2={barrier.y2}
                  stroke="var(--color-secondary)"
                  stroke-width="1.4"
                  stroke-linecap="round"
                />
              {/each}
              {#if selectedDots.length > 1}
                <polyline
                  points={selectedDots
                    .map((index) => `${dots[index].x},${dots[index].y}`)
                    .join(" ")}
                  fill="none"
                  stroke="var(--color-accent)"
                  stroke-width="1.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              {/if}
            </svg>

            {#each dots as dot}
              <button
                type="button"
                data-dot-index={dot.index}
                aria-label={`${dot.index === 20 ? "Start, " : dot.index === 14 ? "End, " : ""}Grid point row ${dot.row + 1}, column ${dot.column + 1}`}
                aria-pressed={selectedDots.includes(dot.index)}
                class="maze-dot absolute z-10 size-12 -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                class:selected={selectedDots.includes(dot.index)}
                class:start={dot.index === 20}
                class:end={dot.index === 14}
                style={`left: ${dot.x}%; top: ${dot.y}%;`}
                onpointerdown={(event) => startDrawing(event, dot.index)}
                onkeydown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    appendDot(dot.index);
                  }
                }}
              ></button>
              {#if dot.index === 20}
                <span
                  aria-hidden="true"
                  class="maze-endpoint absolute z-20 pointer-events-none bg-surface/90 px-1 font-mono text-[9px] font-bold uppercase leading-4 text-accent"
                  style={`left: calc(${dot.x}% - 0.25rem); top: ${dot.y}%; transform: translate(-100%, -50%);`}
                  >START</span
                >
              {:else if dot.index === 14}
                <span
                  aria-hidden="true"
                  class="maze-endpoint absolute z-20 pointer-events-none bg-surface/90 px-1 font-mono text-[9px] font-bold uppercase leading-4 text-accent"
                  style={`left: calc(${dot.x}% + 0.25rem); top: ${dot.y}%; transform: translateY(-50%);`}
                  >END</span
                >
              {/if}
            {/each}
          </div>

          <div class="mt-4 flex flex-wrap justify-between gap-3">
            <button
              type="button"
              class="font-mono text-[10px] uppercase text-secondary hover:text-accent transition-colors"
              onclick={resetPath}
            >
              Reset path
            </button>
          </div>
        </div>
      </section>

      <section
        class="slide-panel"
        aria-hidden={currentSlide !== "result"}
        inert={currentSlide !== "result"}
      >
        <div class="p-5 sm:p-7">
          <div class="mb-8 flex items-start justify-between gap-4">
            <div>
              <p class="font-mono text-[10px] uppercase text-secondary">
                Contact access / decryption complete
              </p>
              <h2 id="result-title" class="mt-2 text-xl font-semibold">
                Address decoded
              </h2>
            </div>
            <button
              type="button"
              aria-label="Close email challenge"
              title="Close"
              class="p-1 text-secondary hover:text-accent transition-colors"
              onclick={() => dialogElement.close()}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                class="size-4 stroke-current"
                stroke-width="1.5"
              >
                <path d="m4 4 12 12M16 4 4 16" />
              </svg>
            </button>
          </div>

          <p class="text-sm leading-6 text-secondary">
            The path has been used to decrypt the contact string.
          </p>
          <label
            for="decoded-address"
            class="mt-8 block font-mono text-[10px] uppercase text-secondary"
          >
            Decoded string
          </label>
          <div
            class="mt-2 flex min-w-0 items-center border border-border bg-background"
          >
            <input
              id="decoded-address"
              type="text"
              aria-label="Decoded email address"
              readonly
              value={revealedAddress}
              class="min-w-0 flex-1 bg-transparent px-3 py-3 font-mono text-sm text-primary outline-none"
              onclick={(event) => event.currentTarget.select()}
            />
            <button
              type="button"
              aria-label="Copy decoded email"
              title="Copy decoded email"
              class="flex shrink-0 items-center gap-2 border-l border-border px-3 py-3 font-mono text-[10px] uppercase text-secondary hover:text-accent transition-colors disabled:opacity-40"
              disabled={isDecrypting || !decodedAddress}
              onclick={copyAddress}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                class="size-4 fill-none stroke-current"
                stroke-width="1.5"
              >
                <rect x="7" y="3" width="10" height="12" rx="1" />
                <path d="M13 15v2H4V6h3" />
              </svg>
              COPY
            </button>
          </div>
          <p
            role="status"
            aria-live="polite"
            class="mt-2 min-h-4 font-mono text-[10px] uppercase text-secondary"
          >
            {#if isDecrypting}
              Decrypting...
            {:else if copyStatus === "copied"}
              Copied to clipboard
            {:else if copyStatus === "failed"}
              Copy failed; select the string to copy
            {:else}
              Ready to copy
            {/if}
          </p>

          <div
            class="mt-10 flex flex-wrap justify-between gap-3 border-t border-border pt-5"
          >
            <button
              type="button"
              class="font-mono text-[10px] uppercase text-secondary hover:text-accent transition-colors"
              onclick={returnToMaze}
            >
              Back to maze
            </button>
            <button
              type="button"
              class="border border-border px-4 py-2 font-mono text-[10px] uppercase text-primary hover:border-accent hover:text-accent transition-colors"
              onclick={resetPath}
            >
              Start over
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</dialog>

<style>
  .email-challenge {
    border-radius: 2px;
    max-height: 90vh;
    max-height: 90dvh;
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  .email-challenge::backdrop {
    backdrop-filter: blur(2px);
  }

  .slide-viewport {
    overflow: hidden;
  }

  .slide-track {
    display: flex;
    width: 200%;
    transform: translateX(0);
    transition: transform 480ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .slide-track.show-result {
    transform: translateX(-50%);
  }

  .slide-panel {
    flex: 0 0 50%;
    min-width: 0;
  }

  .maze-dot {
    border: 0;
    background: transparent;
    touch-action: none;
    user-select: none;
  }

  .maze-dot::after {
    position: absolute;
    inset: 50% auto auto 50%;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--dot-grid-color);
    content: "";
    transform: translate(-50%, -50%);
    transition:
      width 120ms ease,
      height 120ms ease,
      background-color 120ms ease;
  }

  .maze-dot.start::after,
  .maze-dot.end::after {
    background: var(--color-accent);
  }

  .maze-dot:hover::after,
  .maze-dot.selected::after {
    width: 9px;
    height: 9px;
    background: var(--color-accent);
  }

  @media (prefers-reduced-motion: reduce) {
    .slide-track {
      transition-duration: 0ms;
    }
  }
</style>
