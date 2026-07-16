import nodeResolve from "@rollup/plugin-node-resolve"
import terser from "@rollup/plugin-terser"
import esbuild from "rollup-plugin-esbuild"
import serve from "rollup-plugin-serve"

const isWatch = process.env.ROLLUP_WATCH === "true"

export default {
  input: "src/custom-clock-card.ts",
  onwarn(warning, warn) {
    if (warning.code === "THIS_IS_UNDEFINED") return
    warn(warning)
  },
  output: {
    file: isWatch ? "dev/custom-clock-card.js" : "dist/custom-clock-card.js",
    format: "es",
    inlineDynamicImports: true,
    sourcemap: isWatch
  },
  plugins: [
    nodeResolve(),
    esbuild({ target: "es2022" }),
    !isWatch && terser(),
    isWatch &&
      serve({
        allowCrossOrigin: true,
        contentBase: "dev",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache, no-store, must-revalidate"
        },
        host: "0.0.0.0",
        port: 5001
      })
  ].filter(Boolean),
  watch: {
    buildDelay: 300,
    include: "src/**"
  }
}
