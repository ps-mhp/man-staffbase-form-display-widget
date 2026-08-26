# form-display-widget

Staffbase-Custom-Widget. Entwickelt, gebaut und released wird es aus dem
Meta-Repo [`ps-mhp/man-staffbase-cms-extensions`](https://github.com/ps-mhp/man-staffbase-cms-extensions);
dieses Repo enthält nur Quellcode und das ausgelieferte Bundle unter `dist/`.

```bash
scripts/sync.sh form-display-widget
npm run build -- --env widget=form-display-widget
npm test -- src/widgets/form-display-widget
scripts/release.sh form-display-widget
```
