# Сборщик статики

Pug + SCSS + ES5 + Live Reload

## Установка и запуск

```
npm i

npm run dev // Запуск live-сервера на http://localhost:3000/

npm run build // Чистка dist с последующей сборкой
```

## Установка сторонних библиотек

Библиотеки рекомендутся устанавливать через **npm i**

Для CSS библиотек в файле vendor.css добавить путь к файлу в виде комментария, например

```
/*= ../../node_modules/normalize.css/normalize.css */
```

Для JS библиотек в файле vendor.js добавить путь к файлу в виде комментария, например

```
/*= ../../node_modules/jquery/dist/jquery.min.js */
```

---

Возможные улучшения, баги и пожелания кидать в [issue](https://github.com/areal-team/gulp-frontend-builder/issues)