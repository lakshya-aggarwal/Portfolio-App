import next from "eslint-config-next";

// eslint-config-next 16 ships native flat config, so no FlatCompat wrapper.
const config = [
  {
    ignores: [
      ".next/**",
      ".claude/**", // vendored skill assets, not our source
      "graphify-out/**",
      "node_modules/**",
      "next-env.d.ts",
    ],
  },
  ...next,
];

export default config;
