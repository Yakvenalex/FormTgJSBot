# Используем официальный образ NGINX в качестве базового
FROM nginx:alpine

# Удаляем дефолтный файл конфигурации NGINX
RUN rm /usr/share/nginx/html/index.html

# Копируем наш index.html в папку с HTML файлами NGINX
COPY templates/index.html /usr/share/nginx/html/

# Копируем статические файлы из папки static в NGINX
COPY static /usr/share/nginx/html/static

# Экспонируем порт 80
EXPOSE 80

# Запускаем NGINX
CMD ["nginx", "-g", "daemon off;"]
