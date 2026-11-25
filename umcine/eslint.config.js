import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  // Next.js 권장 ESLint 설정
  ...nextVitals,

  // TypeScript 관련 ESLint 설정
  ...nextTs,

  {
    rules: {
      // 기존 이미지 태그와 UI를 유지하기 위해 허용
      "@next/next/no-img-element": "off",
    },
  },

  // 빌드 결과물 및 자동 생성 파일 검사 제외
  globalIgnores([".next/**", "out/**", "build/**", "dist/**", "next-env.d.ts"]),
]);
