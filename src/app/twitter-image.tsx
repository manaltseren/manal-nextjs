// Twitter/X share image — reuses the Open Graph renderer. The route-segment
// config (runtime/alt/size/contentType) must be declared locally so Next can
// statically parse it; only the default render function is re-used.
export { default } from "./opengraph-image";

export const runtime = "nodejs";
export const alt = "Manalaa — Full-Stack Web Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
