# Campus Location Images

Put location detail photos in this folder.

After adding an image file, register it in `src/features/campusMap/locationImages.ts`:

```ts
export const locationImageSources = {
  "college-cics": require("./locationImages/college-cics.jpg"),
};
```

Use the matching `id` from `src/data/mymsuDatabase.ts`.
