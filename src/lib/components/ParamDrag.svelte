<script lang="ts">
  let {
    value = $bindable(0),
    min = -Infinity,
    max = Infinity,
    step = 1,
    sensitivity = 0.5,
    format = (v: number) => String(v),
    onChange,
    class: className = ""
  }: {
    value: number;
    min?: number;
    max?: number;
    step?: number;
    sensitivity?: number;
    format?: (v: number) => string;
    onChange?: (v: number) => void;
    class?: string;
  } = $props();

  let startY = 0;
  let startVal = 0;
  let isDragging = false;

  function onMouseDown(e: MouseEvent) {
    e.preventDefault();
    startY = e.clientY;
    startVal = value;
    isDragging = true;
    document.body.style.cursor = "ns-resize";

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }

  function onMouseMove(e: MouseEvent) {
    if (!isDragging) return;
    const dy = startY - e.clientY;
    const delta = dy * sensitivity * step;
    let nextVal = startVal + delta;
    if (min !== undefined) nextVal = Math.max(min, nextVal);
    if (max !== undefined) nextVal = Math.min(max, nextVal);

    value = nextVal;
    if (onChange) onChange(nextVal);
  }

  function onMouseUp() {
    isDragging = false;
    document.body.style.cursor = "default";
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
  class="param-val {className}"
  onmousedown={onMouseDown}
  role="slider"
  aria-valuenow={value}
  tabindex="0"
>
  {format(value)}
</span>
