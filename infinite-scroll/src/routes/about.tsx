import { Title } from "@solidjs/meta";
import { onMount, Suspense } from "solid-js";

export default function Video() {
  let ref!: HTMLVideoElement;
  onMount(() => {
    ref.play().catch((err) => {
      console.error(err);
    });
  });
  return (
    <main>
      <Suspense>
        <video
          ref={ref}
          muted
          autoplay
          playsinline
        >
          <source
            src="https://cdn.pixabay.com/video/2023/10/19/185726-876210695_tiny.mp4"
            type="video/mp4"
          />
        </video>
      </Suspense>
    </main>
  );
}
