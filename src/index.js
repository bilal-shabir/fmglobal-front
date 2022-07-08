import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import * as serviceWorker from './serviceWorker';
import App from './App';
import Loader from "../src/components/components-overview/loader";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    supportedLngs: ['en', 'fr', 'ar'],
    fallbackLng: "en",
    detection: {
        order: [ 'cookie'],
        caches: ['cookie']
    },
    backend: {
        loadPath: '/assets/locales/{{lng}}/translation.json'
    },
  });


ReactDOM.render(<Suspense fallback={<Loader/>}><App /></Suspense>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
